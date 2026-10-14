import {API_URL,TIMEOUT_MS} from './config';
// Seluruh panggilan memakai iframe HTMLService per permintaan; tidak melakukan fetch lintas-domain
// atau menyisipkan <script>. Ini menghindari CORS dan menggunakan akun Google yang sudah login.
const CHANNEL='RIS_VISUAL_HUB_V1';
const requestId=()=>`rvh_${Date.now()}_${Math.random().toString(36).slice(2,10)}`;
export function apiCall(action,payload={},timeout=TIMEOUT_MS){return new Promise((resolve,reject)=>{
 const id=requestId();let finished=false;let frame;
 const timer=setTimeout(()=>finish(new Error('Koneksi GAS melewati batas waktu. Periksa deployment dan alamat origin GitHub.')),timeout);
 const finish=(err,data)=>{if(finished)return;finished=true;clearTimeout(timer);window.removeEventListener('message',listen);frame?.remove();if(err)reject(err);else resolve(data);};
 const listen=(event)=>{
   if(event.origin!==window.location.origin && !event.origin.endsWith('.googleusercontent.com'))return;
   const msg=event.data;if(!msg||msg.channel!==CHANNEL||msg.type!=='RESULT'||msg.requestId!==id)return;
   if(!msg.result||!(msg.result.success||msg.result.ok))finish(new Error(msg.result?.message||'Gagal memuat data.'));
   else finish(null,msg.result.data);
 };
 window.addEventListener('message',listen);
 frame=document.createElement('iframe');frame.className='api-iframe';frame.title='Koneksi Google Apps Script';frame.setAttribute('aria-hidden','true');
 const param=new URLSearchParams({ui:'bridge',action,requestId:id,p:JSON.stringify(payload)});
 frame.src=`${API_URL}?${param.toString()}`;frame.onerror=()=>finish(new Error('Halaman Google Apps Script tidak dapat dimuat.'));
 document.body.appendChild(frame);
 });}
export const initData=(fresh=false)=>apiCall('init',{fresh});
export const checkVersion=()=>apiCall('versi',{},18000);
export const getProject=id=>apiCall('projectView',{project_id:id});
export const createRecord=(module,record)=>apiCall('create',{module,record});
export const updateField=(module,id,field,value)=>apiCall('update',{module,id,field,value});
export const archiveRecord=(module,id)=>apiCall('archive',{module,id});
export const syncSource=id=>apiCall('syncSource',{id});
export const previewSource=id=>apiCall('sourcePreview',{id});
export const importSource=id=>apiCall('importSource',{id});
export const makeSnapshot=(project_id,name)=>apiCall('snapshotCreate',{project_id,name});
export const readSnapshot=id=>apiCall('snapshotRead',{id});
export const invalidateServer=()=>apiCall('clearCache');
