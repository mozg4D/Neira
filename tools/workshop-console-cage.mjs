import {monotonePod} from './base-pod-cage.mjs';
// Planning-console concept, native spline cages, mm, Y up. No Frame calls.
// Assumed workshop position, not a surveyed site or construction specification.
// Joints, wall/floor anchorage, wiring, ergonomics, loads and hardware selection
// remain unresolved. Display is an opaque equipment envelope, not an operating UI.
function block(w,d,r,y0,y1,x,z){const c=monotonePod([[y0,w,d,r],[y1,w,d,r]]);for(const p of Object.values(c.vertices)){p[0]+=x;p[2]+=z;}return c;}
export function top(){return block(1000,450,45,875,900,-1000,-1125);}
export function sideSupport(x=-1420){return block(50,350,12,0,875,x,-1125);}
export function lowerTie(){return block(790,40,6,200,240,-1000,-1260);}
export function pedestal(){return block(70,80,12,900,950,-1000,-1230);}
function displayPlate(w,h,r,t0,t1){
  // Tilt the top 15 degrees toward the rear wall. The face points +Z/up.
  const c=monotonePod([[t0,w,h,r],[t1,w,h,r]]),a=Math.PI/12,co=Math.cos(a),si=Math.sin(a);
  const transform=([x,t,v])=>[x,co*v+si*t,-si*v+co*t];
  for(const [id,p]of Object.entries(c.vertices)){const q=transform(p);c.vertices[id]=[q[0]-1000,q[1]+1020,q[2]-1240];}
  for(const s of Object.values(c.segments))for(const h of ['ha','hb'])s[h]=transform(s[h]);
  return c;
}
export function screenHousing(){return displayPlate(500,200,20,-12,0);}
export function screenFace(){return displayPlate(472,172,12,0,1);}
export function createConsoleParts(){return [
  {name:'Planning top',material:'shell',cage:top()},
  {name:'Console leg L',material:'frame',cage:sideSupport()},
  {name:'Console leg R',material:'frame',cage:sideSupport(-580)},
  {name:'Console tie',material:'frame',cage:lowerTie()},
  {name:'Display stand',material:'frame',cage:pedestal()},
  {name:'Display envelope',material:'frame',cage:screenHousing()},
  {name:'Display face',material:'display',cage:screenFace()}
].map(p=>({...p,units:'mm'}));}
export const parts=createConsoleParts();

// CPU graph checks, not evaluated Spline Patch topology or physical qualification.
export function checkSourceStructure(){return parts.map(({name,cage:c})=>{
  const ids=Object.keys(c.vertices),degree=Object.fromEntries(ids.map(id=>[id,0]));
  for(const [id,p]of Object.entries(c.vertices))if(p.length!==3||p.some(x=>!Number.isFinite(x)))throw Error(name+' invalid vertex '+id);
  for(const [id,s]of Object.entries(c.segments)){
    if(s.id!==id||!c.vertices[s.a]||!c.vertices[s.b]||s.a===s.b)throw Error(name+' invalid edge '+id);
    if(s.ha.concat(s.hb).some(x=>!Number.isFinite(x)))throw Error(name+' invalid handle '+id);
    degree[s.a]++;degree[s.b]++;
  }
  const seen=new Set();
  for(const q of c.sequences){let current=q.first;for(const id of q.segments){const s=c.segments[id];if(!s||s.a!==current||s.sequence!==q.id||seen.has(id))throw Error(name+' broken sequence '+q.id);seen.add(id);current=s.b;}if(q.closed&&current!==q.first)throw Error(name+' unclosed ring');}
  if(seen.size!==Object.keys(c.segments).length||Object.values(degree).some(n=>n!==3))throw Error(name+' disconnected/unexpected graph');
  const visited=new Set([ids[0]]),queue=[ids[0]];while(queue.length){const id=queue.pop();for(const s of Object.values(c.segments)){const next=s.a===id?s.b:s.b===id?s.a:null;if(next&&!visited.has(next)){visited.add(next);queue.push(next);}}}
  if(visited.size!==ids.length)throw Error(name+' disconnected cage');
  const v=Object.values(c.vertices);return {name,vertices:ids.length,segments:seen.size,connected:true,min:[0,1,2].map(j=>Math.min(...v.map(p=>p[j]))),max:[0,1,2].map(j=>Math.max(...v.map(p=>p[j])))};
});}
