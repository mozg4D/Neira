import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,candidateRoot,sha,stable,sourceHashes,writeJSON,check,timed,openSession,finishSession,programReady,exportedBytes,checkScene,newReport,loadDesignDoc,optionalBytes,publishCandidate,atomicWrite} from './build.mjs';

const near=(a,b,tolerance=1e-4)=>a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<=tolerance);
const changed=(a,b)=>a.some((v,i)=>Math.abs(v-b[i])>1e-5);
const objectMap=scene=>new Map(scene.objects.map(o=>[o.hash,o]));
const extent=vertices=>{const points=vertices.map(v=>v.position||v),min=[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),max=[0,1,2].map(i=>Math.max(...points.map(p=>p[i])));return {min,max,size:max.map((v,i)=>v-min[i])};};
function inverse(m){
 const a=Array.from({length:4},(_,row)=>[...Array.from({length:4},(_,col)=>m[col*4+row]),...Array.from({length:4},(_,col)=>+(row===col))]);
 for(let col=0;col<4;col++){let pivot=col;for(let row=col+1;row<4;row++)if(Math.abs(a[row][col])>Math.abs(a[pivot][col]))pivot=row;assert.ok(Math.abs(a[pivot][col])>1e-12,'Reference affine frame must be invertible');[a[col],a[pivot]]=[a[pivot],a[col]];const d=a[col][col];a[col]=a[col].map(v=>v/d);for(let row=0;row<4;row++)if(row!==col){const f=a[row][col];a[row]=a[row].map((v,i)=>v-f*a[col][i]);}}
 return Array.from({length:16},(_,i)=>a[i%4][4+Math.floor(i/4)]);
}
const multiply=(a,b)=>Array.from({length:16},(_,i)=>{const row=i%4,col=Math.floor(i/4);return [0,1,2,3].reduce((s,k)=>s+a[k*4+row]*b[col*4+k],0);});
const point=(m,p,vector=false)=>[0,1,2].map(i=>m[i]*p[0]+m[4+i]*p[1]+m[8+i]*p[2]+(vector?0:m[12+i]));
function transformedCage(data,m){return {...data,vertices:Object.fromEntries(Object.entries(data.vertices).map(([id,p])=>[id,point(m,p)])),segments:Object.fromEntries(Object.entries(data.segments).map(([id,e])=>[id,{...e,ha:point(m,e.ha||[0,0,0],true),hb:point(m,e.hb||[0,0,0],true)}]))};}
export function partReader(session,scene,frame,cache=new Map()){
 const map=objectMap(scene),worldToFrame=inverse(map.get(frame).worldMatrix);
 return async id=>{
  const object=map.get(id);assert.ok(object,'Interface part must exist: '+id);let source=object;const seen=new Set();
  while(source.type==='instance'){assert.ok(!seen.has(source.hash),'Instance dependency must be acyclic');seen.add(source.hash);source=map.get(source.params.object);assert.ok(source,'Instance source must exist');}
  let raw=cache.get(source.hash);
  if(!raw){const [mesh,cage]=await Promise.all([session.call('mesh.inspect',{id:source.hash,topology:true}),session.call('spline.inspect',{id:source.hash})]);raw={mesh,cage:cage.data};cache.set(source.hash,raw);}
  let world=object.worldMatrix;
  if(object.type==='instance'){const replicas=await session.call('diagnostics.replicas',{id});const surfaces=replicas.copies.filter(c=>!c.curve);assert.equal(surfaces.length,1,'Each interface part must address one evaluated surface occurrence');world=surfaces[0].worldMatrix;}
  const matrix=multiply(worldToFrame,world),mesh={...raw.mesh,vertices:raw.mesh.vertices.map(v=>({...v,position:point(matrix,v.position)}))},cage=transformedCage(raw.cage,matrix);
  return {id,source:source.hash,object,matrix,mesh,cage,bounds:extent(mesh.vertices),cageBounds:extent(Object.values(cage.vertices)),localCageBounds:extent(Object.values(raw.cage.vertices))};
 };
}
async function cages(session,scene){const rows=[];for(const o of scene.objects.filter(o=>['spline','spline_patch'].includes(o.type))){const data=await session.call('spline.inspect',{id:o.hash});rows.push({id:o.hash,type:o.type,sha256:sha(stable(data.data)),vertices:Object.keys(data.data.vertices).length,segments:Object.keys(data.data.segments).length});}return rows;}

