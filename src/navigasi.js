import {STORAGE_KEY} from './config';
export function pageFromHash(){const m=window.location.hash.match(/^#\/([a-z0-9_-]+)/i);return m?.[1]||'';}
export function projectFromHash(){return decodeURIComponent(window.location.hash.match(/\?project=([^&]+)/)?.[1]||'');}
export function routeTo(page,projectId=''){
 const hash='#/'+encodeURIComponent(page)+(projectId?'?project='+encodeURIComponent(projectId):'');
 if(window.location.hash!==hash)window.location.hash=hash;
 try{localStorage.setItem(`${STORAGE_KEY}.lastPage`,hash);}catch(e){}
}
export function installNavigation(handler){const onChange=()=>handler(pageFromHash(),projectFromHash());window.addEventListener('hashchange',onChange);window.addEventListener('popstate',onChange);onChange();return()=>{window.removeEventListener('hashchange',onChange);window.removeEventListener('popstate',onChange);};}
export function restorePage(){if(!pageFromHash()){let prev='';try{prev=localStorage.getItem(`${STORAGE_KEY}.lastPage`)||'';}catch(e){}window.location.replace(window.location.pathname+window.location.search+(prev||'#/home'));}}
