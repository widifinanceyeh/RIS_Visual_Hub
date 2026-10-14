export const yn = v => v === true || String(v).toUpperCase() === 'TRUE';
export const text = v => v === null || v === undefined ? '' : String(v);
export const activeRows = rows => (rows || []).filter(r=>r.status!=='Arsip');
export const moduleInfo=(config,id)=>(config?.modules||[]).find(m=>m.module_id===id);
export const moduleFields=(config,id)=>(config?.fields||[]).filter(f=>f.module_id===id).sort((a,b)=>Number(a.urutan)-Number(b.urutan));
export const optionList=(config,group)=>(config?.options||[]).filter(o=>o.group_id===group).sort((a,b)=>Number(a.urutan)-Number(b.urutan));
export const simpleDate=s=>{if(!s)return '—';let str=text(s);const match=str.match(/^(\d{4})-(\d{2})-(\d{2})/);return match?`${match[3]}/${match[2]}/${match[1]}`:str;};
export function groupProject(data,projectId){return Object.fromEntries(Object.entries(data?.records||{}).map(([mod,rows])=>[mod,mod==='projects'?rows:(rows||[]).filter(r=>r.project_id===projectId)]));}
export const filterRows=(items,search,filters={})=>(items||[]).filter(row=>{
 const q=search.trim().toLocaleLowerCase('id');
 if(q && !Object.values(row).some(v=>text(v).toLocaleLowerCase('id').includes(q)))return false;
 return Object.entries(filters).every(([k,v])=>!v||text(row[k]).trim().toLocaleLowerCase('id')===v.trim().toLocaleLowerCase('id'));
});