const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);
function splitCubic(p){const a=midpoint(p[0],p[1]),b=midpoint(p[1],p[2]),c=midpoint(p[2],p[3]),d=midpoint(a,b),e=midpoint(b,c),f=midpoint(d,e);return [[p[0],a,d,f],[f,e,c,p[3]]];}
function controls(data,edge){const a=data.vertices[edge.a],b=data.vertices[edge.b];return [a,a.map((v,i)=>v+(edge.ha?.[i]||0)),b.map((v,i)=>v+(edge.hb?.[i]||0)),b];}
function originHullDistance(points){
 const sorted=[...new Map(points.map(p=>[p.join(':'),p])).values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 if(sorted.length===1)return Math.hypot(...sorted[0]);
 const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),low=[],high=[];
 for(const p of sorted){while(low.length>=2&&cross(low.at(-2),low.at(-1),p)<=0)low.pop();low.push(p);}
 for(const p of sorted.slice().reverse()){while(high.length>=2&&cross(high.at(-2),high.at(-1),p)<=0)high.pop();high.push(p);}
 const hull=[...low.slice(0,-1),...high.slice(0,-1)];
 if(hull.length>=3&&hull.every((a,i)=>{const b=hull[(i+1)%hull.length];return a[0]*b[1]-a[1]*b[0]>=-1e-14;}))return 0;
 let distance=Infinity;
 for(let i=0;i<hull.length;i++){const a=hull[i],b=hull[(i+1)%hull.length],d=[b[0]-a[0],b[1]-a[1]],den=d[0]**2+d[1]**2,t=den?Math.max(0,Math.min(1,-(a[0]*d[0]+a[1]*d[1])/den)):0;distance=Math.min(distance,Math.hypot(a[0]+t*d[0],a[1]+t*d[1]));}
 return distance;
}
// Bézier convex-hull bounds cover the complete curves, not only sampled points.
export function radialBounds(curves,center,depth=7){
 let min=Infinity,max=0;
 const visit=(p,n)=>{if(n){for(const q of splitCubic(p))visit(q,n-1);return;}const xy=p.map(q=>[q[0]-center[0],q[1]-center[1]]);min=Math.min(min,originHullDistance(xy));max=Math.max(max,...xy.map(p=>Math.hypot(...p)));};
 for(const curve of curves)visit(curve,depth);
 return {min,max};
}
function closedPlanarLoops(data,z){
 return data.sequences.filter(q=>q.closed&&q.segments.length>=3).map(q=>({sequence:q,edges:q.segments.map(id=>data.segments[id])})).filter(q=>q.edges.every(e=>e&&controls(data,e).every(p=>Math.abs(p[2]-z)<1e-6)));
}
function axialCoverage(data,ids,z0,z1){
 const gaps=[];
 for(const id of ids){const p=data.vertices[id],intervals=[];
  for(const edge of Object.values(data.segments)){
   const c=controls(data,edge);if(!c.every(q=>Math.abs(q[0]-p[0])<1e-6&&Math.abs(q[1]-p[1])<1e-6))continue;
   const zs=c.map(q=>q[2]),direction=Math.sign(zs[3]-zs[0]);if(!direction||zs.some((v,i)=>i>0&&direction*(v-zs[i-1])<-1e-6))continue;
   intervals.push([Math.min(zs[0],zs[3]),Math.max(zs[0],zs[3])]);
  }
  let covered=z0;for(const [a,b]of intervals.sort((a,b)=>a[0]-b[0]))if(a<=covered+1e-6&&b>=covered)covered=b;
  if(covered<z1-1e-6)gaps.push({point:p,covered,required:z1});
 }
 return gaps;
}
export function circleWall(data,{center,radius,z0,z1,radialTolerance,depth=7}){
 function findLoop(z){
  const candidates=closedPlanarLoops(data,z).filter(q=>q.edges.every(e=>[data.vertices[e.a],data.vertices[e.b]].every(p=>Math.abs(Math.hypot(p[0]-center[0],p[1]-center[1])-radius)<1e-5)));
  if(candidates.length!==1)return {matches:candidates.length};
  const q=candidates[0],degrees=new Map();for(const e of q.edges)for(const id of [e.a,e.b])degrees.set(id,(degrees.get(id)||0)+1);
  const winding=q.edges.reduce((sum,e)=>{const a=data.vertices[e.a],b=data.vertices[e.b];return sum+Math.atan2((a[0]-center[0])*(b[1]-center[1])-(a[1]-center[1])*(b[0]-center[0]),(a[0]-center[0])*(b[0]-center[0])+(a[1]-center[1])*(b[1]-center[1]));},0);
  return {matches:1,sequence:q.sequence.id,vertices:[...degrees.keys()],closed:[...degrees.values()].every(n=>n===2)&&Math.abs(Math.abs(winding)-Math.PI*2)<1e-5,radiusBounds:radialBounds(q.edges.map(e=>controls(data,e)),center,depth)};
 }
 const bottom=findLoop(z0),top=findLoop(z1),axialGaps=bottom.vertices&&top.vertices?axialCoverage(data,bottom.vertices,z0,z1):[];
 const tolerance=radialTolerance??radius*.0004+1e-5;
 return {center,radius,z0,z1,bottom,top,axialGaps,pass:[bottom,top].every(q=>q.matches===1&&q.closed&&q.radiusBounds.min>=radius-tolerance&&q.radiusBounds.max<=radius+tolerance)&&axialGaps.length===0,tolerance,scope:'Closed native cubic boundary loops and straight axial source connectors; not manufacturing tolerance or self-intersection qualification'};
}
export function radialSlot(data,{center,angle,length,width,z}){
 const r=width/2,h=(length-width)/2,c=Math.cos(angle),s=Math.sin(angle),tolerance=r*.0004+1e-5;
 const uv=p=>[(p[0]-center[0])*c+(p[1]-center[1])*s,-(p[0]-center[0])*s+(p[1]-center[1])*c,p[2]];
 const matches=closedPlanarLoops(data,z).filter(q=>{const points=q.edges.flatMap(e=>[uv(data.vertices[e.a]),uv(data.vertices[e.b])]),bounds=extent(points);return near(bounds.min.slice(0,2),[-length/2,-r],1e-5)&&near(bounds.max.slice(0,2),[length/2,r],1e-5);});
 if(matches.length!==1)return {pass:false,matches:matches.length};
 const q=matches[0],arcs=[],lines=[],invalid=[],degrees=new Map();
 for(const edge of q.edges){
  for(const id of [edge.a,edge.b])degrees.set(id,(degrees.get(id)||0)+1);
  const p=controls(data,edge).map(uv);
  if(p.every(v=>Math.abs(v[1]-r)<1e-6)||p.every(v=>Math.abs(v[1]+r)<1e-6)){
   if(!near([Math.min(p[0][0],p[3][0]),Math.max(p[0][0],p[3][0])],[-h,h],1e-5)||p.some(v=>v[0]<-h-1e-6||v[0]>h+1e-6))invalid.push(edge.id);lines.push(edge.id);
  }else{
   const sign=p[0][0]>=h-1e-6&&p[3][0]>=h-1e-6?1:p[0][0]<=-h+1e-6&&p[3][0]<=-h+1e-6?-1:0;
   const bounds=radialBounds([p],[sign*h,0]);arcs.push({id:edge.id,sign,bounds});if(!sign||bounds.min<r-tolerance||bounds.max>r+tolerance)invalid.push(edge.id);
  }
 }
 return {pass:q.edges.length===6&&lines.length===2&&arcs.length===4&&arcs.filter(a=>a.sign===1).length===2&&arcs.filter(a=>a.sign===-1).length===2&&[...degrees.values()].every(n=>n===2)&&invalid.length===0,sequence:q.sequence.id,vertices:[...degrees.keys()],matches:1,center,angle,length,width,z,lines,arcs,invalid,radialBounds:radialBounds(q.edges.map(e=>controls(data,e)),[0,0]),scope:'Six-segment native radial capsule boundary; manufacturing tolerance and contact loads remain unqualified'};
}
function frustum(data,{r0,r1,z0,z1}){
 const cap=(radius,z)=>{const q=circleWall(data,{center:[0,0],radius,z0:z,z1:z});return {...q.bottom,pass:q.pass};},a=cap(r0,z0),b=cap(r1,z1),missing=[];
 if(a.vertices&&b.vertices)for(const id of a.vertices){
  const p=data.vertices[id],target=[p[0]*r1/r0,p[1]*r1/r0,z1],upper=b.vertices.find(id=>near(data.vertices[id],target,1e-5)),edge=Object.values(data.segments).find(e=>e.a===id&&e.b===upper||e.b===id&&e.a===upper);
  if(!edge){missing.push(id);continue;}
  const c=controls(data,edge),v=c[3].map((n,i)=>n-c[0][i]),den=v.reduce((s,n)=>s+n*n,0),parameters=c.map(q=>q.reduce((s,n,i)=>s+(n-c[0][i])*v[i],0)/den);
  if(c.some((q,j)=>!near(q,c[0].map((n,i)=>n+parameters[j]*v[i]),1e-6))||parameters.some((t,i)=>t<-1e-6||t>1+1e-6||i&&t<parameters[i-1]-1e-6))missing.push(id);
 }
 const valid=q=>q.pass&&q.matches===1&&q.closed&&q.radiusBounds.min>0;
 return {pass:valid(a)&&valid(b)&&a.vertices.length===b.vertices.length&&missing.length===0,r0,r1,z0,z1,bottom:a,top:b,missing};
}

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

