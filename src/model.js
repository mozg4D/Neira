// All dimensions are mm. Native editable curves/surfaces only; no authored mesh.
export async function buildNeira({controlText,docText}) {
 const api=globalThis.frameAI,call=(name,args={})=>api.call(name,args),ids={},parts=[],timings=[];
 const step=async(name,fn)=>{const at=performance.now(),v=await fn();timings.push({name,ms:performance.now()-at});return v;};
 await call('scene.new');
 await call('view.set',{index:2,single:true,mode:'object',shading:'solid-isoparms',pivot:false});
 const materials={};
 for(const [name,params] of Object.entries({Shell:{h:40,s:9,l:76,rough:36,metal:15},Frame:{h:210,s:12,l:22,rough:40,metal:65},Rubber:{h:210,s:3,l:11,rough:80,metal:0},Copper:{h:22,s:58,l:47,rough:28,metal:75},Lens:{h:187,s:40,l:19,rough:18,metal:30}}))materials[name]=(await call('material.create',{name,params})).uid;
 const I=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
 function affine(p,r){const [x,y,z]=r.map(v=>v*Math.PI/180),cx=Math.cos(x),sx=Math.sin(x),cy=Math.cos(y),sy=Math.sin(y),cz=Math.cos(z),sz=Math.sin(z);return [cz*cy,sz*cy,-sy,0,cz*sy*sx-sz*cx,sz*sy*sx+cz*cx,cy*sx,0,cz*sy*cx+sz*sx,sz*sy*cx-cz*sx,cy*cx,0,...p,1];}
 async function place(id,p=[0,0,0],r=[0,0,0]){
  // Native SDK sets an exact assembly frame. Numeric Position addresses the
  // current pivot; construction requires an explicit origin independent of bounds.
  const core=globalThis.frameCore;
  core.transaction(()=>{core.engine.pluginSetPivot(id,I());core.engine.pluginSetLocal(id,affine(p,r));});core.refresh();
 }
 async function group(name,parent,p){const n=await call('scene.create',{type:'group',name,...(parent?{parent}:{})});ids[name]=n.hash;if(p)await place(n.hash,p);return n.hash;}
 async function solid(type,name,params,parent,p,r,mat='Frame'){
  const n=await call('scene.create',{type,name,params,parent});if(n.buildError)throw Error(name+': '+n.buildError);
  if(p||r)await place(n.hash,p,r);await call('material.assign',{id:n.hash,material:materials[mat]});parts.push({id:n.hash,name,type});return n.hash;
 }
 async function instance(source,name,parent,p,r){const n=await call('scene.create',{type:'instance',name,parent,params:{object:source}});await place(n.hash,p,r);parts.push({id:n.hash,name,type:'instance'});return n.hash;}
 function profile(loops){
  const d={version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
  loops.forEach((loop,j)=>{const q='q'+j,vs=loop.points.map((p,i)=>{const id=`v${j}_${i}`;d.vertices[id]=[p[0],p[1],0];return id;}),seq={id:q,closed:true,first:vs[0],segments:[]};
   vs.forEach((a,i)=>{const id=`s${j}_${i}`,h=loop.handles?.[i]||[[0,0],[0,0]];d.segments[id]={id,a,b:vs[(i+1)%vs.length],ha:[...h[0],0],hb:[...h[1],0],soft:!!loop.handles?.[i],sequence:q};seq.segments.push(id);});d.sequences.push(seq);
  });return d;
 }
 const circle=(r,x=0,y=0)=>{const k=.5522847498307936*r;return {points:[[x+r,y],[x,y+r],[x-r,y],[x,y-r]],handles:[[[0,k],[k,0]],[[-k,0],[0,k]],[[0,-k],[-k,0]],[[k,0],[0,-k]]]};};
 const rounded=(w,h,r)=>{const x=w/2,y=h/2,k=r*.5522847498307936;return {points:[[-x+r,-y],[x-r,-y],[x,-y+r],[x,y-r],[x-r,y],[-x+r,y],[-x,y-r],[-x,-y+r]],handles:[null,[[k,0],[0,-k]],null,[[0,k],[k,0]],null,[[-k,0],[0,k]],null,[[0,-k],[-k,0]]]};};
 async function extrusion(name,loops,depth,parent,p,r,mat='Shell',patch=false){
  const s=await call('scene.create',{type:'spline',name:'Profile'});await place(s.hash);await call('spline.replace',{id:s.hash,data:profile(loops)});
  const n=await call('scene.create',{type:'extrude',name,inputs:[s.hash],params:{offset:depth,'start fillet':0,'end fillet':0}});
  await place(n.hash);await call('scene.update',{id:n.hash,parent});
  if(n.buildError)throw Error(name+': '+n.buildError);if(p||r)await place(n.hash,p,r);
  if(patch)await call('scene.convert',{id:n.hash});
  await call('material.assign',{id:n.hash,material:materials[mat]});parts.push({id:n.hash,name,type:patch?'spline_patch':'extrude'});return n.hash;
 }
 const bot=await group('Neira');
 const base=await group('Base',bot);
 await step('base',async()=>{
  await extrusion('Deck',[rounded(500,670,50)],12,base,[0,150,0],[-90,0,0],'Frame');
  await extrusion('Cowl',[rounded(500,670,50),rounded(492,662,46)],84,base,[0,162,0],[-90,0,0]);
  await extrusion('Lid',[rounded(500,670,50)],4,base,[0,246,0],[-90,0,0]);
  // Two rear drive-wheel envelopes and two front swivel-caster envelopes.
  let tire,hub,small,smallHub;
  for(const [side,x] of [['L',-325],['R',265]]){
   const wheel=await group('Drive'+side,base,[x,100,-240]);ids['wheel'+side]=wheel;
   if(!tire)tire=await solid('tube','Tire',{'outer diameter':200,'inner diameter':130,height:60,'angle approximation':12},wheel,[0,0,0],[0,0,-90],'Rubber');
   else await instance(tire,'Tire',wheel,[0,0,0],[0,0,-90]);
   if(!hub)hub=await solid('cylinder','Hub',{diameter:130,height:44,'angle approximation':12},wheel,[8,0,0],[0,0,-90],'Copper');
   else await instance(hub,'Hub',wheel,[8,0,0],[0,0,-90]);
   // Axle is an unresolved drive envelope, not a selected motor.
   await solid('cylinder','Axle',{diameter:32,height:55,'angle approximation':18},base,[side==='L'?-270:215,100,-240],[0,0,-90]);
  }
  for(const [side,x]of [['L',-210],['R',210]]){
   const caster=await group('Caster'+side,base,[x,0,260]);
   await solid('cylinder','Swivel',{diameter:30,height:30,'angle approximation':18},caster,[0,120,0]);
   for(const sx of [-27,21])await solid('cube','Fork',{'size x':6,'size y':65,'size z':30},caster,[sx,60,-15]);
   if(!small)small=await solid('tube','Roller',{'outer diameter':120,'inner diameter':50,height:40,'angle approximation':15},caster,[-20,60,0],[0,0,-90],'Rubber');
   else await instance(small,'Roller',caster,[-20,60,0],[0,0,-90]);
   if(!smallHub)smallHub=await solid('cylinder','Hub',{diameter:50,height:40,'angle approximation':18},caster,[-20,60,0],[0,0,-90],'Copper');
   else await instance(smallHub,'Hub',caster,[-20,60,0],[0,0,-90]);
  }
 });
 const body=await group('Body',bot,[0,250,0]);
 await step('body',async()=>{
  await extrusion('Foot',[rounded(230,220,35)],20,body,[0,0,0],[-90,0,0],'Copper');
  await extrusion('Mast',[rounded(160,140,25),rounded(150,130,20)],650,body,[0,20,0],[-90,0,0],'Frame');
  await extrusion('Chest',[rounded(380,350,60),rounded(372,342,56)],180,bot,[0,1080,-90],[0,0,0]);
  await extrusion('Back',[rounded(380,350,60)],4,bot,[0,1080,-94],[0,0,0]);
  await extrusion('Front',[rounded(380,350,60)],4,bot,[0,1080,90],[0,0,0]);
  await solid('cylinder','Neck',{diameter:65,height:50,'angle approximation':15},bot,[0,1255,0]);
  await extrusion('Head',[rounded(230,145,48)],110,bot,[0,1377.5,-55],[0,0,0]);
  await extrusion('Visor',[rounded(190,68,26)],5,bot,[0,1390,55],[0,0,0],'Frame');
  const lens=await solid('cylinder','Camera',{diameter:26,height:8,'angle approximation':15},bot,[-55,1390,60],[90,0,0],'Lens');
  await instance(lens,'Camera',bot,[55,1390,60],[90,0,0]);
 });
 let upperSource,foreSource,jointSource,plateSource;
 await step('arms',async()=>{
  const mount=await solid('cylinder','Mount',{diameter:40,height:70,'angle approximation':15},bot,[-260,1050,0],[0,0,-90]);
  await instance(mount,'Mount',bot,[190,1050,0],[0,0,-90]);
  for(const [side,x]of [['L',-260],['R',260]]){
   const yaw=await group(side+'Yaw',bot,[x,1050,0]);ids[side+'Yaw']=yaw;
   const pitch=await group(side+'Pitch',yaw);ids[side+'Pitch']=pitch;
   if(!jointSource)jointSource=await solid('cylinder','Joint',{diameter:100,height:70,'angle approximation':12},pitch,[-35,0,0],[0,0,-90],'Copper');
   else await instance(jointSource,'Joint',pitch,[-35,0,0],[0,0,-90]);
   if(!upperSource)upperSource=await extrusion('Upper',[rounded(76,80,22),rounded(68,72,18)],200,pitch,[0,-35,0],[90,0,0]);
   else await instance(upperSource,'Upper',pitch,[0,-35,0],[90,0,0]);
   const elbow=await group(side+'Elbow',pitch,[0,-270,0]);ids[side+'Elbow']=elbow;
   await instance(jointSource,'Joint',elbow,[-35,0,0],[0,0,-90]);
   if(!foreSource)foreSource=await extrusion('Fore',[rounded(68,72,20),rounded(60,64,16)],181,elbow,[0,0,35],[0,0,0]);
   else await instance(foreSource,'Fore',elbow,[0,0,35],[0,0,0]);
   const wrist=await group(side+'Wrist',elbow,[0,0,250]);ids[side+'Wrist']=wrist;
   await solid('cylinder','Wrist',{diameter:58,height:34,'angle approximation':12},wrist,[0,0,-34],[90,0,0],'Copper');
   const holes=[circle(30),circle(10),...[0,120,240].map(a=>circle(2.25,20*Math.cos(a*Math.PI/180),20*Math.sin(a*Math.PI/180))),circle(1.5,7.5,15*Math.sqrt(3)/2)];
   if(!plateSource)plateSource=await extrusion('Plate',holes,6,wrist,[0,0,0],[0,0,0],'Frame',true);
   else await instance(plateSource,'Plate',wrist,[0,0,0],[0,0,0]);
   await instance(plateSource,'Mate',wrist,[0,0,6],[0,0,0]);
   // Test-tool ring leaves the bolt circle exposed; pilot fit remains undefined.
   await solid('tube','Tool',{'outer diameter':26,'inner diameter':20,height:24,'angle approximation':12},wrist,[0,0,12],[90,0,0],'Copper');
  }
 });
 ids.plate=plateSource;ids.root=bot;
 // Local joint angles. Rotations drive native affine channels, never cage rebuilding.
 const keys={LYaw:[[0,[0,0,0]],[90,[0,18,0]],[180,[0,0,0]]],RYaw:[[0,[0,0,0]],[90,[0,-18,0]],[180,[0,0,0]]],LPitch:[[0,[0,0,0]],[90,[-25,0,0]],[180,[0,0,0]]],RPitch:[[0,[0,0,0]],[90,[-25,0,0]],[180,[0,0,0]]],LElbow:[[0,[0,0,0]],[90,[-30,0,0]],[180,[0,0,0]]],RElbow:[[0,[0,0,0]],[90,[-30,0,0]],[180,[0,0,0]]],LWrist:[[0,[0,0,0]],[90,[0,0,35]],[180,[0,0,0]]],RWrist:[[0,[0,0,0]],[90,[0,0,-35]],[180,[0,0,0]]]};
 await step('native tracks',async()=>{for(const [joint,rows]of Object.entries(keys))for(const [frame,value]of rows)await call('animation.key',{id:ids[joint],path:'rotation',frame,value,interpolation:'soft'});await call('animation.seek',{frame:0});});
 // Declare all model references so HASH/clipboard remapping preserves controls.
 const source='a1'.repeat(16),program='a2'.repeat(16),bindings=Object.entries(ids).map(([name,hash])=>({name,hash}));
 const a=await call('authorData.get',{owner:'scene'});
 await call('authorData.replace',{owner:'scene',expected:{epoch:a.epoch,revision:a.data.revision},records:[
  {id:source,revision:0,name:'Control',kind:'source',refs:[],payload:{language:'javascript',text:controlText}},
  {id:program,revision:0,name:'Neira',kind:'opaque',refs:[{kind:'record',owner:'scene',id:source},...bindings.map(b=>({kind:'object',owner:b.hash}))],payload:{format:'frame.scene-control',version:1,data:{source:0,context:'main',start:'ready',bindings:Object.fromEntries(bindings.map((b,i)=>[b.name,i+1]))}}}
 ]});
 const docs=await call('docs.get');await call('docs.update',{text:docText,version:docs.version});
 await call('scene.select',{ids:[]});await call('view.set',{index:0,focus:bot});
 const view=await call('scene.inspect'),camera=view.view.camera.slice();camera[0]=Math.PI*3/4;await call('view.set',{camera,focus:bot});
 const scene=await call('scene.inspect');
 return {ids,parts,timings,program,counts:scene.stats,objects:scene.objects.map(o=>({id:o.hash,name:o.name,type:o.type,buildError:o.buildError,bounds:o.bounds})),units:'mm',coordinateSystem:'Y up, +Z forward',assumptions:'Packaging and commanded kinematics only; no payload, strength, collision or manufacturing qualification'};
}
