import {toolInterface} from '../interface.js';
import {createWristHub} from './wrist-hub.js';
import {createCableGuide} from './cable-guide.js';

// Part agents own the two factories. Assembly owns this shared interface.
export function createPartSet(spec=toolInterface){
 if(spec.units!=='mm')throw Error('Neira parts use millimetres');
 return {spec:{...spec},hub:createWristHub(spec),guide:createCableGuide(spec)};
}
