import {STORAGE_KEY} from './config';
const DB_NAME = `${STORAGE_KEY}.cache`;
const STORE = 'init';
function openDB(){return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window)){resolve(null);return;}
  const req=indexedDB.open(DB_NAME,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(STORE))req.result.createObjectStore(STORE);};
  req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
});}
async function execute(mode,work){let db;try{db=await openDB();if(!db)return null;return await new Promise((resolve,reject)=>{
  const tx=db.transaction(STORE,mode);const op=work(tx.objectStore(STORE));op.onsuccess=()=>resolve(op.result);op.onerror=()=>reject(op.error);
});}catch(e){return null;}finally{db?.close();}}
export const readCache=()=>execute('readonly',s=>s.get('dataset'));
export const writeCache=value=>execute('readwrite',s=>s.put(value,'dataset'));
export const clearCache=()=>execute('readwrite',s=>s.delete('dataset'));
