import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,sha,stable,sourceHashes,writeJSON,check,timed,openSession,finishSession,programReady,exportedBytes,checkScene,newReport} from './build.mjs';

const near=(a,b,tolerance=1e-4)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<=tolerance);
const changed=(a,b)=>a.some((v,i)=>Math.abs(v-b[i])>1e-5);
const objectMap=scene=>new Map(scene.objects.map(o=>[o.hash,o]));
const extent=vertices=>{const points=vertices.map(v=>v.position||v),min=[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),max=[0,1,2].map(i=>Math.max(...points.map(p=>p[i])));return {min,max,size:max.map((v,i)=>v-min[i])};};
async function cages(session,scene){const rows=[];for(const o of scene.objects.filter(o=>['spline','spline_patch'].includes(o.type))){const data=await session.call('spline.inspect',{id:o.hash});rows.push({id:o.hash,type:o.type,sha256:sha(stable(data.data)),vertices:Object.keys(data.data.vertices).length,segments:Object.keys(data.data.segments).length});}return rows;}

// Independent exact-position incidence audit of the evaluated tool plate.
// This reads native geometry for verification; it never authors or substitutes meshes.
function topology(mesh){
 const aliases=[],points=new Map(),parents=[],links=new Map(),edges=new Map();let degenerate=0;
 function find(i){while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;}
 function join(a,b){a=find(a);b=find(b);if(a!==b)parents[a]=b;}
 for(const v of mesh.vertices){const key=v.position.join(':');if(!points.has(key)){points.set(key,points.size);parents.push(parents.length);}aliases[v.id]=points.get(key);}
 function link(v,a,b){if(!links.has(v))links.set(v,new Map());const graph=links.get(v);for(const [x,y]of [[a,b],[b,a]]){if(!graph.has(x))graph.set(x,[]);graph.get(x).push(y);}}
 for(const face of mesh.faces){const v=face.vertices.map(i=>aliases[i]);if(new Set(v).size!==3){degenerate++;continue;}for(let i=0;i<3;i++){const a=v[i],b=v[(i+1)%3],key=Math.min(a,b)+':'+Math.max(a,b);if(!edges.has(key))edges.set(key,[]);edges.get(key).push(a<b?1:-1);join(a,b);link(a,b,v[(i+2)%3]);}}
 let invalidLinks=0;
 for(const graph of links.values()){
  const first=graph.keys().next().value,seen=new Set([first]),queue=[first];
  for(let i=0;i<queue.length;i++)for(const n of graph.get(queue[i])||[])if(!seen.has(n)){seen.add(n);queue.push(n);}
  if([...graph.values()].some(n=>n.length!==2)||seen.size!==graph.size)invalidLinks++;
 }
 const components=new Set(parents.map((_,i)=>find(i))).size,boundary=[...edges.values()].filter(e=>e.length===1).length,nonmanifold=[...edges.values()].filter(e=>e.length!==2).length,orientationWarnings=[...edges.values()].filter(e=>e.length===2&&e[0]===e[1]).length,euler=points.size-edges.size+mesh.faces.length;
 return {vertices:points.size,edges:edges.size,faces:mesh.faces.length,components,boundary,nonmanifold,orientationWarnings,degenerate,invalidVertexLinks:invalidLinks,euler,genus:(2*components-euler)/2};
}

async function verifyPlate(report,session,id){
 const geometry=await session.call('diagnostics.mesh',{id,geometry:true});
 check(report,'Tool plate GPU positions and triangle indices are finite and valid',geometry.finite&&geometry.indicesValid,geometry);
 const mesh=await session.call('mesh.inspect',{id,topology:true}),audit=topology(mesh);report.toolPlate={geometry,topology:audit,bounds:extent(mesh.vertices)};
 check(report,'Tool plate is one closed orientable manifold',audit.components===1&&audit.boundary===0&&audit.nonmanifold===0&&audit.orientationWarnings===0&&audit.degenerate===0&&audit.invalidVertexLinks===0,audit);
 check(report,'Tool plate has five through-holes',audit.genus===5,audit);
 check(report,'Tool plate evaluates to nominal diameter 60 and depth 6 mm',near(report.toolPlate.bounds.size,[60,60,6]),report.toolPlate.bounds);
 const cage=await session.call('spline.inspect',{id}),vertices=Object.values(cage.data.vertices),bounds=extent(vertices);
 check(report,'Tool plate retains finite native editable source controls',vertices.length>0&&vertices.every(v=>v.every(Number.isFinite))&&Object.keys(cage.data.segments).length>0,{vertices:vertices.length,segments:Object.keys(cage.data.segments).length});
 check(report,'Editable plate source retains nominal dimensions',near(bounds.size,[60,60,6]),bounds);
 const circles=[[0,0,30],[0,0,10],...[0,120,240].map(a=>[20*Math.cos(a*Math.PI/180),20*Math.sin(a*Math.PI/180),2.25]),[7.5,15*Math.sqrt(3)/2,1.5]];
 const missing=[];
 for(const [x,y,r]of circles)for(const z of [0,6])for(const [dx,dy]of [[r,0],[0,r],[-r,0],[0,-r]])if(!vertices.some(p=>near(p,[x+dx,y+dy,z],1e-5)))missing.push([x+dx,y+dy,z]);
 check(report,'Native plate cage retains pilot, bolt-circle and pin-hole locations on both faces',missing.length===0,{circles,missing});
 report.toolPlate.cage={sha256:sha(stable(cage.data)),bounds,vertices:vertices.length,segments:Object.keys(cage.data.segments).length};
 return geometry;
}

