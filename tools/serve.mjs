import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const project=resolve(import.meta.dirname,'..'),frame=resolve(process.env.FRAME_ROOT||'C:/frame');
export const server=createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  if(req.method!=='GET'){res.writeHead(405).end();return;}
  if(url.pathname==='/favicon.ico'){res.writeHead(204).end();return;}
  if(url.pathname==='/__frame/gpu-memory'){res.writeHead(200,{'Content-Type':'application/json'}).end('{"gpus":null}');return;}
  const own=url.pathname.startsWith('/__neira/'),base=own?project:frame;
  const relative=own?url.pathname.slice('/__neira'.length):url.pathname;
  const path=resolve(base,'.'+decodeURIComponent(relative==='/'?'/index.html':relative));
  if(!path.startsWith(base+sep)||!(await stat(path)).isFile()){res.writeHead(404).end();return;}
  const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.md':'text/plain','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'}[extname(path)]||'application/octet-stream';
  res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'}).end(await readFile(path));
 }catch(error){res.writeHead(500,{'Content-Type':'text/plain'}).end(error.message);}
});
server.listen(Number(process.env.NEIRA_PORT||4317),'127.0.0.1',()=>console.log('Neira / Frame: http://127.0.0.1:'+server.address().port+'/index.html'));
