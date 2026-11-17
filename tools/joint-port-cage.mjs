// Native spline C-section rotating-shell concept, nominal mm, axis local Y.
// Slot faces +X and extends the full Y0..70 length. This is not a complete joint.
// Bearings, rotor/link attachment, cover fastening, torque transmission, loads,
// assembly sequence and manufacturing tolerances remain unresolved.
const angles=[18,90,180,270,342].map(d=>d*Math.PI/180);
export function portDrum(){
  const c={version:2,approximation:{angle:10},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
  for(let q=0;q<2;q++){
    for(const [p,r]of [['o',50],['i',44]])for(let k=0;k<5;k++)c.vertices[p+q+'_'+k]=[r*Math.cos(angles[k]),q?70:0,r*Math.sin(angles[k])];
    const ring='end'+q,ids=[];
    function arc(p,r,k,l){
      const a=angles[k],b=angles[l],f=4/3*Math.tan((b-a)/4),id=p+q+'a'+k+'_'+l;
      c.segments[id]={id,a:p+q+'_'+k,b:p+q+'_'+l,ha:[-r*Math.sin(a)*f,0,r*Math.cos(a)*f],hb:[r*Math.sin(b)*f,0,-r*Math.cos(b)*f],sequence:ring,soft:true};ids.push(id);
    }
    function radial(id,a,b){c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence:ring,soft:false};ids.push(id);}
    for(let k=0;k<4;k++)arc('o',50,k,k+1);
    radial('cutB'+q,'o'+q+'_4','i'+q+'_4');
    for(let k=4;k>0;k--)arc('i',44,k,k-1);
    radial('cutA'+q,'i'+q+'_0','o'+q+'_0');
    c.sequences.push({id:ring,first:'o'+q+'_0',segments:ids,closed:true});
  }
  for(const p of ['o','i'])for(let k=0;k<5;k++){
    const id=p+'long'+k,a=p+'0_'+k,b=p+'1_'+k;
    c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};
    c.sequences.push({id,first:a,segments:[id],closed:false});
  }
  return c;
}
export const parts=[{name:'Joint port shell',units:'mm',cage:portDrum()}];
export function checkSourceStructure(){
  const c=portDrum(),ids=Object.keys(c.vertices),seen=new Set(),degree=Object.fromEntries(ids.map(id=>[id,0]));
  for(const p of Object.values(c.vertices))if(p.length!==3||p.some(x=>!Number.isFinite(x)))throw Error('invalid vertex');
  for(const [id,s]of Object.entries(c.segments)){
    if(s.id!==id||!c.vertices[s.a]||!c.vertices[s.b]||s.a===s.b||s.ha.concat(s.hb).some(x=>!Number.isFinite(x)))throw Error('invalid segment');degree[s.a]++;degree[s.b]++;
  }
  for(const q of c.sequences){let a=q.first;for(const id of q.segments){const s=c.segments[id];if(!s||s.a!==a||s.sequence!==q.id||seen.has(id))throw Error('invalid sequence');seen.add(id);a=s.b;}if(q.closed&&a!==q.first)throw Error('unclosed end');}
  if(ids.length!==20||seen.size!==30||Object.values(degree).some(n=>n!==3))throw Error('unexpected graph');
  const visited=new Set([ids[0]]),queue=[ids[0]];
  while(queue.length){const id=queue.pop();for(const s of Object.values(c.segments)){const next=s.a===id?s.b:s.b===id?s.a:null;if(next&&!visited.has(next)){visited.add(next);queue.push(next);}}}
  if(visited.size!==20)throw Error('disconnected cage');
  // Exactly planar, concave 10-edge end loops and four straight slot edges.
  for(const q of [0,1])for(const p of ['o','i'])for(let k=0;k<5;k++)if(c.vertices[p+q+'_'+k][1]!==q*70)throw Error('nonplanar end');
  const edgeZ=44*Math.sin(Math.PI/10);
  return {vertices:20,segments:30,sourceGraphConnected:true,planarEnds:true,innerSlotEdgeZ:edgeZ,nominalBeamHalfWidth:12,nominalEdgeClearance:edgeZ-12,axialRange:[0,70],nativeSurfaceQualified:false};
}
