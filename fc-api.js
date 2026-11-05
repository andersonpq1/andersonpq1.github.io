window.FC = (() => {
const c=window.FC_CONFIG;
const sessionKey='fc-admin-session';
let session;try{session=JSON.parse(sessionStorage.getItem(sessionKey)||'null')}catch{session=null}
function store(s){session=s;if(s)sessionStorage.setItem(sessionKey,JSON.stringify(s));else sessionStorage.removeItem(sessionKey)}
async function call(path,{method='GET',body,auth=false,headers={}}={}){
 if(auth){if(!session)throw Error('Entre novamente no painel.');if(session.expires_at*1000<Date.now()+60000){
 const r=await fetch(c.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:c.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:session.refresh_token})});const s=await r.json();if(!r.ok){store(null);throw Error('Sua sessão expirou. Entre novamente.')}store({...s,expires_at:Math.floor(Date.now()/1000)+s.expires_in});}}
 const h={apikey:c.key,...headers};if(auth)h.Authorization='Bearer '+session.access_token;
 if(body!==undefined&&!(body instanceof Blob)){h['Content-Type']='application/json';body=JSON.stringify(body)}
 const response=await fetch(c.url+path,{method,headers:h,body,signal:AbortSignal.timeout(20000)});
 const text=await response.text();let data;try{data=JSON.parse(text)}catch{data=text}
 if(!response.ok)throw Error(data?.msg||data?.message||data?.error_description||'Não foi possível concluir. Confira sua conexão e a configuração do banco.');return data;
}
return {call,async login(email,password){const s=await call('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});store({...s,expires_at:Math.floor(Date.now()/1000)+s.expires_in});if(s.user.id!==c.adminId){store(null);throw Error('Esta conta não tem permissão de administrador.')}},async logout(){try{await call('/auth/v1/logout',{method:'POST',auth:true})}finally{store(null)}},async verify(){if(!session)return false;try{const user=await call('/auth/v1/user',{auth:true});return user.id===c.adminId}catch{store(null);return false}},get user(){return session?.user},url:c.url};
})();