async function verifyInterfaces(report,session,scene,interfaces){
 check(report,'Both wrist interfaces declare actual part references',interfaces?.length===2&&new Set(interfaces.map(i=>i.side)).size===2&&interfaces.every(i=>i.bolts.length===3&&i.washers.length===3));
 const cache=new Map();report.interfaces=[];
 function solid(label,part,genus){
  check(report,label+' has finite positions and valid evaluated indices',part.mesh.vertices.every(v=>v.position.length===3&&v.position.every(Number.isFinite))&&part.mesh.faces.every(f=>f.vertices.length===3&&f.vertices.every(i=>Number.isInteger(i)&&i>=0&&i<part.mesh.vertices.length)));
  const audit=topology(part.mesh);check(report,label+' is a finite closed orientable evaluated surface',part.mesh.vertices.every(v=>v.position.every(Number.isFinite))&&part.mesh.topology.degenerate.length===0&&audit.components===1&&audit.boundary===0&&audit.nonmanifold===0&&audit.orientationWarnings===0&&audit.degenerate===0&&audit.invalidVertexLinks===0&&audit.genus===genus,{...audit,zeroAreaFaces:part.mesh.topology.degenerate});
  const signedVolumeMm3=part.mesh.topology.signedVolume,volumeMm3=Math.abs(signedVolumeMm3);
  check(report,label+' has a finite positive tessellated source volume',Number.isFinite(signedVolumeMm3)&&volumeMm3>0,{signedVolumeMm3,volumeMm3});
  return {id:part.id,source:part.source,bounds:part.bounds,cageBounds:part.cageBounds,topology:audit,signedVolumeMm3,volumeMm3,volumeMethod:'Signed tetrahedral integration of the evaluated native triangle surface in source millimetres; approximation, not exact machined-part volume'};
 }
 function wall(label,part,spec){const observation=circleWall(part.cage,spec);check(report,label,observation.pass,observation);return observation;}
 for(const item of interfaces){
  const prefix=item.side+' ',read=partReader(session,scene,item.frame,cache),hub=await read(item.hub),mate=await read(item.mate),pin=await read(item.pin),entry={side:item.side,hub:solid(prefix+'integral hub',hub,1),mate:solid(prefix+'integral guide',mate,5),pin:solid(prefix+'locating pin',pin,0),fasteners:[]};report.interfaces.push(entry);
  entry.datum={hubLocalRangeMm:[hub.localCageBounds.min[2],hub.localCageBounds.max[2]],guideLocalRangeMm:[mate.localCageBounds.min[2],mate.localCageBounds.max[2]],hubAssemblyPositionMm:hub.object.matrix.slice(9),guideAssemblyPositionMm:mate.object.matrix.slice(9)};
  check(report,prefix+'hub and guide are each one authored source surface',objectMap(scene).get(hub.source).type==='spline_patch'&&objectMap(scene).get(mate.source).type==='spline_patch');
  check(report,prefix+'hub retains 60 mm flange and -34 to 9 mm axial envelope',near(hub.bounds.size,[60,60,43])&&near([hub.bounds.min[2],hub.bounds.max[2]],[-34,9]),hub.bounds);
  check(report,prefix+'guide is one 6 to 36 mm axial part with 60 mm flange',near(mate.bounds.size,[60,60,30])&&near([mate.bounds.min[2],mate.bounds.max[2]],[6,36]),mate.bounds);
  wall(prefix+'hub barrel retains its 58 mm diameter from -34 to 0 mm',hub,{center:[0,0],radius:29,z0:-34,z1:0});
  wall(prefix+'integral hub flange retains 60 mm diameter from 0 to 6 mm',hub,{center:[0,0],radius:30,z0:0,z1:6});
  wall(prefix+'guide flange retains 60 mm diameter from 6 to 12 mm',mate,{center:[0,0],radius:30,z0:6,z1:12});
  const pilot=wall(prefix+'integral locating register is an 8-arc finite source wall',hub,{center:[0,0],radius:10,z0:6,z1:9,radialTolerance:.0001,depth:9});
  const bore=wall(prefix+'mating locating bore meets 0.1 micrometre source-radius bound',mate,{center:[0,0],radius:10,z0:6,z1:12,radialTolerance:.0001,depth:9});
  check(report,prefix+'locating boundaries use eight economical arcs',pilot.bottom.vertices.length===8&&bore.bottom.vertices.length===8);
  const reference=(data,id)=>data.sequences.find(q=>q.id===id).segments.map(id=>{const p=controls(data,data.segments[id]).map(v=>v.slice(0,2).map(n=>Math.round(n*1e8)/1e8));return [JSON.stringify(p),JSON.stringify(p.slice().reverse())].sort()[0];}).sort();
  check(report,prefix+'zero-clearance locating source boundaries are congruent and coaxial',stable(reference(hub.cage,pilot.bottom.sequence))===stable(reference(mate.cage,bore.bottom.sequence)),{nominalDiameterClearanceMm:0,sourceRadiusErrorBoundMm:.0001,fitQualified:false});
  const service=wall(prefix+'hub retains a continuous 12 mm service bore',hub,{center:[0,0],radius:6,z0:-34,z1:9});
  const guideWalls=[{r0:13,r1:9,z0:12,z1:35.5},{r0:10,r1:6,z0:12,z1:35.5},{r0:9,r1:8.5,z0:35.5,z1:36},{r0:6,r1:6.5,z0:35.5,z1:36}].map(spec=>frustum(mate.cage,spec));
  check(report,prefix+'integral guide retains connected inner and outer taper and entry walls',guideWalls.every(w=>w.pass),guideWalls);
  const wallThickness=Math.min(guideWalls[0].bottom.radiusBounds.min-guideWalls[1].bottom.radiusBounds.max,guideWalls[0].top.radiusBounds.min-guideWalls[1].top.radiusBounds.max,guideWalls[2].top.radiusBounds.min-guideWalls[3].top.radiusBounds.max);
  check(report,prefix+'guide retains at least 1.99 mm source radial wall through its mouth',wallThickness>1.99,{sourceMinimumRadialWallMm:wallThickness,strengthQualified:false});
  const fixedSeat=wall(prefix+'pin blind seat is finite from -1 to 6 mm',hub,{center:[8.5,17*Math.sqrt(3)/2],radius:1.5,z0:-1,z1:6});
  const pinWall=wall(prefix+'installed 3 by 10 mm pin has its measured -1 to 9 mm axis',pin,{center:[8.5,17*Math.sqrt(3)/2],radius:1.5,z0:-1,z1:9});
  const slot=[6,12].map(z=>radialSlot(mate.cage,{center:[8.5,17*Math.sqrt(3)/2],angle:Math.PI/3,length:5,width:3.2,z}));
  check(report,prefix+'radial pin slot retains its 5 by 3.2 mm capsule on both faces',slot.every(s=>s.pass),slot);
  const slotAxialGaps=axialCoverage(mate.cage,slot[0].vertices,6,12);check(report,prefix+'radial slot has straight continuous source walls through the 6 mm plate',slotAxialGaps.length===0,slotAxialGaps);
  const pinMax=Math.max(pinWall.bottom.radiusBounds.max,pinWall.top.radiusBounds.max),slotMin=Math.min(...slot.flatMap(s=>s.arcs.map(a=>a.bounds.min))),pinSideClearance=slotMin-pinMax;
  check(report,prefix+'nominal pin has positive side clearance in the radial slot',pinSideClearance>.099,{minimumSourceRadialClearanceMm:pinSideClearance,nominalMm:.1,engagementMm:3,fitQualified:false});
  // All guide triangles intersecting/above the driver-head plane are enclosed
  // radially; including their lower vertices makes this bound conservative.
  const driverRadius=5,headTop=16.8,guideVertexIds=new Set(mate.mesh.faces.filter(f=>f.vertices.some(i=>mate.mesh.vertices[i].position[2]>=headTop-1e-5)).flatMap(f=>f.vertices)),guideMax=Math.max(...[...guideVertexIds].map(i=>Math.hypot(...mate.mesh.vertices[i].position.slice(0,2))));
  const guideRootRadius=guideWalls[0].bottom.radiusBounds.max,driverGuideRadius=Math.max(guideMax,guideRootRadius),slotGuideLigament=Math.min(...slot.map(s=>s.radialBounds.min))-guideRootRadius;
  check(report,prefix+'slot has at least 1.49 mm nominal ligament beyond guide root',slotGuideLigament>1.49,{conservativeSourceLigamentMm:slotGuideLigament,guideRootEnvelopeRadiusMm:guideRootRadius,strengthQualified:false});
  for(let i=0;i<3;i++){
   const a=i*2*Math.PI/3,center=[20*Math.cos(a),20*Math.sin(a)],bolt=await read(item.bolts[i]),washer=await read(item.washers[i]),info={bolt:solid(prefix+'screw '+(i+1),bolt,0),washer:solid(prefix+'washer '+(i+1),washer,1)};entry.fasteners.push(info);
   info.radialEnvelopeMm=radialBounds(Object.values(bolt.cage.segments).map(e=>controls(bolt.cage,e)),center).max;
   wall(prefix+'blind M4 major envelope '+(i+1)+' spans -8 to 6 mm',hub,{center,radius:2,z0:-8,z1:6});
   const clearance=wall(prefix+'mating clearance bore '+(i+1)+' is 4.5 mm through the plate',mate,{center,radius:2.25,z0:6,z1:12});
   const washerBore=wall(prefix+'washer '+(i+1)+' has a finite 4.3 mm clearance bore',washer,{center,radius:2.15,z0:12,z1:12.8});
   check(report,prefix+'standard screw '+(i+1)+' retains its measured head and 16 mm under-head length',near([bolt.bounds.min[2],bolt.bounds.max[2]],[-3.2,16.8])&&Math.abs(bolt.bounds.size[0]-7)<1e-4&&Math.abs(bolt.bounds.size[1]-7)<1e-4,bolt.bounds);
   check(report,prefix+'washer '+(i+1)+' seats from 12 to 12.8 mm',near(washer.bounds.size,[9,9,.8])&&near([washer.bounds.min[2],washer.bounds.max[2]],[12,12.8]),washer.bounds);
   const shaftLoops=[...new Set(Object.values(bolt.cage.vertices).map(p=>p[2]))].sort((a,b)=>a-b).filter(z=>closedPlanarLoops(bolt.cage,z).some(q=>q.edges.every(e=>[bolt.cage.vertices[e.a],bolt.cage.vertices[e.b]].every(p=>Math.abs(Math.hypot(p[0]-center[0],p[1]-center[1])-2)<1e-5))));
   check(report,prefix+'screw '+(i+1)+' has a distinct full-major shaft envelope',shaftLoops.length>=2,shaftLoops);
   const shaft=wall(prefix+'screw '+(i+1)+' retains a finite 4 mm major shaft envelope',bolt,{center,radius:2,z0:shaftLoops[0],z1:shaftLoops.at(-1)}),shaftMax=Math.max(shaft.bottom.radiusBounds.max,shaft.top.radiusBounds.max),boreMin=Math.min(clearance.bottom.radiusBounds.min,clearance.top.radiusBounds.min),washerMin=Math.min(washerBore.bottom.radiusBounds.min,washerBore.top.radiusBounds.min);
   const underHead=shaftLoops.at(-1);wall(prefix+'screw '+(i+1)+' retains its measured circular under-head bearing boundary',bolt,{center,radius:3.5,z0:underHead,z1:underHead});
   info.stack={underHeadMm:underHead,measuredTipMm:bolt.bounds.min[2],measuredUnderHeadLengthMm:underHead-bolt.bounds.min[2],measuredHeadHeightMm:bolt.bounds.max[2]-underHead,washerHeadSourceGapMm:underHead-washer.cageBounds.max[2],nominalOverlapMm:6-bolt.bounds.min[2],fullMajorEnvelopeOverlapMm:6-shaftLoops[0],blindEnvelopeBottomGapMm:bolt.bounds.min[2]+8,candidateFullThreadEndGapMm:bolt.bounds.min[2]+6,threadQualified:false};
   check(report,prefix+'screw '+(i+1)+' seats on its washer with a measured 16 mm shaft and 4 mm head',Math.abs(info.stack.washerHeadSourceGapMm)<1e-8&&Math.abs(info.stack.measuredUnderHeadLengthMm-16)<1e-4&&Math.abs(info.stack.measuredHeadHeightMm-4)<1e-4,info.stack);
   check(report,prefix+'screw '+(i+1)+' has 9.2 mm nominal overlap and 4.8 mm modeled bottom gap',Math.abs(info.stack.nominalOverlapMm-9.2)<1e-4&&Math.abs(info.stack.blindEnvelopeBottomGapMm-4.8)<1e-4,info.stack);
   info.clearances={mateRadialMm:boreMin-shaftMax,washerRadialMm:washerMin-shaftMax,straightDriverApproachMm:20-driverGuideRadius-driverRadius,driverDiameterMm:10,scope:'Evaluated guide and bounded ruled-guide source plus a 10 mm round driver approach above the screw head; no socket, whole-robot, fit, torque or thread-flank qualification'};
   check(report,prefix+'screw '+(i+1)+' has positive bore, washer and 10 mm front driver-envelope clearances',info.clearances.mateRadialMm>.249&&info.clearances.washerRadialMm>.149&&info.clearances.straightDriverApproachMm>1.9,info.clearances);
  }
  const headCenters=entry.fasteners.map(f=>midpoint(f.bolt.bounds.min,f.bolt.bounds.max).slice(0,2)),otherHeadGap=Math.min(...headCenters.flatMap((p,i)=>headCenters.flatMap((q,j)=>i===j?[]:[Math.hypot(p[0]-q[0],p[1]-q[1])-entry.fasteners[j].radialEnvelopeMm-driverRadius])));
  check(report,prefix+'other screw heads leave 10 mm straight front driver approaches clear',otherHeadGap>26,{conservativeOtherHeadApproachGapMm:otherHeadGap,driverDiameterMm:10});
  entry.location={pilot,bore,service,guideWalls,wallThicknessMm:wallThickness,fixedSeat,pinWall,slot,slotAxialGaps,nominalRegisterDiameterClearanceMm:0,registerEngagementMm:3,pinEngagementMm:3,pinSideClearanceMm:pinSideClearance,fitQualified:false,threadQualified:false,pinRetentionQualified:false};
 }
 check(report,'Both independent part sources use Z=0 mating datums and explicit +6 mm assembly placements',report.interfaces.every(i=>near(i.datum.hubLocalRangeMm,[-40,3])&&near(i.datum.guideLocalRangeMm,[0,30])&&near(i.datum.hubAssemblyPositionMm,[0,0,6])&&near(i.datum.guideAssemblyPositionMm,[0,0,6])),report.interfaces.map(i=>({side:i.side,...i.datum})));
 return session.call('diagnostics.mesh',{id:interfaces[0].hub,geometry:true});
}

