// Native editable side plate, nominal mm. Enclosure only: fastening,
// materials, shelf attachments and anti-tip anchoring remain unqualified.
export function cabinetSide(x) {
 const c={version:2,approximation:{angle:10},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
 const w=1400,d=260,r=40,k=r*.5522847498307936;
 const p=[[-w/2+r,-d/2],[w/2-r,-d/2],[w/2,-d/2+r],[w/2,d/2-r],[w/2-r,d/2],[-w/2+r,d/2],[-w/2,d/2-r],[-w/2,-d/2+r]],hh={1:[[k,0],[0,-k]],3:[[0,k],[k,0]],5:[[-k,0],[0,k]],7:[[0,-k],[-k,0]]};
 for(let q=0;q<2;q++){
  const seq='ring'+q,ss=[];
  for(let i=0;i<8;i++)c.vertices['v'+q+'_'+i]=[x+q*8,p[i][0]+800,p[i][1]+300];
  for(let i=0;i<8;i++){const id='r'+q+'_'+i,h=hh[i]||[[0,0],[0,0]];ss.push(id);c.segments[id]={id,a:'v'+q+'_'+i,b:'v'+q+'_'+((i+1)%8),ha:[0,...h[0]],hb:[0,...h[1]],sequence:seq,soft:!!hh[i]};}
  c.sequences.push({id:seq,first:'v'+q+'_0',segments:ss,closed:true});
 }
 for(let i=0;i<8;i++){const id='long'+i;c.segments[id]={id,a:'v0_'+i,b:'v1_'+i,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};c.sequences.push({id,first:'v0_'+i,segments:[id],closed:false});}
 return c;
}
export const parts=[{name:'Cabinet side L',x:632},{name:'Cabinet side R',x:1560}].map(p=>({...p,units:'mm',cage:cabinetSide(p.x)}));
