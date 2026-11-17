// Native spline-only joint housing/service-cover envelopes, nominal mm.
// Axis is local Y. Open drum uses nested annular ends, not solid end caps.
// No bearing seats, motors, torque transmission, radial link ports, fasteners,
// sealing, actual cable routing, loads or manufacturing qualification are claimed.
const K=0.5522847498307936;
function annulus(y0,y1,outerRadius,innerRadius){
  const c={version:2,approximation:{angle:10},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
  for(const [prefix,r]of [['o',outerRadius],['i',innerRadius]]){
    for(let q=0;q<2;q++){
      const ring=prefix+'r'+q,ids=[];
      for(let k=0;k<4;k++){
        const a=k*Math.PI/2,b=(k+1)*Math.PI/2,id=ring+'_'+k,v=prefix+'v'+q+'_';
        c.vertices[v+k]=[r*Math.cos(a),q?y1:y0,r*Math.sin(a)];
        c.segments[id]={id,a:v+k,b:v+((k+1)%4),ha:[-r*Math.sin(a)*K,0,r*Math.cos(a)*K],hb:[r*Math.sin(b)*K,0,-r*Math.cos(b)*K],sequence:ring,soft:true};ids.push(id);
      }
      c.sequences.push({id:ring,first:prefix+'v'+q+'_0',segments:ids,closed:true});
    }
    for(let k=0;k<4;k++){
      const id=prefix+'l'+k,a=prefix+'v0_'+k,b=prefix+'v1_'+k;
      c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};
      c.sequences.push({id,first:a,segments:[id],closed:false});
    }
  }
  return c;
}
export function drum(){return annulus(0,70,50,44);}
export function cover(){return annulus(-3,0,50,22);}
export const parts=[{name:'Joint drum',units:'mm',cage:drum()},{name:'Joint service cover',units:'mm',cage:cover()}];

// CPU source graph checks only. Two source graph components are intentional:
// native Spline Patch face inference must join nested contours into annular ends.
export function checkSourceStructure(){return parts.map(({name,cage:c})=>{
  const ids=Object.keys(c.vertices),degree=Object.fromEntries(ids.map(id=>[id,0])),seen=new Set();
  for(const p of Object.values(c.vertices))if(p.length!==3||p.some(x=>!Number.isFinite(x)))throw Error(name+' invalid vertex');
  for(const [id,s]of Object.entries(c.segments)){
    if(id!==s.id||!c.vertices[s.a]||!c.vertices[s.b]||s.a===s.b||s.ha.concat(s.hb).some(x=>!Number.isFinite(x)))throw Error(name+' invalid segment');degree[s.a]++;degree[s.b]++;
  }
  for(const q of c.sequences){let a=q.first;for(const id of q.segments){const s=c.segments[id];if(!s||s.a!==a||s.sequence!==q.id||seen.has(id))throw Error(name+' invalid sequence');seen.add(id);a=s.b;}if(q.closed&&a!==q.first)throw Error(name+' unclosed ring');}
  if(seen.size!==Object.keys(c.segments).length||Object.values(degree).some(n=>n!==3))throw Error(name+' unexpected graph');
  const visited=new Set(),components=[];
  for(const first of ids){if(visited.has(first))continue;visited.add(first);const queue=[first];let count=0;while(queue.length){const id=queue.pop();count++;for(const s of Object.values(c.segments)){const next=s.a===id?s.b:s.b===id?s.a:null;if(next&&!visited.has(next)){visited.add(next);queue.push(next);}}}components.push(count);}
  if(components.length!==2||components.some(n=>n!==8))throw Error(name+' unexpected graph components');
  const v=Object.values(c.vertices);return {name,vertices:ids.length,segments:seen.size,components,min:[0,1,2].map(j=>Math.min(...v.map(p=>p[j]))),max:[0,1,2].map(j=>Math.max(...v.map(p=>p[j]))),nativeSurfaceQualified:false};
});}
