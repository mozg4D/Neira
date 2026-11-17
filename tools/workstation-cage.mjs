// Native spline cage recipe; does not synthesize HASH or modify Frame.
export function roundedPrism(w,d,r,y0,y1,x=0,z=0){
 const c={version:2,approximation:{angle:12},next:1000,vertices:{},segments:{},sequences:[],freeHandles:{}};
 const p=[[-w/2+r,-d/2],[w/2-r,-d/2],[w/2,-d/2+r],[w/2,d/2-r],[w/2-r,d/2],[-w/2+r,d/2],[-w/2,d/2-r],[-w/2,-d/2+r]],k=r*.55228475,hh={1:[[k,0],[0,-k]],3:[[0,k],[k,0]],5:[[-k,0],[0,k]],7:[[0,-k],[-k,0]]};
 for(let q=0;q<2;q++){
  const seq=[];p.forEach((v,i)=>c.vertices[`v${q}_${i}`]=[v[0]+x,v[1]+z,-(q?y1:y0)]);
  p.forEach((v,i)=>{const id=`r${q}_${i}`,h=hh[i]||[[0,0],[0,0]];seq.push(id);c.segments[id]={id,a:`v${q}_${i}`,b:`v${q}_${(i+1)%8}`,ha:[...h[0],0],hb:[...h[1],0],sequence:`r${q}`,soft:!!hh[i]};});
  c.sequences.push({id:`r${q}`,first:`v${q}_0`,closed:true,segments:seq});
 }
 for(let i=0;i<8;i++){const id=`l${i}`;c.segments[id]={id,a:`v0_${i}`,b:`v1_${i}`,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};c.sequences.push({id,first:`v0_${i}`,closed:false,segments:[id]});}
 return c;
}
export const station={
 deck:roundedPrism(760,300,20,876,900,0,600),
 leg:roundedPrism(40,40,4,0,876,340,490),
 pad:roundedPrism(100,100,8,900,910,200,500),
 brace:roundedPrism(640,40,3,200,240,0,710)
};
// Duplicate legs via native Instances at centers (-340,438,490), (+/-340,438,710).
// Duplicate pad via Instance at (-200,905,500).
export function workPose(){
 const forward=Math.hypot(60,470),down=75;
 const delta=Math.acos((forward**2+down**2-270**2-250**2)/(2*270*250));
 const alpha=Math.atan2(forward,down)-Math.atan2(250*Math.sin(delta),270+250*Math.cos(delta));
 return {frame:330,wrists:[[-200,975,470],[200,975,470]],yaw:Math.atan2(60,470)*180/Math.PI,pitch:-alpha*180/Math.PI,elbow:90-delta*180/Math.PI,roll:0};
}
