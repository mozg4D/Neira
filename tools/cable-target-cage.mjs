// Loose manual cable target, not a gauge or load-bearing wrist support.
import {roundedPrism} from './workstation-cage.mjs';
export function tubeCage(ro=18,ri=8,len=6){
 const c={version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
 const vmap=([x,y,z])=>[x,z,-y];
 for(let j=0;j<4;j++){
  const r=j<2?ro:ri,z=(j%2?1:-1)*len/2,seq=[];
  for(let k=0;k<4;k++){
   const a=k*Math.PI/2,b=(k+1)*Math.PI/2,id=`r${j}_${k}`;c.vertices[`v${j}_${k}`]=vmap([r*Math.cos(a),r*Math.sin(a),z]);seq.push(id);
   c.segments[id]={id,a:`v${j}_${k}`,b:`v${j}_${(k+1)%4}`,ha:vmap([-r*Math.sin(a)*.55228475,r*Math.cos(a)*.55228475,0]),hb:vmap([r*Math.sin(b)*.55228475,-r*Math.cos(b)*.55228475,0]),sequence:`r${j}`,soft:true};
  }
  c.sequences.push({id:`r${j}`,first:`v${j}_0`,closed:true,segments:seq});
 }
 for(const j of [0,2])for(let k=0;k<4;k++){
  const id=`l${j}_${k}`;c.segments[id]={id,a:`v${j}_${k}`,b:`v${j+1}_${k}`,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};c.sequences.push({id,first:`v${j}_${k}`,closed:false,segments:[id]});
 }
 return c;
}
export function targetDatum(wristWorld){
 const P=wristWorld.slice(12,15),a=wristWorld.slice(8,11),Q=P.map((v,i)=>v+70*a[i]);
 // Frame transform.apply axis convention, confirmed against actual axis readback.
 return {P,a,Q,rotation:[Math.atan2(-a[1],a[2])*180/Math.PI,Math.asin(a[0])*180/Math.PI,0]};
}
export const base=roundedPrism(60,70,5,910,916,191.42385568447094,510);
export const post=roundedPrism(12,12,2,916,980,191.42385568447094,539);
// Use native Instances for left ring/base/post. Left datum mirrors X, not Y or Z.
