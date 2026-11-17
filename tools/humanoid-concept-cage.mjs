// External humanoid robot concept, Y up / +Z forward / nominal millimetres.
// Whole model is a solid packaging study: no wall thickness, stair capability,
// balance, actuator selection, load rating, collision or manufacturing claim.
// buildHumanoid is deliberately self-contained for native Frame API transfer.
export function buildHumanoid() {
 const K=.5522847498307936;
 const parts=[];
 function loft(stations,rounded=false) {
  const c={version:2,approximation:{angle:12},next:10000,vertices:{},segments:{},sequences:[],freeHandles:{}};
  const count=rounded?8:4;
  for(let q=0;q<stations.length;q++) {
   const [y,w,d,cx=0,cz=0,r0=0]=stations[q],rx=w/2,rz=d/2,r=Math.min(r0,rx,rz),ring='ring'+q,ids=[];
   const points=rounded?[[-rx+r,-rz],[rx-r,-rz],[rx,-rz+r],[rx,rz-r],[rx-r,rz],[-rx+r,rz],[-rx,rz-r],[-rx,-rz+r]]:[[rx,0],[0,rz],[-rx,0],[0,-rz]];
   const corners={1:[[r*K,0],[0,-r*K]],3:[[0,r*K],[r*K,0]],5:[[-r*K,0],[0,r*K]],7:[[0,-r*K],[-r*K,0]]};
   points.forEach((p,k)=>c.vertices['v'+q+'_'+k]=[p[0]+cx,y,p[1]+cz]);
   for(let k=0;k<count;k++) {
    const id='r'+q+'_'+k;let ha,hb;
    if(rounded){const h=corners[k]||[[0,0],[0,0]];ha=[h[0][0],0,h[0][1]];hb=[h[1][0],0,h[1][1]];}
    else {const a=k*Math.PI/2,b=(k+1)*Math.PI/2;ha=[-Math.sin(a)*rx*K,0,Math.cos(a)*rz*K];hb=[Math.sin(b)*rx*K,0,-Math.cos(b)*rz*K];}
    c.segments[id]={id,a:'v'+q+'_'+k,b:'v'+q+'_'+((k+1)%count),ha,hb,sequence:ring,soft:!rounded||!!corners[k]};ids.push(id);
   }
   c.sequences.push({id:ring,first:'v'+q+'_0',segments:ids,closed:true});
  }
  for(let k=0;k<count;k++) {
   const points=stations.map((_,q)=>c.vertices['v'+q+'_'+k]),slopes=points.slice(0,-1).map((p,q)=>p.map((v,j)=>(points[q+1][j]-v)/(stations[q+1][0]-stations[q][0])));
   const t=points.map((_,q)=>[0,1,2].map(j=>{if(q===0)return slopes[0][j];if(q===points.length-1)return slopes.at(-1)[j];const a=slopes[q-1][j],b=slopes[q][j];return a*b<=0?0:Math.sign(a)*Math.min(Math.abs(a),Math.abs(b));})),seq='long'+k,ids=[];
   for(let q=0;q<points.length-1;q++){const id='l'+k+'_'+q,dt=stations[q+1][0]-stations[q][0];c.segments[id]={id,a:'v'+q+'_'+k,b:'v'+(q+1)+'_'+k,ha:t[q].map(v=>v*dt/3),hb:t[q+1].map(v=>-v*dt/3),sequence:seq,soft:true};ids.push(id);}
   c.sequences.push({id:seq,first:'v0_'+k,segments:ids,closed:false});
  }
  return c;
 }
 const add=(name,role,material,stations,rounded=false)=>parts.push({name,role,material,cage:loft(stations,rounded)});
 // Waist and shoulders read as one continuous shell; a separate hip belt
 // establishes the pelvis and exposes the two leg articulation envelopes.
 add('Torso','tapered feminine torso packaging','shell',[
  [1020,280,190,0,-3],[1100,226,158,0,-5],[1180,250,174,0,0],
  [1280,322,218,0,13],[1360,350,198,0,8],[1415,344,170,0,2],[1460,104,90,0,0]
 ]);
 add('Pelvis','rounded pelvis and upper-leg fairing','shell',[
  [900,238,152,0,0],[940,330,205,0,-3],[980,350,214,0,-4],[1020,280,190,0,-3]
 ]);
 for(const side of [-1,1]) {
  const suffix=side<0?' L':' R',x=v=>side*v;
  add('Hip'+suffix,'hip articulation envelope, not a selected joint','joint',[[890,80,90,x(100),0],[920,110,116,x(100),0],[950,82,92,x(100),0]]);
  add('Thigh'+suffix,'upper-leg sculpted panel envelope','shell',[[535,94,102,x(105),4],[650,122,132,x(108),0],[800,152,154,x(104),-3],[902,134,140,x(100),0]]);
  add('Knee'+suffix,'knee articulation envelope','joint',[[470,76,84,x(105),3],[505,100,110,x(105),7],[535,80,88,x(105),4]]);
  add('Calf'+suffix,'lower-leg shaped panel envelope','shell',[[115,69,76,x(105),-8],[225,78,91,x(105),-8],[360,111,122,x(105),-3],[470,91,96,x(105),3]]);
  add('Ankle'+suffix,'ankle articulation envelope','joint',[[72,56,64,x(105),-8],[94,70,76,x(105),-8],[115,56,64,x(105),-8]]);
  add('Foot'+suffix,'flat stair-foot packaging, not a contact/stability proof','shell',[[0,108,238,x(105),46,26],[24,110,240,x(105),46,28],[57,98,214,x(105),40,30],[78,72,94,x(105),-4,28]],true);
  add('Shoulder'+suffix,'shoulder articulation envelope','joint',[[1335,72,82,x(203),0],[1380,102,112,x(203),0],[1420,72,82,x(203),0]]);
  add('Upper arm'+suffix,'upper-arm sculpted shell envelope','shell',[[1155,69,78,x(239),0],[1245,88,98,x(229),-1],[1335,98,106,x(211),0]]);
  add('Elbow'+suffix,'elbow articulation envelope','joint',[[1105,57,65,x(242),3],[1130,74,83,x(242),2],[1155,60,68,x(239),0]]);
  add('Forearm'+suffix,'forearm tapering shell envelope','shell',[[930,51,61,x(232),12],[1010,70,83,x(240),8],[1105,64,72,x(242),3]]);
  add('Wrist'+suffix,'wrist articulation envelope','joint',[[898,43,49,x(232),13],[914,53,59,x(232),13],[930,43,49,x(232),12]]);
  add('Hand'+suffix,'simple end-effector envelope, not modelled fingers','shell',[[830,48,34,x(232),19,14],[851,67,40,x(232),17,17],[883,65,44,x(232),14,17],[898,43,42,x(232),13,15]],true);
 }
 add('Neck','neck articulation envelope','joint',[[1460,75,72,0,0],[1498,75,72,0,0]]);
 add('Head','robot sensor housing, not a human face','shell',[[1498,128,116,0,0,32],[1538,195,160,0,0,35],[1644,210,170,0,0,35],[1700,170,140,0,0,32]],true);
 // Optical face in front of the sensor housing; no eyes/skin or small trim.
 const face=loft([[82,160,62,0,0,24],[88,160,62,0,0,24]],true);
 for(const p of Object.values(face.vertices)){const extrusion=p[1];p[1]=1600+p[2];p[2]=extrusion;}
 for(const s of Object.values(face.segments))for(const h of ['ha','hb']){const extrusion=s[h][1];s[h][1]=s[h][2];s[h][2]=extrusion;}
 parts.push({name:'Optic face',role:'opaque optical visor envelope','material':'glass',cage:face});
 return parts;
}

