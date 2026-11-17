import {armHalf} from './arm-panels-cage.mjs';

// Native arm-panel axial shortening only. XY radii and wall construction stay
// unchanged. With the current 35 mm placement offset and 18 mm inset, the
// nearest panel end plane lies 53 mm from the joint centre, beyond drum R50.
// This plane separation is NOT whole-assembly/swept collision qualification.
function sourceRange(source){
  const vertices=Object.values(source?.vertices??{});
  if(!vertices.length||vertices.some(p=>p.length!==3||p.some(x=>!Number.isFinite(x))))throw Error('Invalid source vertices');
  for(const s of Object.values(source.segments??{}))for(const h of ['ha','hb'])if(!Array.isArray(s[h])||s[h].length!==3||s[h].some(x=>!Number.isFinite(x)))throw Error('Invalid source handles');
  const z=vertices.map(p=>p[2]),min=Math.min(...z),max=Math.max(...z);
  if(!(max>min))throw Error('Source must have positive local-Z length');
  return {min,max,length:max-min};
}
export function insetArmHalf(source,side=1,inset=18){
  const {min,max,length}=sourceRange(source);
  if(side!==1&&side!==-1)throw Error('side must be +1 or -1');
  if(!Number.isFinite(inset)||inset<0||!(2*inset<length))throw Error('Require 0 <= 2*inset < source length');
  const scale=(length-2*inset)/length,c=armHalf(source,side);
  for(const p of Object.values(c.vertices))p[2]=min+inset+(p[2]-min)*scale;
  for(const s of Object.values(c.segments))for(const h of ['ha','hb'])s[h][2]*=scale;
  const zs=Object.values(c.vertices).map(p=>p[2]);
  if(Math.abs(Math.min(...zs)-(min+inset))>1e-9||Math.abs(Math.max(...zs)-(max-inset))>1e-9)throw Error('Unexpected inset range');
  return c;
}

// CPU finite/range/unchanged-XY checks. Does not evaluate native patch surfaces.
export function checkInset(source,inset=18){
  const snapshot=JSON.stringify(source),{min,max,length}=sourceRange(source),scale=(length-2*inset)/length;
  const checks=[1,-1].map(side=>{
    const before=armHalf(source,side),after=insetArmHalf(source,side,inset);
    for(const [id,p]of Object.entries(after.vertices)){
      if(p.some(x=>!Number.isFinite(x))||p[0]!==before.vertices[id][0]||p[1]!==before.vertices[id][1])throw Error('Vertex XY changed or nonfinite');
      if(p[2]<min+inset-1e-9||p[2]>max-inset+1e-9)throw Error('Vertex outside inset range');
    }
    for(const [id,s]of Object.entries(after.segments))for(const h of ['ha','hb']){
      if(s[h].some(x=>!Number.isFinite(x))||s[h][0]!==before.segments[id][h][0]||s[h][1]!==before.segments[id][h][1]||Math.abs(s[h][2]-before.segments[id][h][2]*scale)>1e-12)throw Error('Handle mismatch');
    }
    return {side,vertices:Object.keys(after.vertices).length,sourceRange:[min,max],insetRange:[min+inset,max-inset],scale,xyUnchanged:true};
  });
  if(JSON.stringify(source)!==snapshot)throw Error('Source mutated');
  return {sourceUnchanged:true,checks,nativeSurfaceQualified:false};
}
