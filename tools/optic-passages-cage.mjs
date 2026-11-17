import { monotonePod } from './base-pod-cage.mjs';

// Native editable spline cages only. Dimensions are nominal millimetres.
// Optical passages are packaging geometry, not selected sensors or verified
// fields of view, focus, refraction, sealing, retention, cooling or tolerances.
const K = 0.5522847498307936;
function empty() {
  return {version:2,approximation:{angle:10},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
}
function addRows(c, prefix, cx, cy, rows) {
  for (let q=0;q<rows.length;q++) {
    const [z,radius]=rows[q];
    const ring=prefix+'r'+q, ids=[];
    for (let k=0;k<4;k++) {
      const a=k*Math.PI/2,b=(k+1)*Math.PI/2;
      const v=prefix+'v'+q+'_', id=ring+'_'+k;
      c.vertices[v+k]=[cx+radius*Math.cos(a),cy+radius*Math.sin(a),z];
      c.segments[id]={id,a:v+k,b:v+((k+1)%4),
        ha:[-radius*Math.sin(a)*K,radius*Math.cos(a)*K,0],
        hb:[radius*Math.sin(b)*K,-radius*Math.cos(b)*K,0],sequence:ring,soft:true};
      ids.push(id);
    }
    c.sequences.push({id:ring,first:prefix+'v'+q+'_0',segments:ids,closed:true});
  }
  for (let q=0;q<rows.length-1;q++) for (let k=0;k<4;k++) {
    const id=prefix+'l'+q+'_'+k,a=prefix+'v'+q+'_'+k,b=prefix+'v'+(q+1)+'_'+k;
    c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};
    c.sequences.push({id,first:a,segments:[id],closed:false});
  }
  return c;
}

export function visor() {
  // 190 x 68 plate, R28 corners, thickness 5. Global Y centre = 1390.
  const c=monotonePod([[55,190,68,28],[60,190,68,28]]);
  for (const [id,p] of Object.entries(c.vertices)) c.vertices[id]=[p[0],p[2]+1390,p[1]];
  for (const s of Object.values(c.segments)) {
    for (const h of ['ha','hb']) s[h]=[s[h][0],s[h][2],s[h][1]];
  }
  // Nested end loops and their side curves define actual through passages.
  // No radial rim spokes: native face inference handles the nested loops.
  addRows(c,'hL',-55,1390,[[55,13.2],[60,13.2]]);
  addRows(c,'hR',55,1390,[[55,13.2],[60,13.2]]);
  return c;
}

export function sleeve() {
  // Shared local XY origin; assembler places X +/-55, Y1390.
  // OD26 stem Z45..60; OD32 flange Z60..68; continuous ID22 passage.
  // Nominal 0.2 radial clearance in visor/head R13.2 holes. Flange rear
  // plane seats at Z60. This does not establish fit or retention.
  const c=empty();
  addRows(c,'o',0,0,[[45,13],[60,13],[60,16],[68,16]]);
  addRows(c,'i',0,0,[[45,11],[68,11]]);
  return c;
}
