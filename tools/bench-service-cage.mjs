import { monotonePod } from './base-pod-cage.mjs';

// Workshop-coordinate native cages, mm, Y up. No Frame calls or authored meshes.
// These are packaging proposals: shelf brackets, tray retention, materials,
// load rating, collision/swept clearance and manufacturing remain unqualified.
function translate(cage, x, z) {
  for (const p of Object.values(cage.vertices)) { p[0] += x; p[2] += z; }
  return cage;
}

export function serviceShelf() {
  // 600 x 240 x 20, kept inside the bench legs' nominal X = +/-340 lines.
  return translate(monotonePod([[500,600,240,12],[520,600,240,12]]),0,600);
}

export function partsTray() {
  // Outer 200 x 80 x 30. Actual open top, 4 mm floor and 3 mm side inset.
  // Rounded plan corners: outer R10, inner R7. Not a general normal-offset shell.
  const c = monotonePod([[900,200,80,10],[930,200,80,10]]);
  const inner = monotonePod([[904,194,74,7],[930,194,74,7]]);
  for (const [id,p] of Object.entries(inner.vertices)) c.vertices['i'+id] = p;
  for (const [id,s] of Object.entries(inner.segments)) {
    c.segments['i'+id] = {...s,id:'i'+id,a:'i'+s.a,b:'i'+s.b,sequence:'i'+s.sequence};
  }
  c.sequences.push(...inner.sequences.map(s=>({...s,id:'i'+s.id,first:'i'+s.first,segments:s.segments.map(id=>'i'+id)})));
  // Connect only the upper rim; independent lower loops form floor faces.
  for (let i=0;i<8;i++) {
    const id='rim'+i,a='v1_'+i,b='iv1_'+i;
    c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};
    c.sequences.push({id,first:a,segments:[id],closed:false});
  }
  return translate(c,-200,650);
}

export function createBenchServiceParts() {
  return [
    {name:'Service shelf',units:'mm',datum:{origin:[0,0,0],normal:[0,0,1]},cage:serviceShelf()},
    {name:'Bench parts tray',units:'mm',datum:{origin:[0,0,0],normal:[0,0,1]},cage:partsTray()}
  ];
}
export const parts = createBenchServiceParts();

export function supportRail() {
  // Front shelf seat: 640 x 40 x 20, X +/-320, Y480..500, Z470..510.
  // Rear seat uses the same source as an Instance translated +220 in Z.
  // Ends nominally meet the legs' inner X faces; the shelf seats at Y500.
  // Seating only: no welds, fasteners, load rating or structural qualification.
  return translate(monotonePod([[480,640,40,4],[500,640,40,4]]),0,490);
}
