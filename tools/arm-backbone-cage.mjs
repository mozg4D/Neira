import {monotonePod} from './base-pod-cage.mjs';

// Native spline-only arm backbone packaging/load-path concept, mm.
// Local Z is the tube axis. Both ends remain open. No mesh authoring.
// Nominal coordinate wall dimensions are not a normal-offset/min-wall proof.
// No loads, actuator/bearing selection, end-joint design, attachment, material,
// buckling, strength or manufacturing qualification is implied.
function hollowRoundedTube(length,outer,inner){
  const [w,h,r]=outer,[iw,ih,ir]=inner;
  const c=monotonePod([[0,w,h,r],[length,w,h,r]]);
  const d=monotonePod([[0,iw,ih,ir],[length,iw,ih,ir]]);
  for(const [id,p]of Object.entries(d.vertices))c.vertices['i'+id]=p;
  for(const [id,s]of Object.entries(d.segments))c.segments['i'+id]={...s,id:'i'+id,a:'i'+s.a,b:'i'+s.b,sequence:'i'+s.sequence};
  c.sequences.push(...d.sequences.map(q=>({...q,id:'i'+q.id,first:'i'+q.first,segments:q.segments.map(id=>'i'+id)})));
  // Nested closed loops at each axial end define annular end faces; their
  // longitudinal curves define inner/outer walls. No internal caps or spokes.
  // This follows the previously integrated open-tube native patch pattern.
  for(const [id,p]of Object.entries(c.vertices))c.vertices[id]=[p[0],p[2],p[1]];
  for(const s of Object.values(c.segments))for(const h of ['ha','hb'])s[h]=[s[h][0],s[h][2],s[h][1]];
  return c;
}
export function upper(){return hollowRoundedTube(200,[32,24,4],[28,20,2]);}
export function fore(){return hollowRoundedTube(180,[32,24,4],[28,20,2]);}
export function saddle(){return hollowRoundedTube(8,[40,30,7],[32,24,4]);}
export const parts=[
  {name:'Upper backbone',units:'mm',cage:upper()},
  {name:'Fore backbone',units:'mm',cage:fore()},
  {name:'Backbone saddle',units:'mm',cage:saddle()}
];

// CPU source-graph validation, not evaluated surface topology. Two graph
// components (outer and inner) are intentional; native nested-face inference
// must be checked by the assembler for a single annular material shell.
export function checkSourceStructure(){return parts.map(({name,cage:c})=>{
  const ids=Object.keys(c.vertices),degree=Object.fromEntries(ids.map(id=>[id,0])),seen=new Set();
  for(const p of Object.values(c.vertices))if(p.length!==3||p.some(x=>!Number.isFinite(x)))throw Error(name+' invalid vertex');
  for(const [id,s]of Object.entries(c.segments)){
    if(id!==s.id||!c.vertices[s.a]||!c.vertices[s.b]||s.a===s.b||s.ha.concat(s.hb).some(x=>!Number.isFinite(x)))throw Error(name+' invalid segment');
    degree[s.a]++;degree[s.b]++;
  }
  for(const q of c.sequences){let a=q.first;for(const id of q.segments){const s=c.segments[id];if(!s||s.a!==a||s.sequence!==q.id||seen.has(id))throw Error(name+' invalid sequence');seen.add(id);a=s.b;}if(q.closed&&a!==q.first)throw Error(name+' unclosed ring');}
  if(seen.size!==Object.keys(c.segments).length||Object.values(degree).some(v=>v!==3))throw Error(name+' unexpected graph');
  const visited=new Set(),components=[];
  for(const start of ids){if(visited.has(start))continue;const queue=[start];visited.add(start);let count=0;while(queue.length){const id=queue.pop();count++;for(const s of Object.values(c.segments)){const n=s.a===id?s.b:s.b===id?s.a:null;if(n&&!visited.has(n)){visited.add(n);queue.push(n);}}}components.push(count);}
  if(components.length!==2||components.some(n=>n!==16))throw Error(name+' unexpected components');
  const v=Object.values(c.vertices);return {name,vertices:v.length,segments:seen.size,components,min:[0,1,2].map(j=>Math.min(...v.map(p=>p[j]))),max:[0,1,2].map(j=>Math.max(...v.map(p=>p[j])))};
});}
