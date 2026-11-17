// Editable source-layout recipe used through the documented Frame AI API.
// Does not construct HASH files, meshes, browser sessions or Frame internals.
import {datum,keeperWithM3LugsV2Cage} from './target-assembly-proposal.mjs';
export function worldKeeperCage(lower=false,left=false){
 const c=structuredClone(keeperWithM3LugsV2Cage(lower)),d=datum();
 const map=(p,point)=>{
  const q=d.u.map((x,i)=>x*p[0]-d.v[i]*p[2]+d.w[i]*p[1]+(point?d.origin[i]:0));
  return [left?-q[0]:q[0],q[2],-q[1]];
 };
 for(const k of Object.keys(c.vertices))c.vertices[k]=map(c.vertices[k],true);
 for(const s of Object.values(c.segments)){s.ha=map(s.ha,false);s.hb=map(s.hb,false)}
 return c;
}
export function fastenerLayout(left=false){
 const d=datum();
 if(left){d.origin[0]*=-1;d.w[0]*=-1;d.v[0]*=-1;d.u=d.u.map((x,i)=>i===0?x:-x)}
 const rotation=[Math.atan2(d.v[2],d.v[1])*180/Math.PI,0,-Math.asin(d.v[0])*180/Math.PI];
 const specs=[['bolt',6.5,{type:'DIN 912',size:'M3',length:16,'angle approximation':18}],['washer',6,{type:'DIN 125',size:'M3','angle approximation':18}],['washer',-6.5,{type:'DIN 125',size:'M3','angle approximation':18}],['nut',-8.9,{type:'regular',size:'M3','angle approximation':18}]];
 return [-27,27].flatMap(u=>specs.map(([type,v,params])=>({type,params,rotation:[...rotation],position:d.origin.map((x,i)=>x+d.u[i]*u+d.v[i]*v)})));
}
