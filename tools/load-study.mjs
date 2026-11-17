import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,sha,stable,sourceHashes,atomicWrite} from './build.mjs';

export const inputUnits=Object.freeze({length:'mm',force:'N',moment:'N*mm',mass:'kg',acceleration:'m/s^2',density:'kg/m^3',area:'mm^2'});
export const defaultInputs=Object.freeze({units:inputUnits,toolMassKg:.5,gravityMps2:9.80665,gravityDirection:Object.freeze([0,-1,0]),applicationPointMm:Object.freeze([0,0,100]),sideForceN:Object.freeze([30,0,0]),torqueZ_Nmm:3000,densityKgM3:2700,boltStressAreaMm2:8.78,loadMultiplier:1});
export const references=Object.freeze({
 density:{title:'Kaiser Aluminum 6061 rod/bar nominal density',url:'https://online.kaiseraluminum.com/depot/PublicProductInformation/Document/1025/Kaiser_Aluminum_6061_Rod_and_Bar.pdf',referenceValue:'2.70 Mg/m^3 = 2700 kg/m^3',status:'Producer PDF checked 2026-11-17; illustrative density, no alloy or temper selected'},
 stressArea:{title:'Wuerth ISO metric coarse-thread nominal tension cross-section',url:'https://www.wuerth-industrie.com/web/media/en/pictures/wuerthindustrie/technikportal/dinokapitel/Kapitel_01_DINO_techn_Teil.pdf',referenceValue:'M4, pitch 0.7 mm, As 8.78 mm^2',status:'Primary table checked by the project coordinator on 2026-11-17, PDF pages 6 and 8. Reference area only; no screw class, proof strength or allowable selected',worksheetOriginalURL:'https://media.bossard.com/global-en/-/media/bossard-group/website/documents/technical-resources/en/f-004-en.pdf',worksheetOriginalStatus:'Returned 404 on 2026-11-17; superseded by the live producer table'}
});
const finite=(v,name)=>{if(typeof v!=='number'||!Number.isFinite(v))throw Error(name+' must be a finite number');return v;};
const positive=(v,name)=>{finite(v,name);if(v<=0)throw Error(name+' must be positive');return v;};
const nonnegative=(v,name)=>{finite(v,name);if(v<0)throw Error(name+' must be nonnegative');return v;};
const vector=(v,name)=>{if(!Array.isArray(v)||v.length!==3)throw Error(name+' must contain three numbers');return v.map((n,i)=>finite(n,name+'['+i+']'));};
function finiteTree(value,path='result'){if(typeof value==='number')finite(value,path);else if(value&&typeof value==='object')for(const [key,item]of Object.entries(value))finiteTree(item,path+'.'+key);}
const scale=(a,s)=>a.map(v=>v*s),add=(a,b)=>a.map((v,i)=>v+b[i]);
export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function normalizeInputs(overrides){
 if(!overrides||typeof overrides!=='object'||Array.isArray(overrides))throw Error('Inputs must be a plain JSON object');
 for(const key of Object.keys(overrides))if(!Object.hasOwn(defaultInputs,key))throw Error('Unknown input: '+key);
 const p={...structuredClone(defaultInputs),...overrides};
 if(stable(p.units)!==stable(inputUnits))throw Error('Input units must be mm, N, N*mm, kg, m/s^2, kg/m^3 and mm^2');
 for(const key of ['toolMassKg','gravityMps2','loadMultiplier'])nonnegative(p[key],key);
 for(const key of ['densityKgM3','boltStressAreaMm2'])positive(p[key],key);
 finite(p.torqueZ_Nmm,'torqueZ_Nmm');
 for(const key of ['gravityDirection','applicationPointMm','sideForceN'])p[key]=vector(p[key],key).slice();
 if(Math.abs(Math.hypot(...p.gravityDirection)-1)>1e-9)throw Error('gravityDirection must have unit length');
 return p;
}
function solve3(matrix,rhs){
 const a=matrix.map((r,i)=>[...r,rhs[i]]),norm=Math.max(...matrix.flat().map(Math.abs),1);
 for(let col=0;col<3;col++){
  let pivot=col;for(let row=col+1;row<3;row++)if(Math.abs(a[row][col])>Math.abs(a[pivot][col]))pivot=row;
  if(Math.abs(a[pivot][col])<norm*1e-12)throw Error('Three non-collinear bolt axes are required');
  [a[col],a[pivot]]=[a[pivot],a[col]];const d=a[col][col];a[col]=a[col].map(v=>v/d);
  for(let row=0;row<3;row++)if(row!==col){const f=a[row][col];a[row]=a[row].map((v,i)=>v-f*a[col][i]);}
 }
 return a.map(r=>r[3]);
}
export function distributeAxial(axes,forceN,momentNmm,stressAreaMm2){
 if(!Array.isArray(axes)||axes.length!==3)throw Error('Exactly three bolt axes are required');axes=axes.map((p,i)=>vector(p,'boltAxesMm['+i+']'));
 forceN=vector(forceN,'forceN');momentNmm=vector(momentNmm,'momentNmm');positive(stressAreaMm2,'stressAreaMm2');
 const matrix=[axes.map(()=>1),axes.map(p=>p[1]),axes.map(p=>-p[0])],rhs=[forceN[2],momentNmm[0],momentNmm[1]],incrementsN=solve3(matrix,rhs),reproduced=matrix.map(row=>row.reduce((sum,n,i)=>sum+n*incrementsN[i],0)),residual=reproduced.map((v,i)=>v-rhs[i]);
 assert(residual.every((v,i)=>Math.abs(v)<=1e-9*Math.max(1,Math.abs(rhs[i]))),'Axial force/moment equilibrium failed');
 const radii=axes.map(p=>Math.hypot(p[0],p[1])),radius=radii.reduce((a,b)=>a+b,0)/3,centroid=[0,1].map(k=>axes.reduce((s,p)=>s+p[k],0)/3),Ixx=axes.reduce((s,p)=>s+p[0]**2,0),Iyy=axes.reduce((s,p)=>s+p[1]**2,0),Ixy=axes.reduce((s,p)=>s+p[0]*p[1],0),isotropic=radius>0&&radii.every(r=>Math.abs(r-radius)<1e-6)&&Math.hypot(...centroid)<1e-6&&Math.abs(Ixx-Iyy)<1e-6*Math.max(Ixx,Iyy)&&Math.abs(Ixy)<1e-6*Math.max(Ixx,Iyy);
 const maximum=Math.max(...incrementsN.map(Math.abs));
 return {incrementsN,incrementalAxialStressMPa:incrementsN.map(v=>v/stressAreaMm2),maximumAbsoluteIncrementN:maximum,maximumAbsoluteIncrementalStressMPa:maximum/stressAreaMm2,equilibrium:{components:['Fz_N','Mx_Nmm','My_Nmm'],required:rhs,reproduced,residual,pass:true},orientationEnvelope:isotropic?{applicable:true,boltRadiusMm:radius,bendingIncrementN:2*Math.hypot(momentNmm[0],momentNmm[1])/(3*radius),totalAbsoluteIncrementN:Math.abs(forceN[2]/3)+2*Math.hypot(momentNmm[0],momentNmm[1])/(3*radius)}:{applicable:false,reason:'The circular isotropic pattern is not centred on the load reference'},unresolved:{transverseForceN:forceN.slice(0,2),toolAxisMomentNmm:momentNmm[2]},interpretation:'Signed equivalent axial demand increments; negative values mean unloading. Preload, contact, prying, absolute bolt tension and transverse load sharing are not solved'};
}
function pinTorque(pin,torqueZ_Nmm){
 if(!pin||typeof pin!=='object')throw Error('Pin geometry is required');
 const center=vector(pin.centerMm,'pin.centerMm'),radius=positive(Math.hypot(center[0],center[1]),'pin radius'),d=positive(pin.diameterMm,'pin diameter'),L=positive(pin.engagementMm,'pin engagement'),e=L/2,force=torqueZ_Nmm/radius,forceN=[-center[1]/radius*force,center[0]/radius*force,0],reactionN=scale(forceN,-1),moment=cross([center[0],center[1],e],forceN),reactionMoment=cross([0,0,e],reactionN),couple=add(moment,reactionMoment),residual=couple.map((v,i)=>v-(i===2?torqueZ_Nmm:0)),area=Math.PI*d*d/4,rootMoment=cross([0,0,e],forceN),rootMagnitude=Math.hypot(...rootMoment);
 assert(residual.every(v=>Math.abs(v)<1e-9*Math.max(1,Math.abs(torqueZ_Nmm))),'Pin/register force-couple equilibrium failed');
 return {allocation:'All prescribed Tz carried by a tangential pin force and opposite coplanar register resultant; face friction is given no credit',radiusMm:radius,diameterMm:d,engagementMm:L,resultantOffsetMm:e,signedTangentialForceN:force,forceN,registerReactionN:reactionN,equilibrium:{netForceN:add(forceN,reactionN),momentNmm:couple,residualMomentNmm:residual,pass:true},areaMm2:area,averageSingleShearMPa:Math.abs(force)/area,nominalProjectedBearingMPa:Math.abs(force)/(d*L),rootBendingMomentNmm:rootMoment,rootBendingMomentMagnitudeNmm:rootMagnitude,outerFibreBendingMPa:32*rootMagnitude/(Math.PI*d**3),qualified:false};
}
export function calculateLoadStudy(geometry,overrides={}){
 const inputs=normalizeInputs(overrides);
 if(geometry?.units!=='mm')throw Error('Geometry must use mm');
 if(!Array.isArray(geometry.hubs)||!geometry.hubs.length||!Array.isArray(geometry.interfaces)||!geometry.interfaces.length)throw Error('Verified hub volumes and interface geometry are required');
 const hubs=geometry.hubs.map(h=>({...h,volumeMm3:positive(h.volumeMm3,'hub volume'),illustrativeMassKg:h.volumeMm3*1e-9*inputs.densityKgM3}));
 const gravityN=scale(inputs.gravityDirection,inputs.toolMassKg*inputs.gravityMps2*inputs.loadMultiplier),sideN=scale(inputs.sideForceN,inputs.loadMultiplier),torque=inputs.torqueZ_Nmm*inputs.loadMultiplier;
 const interfaces=geometry.interfaces.map(item=>{
  const cases=[['G','Tool gravity',gravityN],['S','Side pull',sideN]].map(([id,name,forceN])=>{const momentNmm=cross(inputs.applicationPointMm,forceN);return {id,name,applicationPointMm:inputs.applicationPointMm.slice(),forceN,momentNmm,axialBolts:distributeAxial(item.boltAxesMm,forceN,momentNmm,inputs.boltStressAreaMm2),pinAllocation:null};});
  cases.push({id:'T',name:'Separately prescribed pure tool-axis torque',forceN:[0,0,0],momentNmm:[0,0,torque],axialBolts:null,pinAllocation:pinTorque(item.pin,torque)});
  return {side:item.side,boltAxesMm:item.boltAxesMm,pin:item.pin,cases};
 });
 const result={version:1,qualified:false,status:'Illustrative independent load-case screening',inputUnits,inputs,geometry,mass:{densityKgM3:inputs.densityKgM3,hubs,totalHubsKg:hubs.reduce((s,h)=>s+h.illustrativeMassKg,0),interpretation:'Tessellated source volumes times the explicit assumed density; no alloy selected. Hub self-weight and inertia are excluded from the separate tool-force cases'},interfaces,assumptions:['Cases G, S and T are separate; no simultaneous combined loading is claimed.','Gravity direction is an assumed tool-frame vector, not a pose-dependent world-gravity calculation.','Load multiplier is explicit; dynamics, impact, fatigue and safety factors are absent.','Rigid equal-stiffness axial bolt group; no preload/contact/prying or bolt-class allowable.','Pin is fixed at the flange face and uniformly loaded over its observed projected engagement; resultant at half that engagement.','Register reaction is opposite and coplanar with the pin resultant; register contact pressure is not solved.','Pin material, root flexibility, stress concentration, retention, fit and end-chamfer effects are not qualified.','Average shear and maximum outer-fibre bending describe different stress distributions; no naive yield ratio is formed.'],references,referenceApplicability:{densityDefault:inputs.densityKgM3===defaultInputs.densityKgM3,stressAreaDefault:inputs.boltStressAreaMm2===defaultInputs.boltStressAreaMm2}};
 finiteTree(result);
 return result;
}

