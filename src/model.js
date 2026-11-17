// All dimensions are mm. Native editable curves/surfaces only; no authored mesh.
export async function buildNeira({controlText,docText,partData}) {
 const api=globalThis.frameAI,call=(name,args={})=>api.call(name,args),ids={},parts=[],interfaces=[],timings=[];
 const {hub:hubPart,guide:guidePart,spec}=partData||{};
 for(const part of [hubPart,guidePart])if(!part||part.units!=='mm'||!Array.isArray(part.datum?.origin)||part.datum.origin.length!==3||part.datum.origin.some(v=>v!==0)||String(part.datum?.normal)!=='0,0,1'||!part.cage)throw Error('Native part cages at a Z=0/+Z mating datum are required');
 if(!spec||spec.units!=='mm')throw Error('Shared millimetre interface dimensions are required');
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
  core.transaction(()=>{core.engine.pluginSetPivot(id,I());core.engine.pluginSetLocal(id,affine(p,r));});
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
 const rounded=(w,h,r)=>{const x=w/2,y=h/2,k=r*.5522847498307936;return {points:[[-x+r,-y],[x-r,-y],[x,-y+r],[x,y-r],[x-r,y],[-x+r,y],[-x,y-r],[-x,-y+r]],handles:[null,[[k,0],[0,-k]],null,[[0,k],[k,0]],null,[[-k,0],[0,k]],null,[[0,-k],[-k,0]]]};};
 async function patch(part,parent,p,mat='Frame'){
  const {name,cage:data}=part;
  const s=await call('scene.create',{type:'spline',name:'Cage'});await place(s.hash);await call('spline.replace',{id:s.hash,data});
  const n=await call('scene.create',{type:'spline_patch',name,inputs:[s.hash]});if(n.buildError)throw Error(name+': '+n.buildError);await place(n.hash);await call('scene.update',{id:n.hash,parent});await place(n.hash,p);
  await call('material.assign',{id:n.hash,material:materials[mat]});parts.push({id:n.hash,name,type:'spline_patch'});return n.hash;
 }
 async function extrusion(name,loops,depth,parent,p,r,mat='Shell'){
  const s=await call('scene.create',{type:'spline',name:'Profile'});await place(s.hash);await call('spline.replace',{id:s.hash,data:profile(loops)});
  const n=await call('scene.create',{type:'extrude',name,inputs:[s.hash],params:{offset:depth,'start fillet':0,'end fillet':0}});
  await place(n.hash);await call('scene.update',{id:n.hash,parent});
  if(n.buildError)throw Error(name+': '+n.buildError);if(p||r)await place(n.hash,p,r);
  await call('material.assign',{id:n.hash,material:materials[mat]});parts.push({id:n.hash,name,type:'extrude'});return n.hash;
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
 let upperSource,foreSource,jointSource,hubSource,mateSource,pinSource,boltSource,washerSource;
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
   let hub,mate,pin;
   if(!hubSource)hub=hubSource=await patch(hubPart,wrist,[0,0,spec.flangeThickness],'Copper');else hub=await instance(hubSource,'Hub',wrist,[0,0,spec.flangeThickness]);
   const pinAngle=spec.pinAngle*Math.PI/180,pinPosition=[spec.pinRadius*Math.cos(pinAngle),spec.pinRadius*Math.sin(pinAngle),spec.flangeThickness+spec.registerProjection-10];
   if(!pinSource)pin=pinSource=await solid('cylinder','Pin',{diameter:spec.pinDiameter,height:10,'angle approximation':15},wrist,pinPosition,[90,0,0]);else pin=await instance(pinSource,'Pin',wrist,pinPosition,[90,0,0]);
   const movingGroup=await group(side+'Tool',wrist),fasteners=await group(side+'Bolts',wrist),bolts=[],washers=[];
   if(!mateSource)mate=mateSource=await patch(guidePart,movingGroup,[0,0,spec.flangeThickness]);else mate=await instance(mateSource,'Guide',movingGroup,[0,0,spec.flangeThickness]);
   for(let i=0;i<spec.boltCount;i++){
    const a=i*2*Math.PI/spec.boltCount,x=spec.boltRadius*Math.cos(a),y=spec.boltRadius*Math.sin(a),front=spec.flangeThickness*2;let bolt,washer;
    if(!boltSource)bolt=boltSource=await solid('bolt','M4x16',{type:'DIN 912',size:'M4',length:16,'angle approximation':15},fasteners,[x,y,front+.8],[90,0,0]);else bolt=await instance(boltSource,'M4x16',fasteners,[x,y,front+.8],[90,0,0]);
    if(!washerSource)washer=washerSource=await solid('washer','Washer',{type:'DIN 125',size:'M4','angle approximation':15},fasteners,[x,y,front],[90,0,0]);else washer=await instance(washerSource,'Washer',fasteners,[x,y,front],[90,0,0]);bolts.push(bolt);washers.push(washer);
   }
   interfaces.push({side,frame:wrist,hub,mate,pin,bolts,washers,movingGroup,fasteners,assembledFrame:0,explodedFrame:300});
  }
 });
 ids.plate=hubSource;ids.root=bot;
 // Local joint angles. Rotations drive native affine channels, never cage rebuilding.
 const keys={LYaw:[[0,[0,0,0]],[90,[0,18,0]],[180,[0,0,0]]],RYaw:[[0,[0,0,0]],[90,[0,-18,0]],[180,[0,0,0]]],LPitch:[[0,[0,0,0]],[90,[-25,0,0]],[180,[0,0,0]]],RPitch:[[0,[0,0,0]],[90,[-25,0,0]],[180,[0,0,0]]],LElbow:[[0,[0,0,0]],[90,[-30,0,0]],[180,[0,0,0]]],RElbow:[[0,[0,0,0]],[90,[-30,0,0]],[180,[0,0,0]]],LWrist:[[0,[0,0,0]],[90,[0,0,35]],[180,[0,0,0]]],RWrist:[[0,[0,0,0]],[90,[0,0,-35]],[180,[0,0,0]]]};
 await step('native tracks',async()=>{for(const [joint,rows]of Object.entries(keys))for(const [frame,value]of rows)await call('animation.key',{id:ids[joint],path:'rotation',frame,value,interpolation:'soft'});await call('animation.seek',{frame:0});});
 for(const {movingGroup,fasteners}of interfaces){for(const [frame,z]of [[0,0],[180,0],[240,75],[300,110]])await call('animation.key',{id:fasteners,path:'position',frame,value:[0,0,z],interpolation:'soft'});for(const [frame,z]of [[0,0],[240,0],[300,60]])await call('animation.key',{id:movingGroup,path:'position',frame,value:[0,0,z],interpolation:'soft'});}
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
 return {ids,parts,interfaces,partDatums:{hub:hubPart.datum,guide:guidePart.datum},timings,program,counts:scene.stats,objects:scene.objects.map(o=>({id:o.hash,name:o.name,type:o.type,buildError:o.buildError,bounds:o.bounds})),units:'mm',coordinateSystem:'Y up, +Z forward',assumptions:'Packaging and commanded kinematics only; no payload, strength, collision or manufacturing qualification'};
}