export async function verify(){
 const report=newReport('Neira native HASH verification');let session,manifest,usingCandidate=false,artifactRoot=candidateRoot;
 try{
  report.sources=await sourceHashes();
  const candidate=await optionalBytes(resolve(candidateRoot,'neira.hash'));usingCandidate=!!candidate;artifactRoot=usingCandidate?candidateRoot:resolve(root,'artifacts');
  const [bytes,manifestText,controlText,docText]=await Promise.all([candidate||readFile(resolve(root,'scenes/neira.hash')),readFile(resolve(artifactRoot,'manifest.json'),'utf8'),readFile(resolve(root,'src/control.js'),'utf8'),loadDesignDoc()]);
  manifest=JSON.parse(manifestText);report.file={name:'neira.hash',bytes:bytes.length,sha256:sha(bytes)};report.input=usingCandidate?'work/candidate/neira.hash':'scenes/neira.hash';
  check(report,'Both part factory datum arrays declare origin zero and normal +Z',stable(manifest.partDatums)===stable({hub:{origin:[0,0,0],normal:[0,0,1]},guide:{origin:[0,0,0],normal:[0,0,1]}}));
  report.sourceModules=Object.keys(report.sources).filter(name=>name.startsWith('src/')&&name.endsWith('.js')).sort();
  check(report,'Saved HASH matches build manifest',manifest.file.sha256===sha(bytes)&&manifest.file.bytes===bytes.length);
  check(report,'Frame and model source hashes match the saved build',stable(manifest.sources)===stable(report.sources),{build:manifest.sources,current:report.sources});
  session=await openSession(report);const {page,call}=session;
  console.log('Opening saved Neira HASH in an isolated DPR 1 browser…');
  await timed(report,'Open Neira HASH',15000,()=>call('scene.open',{name:'neira.hash',base64:bytes.toString('base64')}));await programReady(session);
  let scene=await call('scene.inspect');checkScene(report,scene);report.scene={objects:scene.objects.length,stats:scene.stats};
  const homeCamera=scene.view.camera.slice();
  const authoring=s=>s.objects.map(o=>({hash:o.hash,type:o.type,parent:o.parent,name:o.name,visible:o.visible,enabled:o.enabled,params:o.params,matrix:o.matrix,pivot:o.pivot})).sort((a,b)=>a.hash.localeCompare(b.hash)),authoringBefore=authoring(scene);
  check(report,'Reopened Doc equals both canonical design documents',(await call('docs.get')).text===docText);
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
  const plateBefore=await verifyInterfaces(report,session,scene,manifest.interfaces);
  console.log('Editable assembly, nominal interface geometry and fastener clearances checked; exercising motion controls…');
  // The link-length contract is read from actual authored frame translations.
  for(const side of ['L','R']){
   const elbow=at0.get(manifest.ids[side+'Elbow']),wrist=at0.get(manifest.ids[side+'Wrist']);
   const length=m=>Math.hypot(m[9],m[10],m[11]);
   check(report,side+' arm retains 270 mm upper and 250 mm forearm joint offsets',Math.abs(length(elbow.matrix)-270)<1e-6&&Math.abs(length(wrist.matrix)-250)<1e-6,{upper:length(elbow.matrix),forearm:length(wrist.matrix)});
  }
  await timed(report,'Seek native reach pose',3000,()=>call('animation.seek',{frame:90}));
  const at90=objectMap(await call('scene.inspect'));
  check(report,'Reach study keeps both tool interfaces assembled',manifest.interfaces.every(i=>near(at90.get(i.movingGroup).matrix.slice(9),[0,0,0])&&near(at90.get(i.fasteners).matrix.slice(9),[0,0,0])));
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
  const jointLabels=['L Yaw','L Pitch','L Elbow','L Wrist','R Yaw','R Pitch','R Elbow','R Wrist'];
  check(report,'Eight individually named joint controls mount',(await Promise.all(jointLabels.map(name=>popup.getByRole('slider',{name,exact:true}).count()))).every(n=>n===1));
  for(const side of ['L','R'])for(const name of ['Yaw','Pitch','Elbow','Wrist']){
   const id=manifest.ids[side+name],slider=popup.getByRole('slider',{name:side+' '+name,exact:true}),original=await slider.inputValue();
   const before=await page.evaluate(id=>frameEngine.pluginLocal(id),id);
   await slider.evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));},Number(original)+5);
   await page.waitForFunction(([id,before])=>frameEngine.pluginLocal(id).some((v,i)=>Math.abs(v-before[i])>1e-5),[id,before]);
   check(report,side+' '+name+' slider changes its native local joint frame',changed(await page.evaluate(id=>frameEngine.pluginLocal(id),id),before));
   await slider.evaluate((el,value)=>{el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));},original);
   await page.waitForFunction(([id,before])=>frameEngine.pluginLocal(id).every((v,i)=>Math.abs(v-before[i])<1e-5),[id,before]);
  }
  await popup.getByRole('button',{name:'Exploded tool',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===300&&!frameCore.playing);await popup.waitForFunction(()=>document.querySelector('[aria-label="Motion frame"]').value==='300');
  const exploded=await call('scene.inspect'),at300=objectMap(exploded);report.exploded=[];
  for(const item of manifest.interfaces){
   check(report,item.side+' exploded view moves fasteners 110 mm and guide 60 mm on the actual interface axis',near(at300.get(item.fasteners).matrix.slice(9),[0,0,110])&&near(at300.get(item.movingGroup).matrix.slice(9),[0,0,60]));
   check(report,item.side+' exploded view keeps the integral hub and locating pin fixed',near(at300.get(item.hub).worldMatrix,at0.get(item.hub).worldMatrix)&&near(at300.get(item.pin).worldMatrix,at0.get(item.pin).worldMatrix));
   const read=partReader(session,exploded,item.frame),mate=await read(item.mate),bolt=await read(item.bolts[0]);report.exploded.push({side:item.side,guideAxialRangeMm:[mate.bounds.min[2],mate.bounds.max[2]],screwAxialRangeMm:[bolt.bounds.min[2],bolt.bounds.max[2]],interpretation:'Exploded inspection pose only; threaded removal and physical motion are not simulated'});
   check(report,item.side+' exploded geometry has the guide at 66 to 96 mm and screw tip beyond 106 mm',near([mate.bounds.min[2],mate.bounds.max[2]],[66,96])&&Math.abs(bolt.bounds.min[2]-106.8)<1e-4);
  }
  const target=manifest.interfaces[0].frame;
  await call('scene.select',{ids:[target]});await call('view.solo',{enabled:true});await call('scene.select',{ids:[]});await call('view.set',{focus:target,shading:'solid-isoparms'});await call('diagnostics.frame',{frames:1});await page.screenshot({path:resolve(artifactRoot,'tool-exploded.png')});
  await call('animation.seek',{frame:240});const at240=objectMap(await call('scene.inspect'));
  check(report,'Exploded inspection first separates screws while the guides remain seated',manifest.interfaces.every(i=>near(at240.get(i.fasteners).matrix.slice(9),[0,0,75])&&near(at240.get(i.movingGroup).matrix.slice(9),[0,0,0])));
  await popup.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===0&&!frameCore.playing);await call('view.set',{focus:target});await call('diagnostics.frame',{frames:1});await page.screenshot({path:resolve(artifactRoot,'tool-assembled.png')});
  report.interfaceScreenshots={assembled:'artifacts/tool-assembled.png',exploded:'artifacts/tool-exploded.png',caption:'Actual native spline-surface geometry; exploded positioning is an inspection illustration, not physical unscrewing or fit qualification'};
  await call('view.solo',{enabled:false});await call('view.set',{camera:homeCamera});
  await popup.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===0&&!frameCore.playing);
  await popup.getByRole('button',{name:'Play',exact:true}).click();await page.waitForFunction(()=>frameCore.playing&&frameCore.frame>0);
  await popup.getByRole('button',{name:'Pause',exact:true}).click();await page.waitForFunction(()=>!frameCore.playing);
  const paused=await call('animation.inspect');await page.waitForTimeout(120);const afterPause=await call('animation.inspect');
  check(report,'Control Pause stops timeline advancement',paused.frame===afterPause.frame,{paused:paused.frame,after:afterPause.frame});
  await popup.getByRole('button',{name:'Home',exact:true}).click();await page.waitForFunction(()=>frameCore.frame===0&&!frameCore.playing);
  await popup.screenshot({path:resolve(artifactRoot,'control.png'),fullPage:true});report.controlScreenshot='artifacts/control.png';
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
  const immediatelyBeforeExport=authoring(await call('scene.inspect'));
  check(report,'Home restores original assembly frames within numeric roundoff',immediatelyBeforeExport.every((o,i)=>near(o.matrix,authoringBefore[i].matrix,1e-9)&&near(o.pivot,authoringBefore[i].pivot,1e-9)&&stable({...o,matrix:null,pivot:null})===stable({...authoringBefore[i],matrix:null,pivot:null})));
  const roundtrip=await timed(report,'Export round-trip HASH',15000,()=>exportedBytes(session));
  console.log('Motion controls checked; verifying native HASH round-trip and fresh frame timings…');
  await timed(report,'Reopen round-trip HASH',15000,()=>call('scene.open',{name:'neira-roundtrip.hash',base64:roundtrip.bytes.toString('base64')}));await programReady(session);
  scene=await call('scene.inspect');const sourceAfter=await cages(session,scene);
  check(report,'HASH round-trip exactly preserves immediate primitive/generator parameters and assembly frames',stable(immediatelyBeforeExport)===stable(authoring(scene)));
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
  await page.screenshot({path:resolve(artifactRoot,'neira.png')});
  report.claims={editableAuthoring:true,closedInterfaceParts:true,nominalInterfaceGeometry:true,listedDriverApproachEnvelope:true,commandedJointMotion:true,docAndCodePersistence:true,payloadValidated:false,collisionValidated:false,actuatorSelected:false,manufacturingQualified:false,threadQualified:false,fitQualified:false,pinRetentionQualified:false};
 }catch(error){report.error=error.stack||String(error);}
 finally{
  try{await finishSession(report,session);}catch(error){report.error??=error.stack||String(error);}
  try{report.sourcesAfter=await sourceHashes();check(report,'Verification source files remain unchanged during this run',stable(report.sources)===stable(report.sourcesAfter));}catch(error){report.error??=error.stack||String(error);}
  report.finishedAt=new Date().toISOString();report.pass=!report.error&&report.checks.length>0&&report.checks.every(c=>c.pass);
  if(report.pass&&usingCandidate)try{await publishCandidate(report,manifest);}catch(error){report.error=error.stack||String(error);report.pass=false;}
  await writeJSON(resolve(artifactRoot,'verification.json'),report);
  if(report.pass&&usingCandidate)await atomicWrite(resolve(root,'artifacts/verification.json'),await readFile(resolve(artifactRoot,'verification.json')));
 }
 console.log(JSON.stringify({pass:report.pass,checks:report.checks.length,performance:report.performance,interfaces:report.interfaces?.map(i=>({side:i.side,hub:i.hub.topology,mate:i.mate.topology})),error:report.error},null,2));if(!report.pass)process.exitCode=1;return report;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await verify();
