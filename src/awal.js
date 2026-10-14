import {APP_VERSION} from './config';
import {readCache,writeCache,clearCache} from './simpanan';
import {initData,checkVersion} from './api';
export async function prepare(onCached,onFresh){
 const existing=await readCache();if(existing?.appVersion===APP_VERSION && existing.data?.records)onCached(existing.data);
 else if(existing)await clearCache();
 try{
   // Bila sudah ada salinan, cek penanda versi dahulu (tidak baca semua tabel berulang).
   if(existing?.appVersion===APP_VERSION && existing.data?.records){
     const ver=await checkVersion();if(Number(ver.versiData)===Number(existing.data.versiData)){onFresh(existing.data);return existing.data;}
   }
   const data=await initData();await writeCache({appVersion:APP_VERSION,data});onFresh(data);return data;
 }catch(e){if(existing?.data?.records && existing?.appVersion===APP_VERSION)return existing.data;throw e;}
}
export async function reloadFresh(onData){
 const data=await initData(true);await writeCache({appVersion:APP_VERSION,data});onData(data);return data;
}
export async function applyLocalPatch(original,module,id,field,value,versiData){
 if(!original?.records)return original;
 const current=original.records[module]||[];
 const records={...original.records,[module]:current.map(r=>r.id===id?{...r,[field]:value}:r)};
 const data={...original,records,versiData:versiData??original.versiData};
 await writeCache({appVersion:APP_VERSION,data});return data;
}
