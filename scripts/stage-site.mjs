import {cp,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist/',root),{recursive:true});
await cp(new URL('frontend/dist/',root),new URL('dist/',root),{recursive:true});
console.info('Frontend build staged for private Sites preview. Express is deployed separately.');
