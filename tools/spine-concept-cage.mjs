import {monotonePod} from './base-pod-cage.mjs';import {hollowPod} from './base-packaging-cage.mjs';
function merge(c,d,p){for(const[k,v]of Object.entries(d.vertices))c.vertices[p+k]=v;for(const[k,s]of Object.entries(d.segments))c.segments[p+k]={...s,id:p+k,a:p+s.a,b:p+s.b,sequence:p+s.sequence};c.sequences.push(...d.sequences.map(s=>({...s,id:p+s.id,first:p+s.first,segments:s.segments.map(k=>p+k)})));return c;}
function bridge(c,a,b,n){for(let i=0;i<8;i++){const id=n+i;c.segments[id]={id,a:a+i,b:b+i,ha:[0,0,0],hb:[0,0,0],sequence:id,soft:false};c.sequences.push({id,first:a+i,segments:[id],closed:false});}}
export function piercedCover(){const c=hollowPod();return merge(c,monotonePod([[246,90,90,6],[250,90,90,6]]),'hole');}
export function mast(){const c=monotonePod([[174,80,80,6],[1020,80,80,6]]);merge(c,monotonePod([[174,72,72,2],[1020,72,72,2]]),'i');return c;}
export function foot(){return monotonePod([[162,100,100,8],[174,100,100,8]]);}
export function beam(){return monotonePod([[1020,380,60,5],[1080,380,60,5]]);}
export function battery(x){const c=monotonePod([[170,120,220,10],[218,120,220,10]]);for(const p of Object.values(c.vertices))p[0]+=x;return c;}

export function neckColumn(){return merge(monotonePod([[1080,50,50,5],[1255,50,50,5]]),monotonePod([[1080,42,42,1],[1255,42,42,1]]),'i');}
