// Native spline L-section carrier concept, millimetres, model X/Y/Z.
// Right of the mast; assembler may mirror by Instance scale X=-1.
// Nominal contact only: flange X40..44 touches mast outer X40; top Y1012
// leaves 8 mm to beam underside Y1020. No fasteners, retention, removal path,
// load/material/manufacturing qualification or electronics are included.
export function carrier(){
  const c={version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
  const xy=[[40,982],[110,982],[110,986],[44,986],[44,1012],[40,1012]];
  for(let q=0;q<2;q++){
    const ring='r'+q,ids=[];
    xy.forEach(([x,y],k)=>c.vertices['v'+q+'_'+k]=[x,y,q?45:-45]);
    for(let k=0;k<6;k++){
      const id=ring+'_'+k;ids.push(id);
      c.segments[id]={id,a:'v'+q+'_'+k,b:'v'+q+'_'+((k+1)%6),ha:[0,0,0],hb:[0,0,0],sequence:ring,soft:false};
    }
    c.sequences.push({id:ring,first:'v'+q+'_0',segments:ids,closed:true});
  }
  for(let k=0;k<6;k++){
    const id='l'+k,a='v0_'+k,b='v1_'+k;
    c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};
    c.sequences.push({id,first:a,segments:[id],closed:false});
  }
  return c;
}
export const parts=[{name:'Torso service carrier',units:'mm',cage:carrier()}];
export function checkSourceStructure(){
  const c=carrier(),ids=Object.keys(c.vertices),degree=Object.fromEntries(ids.map(id=>[id,0])),seen=new Set();
  for(const p of Object.values(c.vertices))if(p.some(x=>!Number.isFinite(x)))throw Error('nonfinite vertex');
  for(const [id,s]of Object.entries(c.segments)){
    if(id!==s.id||!c.vertices[s.a]||!c.vertices[s.b]||s.a===s.b||s.ha.concat(s.hb).some(x=>x!==0))throw Error('invalid straight segment');
    degree[s.a]++;degree[s.b]++;
  }
  for(const q of c.sequences){let a=q.first;for(const id of q.segments){const s=c.segments[id];if(!s||s.a!==a||s.sequence!==q.id||seen.has(id))throw Error('invalid sequence');seen.add(id);a=s.b;}if(q.closed&&a!==q.first)throw Error('unclosed section');}
  if(ids.length!==12||seen.size!==18||Object.values(degree).some(n=>n!==3))throw Error('unexpected graph');
  const reached=new Set([ids[0]]),queue=[ids[0]];
  while(queue.length){const id=queue.pop();for(const s of Object.values(c.segments)){const next=s.a===id?s.b:s.b===id?s.a:null;if(next&&!reached.has(next)){reached.add(next);queue.push(next);}}}
  if(reached.size!==12)throw Error('disconnected graph');
  const v=Object.values(c.vertices);
  return {vertices:ids.length,segments:seen.size,connected:true,min:[0,1,2].map(j=>Math.min(...v.map(p=>p[j]))),max:[0,1,2].map(j=>Math.max(...v.map(p=>p[j]))),nativeSurfaceQualified:false};
}