export function checkHumanoid() {
 const assert=(c,m)=>{if(!c)throw new Error(m);};
 const parts=buildHumanoid();assert(parts.length<=30,'Part limit');assert(new Set(parts.map(p=>p.name)).size===parts.length,'Duplicate names');
 let controls=0,segments=0;const all=[];
 for(const part of parts){const c=part.cage,seen=new Set(),adj=new Map(Object.keys(c.vertices).map(id=>[id,new Set()]));
  assert(['shell','joint','accent','glass'].includes(part.material),'Invalid material');
  for(const p of Object.values(c.vertices)){assert(p.length===3&&p.every(Number.isFinite),'Invalid point');all.push(p);controls++;}
  for(const [id,s]of Object.entries(c.segments)){assert(id===s.id&&c.vertices[s.a]&&c.vertices[s.b]&&s.a!==s.b,'Invalid segment');assert(s.ha.concat(s.hb).every(Number.isFinite),'Invalid handle');adj.get(s.a).add(s.b);adj.get(s.b).add(s.a);segments++;}
  for(const seq of c.sequences){let v=seq.first;for(const id of seq.segments){const s=c.segments[id];assert(s&&s.a===v&&s.sequence===seq.id&&!seen.has(id),'Invalid sequence');seen.add(id);v=s.b;}assert(!seq.closed||v===seq.first,'Unclosed ring');}
  assert(seen.size===Object.keys(c.segments).length,'Unsequenced edges');
  const visited=new Set(),queue=[Object.keys(c.vertices)[0]];while(queue.length){const v=queue.pop();if(visited.has(v))continue;visited.add(v);queue.push(...adj.get(v));}assert(visited.size===adj.size,'Disconnected part');
 }
 const bounds={min:[0,1,2].map(j=>Math.min(...all.map(p=>p[j]))),max:[0,1,2].map(j=>Math.max(...all.map(p=>p[j])))};
 assert(bounds.min[1]===0&&bounds.max[1]===1700,'Incorrect height');
 const plain=JSON.parse(JSON.stringify(parts));assert(plain.length===parts.length,'Not serializable');
 // Function transfer must not depend on the module exports or imports.
 const standalone=Function('return ('+buildHumanoid.toString()+')()')();assert(JSON.stringify(standalone)===JSON.stringify(parts),'Factory not self-contained');
 return {parts:parts.length,controls,segments,bounds,finite:true,connectedPerPart:true,sequencesValid:true,selfContained:true,nominalHeightMm:1700,sourceOnly:true,nativeSurfacesVerified:false,stairCapabilityQualified:false,physicalQualification:false};
}
