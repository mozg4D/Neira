// Editable native cage recipe used for the separate Frame form study.
// It does not serialize HASH or change Frame code. Apply through spline.replace.
export const rows = [[900,125,100,0],[970,140,96,3],[1050,195,104,6],[1135,185,100,8],[1200,145,76,4],[1255,60,48,0]];
export function loftCage(rows) {
  const d={version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
  for(let r=0;r<rows.length;r++) {
    const [height,w,depth,fore=0]=rows[r];
    [[w,0],[0,depth],[-w,0],[0,-depth]].forEach((p,k)=>d.vertices[`v${r}_${k}`]=[p[0],p[1]+fore,-height]);
    const ss=[];
    for(let k=0;k<4;k++) {
      const id=`r${r}_${k}`,a=k*Math.PI/2,b=(k+1)*Math.PI/2;ss.push(id);
      d.segments[id]={id,a:`v${r}_${k}`,b:`v${r}_${(k+1)%4}`,ha:[-Math.sin(a)*w*.55228475,Math.cos(a)*depth*.55228475,0],hb:[Math.sin(b)*w*.55228475,-Math.cos(b)*depth*.55228475,0],sequence:`ring${r}`,soft:true};
    }
    d.sequences.push({id:`ring${r}`,segments:ss,closed:true,first:`v${r}_0`});
  }
  for(let k=0;k<4;k++) {
    const ss=[];
    for(let r=0;r<rows.length-1;r++) {
      const id=`l${k}_${r}`,p=d.vertices[`v${r}_${k}`],q=d.vertices[`v${r+1}_${k}`],prev=d.vertices[`v${Math.max(0,r-1)}_${k}`],next=d.vertices[`v${Math.min(rows.length-1,r+2)}_${k}`];ss.push(id);
      d.segments[id]={id,a:`v${r}_${k}`,b:`v${r+1}_${k}`,ha:q.map((v,j)=>(v-prev[j])/(r===0?3:6)),hb:p.map((v,j)=>(v-next[j])/(r===rows.length-2?3:6)),sequence:`long${k}`,soft:true};
    }
    d.sequences.push({id:`long${k}`,segments:ss,closed:false,first:`v0_${k}`});
  }
  return d;
}
export function headCage() {
  const d=loftCage([[-55,92,55,0],[-15,115,72.5,0],[35,110,68,0],[55,100,60,0]]);
  for(const k in d.vertices){const [x,y,z]=d.vertices[k];d.vertices[k]=[x,-z,-1377.5-y];}
  for(const s of Object.values(d.segments))for(const k of ['ha','hb']){const [x,y,z]=s[k];s[k]=[x,-z,-y];}
  return d;
}
