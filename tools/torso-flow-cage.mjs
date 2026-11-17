import {torsoPanel as originalTorsoPanel} from './torso-panels-cage.mjs';

// Shape study only. Native editable cages; no meshes or Frame API calls.
// Tightens the upper chest above the shoulder line without modifying the
// shoulder-aperture band, lower waist interface or upper neck interface.
export const rows = [
 [900,110,78,-3,0], [970,135,88,1,0],
 [1018,188,104,6,45], [1082,193,104,8,45],
 [1135,180,86,6,0], [1200,112,64,3,0], [1255,60,48,0,0]
];

export function torsoFlowPanel(side=1) {
 if(side!==1&&side!==-1)throw new RangeError('side must be +1 or -1');
 const c=originalTorsoPanel(side),original=originalTorsoPanel(side);
 for(const inside of [0,1]) {
  const pre=inside?'i':'';
  for(const q of [1,4,5]) {
   const [y,W,D,f,n]=rows[q],w=W-inside*4,d=D-inside*4;
   const a=Math.asin(n/d),angles=[a,Math.PI/4,Math.PI/2,3*Math.PI/4,Math.PI-a];
   angles.forEach((t,k)=>c.vertices[pre+'v'+q+'_'+k]=[w*Math.cos(t),y,f+side*(d*Math.sin(t)+.5)]);
   for(let k=0;k<4;k++) {
    const t=angles[k],u=angles[k+1],h=4/3*Math.tan((u-t)/4),s=c.segments[pre+'r'+q+'_'+k];
    s.ha=[-Math.sin(t)*w*h,0,side*Math.cos(t)*d*h];
    s.hb=[Math.sin(u)*w*h,0,-side*Math.cos(u)*d*h];
   }
  }
  for(let k=0;k<5;k++) {
   const points=rows.map((_,q)=>c.vertices[pre+'v'+q+'_'+k]);
   const slopes=points.slice(0,-1).map((p,q)=>p.map((v,j)=>(points[q+1][j]-v)/(rows[q+1][0]-rows[q][0])));
   const tangent=points.map((_,q)=>[0,1,2].map(j=>{
    if(q===0)return slopes[0][j];
    if(q===points.length-1)return slopes.at(-1)[j];
    const a=slopes[q-1][j],b=slopes[q][j];
    return a*b<=0?0:Math.sign(a)*Math.min(Math.abs(a),Math.abs(b));
   }));
   // Keep the complete cubic source band Y1018..1082 exactly, including
   // its derivatives, and use those same derivatives on its neighbours.
   const band=original.segments[pre+'l'+k+'_2'],bandHeight=64;
   tangent[2]=band.ha.map(v=>v*3/bandHeight);
   tangent[3]=band.hb.map(v=>-v*3/bandHeight);
   for(let q=0;q<points.length-1;q++) {
    const s=c.segments[pre+'l'+k+'_'+q],dt=rows[q+1][0]-rows[q][0];
    if(q===2){s.ha=[...band.ha];s.hb=[...band.hb];}
    else {s.ha=tangent[q].map(v=>v*dt/3);s.hb=tangent[q+1].map(v=>-v*dt/3);}
   }
  }
 }
 return c;
}

export function checkTorsoFlow() {
 const assert=(c,m)=>{if(!c)throw new Error(m);},eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 let maxControls=0,segments=0;
 for(const side of [1,-1]) {
  const c=torsoFlowPanel(side),old=originalTorsoPanel(side),seen=new Set();
  const adjacent=new Map(Object.keys(c.vertices).map(id=>[id,new Set()]));
  for(const p of Object.values(c.vertices))assert(p.length===3&&p.every(Number.isFinite),'Non-finite vertex');
  for(const [id,s]of Object.entries(c.segments)) {
   assert(s.id===id&&c.vertices[s.a]&&c.vertices[s.b]&&s.a!==s.b,'Invalid segment');
   assert(s.ha.concat(s.hb).every(Number.isFinite),'Non-finite handle');
   adjacent.get(s.a).add(s.b);adjacent.get(s.b).add(s.a);
   if(/^(i)?l\d_/.test(id)) {
    const a=c.vertices[s.a],b=c.vertices[s.b];
    for(let j=0;j<3;j++) {
     const controls=[a[j],a[j]+s.ha[j],b[j]+s.hb[j],b[j]],sign=Math.sign(b[j]-a[j]);
     assert(controls.every(v=>v>=Math.min(a[j],b[j])-1e-9&&v<=Math.max(a[j],b[j])+1e-9),'Longitudinal overshoot '+id);
     const d=controls.slice(1).map((v,i)=>3*sign*(v-controls[i])),A=d[0]-2*d[1]+d[2],B=2*(d[1]-d[0]),critical=A!==0?-B/(2*A):-1;
     const values=[d[0],d[2]];if(critical>0&&critical<1)values.push(A*critical*critical+B*critical+d[0]);
     assert(Math.min(...values)>=-1e-9,'Nonmonotone longitudinal cubic '+id);
    }
   }
  }
  for(const seq of c.sequences) {
   let v=seq.first;
   for(const id of seq.segments){const s=c.segments[id];assert(s&&s.a===v&&s.sequence===seq.id&&!seen.has(id),'Invalid sequence');seen.add(id);v=s.b;}
   assert(!seq.closed||v===seq.first,'Unclosed sequence');
  }
  assert(seen.size===Object.keys(c.segments).length,'Unsequenced segment');
  const reached=new Set(),queue=[Object.keys(c.vertices)[0]];
  while(queue.length){const v=queue.pop();if(reached.has(v))continue;reached.add(v);queue.push(...adjacent.get(v));}
  assert(reached.size===Object.keys(c.vertices).length,'Disconnected graph');
  for(const pre of ['', 'i']) {
   for(const q of [0,2,3,6]) {
    for(let k=0;k<5;k++)assert(eq(c.vertices[pre+'v'+q+'_'+k],old.vertices[pre+'v'+q+'_'+k]),'Protected vertex changed');
    for(let k=0;k<4;k++)assert(eq(c.segments[pre+'r'+q+'_'+k],old.segments[pre+'r'+q+'_'+k]),'Protected ring changed');
   }
   for(let k=0;k<5;k++)assert(eq(c.segments[pre+'l'+k+'_2'],old.segments[pre+'l'+k+'_2']),'Protected aperture curve changed');
   for(let k=0;k<5;k++)for(let q=1;q<rows.length-1;q++) {
    const before=c.segments[pre+'l'+k+'_'+(q-1)],after=c.segments[pre+'l'+k+'_'+q];
    for(let j=0;j<3;j++)assert(Math.abs(-before.hb[j]/(rows[q][0]-rows[q-1][0])-after.ha[j]/(rows[q+1][0]-rows[q][0]))<1e-9,'Longitudinal derivative mismatch');
   }
  }
  maxControls=Object.keys(c.vertices).length;segments=seen.size;
 }
 return {controlsPerPanel:maxControls,segmentsPerPanel:segments,finite:true,connected:true,longitudinalCurvesMonotone:true,longitudinalC1:true,protectedSourceBand:[1018,1082],protectedBandExact:true,lowerAndNeckRingsExact:true,changedStations:rows.filter((_,q)=>[1,4,5].includes(q)),nativeSurfaceVerified:false,physicalQualification:false};
}
