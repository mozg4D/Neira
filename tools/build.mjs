import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdir,readFile,rename,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {cpus,platform,release} from 'node:os';

export const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
export const candidateRoot=resolve(root,'work/candidate');
export const frameRoot=resolve(process.env.FRAME_ROOT||'C:/frame');
export const programId='a2'.repeat(16);
export const sha=value=>createHash('sha256').update(value).digest('hex');
export const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
export async function writeJSON(path,value){await mkdir(dirname(path),{recursive:true});await writeFile(path,JSON.stringify(value,null,2)+'\n');}
export async function optionalBytes(path){try{return await readFile(path);}catch(error){if(error.code==='ENOENT')return null;throw error;}}
export async function canonicalReceipt(){const bytes=await optionalBytes(resolve(root,'scenes/neira.hash'));return bytes?{exists:true,bytes:bytes.length,sha256:sha(bytes)}:{exists:false};}
export async function atomicWrite(path,bytes){await mkdir(dirname(path),{recursive:true});const temporary=path+'.neira-'+process.pid+'.tmp';await writeFile(temporary,bytes);await rename(temporary,path);}
export async function publishCandidate(report,manifest){
 assert.ok(manifest.canonicalBefore,'Candidate has no canonical-file fence; rebuild before publishing');
 const publicationStart=await canonicalReceipt(),alreadyPublished=publicationStart.exists&&publicationStart.sha256===report.file.sha256&&publicationStart.bytes===report.file.bytes;
 check(report,'Canonical HASH is unchanged or already equals this verified candidate',stable(publicationStart)===stable(manifest.canonicalBefore)||alreadyPublished,{expected:manifest.canonicalBefore,current:publicationStart,alreadyPublished});
 const bytes=await readFile(resolve(candidateRoot,'neira.hash'));
 check(report,'Candidate bytes still match the fully verified file',sha(bytes)===report.file.sha256&&bytes.length===report.file.bytes);
 const artifacts=['build.json','manifest.json','neira.png','control.png','tool-assembled.png','tool-exploded.png'];
 const copies=await Promise.all(artifacts.map(async name=>({name,bytes:await readFile(resolve(candidateRoot,name))})));
 // The scene is the user-editable deliverable. Recheck immediately before
 // its same-directory atomic rename; an external change keeps it untouched.
 check(report,'Canonical HASH remains unchanged at publication boundary',stable(await canonicalReceipt())===stable(publicationStart));
 if(!alreadyPublished)await atomicWrite(resolve(root,'scenes/neira.hash'),bytes);
 for(const file of copies)await atomicWrite(resolve(root,'artifacts',file.name),file.bytes);
 report.publication={state:alreadyPublished?'already-published':'published',scene:'scenes/neira.hash',bytes:bytes.length,sha256:sha(bytes),previous:manifest.canonicalBefore};
}
export async function sourceHashes(){
 const sources={'frame/index.html':resolve(frameRoot,'index.html'),'frame/frame-sw.js':resolve(frameRoot,'frame-sw.js'),'frame/tools/browser.mjs':resolve(frameRoot,'tools/browser.mjs'),'src/model.js':resolve(root,'src/model.js'),'src/control.js':resolve(root,'src/control.js'),'docs/Design.md':resolve(root,'docs/Design.md'),'docs/Tool-interface.md':resolve(root,'docs/Tool-interface.md'),'tools/build.mjs':resolve(root,'tools/build.mjs'),'tools/check.mjs':resolve(root,'tools/check.mjs')};
 return Object.fromEntries(await Promise.all(Object.entries(sources).map(async([name,path])=>[name,sha(await readFile(path))])));
}
export function check(report,name,pass,detail){
 report.checks.push({name,pass:!!pass,...detail===undefined?{}:{detail}});
 assert.ok(pass,name+(detail===undefined?'':': '+JSON.stringify(detail)));
}
export async function loadDesignDoc(){const texts=await Promise.all(['docs/Design.md','docs/Tool-interface.md'].map(path=>readFile(resolve(root,path),'utf8')));return texts.join('\n\n');}
export async function timed(report,name,budgetMs,fn){
 const at=performance.now();let value,error;
 try{value=await fn();}catch(e){error=e;}
 const ms=performance.now()-at;report.timings.push({name,ms,budgetMs});
 if(error)throw error;
 if(budgetMs!==null)check(report,name+' completes within latency budget',ms<=budgetMs,{ms,budgetMs});
 return value;
}
export async function openSession(report){
 const {launch,ready}=await import(pathToFileURL(resolve(frameRoot,'tools/browser.mjs')).href);
 // Explicit DPR 1 also protects against an inherited test-shell override.
 process.env.FRAME_DPR='1';
 const session=await launch({headless:true});
 try{
  const {page}=session;page.setDefaultTimeout(15000);
  page.on('pageerror',error=>report.errors.push(error.stack||error.message));
  page.on('console',message=>{if(message.type()==='error')report.consoleErrors.push(message.text());});
  page.on('request',request=>{const url=new URL(request.url());if(/\/plugins\/.*\.(?:m?js|wasm)$/.test(url.pathname))report.pluginRuntimeRequests.push(url.pathname);});
  await ready(page);await page.evaluate(()=>frameAI.ready);
  report.hardware=await page.evaluate(()=>{
   const device=frameEngine.renderer.device,info=device.adapterInfo;
   window.__neiraGPU={device,errors:[],lost:null};
   device.addEventListener('uncapturederror',event=>__neiraGPU.errors.push(event.error.message));
   device.lost.then(info=>__neiraGPU.lost={reason:info.reason,message:info.message});
   device.pushErrorScope('validation');
   return {...Object.fromEntries(['vendor','architecture','device','description','isFallbackAdapter'].map(k=>[k,info?.[k]??null])),dpr:devicePixelRatio,timestampQueries:device.features.has('timestamp-query')};
  });
  check(report,'Hardware WebGPU adapter is identified and not a fallback',!!report.hardware.vendor&&report.hardware.isFallbackAdapter===false,report.hardware);
  check(report,'Viewport uses DPR 1',report.hardware.dpr===1,report.hardware.dpr);
  session.call=(name,args={})=>page.evaluate(([n,a])=>frameAI.call(n,a),[name,args]);
  return session;
 }catch(error){await session.close();throw error;}
}
export async function programReady(session){
 try{await session.page.waitForFunction(id=>framePrograms.status({owner:'scene',id})?.state==='running',programId,{timeout:15000});}
 catch(error){let diagnostics;try{diagnostics={status:await session.call('programs.status'),description:await session.call('programs.describe')};}catch(e){diagnostics={error:e.message};}throw Error('Neira control program did not reach running state: '+JSON.stringify(diagnostics),{cause:error});}
 return session.call('programs.status',{owner:'scene',id:programId});
}
export async function exportedBytes(session,name='neira.hash'){
 const file=await session.call('scene.export',{format:'hash',transfer:true,name});
 const chunks=[];let offset=0;
 try{
  while(true){const chunk=await session.call('scene.export.read',{id:file.transfer.id,offset});assert.equal(chunk.offset,offset);const bytes=Buffer.from(chunk.base64,'base64');assert.equal(bytes.length,chunk.bytes);chunks.push(bytes);offset=chunk.nextOffset;if(chunk.eof)break;assert.ok(chunk.bytes>0,'Export transfer must progress');}
 }finally{await session.call('scene.export.release',{id:file.transfer.id});}
 const bytes=Buffer.concat(chunks);assert.equal(bytes.length,file.bytes);assert.equal(sha(bytes),file.sha256);
 return {bytes,receipt:{name:file.name,bytes:file.bytes,sha256:file.sha256}};
}
export function checkScene(report,scene){
 const allowed=new Set(['group','spline','spline_patch','cube','cylinder','tube','sphere','capsule','square','circle','extrude','lathe','sweep','instance','symmetry','cloner','gear','pulley','bolt','nut','washer','target','infinite','render']);
 check(report,'Scene has native surface geometry',scene.stats.meshes>0&&scene.stats.triangles>0,scene.stats);
 check(report,'All authored objects use native non-polygon types',scene.objects.every(o=>allowed.has(o.type)&&o.type!=='mesh'&&!o.ignored?.plugin),Object.fromEntries([...new Set(scene.objects.map(o=>o.type))].map(type=>[type,scene.objects.filter(o=>o.type===type).length])));
 check(report,'No native object reports a build error',scene.objects.every(o=>!o.buildError),scene.objects.filter(o=>o.buildError).map(o=>({name:o.name,error:o.buildError})));
 check(report,'Native object names stay within 16 characters',scene.objects.every(o=>o.name.length<=16));
 check(report,'Repeated parts share source Instances',scene.objects.some(o=>o.type==='instance'));
}
export async function finishSession(report,session){
 if(!session)return;
 try{
  report.gpu=await session.page.evaluate(async()=>{const p=window.__neiraGPU;if(!p)return null;await p.device.queue.onSubmittedWorkDone();return {validation:(await p.device.popErrorScope())?.message||null,uncaptured:p.errors,lost:p.lost,replaced:p.device!==frameEngine.renderer.device};});
  check(report,'WebGPU validation succeeds without device loss or replacement',!!report.gpu&&!report.gpu.validation&&!report.gpu.uncaptured.length&&!report.gpu.lost&&!report.gpu.replaced,report.gpu);
  const startupPlugins=await session.page.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name).filter(url=>/\/plugins\/.*\.(?:m?js|wasm)(?:\?|$)/.test(url)).map(url=>new URL(url).pathname));
  report.pluginRuntimeRequests=[...new Set([...report.pluginRuntimeRequests,...startupPlugins])];
  check(report,'No Frame plugin runtime was loaded',report.pluginRuntimeRequests.length===0,report.pluginRuntimeRequests);
  check(report,'No browser or console errors',report.errors.length===0&&report.consoleErrors.length===0,{errors:report.errors,consoleErrors:report.consoleErrors});
 }finally{await session.close();report.cleanup={ownedBrowserAndServerClosed:true};}
}
export function newReport(kind){return {kind,pass:false,startedAt:new Date().toISOString(),environment:{node:process.version,platform:platform(),release:release(),cpu:cpus()[0]?.model||null},scope:'Native Frame DPR 1; no Frame plugins; packaging, topology and commanded motion only',checks:[],timings:[],errors:[],consoleErrors:[],pluginRuntimeRequests:[]};}

