import {monotonePod} from './base-pod-cage.mjs';
export const parts=[['Light post',40,40,4,900,1320,340,710],['Light bridge',760,40,6,1320,1350,0,710],['Diffuser',580,24,5,1314,1320,0,710]];
export function cage(v){const[,w,d,r,y0,y1,x,z]=v,c=monotonePod([[y0,w,d,r],[y1,w,d,r]]);for(const p of Object.values(c.vertices)){p[0]+=x;p[2]+=z;}return c;}
