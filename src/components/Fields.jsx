import React,{useEffect,useRef,useState} from 'react';import {yn,optionList,text} from '../utils/data';import Icon from './Icons';
const read=v=>v===undefined||v===null?'':v;
export function FieldInput({field,value,onChange,onBlur,config,disabled=false}){
 const common={id:`field-${field.header}`,disabled,onBlur,onChange:e=>onChange(field.type==='checkbox'?e.target.checked:e.target.value)};
 const options=optionList(config,field.options_group),v=read(value),type=String(field.type||'text');
 if(type==='hidden'||type==='readonly')return <div className="value-box">{text(v)||'—'}</div>;
 if(type==='checkbox')return <label className="checkline"><input type="checkbox" checked={yn(v)} {...common}/> Ya</label>;
 if(type==='select')return <select className="control" value={text(v)} {...common}><option value="">— Pilih —</option>{!options.some(o=>text(o.value)===text(v))&&v!==''&&<option value={v}>{text(v)} (nilai lama)</option>}{options.map(o=><option key={o.value} value={o.value}>{o.label||o.value}</option>)}</select>;
 if(type==='textarea')return <textarea className="control" rows={3} value={v} {...common}/>;
 return <input className="control" type={['date','number','url','email'].includes(type)?type:'text'} value={v} {...common}/>;
}
export function RecordForm({moduleId,fields=[],config,record,projectId,onSave,onClose}){
 const [form,setForm]=useState(()=>{const obj={};fields.forEach(f=>{if(f.header==='project_id')obj[f.header]=projectId||'';else if(record)obj[f.header]=read(record[f.header]);else obj[f.header]=read(f.default_value);});return obj;});
 const [sending,setSending]=useState(false),[error,setError]=useState('');
 const shown=fields.filter(f=>yn(f.editable)&&!['id','project_id','source_id','source_key'].includes(f.header));
 const submit=async e=>{e.preventDefault();setError('');setSending(true);try{await onSave(form);onClose();}catch(ex){setError(ex.message);}finally{setSending(false);}};
 return <form className="record-form" onSubmit={submit}><div className="form-grid">{shown.map(f=><div key={f.header} className={'field '+(f.type==='textarea'?'field-wide':'')}><label htmlFor={`field-${f.header}`}>{f.label}{yn(f.required)&&<span className="required"> *</span>}</label><FieldInput field={f} value={form[f.header]} config={config} onChange={v=>setForm(old=>({...old,[f.header]:v}))}/></div>)}</div>{error&&<p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="button-secondary" onClick={onClose}>Batal</button><button type="submit" className="button-primary" disabled={sending}>{sending?'Menyimpan…':'Simpan'}</button></div></form>;
}
export function LiveField({field,value,onSave,config,delay=800}){
 const [draft,setDraft]=useState(read(value)),[status,setStatus]=useState('idle');const timer=useRef(null);const revision=useRef(0);
 useEffect(()=>{setDraft(read(value));setStatus('idle');},[value,field.header]);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 async function save(v){const rev=++revision.current;setStatus('saving');try{await onSave(v);if(rev===revision.current)setStatus('saved');}catch(e){if(rev===revision.current)setStatus('error');}}
 const change=v=>{setDraft(v);setStatus('pending');clearTimeout(timer.current);timer.current=setTimeout(()=>save(v),Number(delay)||800);};
 const flush=()=>{if(status==='pending'){clearTimeout(timer.current);save(draft);}};
 return <div className="live-field"><FieldInput field={field} value={draft} onChange={change} onBlur={flush} config={config}/><span className={'save-mark '+status}>{status==='saving'?'Menyimpan…':status==='saved'?'Tersimpan di sheet':status==='error'?'Gagal menyimpan':' '}</span>{status==='error'&&<button onClick={()=>save(draft)} className="inline-link">Simpan ulang</button>}</div>;
}
