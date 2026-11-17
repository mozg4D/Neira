import {loftCage} from './form-study-cage.mjs';

// Native editable shell study, millimetres. Coordinate insets are not a
// certified normal wall thickness; loads, fastening and clearances are open.
export const rows = [
  [250,150,105,0], [360,138,106,-8], [520,118,96,-14],
  [700,92,78,-8], [820,98,78,-3], [900,110,78,-3]
];

function monotoneHalf(stations) {
  const c=loftCage(stations);
  for(let q=0;q<stations.length;q++) {
    delete c.vertices['v'+q+'_2'];
    delete c.segments['r'+q+'_1'];
    delete c.segments['r'+q+'_2'];
    const s=c.sequences.find(s=>s.id==='ring'+q);
    s.segments=['r'+q+'_3','r'+q+'_0'];
    s.first='v'+q+'_3';s.closed=false;
  }
  for(let q=0;q<stations.length-1;q++) delete c.segments['l2_'+q];
  c.sequences=c.sequences.filter(s=>s.id!=='long2');
  // C1 coordinate-wise minmod Hermite slopes. Each cubic's interior controls
  // stay in ordered thirds of its endpoint interval, proving no coordinate
  // overshoot along the longitudinal source curves (not the whole surface).
  for(const k of [0,1,3]) {
    const p=stations.map((_,q)=>c.vertices['v'+q+'_'+k]);
    const slope=p.slice(0,-1).map((v,q)=>v.map((x,j)=>(p[q+1][j]-x)/(stations[q+1][0]-stations[q][0])));
    const tangent=p.map((_,q)=>[0,1,2].map(j=>{
      if(q===0)return slope[0][j];
      if(q===p.length-1)return slope.at(-1)[j];
      const a=slope[q-1][j],b=slope[q][j];
      return a*b<=0?0:Math.sign(a)*Math.min(Math.abs(a),Math.abs(b));
    }));
    for(let q=0;q<p.length-1;q++) {
      const dt=stations[q+1][0]-stations[q][0],s=c.segments['l'+k+'_'+q];
      s.ha=tangent[q].map(x=>x*dt/3);
      s.hb=tangent[q+1].map(x=>-x*dt/3);
    }
  }
  return c;
}

export function waistFlowHalf(side=1) {
  if(side!==1&&side!==-1)throw new RangeError('side must be +1 or -1');
  const c=monotoneHalf(rows),inner=monotoneHalf(rows.map(([y,w,z,f])=>[y,w-4,z-4,f]));
  for(const [k,v] of Object.entries(inner.vertices))c.vertices['i'+k]=v;
  for(const [k,s] of Object.entries(inner.segments))c.segments['i'+k]={...s,id:'i'+k,a:'i'+s.a,b:'i'+s.b,sequence:'i'+s.sequence};
  c.sequences.push(...inner.sequences.map(s=>({...s,id:'i'+s.id,first:'i'+s.first,segments:s.segments.map(k=>'i'+k)})));
  for(let q=0;q<rows.length;q++)for(const k of(q===0||q===rows.length-1?[0,1,3]:[1,3])) {
    const id='rim'+q+'_'+k,a='v'+q+'_'+k,b='i'+a;
    c.segments[id]={id,a,b,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};
    c.sequences.push({id,first:a,segments:[id],closed:false});
  }
  for(const [k,p] of Object.entries(c.vertices))c.vertices[k]=[side*(p[0]+.5),-p[2],p[1]];
  for(const s of Object.values(c.segments))for(const k of ['ha','hb']) {
    const p=s[k];s[k]=[side*p[0],-p[2],p[1]];
  }
  return c;
}

export function checkWaistFlow() {
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const near=(a,b)=>Math.abs(a-b)<1e-9;
  for(const side of [1,-1]) {
    const c=waistFlowHalf(side),seen=new Set(),adj=new Map(Object.keys(c.vertices).map(k=>[k,new Set()]));
    for(const p of Object.values(c.vertices))assert(p.length===3&&p.every(Number.isFinite),'Non-finite vertex');
    for(const [id,s] of Object.entries(c.segments)) {
      assert(id===s.id&&c.vertices[s.a]&&c.vertices[s.b]&&s.a!==s.b,'Invalid segment');
      assert(s.ha.concat(s.hb).every(Number.isFinite),'Non-finite handle');
      adj.get(s.a).add(s.b);adj.get(s.b).add(s.a);
      if(/^(i)?l[013]_/.test(id)) {
        const a=c.vertices[s.a],b=c.vertices[s.b];
        for(let j=0;j<3;j++) {
          const values=[a[j],a[j]+s.ha[j],b[j]+s.hb[j],b[j]],sign=Math.sign(b[j]-a[j]);
          assert(values.every(v=>v>=Math.min(a[j],b[j])-1e-9&&v<=Math.max(a[j],b[j])+1e-9),'Longitudinal control overshoot');
          assert(values.slice(1).every((v,i)=>sign*(v-values[i])>=-1e-9),'Nonmonotone longitudinal controls');
        }
      }
    }
    for(const seq of c.sequences) {
      let v=seq.first;
      for(const id of seq.segments){const s=c.segments[id];assert(s&&s.a===v&&s.sequence===seq.id&&!seen.has(id),'Invalid sequence');seen.add(id);v=s.b;}
      assert(!seq.closed||v===seq.first,'Unclosed sequence');
    }
    assert(seen.size===Object.keys(c.segments).length,'Unsequenced segment');
    const visited=new Set(),queue=[Object.keys(c.vertices)[0]];
    while(queue.length){const v=queue.pop();if(visited.has(v))continue;visited.add(v);queue.push(...adj.get(v));}
    assert(visited.size===Object.keys(c.vertices).length,'Disconnected graph');
    for(let q=0;q<rows.length;q++) {
      const [y,w,d,f]=rows[q],a=c.vertices['v'+q+'_0'],inner=c.vertices['iv'+q+'_0'];
      assert(near(a[0],side*(w+.5))&&near(a[1],y)&&near(a[2],f),'Station mismatch');
      assert(near(Math.abs(a[0]-inner[0]),4),'X coordinate inset mismatch');
      for(const k of [1,3]){const p=c.vertices['v'+q+'_'+k],ip=c.vertices['iv'+q+'_'+k];assert(near(p[0],side*.5)&&near(Math.abs(p[2]-ip[2]),4),'Seam or Z coordinate inset mismatch');}
    }
    assert(near(c.vertices.v5_0[0],side*110.5)&&near(c.vertices.v5_1[2],75)&&near(c.vertices.v5_3[2],-81),'Upper junction mismatch');
  }
  const a=waistFlowHalf(1),b=waistFlowHalf(-1);
  for(const id of Object.keys(a.vertices))assert(a.vertices[id].every((v,j)=>near(j===0?-v:v,b.vertices[id][j])),'Mirror mismatch');
  return {verticesPerHalf:Object.keys(a.vertices).length,segmentsPerHalf:Object.keys(a.segments).length,sequencesPerHalf:a.sequences.length,sourceGraphConnected:true,finite:true,mirror:true,longitudinalControlMonotonicity:true,coordinateInset:4,seam:1,height:[250,900],upperJunction:{rx:110,rz:78,fore:-3},nativeSurfaceVerified:false,physicalQualification:false};
}
