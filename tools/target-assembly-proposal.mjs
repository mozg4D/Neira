// Direct editable spline source only. No Boolean, mesh, scene or filesystem API.
// Candidate upper/lower ring keeper: NOT fastened and NOT a complete stand.
const Q=[191.4238556845,992.7009775192,537.1797971383];
const axis=[-.1225163473647,.2528711074168,.9597113876902];
const norm=p=>{const l=Math.hypot(...p);return p.map(x=>x/l)};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export function datum(){const w=norm(axis),v=norm([0,1,0].map((x,i)=>x-w[i]*w[1])),u=cross(v,w);return {origin:[...Q],normal:w,u,v,w};}
// Closed meridian, with extra collinear stations so both split-plane ends
// can be tiled by FIVE QUADRILATERAL native patches, not concave n-gons.
const section=[[23,-5.2],[18.2,-5.2],[16.5,-5.2],[16.5,-3.2],
 [18.2,-3.2],[18.2,3.2],[16.5,3.2],[16.5,5.2],
 [18.2,5.2],[23,5.2],[23,3.2],[23,-3.2]];
export function keeperCage(lower=false){
 const c={version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
 // Frame cage coordinates = [local u, local w, -local v].
 // Lower is a 180deg rotation about w; never a negative determinant mirror.
 const map=([u,v,w])=>lower?[-u,w,v]:[u,w,-v];
 const key=(j,n)=>`v${j}_${n}`;
 const edge=(id,a,b,ha=[0,0,0],hb=[0,0,0],soft=false,sequence=id)=>{
  c.segments[id]={id,a,b,ha,hb,soft,sequence};return id;
 };
 const seq=(id,first,segments,closed=false)=>c.sequences.push({id,first,segments,closed});
 const step=Math.PI/4,k=4/3*Math.tan(step/4);
 section.forEach(([r,w],j)=>{
  for(let n=0;n<=4;n++){const t=n*step;c.vertices[key(j,n)]=map([r*Math.cos(t),r*Math.sin(t),w]);}
  const id=`arc${j}`,ss=[];
  for(let n=0;n<4;n++){const a=n*step,b=(n+1)*step;ss.push(edge(`${id}_${n}`,key(j,n),key(j,n+1),map([-r*Math.sin(a)*k,r*Math.cos(a)*k,0]),map([r*Math.sin(b)*k,-r*Math.cos(b)*k,0]),true,id));}
  seq(id,key(j,0),ss);
 });
 for(let n=0;n<=4;n++){
  const id=`profile${n}`,ss=[];
  for(let j=0;j<section.length;j++)ss.push(edge(`${id}_${j}`,key(j,n),key((j+1)%section.length,n),undefined,undefined,false,id));
  seq(id,key(0,n),ss,true);
 }
 // Four chords partition each planar end into five non-overlapping quads.
 for(const n of [0,4])for(const [a,b] of [[1,4],[4,11],[5,10],[5,8]]){
  const id=`cap${n}_${a}_${b}`;edge(id,key(a,n),key(b,n));seq(id,key(a,n),[id]);
 }
 return c;
}
export function createTargetAssemblyProposal(){
 return {name:'Target keeper candidate',units:'mm',datum:datum(),
  sourceCoordinates:'cage [u,w,-v]; world point = Q + u*localU + v*localV + w*localW',
  parameters:{seatRadius:18.2,lipRadius:16.5,outsideRadius:23,axialPocket:6.4,lipThickness:2,ringNominalOD:36,ringNominalThickness:6,radialClearance:.2,axialTotalClearance:.4},
  parts:[{name:'KeeperTop',cage:keeperCage(false)},{name:'KeeperBottom',cage:keeperCage(true)}],
  assembly:{splitPlane:'local v=0',insert:'Remove upper keeper; lower ring into lower keeper, then replace upper. End faces touch, never overlap.',upperRemovalDirection:'world +v',left:'mirror complete world assembly across X=0; use native Instance when available'},
  checks:{nativeBuild:false,solidTopology:false,physicalFit:false,loadQualified:false},
  limitations:['No M3 holes, lugs or fasteners yet; upper half can lift off. Do not claim retained assembly.',
   'Lower keeper has NO attachment to old post/base; old intersecting envelopes must not be represented as joined.',
   'Clearances are provisional print allowances, not measured fits. Arc approximation is not manufacturing tolerance.',
   'Inspect native patches at all five end-cap quads and stepped lip corners before saving any candidate.',
   'No clamp force, cable pull, motor action or wrist support permitted by this proposal.'],
  next:'After native topology/clearance checks, extend direct-cage outer contours into fastening lugs with explicit spline-bounded M3 holes; then design lower-keeper/stand attachment.'};
}
export default createTargetAssemblyProposal;

// New candidate only: existing keeperCage/createTargetAssemblyProposal unchanged.
// Direct lower keeper/stem: the outer meridian continues down to a flat foot.
// No closed post is embedded or overlapped. The original inner seat and lips
// remain circular at exactly their old radii/w positions, with more arc stations.
export function lowerKeeperStemCage(){
 const d=datum(),angles=[0,45,75,105,135,180].map(x=>x*Math.PI/180);
 const outer=new Set([0,9,10,11]);
 const zAtZero=d.origin[2]+d.v[2]*(916-d.origin[1])/d.v[1];
 const footShift=(539-zAtZero)/(d.w[2]-d.v[2]*d.w[1]/d.v[1]);
 const c={version:2,approximation:{angle:12},next:2000,vertices:{},segments:{},sequences:[],freeHandles:{}};
 const key=(j,n)=>`v${j}_${n}`,map=([u,v,w])=>[u,w,-v];
 const seq=(id,first,segments,closed=false)=>c.sequences.push({id,first,segments,closed});
 const edge=(id,a,b,ha=[0,0,0],hb=[0,0,0],soft=false,sequence=id)=>{
  c.segments[id]={id,a,b,ha,hb,soft,sequence};return id;
 };
 section.forEach(([r,w],j)=>{
  const isOuter=outer.has(j),ss=[],id=`arc${j}`;
  angles.forEach((t,n)=>{
   const p=isOuter&&(n===2||n===3)
    ? [n===2?-12:12,(916-d.origin[1]-(w+footShift)*d.w[1])/d.v[1],w+footShift]
    : [-r*Math.cos(t),-r*Math.sin(t),w];
   c.vertices[key(j,n)]=map(p);
  });
  for(let n=0;n<angles.length-1;n++){
   const a=angles[n],b=angles[n+1],curved=!isOuter||n===0||n===4;
   const k=4/3*Math.tan((b-a)/4);
   const ha=curved?map([r*Math.sin(a)*k,-r*Math.cos(a)*k,0]):[0,0,0];
   const hb=curved?map([-r*Math.sin(b)*k,r*Math.cos(b)*k,0]):[0,0,0];
   ss.push(edge(`${id}_${n}`,key(j,n),key(j,n+1),ha,hb,curved,id));
  }
  seq(id,key(j,0),ss);
 });
 for(let n=0;n<angles.length;n++){
  const id=`profile${n}`,ss=[];
  for(let j=0;j<section.length;j++)ss.push(edge(`${id}_${j}`,key(j,n),key((j+1)%section.length,n),undefined,undefined,false,id));
  seq(id,key(0,n),ss,true);
 }
 for(const n of [0,angles.length-1])for(const [a,b] of [[1,4],[4,11],[5,10],[5,8]]){
  const id=`cap${n}_${a}_${b}`;edge(id,key(a,n),key(b,n));seq(id,key(a,n),[id]);
 }
 return c;
}
export function createLowerKeeperStemProposal(){
 const d=datum(),cage=lowerKeeperStemCage();
 return {name:'Lower keeper with integral stem candidate',units:'mm',datum:d,cage,
  sourceCoordinates:'cage [u,w,-v]; world = Q + u*localU + v*localV + w*localW',
  interface:{bottomWorldY:916,footWidthAlongU:24,footProjectedHorizontalDepth:10.4/d.v[1],
   seatAxialWRange:[-5.2,5.2],bottomWorldCenterZ:539,bottomLocalVFormula:'(916 - Q.y - w*axis.y) / v.y',
   bottomCenter:(()=>{const a=cage.vertices.v0_2,b=cage.vertices.v9_3;const m=a.map((x,i)=>(x+b[i])/2);return d.origin.map((x,i)=>x+d.u[i]*m[0]+d.w[i]*m[1]-d.v[i]*m[2]);})(),
   splitPlane:'v=0; original upper keeper remains unchanged',seatRadius:18.2,lipRadius:16.5},
  construction:'Outer radius-23 profile retains circular end arcs 0..45 and 135..180 degrees. Between them, straight shoulders continue into a 24-wide foot, shifted along w to center world Z=539 over the existing base. Inner seat/lips remain circular. One continuous cage, no separate post.',
  checks:{nativeBuild:false,solidTopology:false,physicalFit:false,loadQualified:false},
  limitations:['UNFIXED: bottom is a mating plane only; no holes, screws or base retention.',
   'Upper keeper is not fastened. Do not claim captured assembly or load support.',
   'Shoulder transitions at 45/135 degrees and foot edges are sharp draft corners; fillets/material/process remain open.',
   'Hide/remove the old intersecting post envelope when inspecting this candidate; do not combine it into a supposed joint.',
   'Recheck native patch connectivity and all world bottom vertices after applying datum.']};
}


// Unqualified direct-cage M3 lug candidate. Old exports above are unchanged.
// Holes are eight-arc spline boundaries and explicit walls, NOT subtractions.
export function keeperWithM3LugsCage(lower=false){
 const d=datum(),A=[0,7.5,15,45,75,105,135,165,172.5,180].map(x=>x*Math.PI/180),O=new Set([0,9,10,11]);
 const z0=d.origin[2]+d.v[2]*(916-d.origin[1])/d.v[1],shift=(534-z0)/(d.w[2]-d.v[2]*d.w[1]/d.v[1]);
 const c={version:2,approximation:{angle:12},next:4000,vertices:{},segments:{},sequences:[],freeHandles:{}},vm=new Map(),em=new Set();
 const map=([u,v,w])=>[u,w,-v],V=p=>{const k=p.map(x=>Math.abs(x)<1e-10?0:+x.toFixed(9)).join(',');if(vm.has(k))return vm.get(k);const id='v'+vm.size;vm.set(k,id);c.vertices[id]=map(p);return id;};
 const E=(a,b,ha=[0,0,0],hb=[0,0,0],soft=false)=>{const va=V(a),vb=V(b);if(va===vb)throw Error('zero edge');const k=[va,vb].sort().join('|');if(em.has(k))return;em.add(k);const id='s'+em.size;c.segments[id]={id,a:va,b:vb,ha:map(ha),hb:map(hb),sequence:id,soft};c.sequences.push({id,first:va,segments:[id],closed:false});};
 const s=lower?-1:1,P=section.map(([r,w],j)=>A.map((t,n)=>{
  if(!O.has(j))return [-r*Math.cos(t),s*r*Math.sin(t),w];
  if(n===0)return [-32,0,w];if(n===1)return [-32,s*6,w];if(n===2)return [-22.2,s*6,w];
  if(n===7)return [22.2,s*6,w];if(n===8)return [32,s*6,w];if(n===9)return [32,0,w];
  if(lower&&(n===4||n===5)){const ww=w+shift;return [n===4?-12:12,(916-d.origin[1]-ww*d.w[1])/d.v[1],ww];}
  return [-r*Math.cos(t),s*r*Math.sin(t),w];
 }));
 for(let j=0;j<section.length;j++)for(let n=0;n<A.length-1;n++){
  if(O.has(j)&&(j===10||j===11)&&(n===1||n===7))continue; // hole face replaces these internal lines
  const curved=!O.has(j)||(!lower&&n>=3&&n<=5),r=section[j][0],a=A[n],b=A[n+1],k=4/3*Math.tan((b-a)/4);
  E(P[j][n],P[j][n+1],curved?[r*Math.sin(a)*k,s*r*Math.cos(a)*k,0]:undefined,curved?[-r*Math.sin(b)*k,-s*r*Math.cos(b)*k,0]:undefined,curved);
 }
 for(let n=0;n<A.length;n++)for(let j=0;j<section.length;j++){
  const a=P[j][n],b=P[(j+1)%section.length][n];
  if((n===0||n===9)&&a[2]===b[2]&&Math.min(Math.abs(a[0]),Math.abs(b[0]))<22.2&&Math.max(Math.abs(a[0]),Math.abs(b[0]))>22.2){const m=[n===0?-22.2:22.2,0,a[2]];E(a,m);E(m,b);}else E(a,b);
 }
 for(const n of[0,9]){
  const sign=n===0?-1:1;
  E(P[1][n],P[4][n]);E(P[5][n],P[8][n]);
  E(P[4][n],[sign*22.2,0,-3.2]);E(P[5][n],[sign*22.2,0,3.2]);
 }
 const B=[[22.2,-5.2],[32,-5.2],[32,-3.2],[32,3.2],[32,5.2],[22.2,5.2],[22.2,3.2],[22.2,-3.2]].sort((a,b)=>Math.atan2(a[1],a[0]-27)-Math.atan2(b[1],b[0]-27));
 for(const sign of[-1,1]){
  const loops=[];
  for(const v of[0,s*6]){
   const C=B.map(([u,w])=>{const t=Math.atan2(w,u-27);return {t,p:[sign*(27+1.7*Math.cos(t)),v,1.7*Math.sin(t)]};});loops.push(C);
   for(let k=0;k<B.length;k++){
    const l=(k+1)%B.length,[u,w]=B[k],[u2,w2]=B[l],a=C[k],b=C[l],dt=(b.t-a.t+2*Math.PI)%(2*Math.PI),h=4/3*Math.tan(dt/4);
    E([sign*u,v,w],[sign*u2,v,w2]);E([sign*u,v,w],a.p);
    E(a.p,b.p,[-sign*1.7*Math.sin(a.t)*h,0,1.7*Math.cos(a.t)*h],[sign*1.7*Math.sin(b.t)*h,0,-1.7*Math.cos(b.t)*h],true);
   }
  }
  for(let k=0;k<B.length;k++)E(loops[0][k].p,loops[1][k].p);
  // Exposed axial-end surfaces: connect new cap and plateau corner controls.
  for(const w of[-5.2,5.2])E([sign*22.2,0,w],[sign*22.2,s*6,w]);
 }
 return c;
}
export function createKeeperM3LugsProposal(){
 return {name:'Split keeper M3 lug candidate',units:'mm',datum:datum(),
  sourceCoordinates:'cage [u,w,-v]; world = Q + u*localU + v*localV + w*localW',
  parts:[{name:'KeeperTopM3',cage:keeperWithM3LugsCage(false)},{name:'KeeperStemM3',cage:keeperWithM3LugsCage(true)}],
  interfaces:{holeDiameter:3.4,holeAxes:[{origin:[-27,0,0],direction:[0,1,0]},{origin:[27,0,0],direction:[0,1,0]}],
   lugRanges:{absU:[22.2,32],upperV:[0,6],lowerV:[-6,0],w:[-5.2,5.2]},
   seatRadius:18.2,lipRadius:16.5,axialPocket:6.4,bottomWorldY:916,bottomWorldCenterZ:534},
  assumptions:['M3 clearance diameter3.4 is provisional; no fit or print accuracy claim.',
   'Use through screws and accessible nuts, not threads in printed holes; hardware/length/tool access not yet modeled.',
   'Lug mating faces touch at v=0; 12mm nominal total grip. Fastening should seat those faces, not squeeze the loose ring.'],
  checks:{nativeBuild:false,solidTopology:false,holePassage:false,physicalFit:false,loadQualified:false},
  limitations:['UNFIXED: no physical fasteners or base fixation yet.',
   'Native patch inference at lug-to-ring end surfaces MUST be inspected; this graph is a candidate, not a qualified solid.',
   'Sharp corners remain; material, fillets, screw preload and printed-part crushing need design.']};
}


// V2 removes four old loft diagonals crossing the new lug-end boundary.
// Each corrected end transition is explicitly one triangle + one quad.
// Original exports remain historical candidates, not silently corrected.
export function keeperWithM3LugsV2Cage(lower=false){
 const c=keeperWithM3LugsCage(lower),signV=lower?-1:1;
 const find=(u,v,w)=>{const target=[u,w,-v];const hit=Object.entries(c.vertices).find(([,p])=>Math.hypot(...p.map((x,i)=>x-target[i]))<1e-7);if(!hit)throw Error('missing V2 station');return hit[0];};
 const remove=(a,b)=>{const pair=Object.entries(c.segments).find(([,s])=>(s.a===a&&s.b===b)||(s.a===b&&s.b===a));if(!pair)throw Error('missing crossing diagonal');const [id]=pair;delete c.segments[id];c.sequences=c.sequences.filter(s=>!s.segments.includes(id));};
 let count=0;
 for(const side of[-1,1])for(const w of[-5.2,5.2]){
  const oldOuter=find(side*32,signV*6,w);
  const inner=find(side*18.2*Math.cos(Math.PI/24),signV*18.2*Math.sin(Math.PI/24),w);
  const cap=find(side*22.2,0,w);
  remove(oldOuter,inner);
  const id='v2transition'+count++;
  c.segments[id]={id,a:cap,b:inner,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};
  c.sequences.push({id,first:cap,segments:[id],closed:false});
 }
 return c;
}
export function createKeeperM3LugsV2Proposal(){
 const p=createKeeperM3LugsProposal();
 p.name='Split keeper M3 lug V2 candidate';
 p.parts=[{name:'KeeperTopM3V2',cage:keeperWithM3LugsV2Cage(false)},{name:'KeeperStemM3V2',cage:keeperWithM3LugsV2Cage(true)}];
 p.correction='Removed four crossing axial-end loft diagonals. Four explicit triangular transition cells plus quadrilateral neighbours replace the overlapping graph.';
 p.expectedTopology={vertices:160,edges:326,triangularCells:4,quadrilateralCells:160,totalCells:164,eulerCharacteristic:-2,genus:2,nativeVerified:false};
 p.checks.nativeBuild=false;p.checks.solidTopology=false;
 return p;
}
