export function activate(ctx) {
 let disposed=false;
 ctx.cleanup(()=>{disposed=true;});
 ctx.control.register(({root,document})=>{
  const h=document.createElement('h1');h.textContent='Neira';
  const intro=document.createElement('p');intro.textContent='Form study · shells and workshop';
  const note=document.createElement('p');note.textContent='Inspection hides panels, not a disassembly simulation. Arm internals, loads, collisions and actuators remain unverified.';
  const status=document.createElement('p');status.setAttribute('role','status');status.textContent='Ready';
  const commands=document.createElement('div');commands.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin:16px 0';
  let chain=Promise.resolve();
  function run(fn){chain=chain.then(async()=>{if(disposed)return;status.textContent='Working…';try{await fn();frame.value=String(ctx.core.frame);status.textContent='Ready';}catch(e){status.textContent=e.message;}});return chain;}
  function button(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=()=>run(fn);commands.append(b);}
  button('Play',()=>ctx.call('animation.play'));
  button('Pause',()=>ctx.call('animation.pause'));
  button('Home',async()=>{await ctx.call('animation.pause');await ctx.call('animation.seek',{frame:0});});
  button('Reach pose',async()=>{await ctx.call('animation.pause');await ctx.call('animation.seek',{frame:90});});
  button('Exploded tool',async()=>{await ctx.call('animation.pause');await ctx.call('animation.seek',{frame:300});});
  button('Tool interface',()=>ctx.call('view.set',{focus:ctx.bindings.LWrist.owner}));
  button('Whole body',()=>ctx.call('view.set',{focus:ctx.bindings.root.owner}));

  const skins=["coverR","coverL","waistR","waistL","torsoFront","torsoRear","upperA","upperB","foreA","foreB","upperAR","upperBR","foreAR","foreBR","headRear","headFace","jointCover0","jointCover1","jointCover2","jointCover3","jointCover4","jointCover5","jointCover6","jointCover7"];
  async function inspectSkin(hidden=[]){await ctx.call('animation.pause');const scene=await ctx.call('scene.inspect'),visible=new Map(scene.objects.map(o=>[o.hash,o.visible]));const commands=skins.filter(key=>visible.get(ctx.bindings[key].owner)!==!hidden.includes(key)).map(key=>({name:'scene.update',args:{id:ctx.bindings[key].owner,visible:!hidden.includes(key)}}));if(commands.length)await ctx.call('api.batch',{commands});}
  button('Assembled',()=>inspectSkin());
  button('Panel cutaway',async()=>{await inspectSkin(['coverR','waistR','torsoFront','upperB','foreB','upperBR','foreBR']);await ctx.call('view.set',{focus:ctx.bindings.root.owner});});
  button('Frame and internals',async()=>{await inspectSkin(skins);await ctx.call('view.set',{focus:ctx.bindings.root.owner});});
  button('Joint service study',async()=>{await inspectSkin(["upperA","upperB","foreA","foreB","upperAR","upperBR","foreAR","foreBR","jointCover0","jointCover1","jointCover2","jointCover3","jointCover4","jointCover5","jointCover6","jointCover7"]);await ctx.call('view.set',{focus:ctx.bindings.root.owner});});
  button('Arm backbones',async()=>{await inspectSkin(['upperA','upperB','foreA','foreB','upperAR','upperBR','foreAR','foreBR']);await ctx.call('view.set',{focus:ctx.bindings.root.owner});});
  button('Base service',async()=>{await inspectSkin(['coverR','coverL','waistR','waistL']);await ctx.call('view.set',{focus:ctx.bindings.Base.owner});});
  button('Workbench pose',async()=>{await inspectSkin();await ctx.call('animation.seek',{frame:330});await ctx.call('view.set',{focus:ctx.bindings.workbench.owner});});
  button('Storage',()=>ctx.call('view.set',{focus:ctx.bindings.storage.owner}));
  async function showZone(key){await ctx.call('scene.update',{id:ctx.bindings[key].owner,visible:true});await ctx.call('view.set',{focus:ctx.bindings[key].owner});}
  button('Planning station',()=>showZone('planning'));
  button('Parking concept',()=>showZone('parking'));
  button('Room overview',async()=>{for(const key of ['room','planning','parking'])await ctx.call('scene.update',{id:ctx.bindings[key].owner,visible:true});await ctx.call('view.set',{focus:ctx.bindings.room.owner});});
  button('Isolate workcell',async()=>{for(const key of ['room','planning','parking'])await ctx.call('scene.update',{id:ctx.bindings[key].owner,visible:false});await ctx.call('view.set',{focus:ctx.bindings.workbench.owner});});

  const label=document.createElement('label');label.textContent='Motion frame ';
  const frame=document.createElement('input');frame.type='range';frame.min='0';frame.max='330';frame.value='0';frame.setAttribute('aria-label','Motion frame');
  // Change on release: one native seek, without a queue of stale slider events.
  frame.onchange=()=>{const value=Number(frame.value);run(async()=>{await ctx.call('animation.pause');await ctx.call('animation.seek',{frame:value});});};label.append(frame);
  const joints=document.createElement('div'),inputs=[];joints.style.cssText='display:grid;gap:10px;margin:16px 0';
  for(const side of ['L','R'])for(const [name,axis,start]of [['Yaw',1,side==='L'?18:-18],['Pitch',0,-25],['Elbow',0,-30],['Wrist',2,side==='L'?35:-35]]){
   const row=document.createElement('label');row.textContent=side+' '+name+' ';
   const input=document.createElement('input');input.type='range';input.min='-60';input.max='60';input.value=String(start);input.disabled=true;input.setAttribute('aria-label',side+' '+name);inputs.push({input,id:ctx.bindings[side+name].owner,axis});
   input.onchange=()=>{const value=[0,0,0];value[axis]=Number(input.value);run(async()=>{await ctx.call('animation.pause');await ctx.call('animation.key',{id:ctx.bindings[side+name].owner,path:'rotation',frame:90,value,interpolation:'soft'});await ctx.call('animation.seek',{frame:90});});};
   row.append(input);joints.append(row);
  }
  const limits=document.createElement('p');limits.textContent='Sliders edit frame 90. ±60° are study limits. Frames 180–300 show an exploded assembly; threads, fits and pin retention remain unqualified.';
  root.append(h,intro,commands,label,joints,limits,note,status);
  run(async()=>{const animation=await ctx.call('animation.inspect');for(const {input,id,axis}of inputs){const track=animation.channels.find(c=>c.id===id&&c.path==='rotation')?.track,key=track?.keys.find(k=>k[0]===90);if(!key)throw Error('Frame-90 pose key is missing');input.value=String(key[1].v[axis]);input.disabled=false;}frame.value=String(animation.frame);});
  return ()=>{for(const b of commands.children)b.onclick=null;frame.onchange=null;for(const i of joints.querySelectorAll('input'))i.onchange=null;};
 });
 return {exports:{home:()=>ctx.call('animation.seek',{frame:0}),pose:frame=>ctx.call('animation.seek',{frame})}};
}