const midpoint=(a,b)=>a.map((v,i)=>(v+b[i])/2);
export function geometryFromVerification(report){
 if(report?.pass!==true||!Array.isArray(report.checks)||report.checks.some(c=>c.pass!==true))throw Error('Geometry verification must have passed every recorded check');
 if(report.interfaces?.length!==2)throw Error('Two verified wrist interfaces are required');
 const hubs=[],interfaces=[];
 for(const item of report.interfaces){
  const volume=positive(item.hub.volumeMm3,'verified hub tessellated volume'),signed=finite(item.hub.signedVolumeMm3,'verified signed volume');
  if(Math.abs(volume-Math.abs(signed))>1e-9*Math.max(1,volume))throw Error('Verified volume magnitude and signed volume disagree');
  hubs.push({side:item.side,id:item.hub.id,source:item.hub.source,volumeMm3:volume,signedVolumeMm3:signed,volumeMethod:item.hub.volumeMethod});
  if(item.fasteners?.length!==3)throw Error('Three verified fasteners are required');
  const face=finite(item.location?.pilot?.z0,'verified mating face'),boltAxesMm=item.fasteners.map(f=>{const p=midpoint(f.bolt.cageBounds.min,f.bolt.cageBounds.max);return [p[0],p[1],finite(f.stack.underHeadMm,'verified under-head plane')-face];}),bounds=item.pin.cageBounds,center=midpoint(bounds.min,bounds.max),dx=bounds.max[0]-bounds.min[0],dy=bounds.max[1]-bounds.min[1];
  if(Math.abs(dx-dy)>1e-6)throw Error('Pin transverse bounds must represent a circular nominal section');
  const engagement=Math.min(bounds.max[2],item.location.bore.z1)-Math.max(face,bounds.min[2]);
  interfaces.push({side:item.side,frame:item.frame||null,boltAxesMm,boltIds:item.fasteners.map(f=>f.bolt.id),pin:{id:item.pin.id,centerMm:[center[0],center[1],0],diameterMm:positive((dx+dy)/2,'verified pin diameter'),engagementMm:positive(engagement,'verified projected pin engagement'),wristAxialRangeMm:[bounds.min[2],bounds.max[2]],rootPlaneInWristMm:face}});
 }
 return {units:'mm',hubs,interfaces,reference:'Assembled mating face, +Z from wrist toward tool; bolt-axis XY projections and pin engagement derived from the passed native geometry report'};
}
export async function runLoadStudy(argv=process.argv.slice(2)){
 if(argv.length&&!(argv.length===2&&argv[0]==='--input'))throw Error('Usage: node tools/load-study.mjs [--input assumptions.json]');
 const reportPath=resolve(root,'artifacts/verification.json'),scenePath=resolve(root,'scenes/neira.hash'),scriptPath=fileURLToPath(import.meta.url),worksheetPath=resolve(root,'docs/Interface-loads.md');
 const [reportBytes,sceneBytes,scriptBytes,worksheetBytes,inputBytes]=await Promise.all([readFile(reportPath),readFile(scenePath),readFile(scriptPath),readFile(worksheetPath),argv.length?readFile(resolve(argv[1])):null]);
 const report=JSON.parse(reportBytes),sources=await sourceHashes();
 if(stable(sources)!==stable(report.sources)||stable(report.sources)!==stable(report.sourcesAfter))throw Error('Geometry source hashes differ; use the recorded Frame checkout and rebuild/reverify changed sources');
 if(report.file?.sha256!==sha(sceneBytes)||report.file?.bytes!==sceneBytes.length)throw Error('Canonical HASH does not match the passed geometry report');
 const geometry=geometryFromVerification(report),result=calculateLoadStudy(geometry,inputBytes?JSON.parse(inputBytes):{});
 result.provenance={geometryReport:{path:'artifacts/verification.json',sha256:sha(reportBytes),finishedAt:report.finishedAt,checks:report.checks.length},canonicalScene:{path:'scenes/neira.hash',sha256:sha(sceneBytes),bytes:sceneBytes.length},geometrySources:sources,calculator:{path:'tools/load-study.mjs',sha256:sha(scriptBytes)},worksheet:{path:'docs/Interface-loads.md',sha256:sha(worksheetBytes)},assumptionsInput:inputBytes?{name:basename(argv[1]),sha256:sha(inputBytes)}:{name:'Explicit defaults in calculator',sha256:sha(stable(defaultInputs))}};
 const [reportAfter,sceneAfter,sourcesAfter,scriptAfter,worksheetAfter,inputAfter]=await Promise.all([readFile(reportPath),readFile(scenePath),sourceHashes(),readFile(scriptPath),readFile(worksheetPath),inputBytes?readFile(resolve(argv[1])):null]);
 if(sha(reportAfter)!==sha(reportBytes)||sha(sceneAfter)!==sha(sceneBytes)||stable(sourcesAfter)!==stable(sources)||sha(scriptAfter)!==sha(scriptBytes)||sha(worksheetAfter)!==sha(worksheetBytes)||inputBytes&&sha(inputAfter)!==sha(inputBytes))throw Error('Evidence changed during calculation; output was not written');
 result.generatedAt=new Date().toISOString();
 await atomicWrite(resolve(root,'artifacts/load-study.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({written:'artifacts/load-study.json',qualified:false,sceneSHA256:result.provenance.canonicalScene.sha256,totalIllustrativeHubMassKg:result.mass.totalHubsKg,cases:result.interfaces[0].cases.map(c=>({id:c.id,momentNmm:c.momentNmm,boltIncrementsN:c.axialBolts?.incrementsN,pinForceN:c.pinAllocation?.signedTangentialForceN}))},null,2));
 return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await runLoadStudy().catch(error=>{console.error(error.message);process.exitCode=1;});