export async function verify(){
 const report=newReport('Neira native HASH verification');let session;
 try{
  report.sources=await sourceHashes();
  const [bytes,manifestText,controlText,docText]=await Promise.all([readFile(resolve(root,'scenes/neira.hash')),readFile(resolve(root,'artifacts/manifest.json'),'utf8'),readFile(resolve(root,'src/control.js'),'utf8'),readFile(resolve(root,'docs/Design.md'),'utf8')]);
  const manifest=JSON.parse(manifestText);report.file={name:'neira.hash',bytes:bytes.length,sha256:sha(bytes)};
  check(report,'Saved HASH matches build manifest',manifest.file.sha256===sha(bytes)&&manifest.file.bytes===bytes.length);
  check(report,'Frame and model source hashes match the saved build',stable(manifest.sources)===stable(report.sources),{build:manifest.sources,current:report.sources});
  session=await openSession(report);const {page,call}=session;
  console.log('Opening saved Neira HASH in an isolated DPR 1 browser…');
  await timed(report,'Open Neira HASH',15000,()=>call('scene.open',{name:'neira.hash',base64:bytes.toString('base64')}));await programReady(session);
  let scene=await call('scene.inspect');checkScene(report,scene);report.scene={objects:scene.objects.length,stats:scene.stats};
  check(report,'Reopened Doc equals canonical Design.md',(await call('docs.get')).text===docText);
  const rootData=await call('authorData.get',{owner:'scene'});
  check(report,'Reopened HASH retains exact Scene Control source',rootData.data.records.find(r=>r.id==='a1'.repeat(16))?.payload.text===controlText);
  report.program=await programReady(session);
  const sourceBefore=await cages(session,scene);report.cages=sourceBefore;
  const at0=objectMap(scene),armIds=['LYaw','RYaw','LPitch','RPitch','LElbow','RElbow','LWrist','RWrist'].map(k=>manifest.ids[k]);
  check(report,'All eight commanded joint frames exist',armIds.every(id=>at0.has(id)),armIds);
  const base=at0.get(manifest.ids.Base).bounds,body=at0.get(manifest.ids.root).bounds;
  report.envelope={base,body};
  check(report,'Actual base width is 650 mm and body height is 1450 mm',Math.abs(base.max[0]-base.min[0]-650)<1e-4&&Math.abs(body.max[1]-body.min[1]-1450)<1e-4,report.envelope);
  check(report,'Rendered native source surfaces have material assignments',scene.objects.filter(o=>o.mesh&&o.type!=='instance').every(o=>o.tags.some(t=>t.kind==='material')));
  check(report,'The five intended materials survive native HASH', ['Shell','Frame','Rubber','Copper','Lens'].every(name=>scene.materials.some(m=>m.name===name)));
  const plateBefore=await verifyPlate(report,session,manifest.ids.plate);
  console.log('Editable assembly, nominal dimensions and tool-plate topology checked; exercising motion controls…');
  // The link-length contract is read from actual authored frame translations.
  for(const side of ['L','R']){
   const elbow=at0.get(manifest.ids[side+'Elbow']),wrist=at0.get(manifest.ids[side+'Wrist']);
   const length=m=>Math.hypot(m[9],m[10],m[11]);
   check(report,side+' arm retains 270 mm upper and 250 mm forearm joint offsets',Math.abs(length(elbow.matrix)-270)<1e-6&&Math.abs(length(wrist.matrix)-250)<1e-6,{upper:length(elbow.matrix),forearm:length(wrist.matrix)});
   const members=scene.objects.filter(o=>o.parent===wrist.hash),mate=members.find(o=>o.name==='Mate'),tool=members.find(o=>o.name==='Tool');
   check(report,side+' wrist has the shared mating plate at 6 mm and tool at 12 mm',mate?.type==='instance'&&mate.params.object===manifest.ids.plate&&near(mate.matrix.slice(9),[0,0,6])&&near(tool?.matrix.slice(9)||[],[0,0,12]),{mate:mate?.matrix,tool:tool?.matrix});
  }
  await timed(report,'Seek native reach pose',3000,()=>call('animation.seek',{frame:90}));
  const at90=objectMap(await call('scene.inspect'));
  check(report,'Reach pose changes every intended joint world frame',armIds.every(id=>changed(at0.get(id).worldMatrix,at90.get(id).worldMatrix)));
  check(report,'Reach pose leaves the base and root frames unchanged',near(at0.get(manifest.ids.root).worldMatrix,at90.get(manifest.ids.root).worldMatrix)&&near(at0.get(manifest.ids.Base).worldMatrix,at90.get(manifest.ids.Base).worldMatrix));
  const plateAt90=await call('diagnostics.mesh',{id:manifest.ids.plate,geometry:true});
  check(report,'Joint animation preserves local plate geometry',plateAt90.positionsSHA256===plateBefore.positionsSHA256&&plateAt90.indicesSHA256===plateBefore.indicesSHA256);
  const popupPromise=page.waitForEvent('popup');await page.locator('#btnControl').click();const popup=await popupPromise;await popup.waitForLoadState();
  check(report,'Scene Control panel mounts from saved source',await popup.getByRole('heading',{name:'Neira',exact:true}).isVisible());
  await popup.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===0&&!frameCore.playing);
  await popup.waitForFunction(()=>document.querySelector('[aria-label="Motion frame"]').value==='0');
  check(report,'Control Home restores the native home pose',near((await call('scene.inspect')).objects.find(o=>o.hash===armIds[2]).worldMatrix,at0.get(armIds[2]).worldMatrix));
  check(report,'Home displays the actual completed timeline frame',await popup.getByRole('slider',{name:'Motion frame',exact:true}).inputValue()==='0');
  await popup.getByRole('button',{name:'Reach pose',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===90&&!frameCore.playing);
  await popup.waitForFunction(()=>document.querySelector('[aria-label="Motion frame"]').value==='90');
  check(report,'Control Reach pose seeks the native timeline',changed((await call('scene.inspect')).objects.find(o=>o.hash===armIds[2]).worldMatrix,at0.get(armIds[2]).worldMatrix));
  check(report,'Reach pose displays the actual completed timeline frame',await popup.getByRole('slider',{name:'Motion frame',exact:true}).inputValue()==='90');
  check(report,'Eight individual joint controls mount',await popup.getByRole('slider').count()===9);
  for(const side of ['L','R'])for(const name of ['Yaw','Pitch','Elbow','Wrist']){
   const id=manifest.ids[side+name],slider=popup.getByRole('slider',{name:side+' '+name,exact:true}),original=await slider.inputValue();
   const before=await page.evaluate(id=>frameEngine.pluginLocal(id),id);
   await slider.evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));},Number(original)+5);
   await page.waitForFunction(([id,before])=>frameEngine.pluginLocal(id).some((v,i)=>Math.abs(v-before[i])>1e-5),[id,before]);
   check(report,side+' '+name+' slider changes its native local joint frame',changed(await page.evaluate(id=>frameEngine.pluginLocal(id),id),before));
   await slider.evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));},original);
   await page.waitForFunction(([id,before])=>frameEngine.pluginLocal(id).every((v,i)=>Math.abs(v-before[i])<1e-5),[id,before]);
  }
  await popup.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===0&&!frameCore.playing);
  await popup.getByRole('button',{name:'Play',exact:true}).click();await page.waitForFunction(()=>frameCore.playing&&frameCore.frame>0);
  await popup.getByRole('button',{name:'Pause',exact:true}).click();await page.waitForFunction(()=>!frameCore.playing);
  const paused=await call('animation.inspect');await page.waitForTimeout(120);const afterPause=await call('animation.inspect');
  check(report,'Control Pause stops timeline advancement',paused.frame===afterPause.frame,{paused:paused.frame,after:afterPause.frame});
  await popup.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===0&&!frameCore.playing);
  await popup.screenshot({path:resolve(root,'artifacts/control.png')});report.controlScreenshot='artifacts/control.png';
  // Persist a non-default pose across popup remount, then restore it. This
  // catches controls that display hard-coded defaults instead of saved keys.
  const yawSlider=popup.getByRole('slider',{name:'L Yaw',exact:true}),yawOriginal=await yawSlider.inputValue(),yawValue=Number(yawOriginal)+7;
  await yawSlider.evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));},yawValue);
  await page.waitForFunction(([id,value])=>frameCore.frame===90&&Math.abs(frameEngine.pluginLocal(id)[0]-Math.cos(value*Math.PI/180))<1e-6,[manifest.ids.LYaw,yawValue]);
  await popup.reload();await popup.getByRole('heading',{name:'Neira',exact:true}).waitFor();await popup.waitForFunction(()=>[...document.querySelectorAll('input')].every(el=>!el.disabled));
  check(report,'Control popup reload remounts one panel',await popup.getByRole('button',{name:'Home',exact:true}).count()===1&&(await call('programs.panel',{action:'inspect'})).panels===1);
  check(report,'Reloaded joint slider reflects the actual edited pose',Number(await yawSlider.inputValue())===yawValue,{expected:yawValue,actual:await yawSlider.inputValue()});
  await yawSlider.evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));},yawOriginal);
  await page.waitForFunction(([id,value])=>Math.abs(frameEngine.pluginLocal(id)[0]-Math.cos(value*Math.PI/180))<1e-6,[manifest.ids.LYaw,Number(yawOriginal)]);
  await popup.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===0&&!frameCore.playing);
  const roundtrip=await timed(report,'Export round-trip HASH',15000,()=>exportedBytes(session));
  console.log('Motion controls checked; verifying native HASH round-trip and fresh frame timings…');
  await timed(report,'Reopen round-trip HASH',15000,()=>call('scene.open',{name:'neira-roundtrip.hash',base64:roundtrip.bytes.toString('base64')}));await programReady(session);
  scene=await call('scene.inspect');const sourceAfter=await cages(session,scene);
  check(report,'HASH round-trip preserves exact editable source cages',stable(sourceBefore)===stable(sourceAfter));
  check(report,'HASH round-trip preserves exact Doc and control source',(await call('docs.get')).text===docText&&(await call('authorData.get',{owner:'scene'})).data.records.find(r=>r.id==='a1'.repeat(16))?.payload.text===controlText);
  const plateAfter=await call('diagnostics.mesh',{id:manifest.ids.plate,geometry:true});
  check(report,'HASH round-trip preserves evaluated plate geometry',plateAfter.positionsSHA256===plateBefore.positionsSHA256&&plateAfter.indicesSHA256===plateBefore.indicesSHA256);
  await popup.getByRole('heading',{name:'Neira',exact:true}).waitFor();check(report,'Round-trip restores one running control panel',(await call('programs.panel',{action:'inspect'})).panels===1);
  await popup.close();await call('scene.select',{ids:[]});
  report.frames=await timed(report,'Collect six fresh rendered frames',15000,()=>call('diagnostics.frame',{frames:6}));
  check(report,'Frame timings contain six fresh CPU samples',report.frames.frames.length===6&&report.frames.frames.every(f=>Number.isFinite(f.cpuMs)&&f.cpuMs>=0),report.frames.frames);
  check(report,'GPU timestamp timings are available',report.frames.timestampQueries&&report.frames.frames.every(f=>Number.isFinite(f.gpuMs)&&f.gpuMs>0),report.frames);
  const median=values=>values.slice().sort((a,b)=>a-b)[Math.floor(values.length/2)];report.performance={cpuMedianMs:median(report.frames.frames.map(f=>f.cpuMs)),gpuMedianMs:median(report.frames.frames.map(f=>f.gpuMs)),context:'1280x900, DPR 1, native viewport; baseline only, no improvement claim'};
  await page.screenshot({path:resolve(root,'artifacts/neira.png')});
  report.claims={editableAuthoring:true,closedToolPlate:true,commandedJointMotion:true,docAndCodePersistence:true,payloadValidated:false,collisionValidated:false,actuatorSelected:false,manufacturingQualified:false};
 }catch(error){report.error=error.stack||String(error);}
 finally{
  try{await finishSession(report,session);}catch(error){report.error??=error.stack||String(error);}
  try{report.sourcesAfter=await sourceHashes();check(report,'Verification source files remain unchanged during this run',stable(report.sources)===stable(report.sourcesAfter));}catch(error){report.error??=error.stack||String(error);}
  report.finishedAt=new Date().toISOString();report.pass=!report.error&&report.checks.length>0&&report.checks.every(c=>c.pass);await writeJSON(resolve(root,'artifacts/verification.json'),report);
 }
 console.log(JSON.stringify({pass:report.pass,checks:report.checks.length,performance:report.performance,toolPlate:report.toolPlate?.topology,error:report.error},null,2));if(!report.pass)process.exitCode=1;return report;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await verify();
