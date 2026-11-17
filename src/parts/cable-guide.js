import {emptyCage,circle,locatingCircle,ring,bridge,wall,radialSlot} from '../cad.js';
import {toolInterface} from '../interface.js';

// The mounting face is local Z=0; +Z follows the cable passage toward its mouth.
export function createCableGuide(spec=toolInterface){
 const cage=emptyCage(),face=spec.flangeThickness,mouth=face+spec.guideLength,taper=mouth-spec.mouthChamfer;
 wall(cage,'face',circle(spec.flangeDiameter/2),0,face);
 const [,boreTop]=wall(cage,'bore',locatingCircle(spec.registerDiameter/2),0,face);
 const [,outerTaperEnd]=wall(cage,'guide',circle(spec.guideRootRadius),face,taper,circle(spec.guideEndRadius));
 const innerTaperEnd=ring(cage,'throat',locatingCircle(spec.guideThroatRadius),taper);
 const innerMouth=ring(cage,'lipIn',locatingCircle(spec.guideThroatRadius+spec.mouthChamfer),mouth);
 const outerMouth=ring(cage,'lipOut',circle(spec.guideEndRadius-spec.mouthChamfer),mouth);
 bridge(cage,'taper',boreTop,innerTaperEnd);
 bridge(cage,'entry',innerTaperEnd,innerMouth);
 bridge(cage,'edge',outerTaperEnd,outerMouth);
 for(let i=0;i<spec.boltCount;i++){
  const angle=i*2*Math.PI/spec.boltCount;
  wall(cage,'bolt'+i,circle(spec.boltClearance/2,spec.boltRadius*Math.cos(angle),spec.boltRadius*Math.sin(angle)),0,face);
 }
 wall(cage,'slot',radialSlot(spec.pinRadius,spec.pinAngle,spec.slotWidth,spec.slotLength),0,face);
 return {name:'Guide',units:spec.units,datum:{origin:[0,0,0],normal:[0,0,1]},cage};
}