export async function build(){
 const report=newReport('Neira reproducible build');let session;
 try{
  await mkdir(candidateRoot,{recursive:true});report.publication={state:'candidate-only',scene:'work/candidate/neira.hash'};
  report.sources=await sourceHashes();
  const canonicalBefore=await canonicalReceipt();
  const [{buildNeira},controlText,docText]=await Promise.all([import(pathToFileURL(resolve(root,'src/model.js')).href),readFile(resolve(root,'src/control.js'),'utf8'),loadDesignDoc()]);
  session=await openSession(report);
  console.log('Building native Neira assembly at DPR 1…');
  const manifest=await timed(report,'Build native robot assembly',120000,()=>session.page.evaluate(buildNeira,{controlText,docText}));
  console.log('Native assembly built; checking saved control program…');
  await programReady(session);
  const scene=await session.call('scene.inspect');checkScene(report,scene);
  const docs=await session.call('docs.get');check(report,'Embedded Doc equals canonical design and tool-interface documents',docs.text===docText);
  const file=await timed(report,'Export editable HASH',15000,()=>exportedBytes(session));
  await atomicWrite(resolve(candidateRoot,'neira.hash'),file.bytes);
  report.file=file.receipt;report.model={objects:scene.objects.length,stats:scene.stats};
  await writeJSON(resolve(candidateRoot,'manifest.json'),{...manifest,sources:report.sources,file:file.receipt,canonicalBefore});
  await session.call('diagnostics.frame',{frames:3});
  await session.page.screenshot({path:resolve(candidateRoot,'neira.png')});
  report.screenshot='artifacts/neira.png';
 }catch(error){report.error=error.stack||String(error);}
 finally{
  try{await finishSession(report,session);}catch(error){report.error??=error.stack||String(error);}
  try{report.sourcesAfter=await sourceHashes();check(report,'Build source files remain unchanged during this run',stable(report.sources)===stable(report.sourcesAfter));}catch(error){report.error??=error.stack||String(error);}
  report.finishedAt=new Date().toISOString();report.pass=!report.error&&report.checks.length>0&&report.checks.every(c=>c.pass);
  await writeJSON(resolve(candidateRoot,'build.json'),report);
 }
 console.log(JSON.stringify({pass:report.pass,checks:report.checks.length,file:report.file,error:report.error,hardware:report.hardware},null,2));
 if(!report.pass)process.exitCode=1;return report;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await build();
