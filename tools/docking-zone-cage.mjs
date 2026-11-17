import {monotonePod} from './base-pod-cage.mjs';

// Docking-zone spatial concept, native editable spline cages in millimetres.
// These are opaque appearance/equipment envelopes, NOT a functional charger.
// No electrical design, live contacts, alignment mechanism, charging protocol,
// thermal/fire safety, anchorage, collision clearance or rated loads are claimed.
// Approach stays open at +Z; low side markers are visual guides, not wheel stops.
function block(w,d,r,y0,y1,x,z){
  const c=monotonePod([[y0,w,d,r],[y1,w,d,r]]);
  for(const p of Object.values(c.vertices)){p[0]+=x;p[2]+=z;}
  return c;
}
export function parkingPad(){return block(1000,900,80,0,2,850,-950);}
export function serviceConsole(){return block(320,120,35,0,650,850,-1410);}
export function indicatorPanel(){
  // Face toward +Z; 1 mm stand-off from the console's nominal front plane.
  const c=monotonePod([[-1349,220,160,15],[-1345,220,160,15]]);
  for(const [id,p]of Object.entries(c.vertices))c.vertices[id]=[p[0]+850,p[2]+480,p[1]];
  for(const s of Object.values(c.segments))for(const h of ['ha','hb'])s[h]=[s[h][0],s[h][2],s[h][1]];
  return c;
}
export function sideMarker(x=400){
  // 20 x 260 x 18. Markers lie beside the nominal straight approach, not across it.
  return block(20,260,8,2,20,x,-1000);
}
export function createDockingZoneParts(){return [
  {name:'Parking zone',material:'floorAccent',cage:parkingPad()},
  {name:'Service pedestal',material:'shell',cage:serviceConsole()},
  {name:'Dock indicator',material:'display',cage:indicatorPanel()},
  {name:'Dock guide L',material:'accent',cage:sideMarker()},
  {name:'Dock guide R',material:'accent',cage:sideMarker(1300)}
].map(p=>({...p,units:'mm'}));}
export const parts=createDockingZoneParts();

// Source-graph checks only, not evaluated Spline Patch/manufacturing evidence.
export function checkSourceStructure(){return parts.map(({name,cage:c})=>{
  const ids=Object.keys(c.vertices),degree=Object.fromEntries(ids.map(id=>[id,0])),seen=new Set();
  for(const p of Object.values(c.vertices))if(p.length!==3||p.some(x=>!Number.isFinite(x)))throw Error(name+' invalid vertex');
  for(const [id,s]of Object.entries(c.segments)){
    if(id!==s.id||!c.vertices[s.a]||!c.vertices[s.b]||s.a===s.b||s.ha.concat(s.hb).some(x=>!Number.isFinite(x)))throw Error(name+' invalid segment');
    degree[s.a]++;degree[s.b]++;
  }
  for(const q of c.sequences){let a=q.first;for(const id of q.segments){const s=c.segments[id];if(!s||s.a!==a||s.sequence!==q.id||seen.has(id))throw Error(name+' invalid sequence');seen.add(id);a=s.b;}if(q.closed&&a!==q.first)throw Error(name+' unclosed ring');}
  if(seen.size!==Object.keys(c.segments).length||Object.values(degree).some(v=>v!==3))throw Error(name+' unexpected graph');
  const visited=new Set([ids[0]]),queue=[ids[0]];
  while(queue.length){const id=queue.pop();for(const s of Object.values(c.segments)){const n=s.a===id?s.b:s.b===id?s.a:null;if(n&&!visited.has(n)){visited.add(n);queue.push(n);}}}
  if(visited.size!==ids.length)throw Error(name+' disconnected graph');
  const v=Object.values(c.vertices);return {name,vertices:v.length,segments:seen.size,connected:true,min:[0,1,2].map(j=>Math.min(...v.map(p=>p[j]))),max:[0,1,2].map(j=>Math.max(...v.map(p=>p[j])))};
});}
