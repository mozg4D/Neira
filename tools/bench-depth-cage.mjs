import {station} from './workstation-cage.mjs';
import {serviceShelf,partsTray} from './bench-service-cage.mjs';
const clone=x=>structuredClone(x);
export function deeperBenchTop(){const c=clone(station.deck);for(const p of Object.values(c.vertices))if(p[1]>600)p[1]+=200;return c;}
export function deeperServiceShelf(){const c=serviceShelf();for(const p of Object.values(c.vertices))if(p[2]>600)p[2]+=200;return c;}
export function rearPartsTray(){const c=partsTray();for(const p of Object.values(c.vertices))p[2]+=200;return c;}
export function rearBrace(){const c=clone(station.brace);for(const p of Object.values(c.vertices))p[1]+=200;return c;}
// Native owner/source orientation differs: station uses XY/-Z, service parts XYZ.
// Other existing sources (light post, bridge, diffuser) translate +200 in source Z.
// Existing rear leg occurrence pivots become Z910; rear shelf rail pivot Z420.
export const layout={bench:{x:[-380,380],y:[876,900],z:[450,950]},shelf:{x:[-300,300],y:[500,520],z:[480,920]},rearLegCentersZ:910,rearRailPivotZ:420,rearBraceCenterZ:910,lightCenterZ:910,trayCenter:[-200,915,850],unchangedFrontWorkTargets:true,nominalClearCentralRectangle:{x:[-300,300],z:[550,810]},physicalQualification:false};
