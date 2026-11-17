// Native, editable architectural massing. Millimetres, Y up. No meshes or plugins.
// Gross envelope 15 x 20 m per level; upper slab has a real stair opening.
// Structure, foundations, fire/egress, access, glazing and all systems are unqualified.
export function buildLab(){
 const parts=[],instances=[];
 function prism(w,d,r,y0,y1,x=0,z=0){
  if(![w,d,r,y0,y1,x,z].every(Number.isFinite)||w<=0||d<=0||y1<=y0||r<=0||2*r>=Math.min(w,d))throw new RangeError('Invalid rounded prism dimensions/radius');
  const c={version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
  const p=[[-w/2+r,-d/2],[w/2-r,-d/2],[w/2,-d/2+r],[w/2,d/2-r],[w/2-r,d/2],[-w/2+r,d/2],[-w/2,d/2-r],[-w/2,-d/2+r]],k=r*.5522847498307936,hh={1:[[k,0],[0,-k]],3:[[0,k],[k,0]],5:[[-k,0],[0,k]],7:[[0,-k],[-k,0]]};
  for(let q=0;q<2;q++){const ids=[];p.forEach((v,i)=>c.vertices['v'+q+'_'+i]=[v[0]+x,q?y1:y0,v[1]+z]);p.forEach((v,i)=>{const id='r'+q+'_'+i,h=hh[i]||[[0,0],[0,0]];ids.push(id);c.segments[id]={id,a:'v'+q+'_'+i,b:'v'+q+'_'+((i+1)%8),ha:[h[0][0],0,h[0][1]],hb:[h[1][0],0,h[1][1]],sequence:'r'+q,soft:!!hh[i]};});c.sequences.push({id:'r'+q,first:'v'+q+'_0',closed:true,segments:ids});}
  for(let i=0;i<8;i++){const id='l'+i;c.segments[id]={id,a:'v0_'+i,b:'v1_'+i,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};c.sequences.push({id,first:'v0_'+i,closed:false,segments:[id]});}return c;
 }
 function add(name,material,w,d,r,y0,y1,x,z,zone='structure'){parts.push({name,material,zone,units:'mm',datum:{origin:[0,0,0],normal:[0,0,1]},cage:prism(w,d,r,y0,y1,x,z)});return name;}
 // translation is a displacement from the source cage. Native Instances are center-normalized:
 // set occurrence position to source.bounds.center + translation, not translation alone.
 function copy(name,sourceName,translation,zone){instances.push({name,sourceName,translation,zone});}
 add('Ground raft','floor',15000,20000,60,-250,0,0,4000);
 add('Upper west slab','shell',11300,20000,20,3350,3600,-1850,4000,'upper');
 add('Upper front slab','shell',3700,13200,20,3350,3600,5650,600,'upper');
 add('Upper rear slab','shell',3700,2500,20,3350,3600,5650,12750,'upper');
 add('Roof canopy','shell',15600,3000,140,7050,7350,0,12800,'roof');
 add('Front roof blade','shell',15600,500,100,7050,7350,0,-5800,'roof');
 add('Column','joint',180,180,20,0,7050,-7300,-5800);
 for(const [i,x,z] of [[1,7300,-5800],[2,-7300,4000],[3,7300,4000],[4,-7300,13800],[5,7300,13800]])copy('Column '+i,'Column',[x+7300,0,z+5800],'structure');
 add('West roof spine','joint',220,19600,20,6830,7050,-7300,4000,'roof');copy('East roof spine','West roof spine',[14600,0,0],'roof');
 add('Rear glazing','glass',14300,60,15,250,6800,0,13900,'facade');
 add('West glazing','glass',60,19200,15,250,6800,-7440,4000,'facade');
 add('East glazing','glass',60,19200,15,250,6800,7440,4000,'facade');
 add('Facade belt','accent',14800,100,20,3500,3620,0,13950,'facade');
 add('Stair tread','shell',1500,280,8,60,180,4750,7340,'stairs');
 for(let i=1;i<10;i++)copy('Lower tread '+i,'Stair tread',[0,180*i,280*i],'stairs');
 for(let i=0;i<10;i++)copy('Upper tread '+i,'Stair tread',[1800,1800+180*i,2520-280*i],'stairs');
 add('Stair landing','shell',3300,1500,16,1680,1800,5650,10750,'stairs');
 // Glass balustrade strips follow each flight; top rails share the same slope.
 function incline(name,x,up,material,width,height){const c=prism(width,2800,6,0,height,x,8600);for(const p of Object.values(c.vertices))p[1]+=up?1080+(p[2]-7200)*1800/2800:4680-(p[2]-7200)*1800/2800;for(const s of Object.values(c.segments))for(const h of ['ha','hb'])s[h][1]+=(up?1:-1)*s[h][2]*1800/2800;parts.push({name,material,zone:'stairs',units:'mm',datum:{origin:[0,0,0],normal:[0,0,1]},cage:c});}
 incline('Lower handrail',3970,true,'joint',60,60);copy('Lower inner rail','Lower handrail',[1600,0,0],'stairs');
 incline('Upper handrail',5730,false,'joint',60,60);copy('Upper outer rail','Upper handrail',[1600,0,0],'stairs');
 add('Landing screen','glass',3300,40,8,1800,2820,5650,11480,'stairs');
 add('Upper void guard','glass',40,4300,8,3600,4620,3780,9350,'upper');
 // Ground-floor making and robot assembly zones.
 add('Assembly island','shell',3000,1600,100,740,900,0,1800,'workshop');
 add('Island plinth','joint',2600,1250,90,0,740,0,1800,'workshop');
 add('Fabrication bench','shell',1800,4200,80,820,950,-5400,6900,'workshop');
 add('Fabrication support','joint',1400,3800,60,0,820,-5400,6900,'workshop');
 add('Machine cabinet','shell',2200,2000,140,0,2300,-5400,11500,'workshop');
 add('Machine window','glass',1850,50,20,700,2000,-5400,10470,'workshop');
 add('Tool wall','joint',3000,400,40,0,2500,-1500,13200,'workshop');
 add('Tool band','accent',2700,60,20,1100,1180,-1500,12970,'workshop');
 // Upper floor design studio and quieter rear lounge.
 add('Design table','shell',3600,1400,100,4320,4460,-2600,1800,'studio');
 add('Design plinth','joint',2800,900,100,3600,4320,-2600,1800,'studio');
 add('Display wall','joint',3200,120,30,4500,5800,-2600,2600,'studio');
 add('Display face','glass',2900,30,10,4650,5650,-2600,2520,'studio');
 add('Meeting table','shell',3000,1600,350,4300,4440,-2300,8000,'studio');
 add('Meeting pedestal','joint',900,900,100,3600,4300,-2300,8000,'studio');
 add('Lounge seat','shell',3200,950,220,3800,4100,-2600,12000,'studio');
 add('Lounge back','accent',3200,220,90,4000,4550,-2600,12370,'studio');
 add('Arrival bench','shell',3000,850,140,250,500,-5000,-3500,'arrival');
 add('Arrival spine','accent',3000,180,60,350,1000,-5000,-3800,'arrival');
 for(const p of parts){p.role=['upper','studio'].includes(p.zone)?'upper-floor':p.zone;p.visible=true;} for(const i of instances)i.role=['upper','studio'].includes(i.zone)?'upper-floor':i.zone;
 return {parts,instances,metadata:{name:'Neira two-level laboratory concept',units:'mm',footprint:[15000,20000],floorToFloor:3600,grossAreaPerLevelM2:300,upperStairOpeningM2:15.91,nominalUpperSlabPlanAreaM2:284.09,section:'Front facade and central roof deliberately omitted for cutaway visibility. Rear, west and east glazing remain visible, with transparent architectural glass also on the landing screen and upper void guard.',architecturalGlass:{parts:['Rear glazing','West glazing','East glazing','Landing screen','Upper void guard'],h:200,s:28,l:62,rough:12,metal:20,opac:72},zones:{ground:'Arrival, robot assembly, fabrication, machine enclosure and tool wall',upper:'Design studio, meeting and lounge'},stairs:{risers:20,rise:180,going:280,flightWidth:1500,landingDepth:1500,opening:{x:[3800,7500],z:[7200,11500]}},qualification:'Spatial/architectural study only. No building-code, structural, fire, egress, accessibility, services, weatherproofing or construction qualification. Floating stair treads are spatial envelopes, not designed support structure. Rounded edges make nominal rectangular areas approximate.'}};
}
export function checkLab(){const b=buildLab(),names=new Set(),errors=[];for(const p of b.parts){if(names.has(p.name))errors.push('duplicate '+p.name);names.add(p.name);const c=p.cage,seen=new Set();const ring=Array.from({length:8},(_,i)=>c.vertices['v0_'+i]);const lo=[0,2].map(j=>Math.min(...ring.map(v=>v[j]))),hi=[0,2].map(j=>Math.max(...ring.map(v=>v[j]))),w=hi[0]-lo[0],d=hi[1]-lo[1],r=ring[0][0]-lo[0];if(!(w>0&&d>0&&r>0&&2*r<Math.min(w,d)))errors.push('dimensions/radius '+p.name);const radii=[hi[0]-ring[1][0],ring[2][2]-lo[1],hi[1]-ring[3][2],hi[0]-ring[4][0],ring[5][0]-lo[0],hi[1]-ring[6][2],ring[7][2]-lo[1]];if(radii.some(v=>Math.abs(v-r)>1e-7))errors.push('corner radius '+p.name);for(let i=0;i<8;i++)if(!(c.vertices['v1_'+i][1]>c.vertices['v0_'+i][1]))errors.push('height '+p.name);for(const v of Object.values(c.vertices))if(v.length!==3||!v.every(Number.isFinite))errors.push('finite '+p.name);for(const seq of c.sequences){let v=seq.first;for(const id of seq.segments){const s=c.segments[id];if(!s||s.a!==v||s.sequence!==seq.id||seen.has(id))errors.push('sequence '+p.name);seen.add(id);v=s.b;if(!s.ha.concat(s.hb).every(Number.isFinite))errors.push('handle '+p.name);}if(seq.closed&&v!==seq.first)errors.push('loop '+p.name);}if(seen.size!==Object.keys(c.segments).length)errors.push('unsequenced '+p.name);}for(const i of b.instances){if(names.has(i.name)||!names.has(i.sourceName)||!i.translation.every(Number.isFinite))errors.push('instance '+i.name);names.add(i.name);}if(errors.length)throw Error(errors.join('; '));return {uniqueCages:b.parts.length,instances:b.instances.length,finite:true,sequenceContinuity:true,positiveDimensions:true,radiiWithinHalfExtents:true,footprintM2:300,upperNetSlabAreaM2:284.09,nativeSurfacesVerified:false,physicalQualification:false};}
