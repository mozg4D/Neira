import {emptyCage,circle,locatingCircle,wall} from '../cad.js';
import {toolInterface} from '../interface.js';

// Local datum: the front mating face is Z=0 and the tool axis is +Z.
export function createWristHub(spec=toolInterface) {
 const cage=emptyCage(),flangeBack=-spec.flangeThickness;
 const bodyBack=flangeBack-spec.bodyLength;
 wall(cage,'hub',circle(spec.bodyDiameter/2),bodyBack,flangeBack);
 wall(cage,'face',circle(spec.flangeDiameter/2),flangeBack,0);
 wall(cage,'pilot',locatingCircle(spec.registerDiameter/2),0,spec.registerProjection);
 wall(cage,'pass',circle(spec.serviceDiameter/2),bodyBack,spec.registerProjection);
 // Major-diameter envelopes suppress the unqualified thread helices.
 for(let i=0;i<spec.boltCount;i++) {
  const a=i*2*Math.PI/spec.boltCount;
  wall(cage,'tap'+i,circle(spec.threadMajorDiameter/2,spec.boltRadius*Math.cos(a),spec.boltRadius*Math.sin(a)),-spec.modeledBlindDepth,0);
 }
 const pinAngle=spec.pinAngle*Math.PI/180;
 wall(cage,'pin',circle(spec.pinDiameter/2,spec.pinRadius*Math.cos(pinAngle),spec.pinRadius*Math.sin(pinAngle)),-spec.pinSeatDepth,0);
 return {name:'Hub',units:'mm',datum:{origin:[0,0,0],normal:[0,0,1]},cage};
}
