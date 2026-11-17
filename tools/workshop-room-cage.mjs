import { monotonePod } from './base-pod-cage.mjs';

// Provisional workshop spatial envelope in mm, Y up. Native splines only.
// Not an actual site survey, construction specification, structural design,
// building-regulation assessment, glazing design or verified access layout.
function empty() {
  return {version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
}
function segment(c,id,a,b,sequence) {
  c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence,soft:false};
}
function rectanglePrism(c,prefix,[x0,y0,x1,y1],z0,z1) {
  const xy=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
  for (let q=0;q<2;q++) {
    const ring=prefix+'r'+q, ids=[];
    for (let k=0;k<4;k++) c.vertices[prefix+'v'+q+'_'+k]=[...xy[k],q?z1:z0];
    for (let k=0;k<4;k++) {
      const id=ring+'_'+k;
      segment(c,id,prefix+'v'+q+'_'+k,prefix+'v'+q+'_'+((k+1)%4),ring);
      ids.push(id);
    }
    c.sequences.push({id:ring,first:prefix+'v'+q+'_0',segments:ids,closed:true});
  }
  for (let k=0;k<4;k++) {
    const id=prefix+'l'+k,a=prefix+'v0_'+k,b=prefix+'v1_'+k;
    segment(c,id,a,b,id);
    c.sequences.push({id,first:a,segments:[id],closed:false});
  }
  return c;
}

export function floor() {
  const c=monotonePod([[-40,4000,4000,80],[0,4000,4000,80]]);
  for (const p of Object.values(c.vertices)) { p[0]+=200; p[2]+=200; }
  return c;
}

export function rearWall() {
  const c=rectanglePrism(empty(),'o',[-1800,0,2200,2600],-1580,-1500);
  // Actual through opening, not a surface marking or separate opaque insert.
  // No glazing/frame/lintel/attachment detail or structural capacity is implied.
  rectanglePrism(c,'w',[-1250,1150,250,2050],-1580,-1500);
  return c;
}

export function sideWall() {
  return rectanglePrism(empty(),'o',[2120,0,2200,2600],-1500,2200);
}

export function createWorkshopRoomParts() {
  return [
    {name:'Workshop floor',material:'floor',units:'mm',cage:floor()},
    {name:'Window wall',material:'wall',units:'mm',cage:rearWall()},
    {name:'Side wall',material:'wall',units:'mm',cage:sideWall()}
  ];
}
export const parts=createWorkshopRoomParts();

export function windowFrame() {
  // Architectural appearance/opening intent only: 50 mm border, 20 mm depth.
  // Frame anchorage, lintel, weatherproofing, glazing and rated loads unresolved.
  const c=rectanglePrism(empty(),'o',[-1300,1100,300,2100],-1500,-1480);
  rectanglePrism(c,'i',[-1250,1150,250,2050],-1500,-1480);
  return c;
}

export function sill() {
  // Interior ledge envelope only; no load capacity or attachment qualification.
  const c=monotonePod([[1120,1600,160,10],[1150,1600,160,10]]);
  for (const p of Object.values(c.vertices)) { p[0]-=500; p[2]-=1400; }
  return c;
}
