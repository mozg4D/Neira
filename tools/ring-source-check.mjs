// Discrete checks of native cubic SOURCE curves, not a surface/fit certificate.
import {roundedTubeCage} from './cable-target-cage.mjs';
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const cage=roundedTubeCage(),samples=1001;
const cageSHA256=createHash('sha256').update(JSON.stringify(cage)).digest('hex');
const cubic=(p0,p1,p2,p3,t)=>p0.map((v,i)=>(1-t)**3*v+3*(1-t)**2*t*p1[i]+3*(1-t)*t*t*p2[i]+t**3*p3[i]);
let minRadius=Infinity,maxRadius=-Infinity,minZ=Infinity,maxZ=-Infinity,maxCircleRadialError=0;
const nominalRadii=[18,17,9,8,8,9,17,18];
for(const [id,s] of Object.entries(cage.segments)){
 const a=cage.vertices[s.a],b=cage.vertices[s.b];
 if(!a||!b)throw Error(`Missing endpoint ${id}`);
 const ha=a.map((v,i)=>v+s.ha[i]),hb=b.map((v,i)=>v+s.hb[i]);
 for(let n=0;n<samples;n++){
  const p=cubic(a,ha,hb,b,n/(samples-1)),r=Math.hypot(p[0],p[2]),z=p[1];
  if(!p.every(Number.isFinite))throw Error(`Nonfinite ${id}`);
  minRadius=Math.min(minRadius,r);maxRadius=Math.max(maxRadius,r);minZ=Math.min(minZ,z);maxZ=Math.max(maxZ,z);
  if(id.startsWith('r'))maxCircleRadialError=Math.max(maxCircleRadialError,Math.abs(r-nominalRadii[Number(id.split('_')[0].slice(1))]));
 }
}
for(const q of cage.sequences){
 if(!q.closed)throw Error(`Open sequence ${q.id}`);
 q.segments.forEach((id,i)=>{const s=cage.segments[id],next=cage.segments[q.segments[(i+1)%q.segments.length]];if(s.b!==next.a)throw Error(`Disconnected ${q.id}`);});
}
if(minRadius<8-1e-9||maxZ>3+1e-9||minZ< -3-1e-9)throw Error('Source envelope mismatch');
const report={kind:'sampled-native-cubic-source-curves',cageSHA256,controls:Object.keys(cage.vertices).length,segments:Object.keys(cage.segments).length,samplesPerSegment:samples,minRadius,maxRadius,minZ,maxZ,maxCircleRadialError,
 idealCircularProfileVolume:2*Math.PI*13*(56+Math.PI),
 recordedNativeDisplayObservation:{candidateSHA256:'3a430e364ac0925d4116fa55ad00ceff2e5390886a1ba1b768e4f7f03f88a3bf',cageSHA256:'486bb368b57bbae46e7f1158492a196fa34ccd6c58ec477279432d828befc0c0',matchesCurrentCage:cageSHA256==='486bb368b57bbae46e7f1158492a196fa34ccd6c58ec477279432d828befc0c0',vertices:1152,triangles:2304,boundaryEdges:0,nonmanifoldEdges:0,orientationWarnings:0,degenerateFaces:0,signedVolume:4799.540529910239},
 qualifiedForManufacture:false,limitations:['Discrete source-curve sampling is not a certified surface error bound','Ideal circular-profile volume differs from cubic/sampled/native surfaces','No strength, print process or cable bend qualification']};
writeFileSync(new URL('../artifacts/ring-source-check.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
