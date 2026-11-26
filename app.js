/*
 * ╔══════════════════════════════════════════╗
 * ║  FOREVER                                 ║
 * ║  Стадия: Alpha                           ║
 * ║  Версия: 0.6                        ║
 * ║  © 2026 RKC Studio                       ║
 * ║  Rat, Karas and Crab                     ║
 * ║  Part of ОБПАО ecosystem                 ║
 * ╚══════════════════════════════════════════╝
 */

const AVATARS = ['😺','🦊','🐺','🐼','🦝','🐸','🐧','🦄','🐲','🦁','🐯','🦋','🌙','⭐','🔮','🎭','🎲','🚀','🌊','🔥']

// ── LOCALIZATION ──────────────────────────────────────────────────
let lang = localStorage.getItem('fv_lang') || 'ru'
const T = {
  ru: {
    chats:'Чаты', find:'Найти', requests:'Запросы', settings:'⚙',
    searchContacts:'Поиск по контактам...', searchChannels:'Поиск каналов...',
    createChannel:'+ Создать канал', avatar:'Аватар', displayName:'Отображаемое имя',
    status:'Статус', statusPlaceholder:'Что сейчас делаешь? (🎮 играю...)',
    about:'О себе', saveProfile:'Сохранить профиль', profileSaved:'Профиль сохранён',
    profileUpdated:'Профиль обновлён ✓', saving:'Сохраняем...',
    nick:'Ник', newNick:'Новый ник (a-z, 0-9, _)', saveNick:'Сохранить ник',
    nickUpdated:'Ник обновлён', nickTaken:'Ник уже занят',
    interface:'Интерфейс', sound:'Звук уведомлений', hideOnline:'Скрыть статус онлайн',
    confirmDel:'Спрашивать при удалении', fontSize:'Размер шрифта', compact:'Компактный режим',
    account:'Аккаунт', clearCache:'Очистить кэш', logout:'Выйти из аккаунта',
    language:'Язык', online:'онлайн', offline:'офлайн', channel:'канал',
    members:' участников', friends:'Друзей', daysWithUs:'Дней с нами',
    startConvo:'Начните разговор', selectContact:'Выберите контакт для начала',
    findHint:'Вкладка «Найти» → отправьте запрос', msgPlaceholder:'Сообщение... (Enter — отправить)',
    banUser:'Забанить', unbanUser:'Разбанить', banReason:'Причина бана...',
    banConfirm:'Забанить пользователя', banDone:'🚫 Пользователь забанен',
    unbanDone:'✅ Бан снят', adminPanel:'Мини-администрирование',
    cacheCleared:'Кэш очищен', cacheClearConfirm:'Очистить кэш? Непрочитанные и закреплённые чаты сбросятся.',
    incoming:'Входящие запросы', noRequests:'Нет входящих запросов',
    accept:'Принять', decline:'Отклонить', added:'добавлен!', declined:'Запрос отклонён',
    send:'→', writeToChannel:'Только владелец может писать', joinChannel:'+ Вступить в канал',
    leaveChannel:'Выйти', joined:'✓ Вы вступили в канал!', left:'Вы вышли из канала',
    deleteMsg:'Удалить сообщение?', sendError:'Ошибка отправки',
    noChannels:'Каналов пока нет', loadError:'Ошибка загрузки',
    channelCreated:'создан!', channelDeleted:'удалён', channelUpdated:'Канал обновлён ✓',
    maxChannels:'Максимум 2 канала на пользователя', channelNameMin:'Название минимум 2 символа',
    enterName:'Введите название', pinned:'Закреплено',
    roleCreator:'Создатель', roleAdmin:'Администратор',
  },
  en: {
    chats:'Chats', find:'Find', requests:'Requests', settings:'⚙',
    searchContacts:'Search contacts...', searchChannels:'Search channels...',
    createChannel:'+ Create channel', avatar:'Avatar', displayName:'Display name',
    status:'Status', statusPlaceholder:'What are you doing? (🎮 playing...)',
    about:'About', saveProfile:'Save profile', profileSaved:'Profile saved',
    profileUpdated:'Profile updated ✓', saving:'Saving...',
    nick:'Nick', newNick:'New nick (a-z, 0-9, _)', saveNick:'Save nick',
    nickUpdated:'Nick updated', nickTaken:'Nick already taken',
    interface:'Interface', sound:'Notification sound', hideOnline:'Hide online status',
    confirmDel:'Confirm before delete', fontSize:'Font size', compact:'Compact mode',
    account:'Account', clearCache:'Clear cache', logout:'Sign out',
    language:'Language', online:'online', offline:'offline', channel:'channel',
    members:' members', friends:'Friends', daysWithUs:'Days with us',
    startConvo:'Start a conversation', selectContact:'Select a contact to begin',
    findHint:'"Find" tab → send a request', msgPlaceholder:'Message... (Enter to send)',
    banUser:'Ban', unbanUser:'Unban', banReason:'Ban reason...',
    banConfirm:'Ban user', banDone:'🚫 User banned',
    unbanDone:'✅ Ban lifted', adminPanel:'Mini admin panel',
    cacheCleared:'Cache cleared', cacheClearConfirm:'Clear cache? Unread and pinned chats will reset.',
    incoming:'Incoming requests', noRequests:'No incoming requests',
    accept:'Accept', decline:'Decline', added:'added!', declined:'Request declined',
    send:'→', writeToChannel:'Only owner can write', joinChannel:'+ Join channel',
    leaveChannel:'Leave', joined:'✓ You joined the channel!', left:'You left the channel',
    deleteMsg:'Delete message?', sendError:'Send error',
    noChannels:'No channels yet', loadError:'Load error',
    channelCreated:'created!', channelDeleted:'deleted', channelUpdated:'Channel updated ✓',
    maxChannels:'Max 2 channels per user', channelNameMin:'Name must be at least 2 characters',
    enterName:'Enter name', pinned:'Pinned',
    roleCreator:'Creator', roleAdmin:'Admin',
  }
}
function t(key){ return T[lang]?.[key] || T.ru[key] || key }
function setLang(l){ lang=l; localStorage.setItem('fv_lang',l); applyLang(); applySettings(); toast(l==='ru'?'🇷🇺 Русский':'🇬🇧 English') }
function applyLang(){
  // Sidebar tabs
  const tabs=document.querySelectorAll('.stab')
  const tabKeys=['chats','find','requests','profile','feed','settings']
  tabs.forEach((tab,i)=>{ if(tabKeys[i] && i<3) tab.childNodes[0].textContent=t(tabKeys[i]) })
  // Placeholders & inputs
  const sc=document.getElementById('contacts-search'); if(sc) sc.placeholder=t('searchContacts')
  const sf=document.getElementById('feed-search'); if(sf) sf.placeholder=t('searchChannels')
  const mi=document.getElementById('msg-input'); if(mi) mi.placeholder=t('msgPlaceholder')
  const nn=document.getElementById('new-nick'); if(nn) nn.placeholder=t('newNick')
  const pst=document.getElementById('p-status'); if(pst) pst.placeholder=t('statusPlaceholder')
  // Settings labels (data-t attribute approach)
  document.querySelectorAll('[data-t]').forEach(el=>{ const k=el.getAttribute('data-t'); if(k) el.textContent=t(k) })
  // Lang buttons active state
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'))
  const lb=document.getElementById('lang-'+lang); if(lb)lb.classList.add('active')
}

const { createClient } = window.supabase
const SUPA_URL = 'https://ljljtvywrmkmamhzyqha.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbGp0dnl3cm1rbWFtaHp5cWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjkyMTEsImV4cCI6MjA4Nzg0NTIxMX0.9wdkamyHzC6yhRIdAcX7RVOaBbZcLxZSgZ4punY8b9o'
const db = createClient(SUPA_URL, SUPA_KEY)

let currentUser    = null
let myProfile      = null
let contacts       = []
let allContacts    = []
let activeChat     = null
let lastMsgId      = 0
let pollInterval   = null
let onlineInterval = null
let chatSession    = 0  // increments on every chat/channel open to invalidate stale ticks
let currentViewedProfile = null
let settings       = { sound: false }
let selectedAvatar = AVATARS[0]

// ── UTILS ─────────────────────────────────────────────────────────
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }
function scrollBottom() { const c=document.getElementById('messages'); c.scrollTop=c.scrollHeight }
let toastTimer
function toast(msg,dur=2800){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),dur)}
function fmtTime(iso){return new Date(iso).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}
function isOnline(last_seen){if(!last_seen)return false;return(Date.now()-new Date(last_seen).getTime())<90000}
function avatarFor(profile){return profile?.avatar_emoji||'👤'}
function roleBadge(role){
  if(!role)return ''
  if(role==='creator')return `<span class="role-badge role-creator">★ ${t('roleCreator')}</span>`
  if(role==='admin')return `<span class="role-badge role-admin">⚡ ${t('roleAdmin')}</span>`
  return ''
}
function displayFor(profile){return profile?.display_name||profile?.username||'—'}

// ── MOBILE ────────────────────────────────────────────────────────
function isMobile(){ return window.innerWidth <= 640 }

function toggleSidebar(){
  if(isMobile()) return
  const sb=document.getElementById('sidebar')
  const hb=document.getElementById('hamburger')
  const ov=document.getElementById('sidebar-overlay')
  const open=sb.classList.toggle('open')
  hb.classList.toggle('open',open)
  ov.classList.toggle('show',open)
}
function closeSidebar(){
  if(isMobile()) return
  document.getElementById('sidebar').classList.remove('open')
  document.getElementById('hamburger').classList.remove('open')
  document.getElementById('sidebar-overlay').classList.remove('show')
}

let mobileCurrentTab = 'contacts'
function mobileNav(tab){
  const tabMap={chats:'contacts',find:'find',requests:'requests',feed:'feed',profile:'profile',settings:'settings'}
  const panelName=tabMap[tab]||tab
  mobileCurrentTab=panelName
  document.querySelectorAll('.bnav-item').forEach(b=>b.classList.remove('active'))
  const btn=document.getElementById('bnav-'+tab)
  if(btn) btn.classList.add('active')
  document.getElementById('sidebar').classList.add('mobile-visible')
  document.getElementById('active-chat').classList.remove('show')
  document.getElementById('channel-view').classList.remove('show')
  document.getElementById('no-chat').style.display=''
  activeChat=null
  activeChannel=null
  switchSidebarTabDirect(panelName)
}

function mobileInitNav(){
  if(!isMobile()) return
  document.getElementById('sidebar').classList.add('mobile-visible')
  switchSidebarTabDirect('contacts')
  const btn=document.getElementById('bnav-chats')
  if(btn) btn.classList.add('active')
  if(myProfile){const av=document.getElementById('bnav-av');if(av) av.textContent=myProfile.avatar_emoji||'👤'}
}

function updateBottomNavBadge(count){
  const b=document.getElementById('bnav-req-badge')
  if(!b) return
  if(count>0){b.textContent=count;b.classList.remove('hidden')}
  else b.classList.add('hidden')
}
function updateBottomNavUnread(count){
  const b=document.getElementById('bnav-badge')
  if(!b) return
  if(count>0){b.textContent=count>99?'99+':count;b.classList.remove('hidden')}
  else b.classList.add('hidden')
}

// ── SIDEBAR TABS ──────────────────────────────────────────────────
function switchSidebarTabDirect(name){
  document.querySelectorAll('.stab').forEach(t=>t.classList.toggle('active',t.dataset.tab===name))
  document.querySelectorAll('.sidebar-panel').forEach(p=>p.classList.toggle('active',p.id==='panel-'+name))
  if(name==='requests')loadRequests()
  if(name==='profile')initProfileEditor()
  if(name==='settings')initProfileEditor()
  if(name==='feed')loadFeed()
}
function switchSidebarTab(name){
  switchSidebarTabDirect(name)
  if(!isMobile()){
    document.getElementById('sidebar').classList.add('open')
    document.getElementById('sidebar-overlay').classList.add('show')
  }
}

// ── TOS TOGGLE ────────────────────────────────────────────────────
function showTos(){
  document.getElementById('tos-section').style.display='block'
  document.getElementById('btn-register').onclick=null
  document.getElementById('btn-register').onclick=authRegisterConfirm
}

// ── AUTH ──────────────────────────────────────────────────────────
function setAuthMsg(msg,isErr){const el=document.getElementById('auth-msg');el.textContent=msg;el.className='auth-msg '+(isErr?'err':'ok')}

async function authLogin(){
  // Hide TOS if visible
  document.getElementById('tos-section').style.display='none'
  document.getElementById('btn-register').onclick=authRegister
  const email=document.getElementById('a-email').value.trim()
  const pass=document.getElementById('a-password').value
  if(!email||!pass)return setAuthMsg('Заполните все поля',true)
  setAuthMsg('Входим...',false)
  const{data,error}=await db.auth.signInWithPassword({email,password:pass})
  if(error){
    if(error.message.includes('Email not confirmed'))showConfirmScreen(email)
    else setAuthMsg(error.message,true)
    return
  }
  await onLogin(data.user)
}

function authRegister(){
  // First click — show TOS
  showTos()
  setAuthMsg('Прочитайте и примите соглашение',false)
}

async function authRegisterConfirm(){
  const email=document.getElementById('a-email').value.trim()
  const pass=document.getElementById('a-password').value
  if(!email||!pass)return setAuthMsg('Заполните все поля',true)
  if(pass.length<6)return setAuthMsg('Пароль мин. 6 символов',true)
  if(!document.getElementById('tos-agree').checked)return setAuthMsg('Примите пользовательское соглашение',true)
  setAuthMsg('Создаём аккаунт...',false)
  const{data,error}=await db.auth.signUp({email,password:pass})
  if(error){
    if(error.message.includes('already registered')||error.message.includes('already been registered'))
      setAuthMsg('Этот email уже зарегистрирован — нажмите «Войти»',true)
    else
      setAuthMsg(error.message,true)
    return
  }
  if(data.user&&!data.session)showConfirmScreen(email)
  else if(data.user&&data.session)await onLogin(data.user)
  else showConfirmScreen(email)
}

function showConfirmScreen(email){
  document.getElementById('auth-screen').classList.add('hidden')
  document.getElementById('confirm-screen').classList.remove('hidden')
  document.getElementById('confirm-email-addr').textContent=email
  const confirmPoll=setInterval(async()=>{
    const{data:{session}}=await db.auth.getSession()
    if(session?.user?.email_confirmed_at){clearInterval(confirmPoll);document.getElementById('confirm-screen').classList.add('hidden');await onLogin(session.user)}
  },4000)
}
async function resendConfirm(){
  const email=document.getElementById('confirm-email-addr').textContent
  const msgEl=document.getElementById('confirm-msg')
  const{error}=await db.auth.resend({type:'signup',email})
  if(error){msgEl.textContent=error.message;msgEl.className='auth-msg err'}
  else{msgEl.textContent='Письмо отправлено ✓';msgEl.className='auth-msg ok'}
}
function backToLogin(){document.getElementById('confirm-screen').classList.add('hidden');document.getElementById('auth-screen').classList.remove('hidden');document.getElementById('auth-msg').textContent=''}

async function onLogin(user){
  currentUser=user
  const{data:profile}=await db.from('forever_profiles').select('*').eq('id',user.id).single()
  if(!profile){document.getElementById('auth-screen').classList.add('hidden');document.getElementById('setup-screen').classList.remove('hidden')}
  else{
    // Also check is_admin from profiles (Artem's system)
    const{data:arProfile}=await db.from('profiles').select('is_admin').eq('id',user.id).single()
    if(arProfile?.is_admin && !profile.role) profile.role='admin'
    myProfile=profile
    startApp()
  }
}
async function saveUsername(){
  const username=document.getElementById('s-username').value.trim().toLowerCase()
  const msgEl=document.getElementById('setup-msg')
  if(!/^[a-z0-9_]{3,24}$/.test(username)){msgEl.textContent='Только a-z, 0-9, _ (3–24 символа)';msgEl.className='auth-msg err';return}
  msgEl.textContent='Сохраняем...';msgEl.className='auth-msg'
  const{data,error}=await db.from('forever_profiles').insert({id:currentUser.id,username}).select().single()
  if(error){msgEl.textContent=error.message.includes('unique')?'Ник уже занят':error.message;msgEl.className='auth-msg err';return}
  myProfile=data;document.getElementById('setup-screen').classList.add('hidden');startApp()
}
async function logout(){await db.auth.signOut();clearInterval(pollInterval);clearInterval(onlineInterval);location.reload()}

// ── START ─────────────────────────────────────────────────────────
async function startApp(){
  document.getElementById('auth-screen').classList.add('hidden')
  document.getElementById('setup-screen').classList.add('hidden')
  document.getElementById('my-username').innerHTML=myProfile.username+(myProfile.role?` ${roleBadge(myProfile.role)}`:'')
  document.getElementById('my-av').textContent=avatarFor(myProfile)
  document.getElementById('my-email').textContent=currentUser.email
  document.getElementById('cur-nick').textContent=myProfile.username
  loadSettings()
  await loadContacts()
  await loadRequests()
  updateOnline()
  onlineInterval=setInterval(updateOnline,30000)
  pollInterval=setInterval(tick,5000)
  applyLang()
  mobileInitNav()
  // Show onboarding on first ever login
  const seen=localStorage.getItem('fv_onboarded')
  if(!seen) showOnboarding()
}

const ONBOARDING_STEPS=[
  {emoji:'💬',title:'Добро пожаловать в Forever!',text:'Мессенджер от RKC Studio. Давай быстро покажем как всё работает.'},
  {emoji:'👥',title:'Чаты',text:'Вкладка «Найти» — ищи друзей по нику и отправляй заявки. После принятия заявки чат появится в «Чатах».'},
  {emoji:'📡',title:'Каналы',text:'Вкладка 📡 — подписывайся на каналы или создай свой. Каналы также появляются в списке чатов.'},
  {emoji:'👤',title:'Профиль',text:'Вкладка 👤 — настрой аватар, имя и статус. Нажми на аватар собеседника в чате чтобы увидеть его профиль.'},
  {emoji:'🚀',title:'Всё готово!',text:'Начинай общаться. Если что-то непонятно — загляни в настройки ⚙'},
]
let onboardStep=0
function showOnboarding(){
  onboardStep=0
  renderOnboardStep()
  document.getElementById('onboarding-modal').classList.remove('hidden')
}
function renderOnboardStep(){
  const s=ONBOARDING_STEPS[onboardStep]
  document.getElementById('ob-emoji').textContent=s.emoji
  document.getElementById('ob-title').textContent=s.title
  document.getElementById('ob-text').textContent=s.text
  document.getElementById('ob-counter').textContent=`${onboardStep+1} / ${ONBOARDING_STEPS.length}`
  document.getElementById('ob-dots').innerHTML=ONBOARDING_STEPS.map((_,i)=>
    `<div class="onboard-dot ${i===onboardStep?'active':''}"></div>`).join('')
  document.getElementById('ob-btn').textContent=onboardStep===ONBOARDING_STEPS.length-1?'Начать →':'Далее →'
}
function onboardNext(){
  if(onboardStep<ONBOARDING_STEPS.length-1){onboardStep++;renderOnboardStep()}
  else{document.getElementById('onboarding-modal').classList.add('hidden');localStorage.setItem('fv_onboarded','1')}
}
function onboardSkip(){
  document.getElementById('onboarding-modal').classList.add('hidden')
  localStorage.setItem('fv_onboarded','1')
}

async function updateOnline(){
  // If hide_online, set last_seen to a far past date so others see us as offline
  const ts = settings.hideOnline ? new Date(0).toISOString() : new Date().toISOString()
  await db.from('forever_profiles').update({last_seen:ts, hide_online:settings.hideOnline}).eq('id',currentUser.id)
  await loadContacts()
}

// ── SETTINGS ──────────────────────────────────────────────────────
function loadSettings(){try{const s=JSON.parse(localStorage.getItem('fv_s')||'{}');settings={sound:s.sound||false,hideOnline:s.hideOnline||false,confirmDel:s.confirmDel!==false,compact:s.compact||false,fontSize:s.fontSize||'md',lightMode:s.lightMode||false}}catch(e){settings={sound:false,hideOnline:false,confirmDel:true,compact:false,fontSize:'md',lightMode:false}}applySettings()}
function saveSettings(){localStorage.setItem('fv_s',JSON.stringify(settings))}
function applySettings(){
  document.getElementById('toggle-sound').classList.toggle('on',settings.sound)
  document.getElementById('toggle-hide-online').classList.toggle('on',settings.hideOnline)
  document.getElementById('toggle-confirm-del').classList.toggle('on',settings.confirmDel)
  const compactEl=document.getElementById('toggle-compact')
  if(compactEl)compactEl.classList.toggle('on',settings.compact)
  // Font size
  const fs=settings.fontSize||'md'
  const sizes={sm:'12px',md:'13px',lg:'15px'}
  document.getElementById('messages').style.fontSize=sizes[fs]||'13px'
  document.querySelectorAll('.font-size-btn').forEach(b=>b.classList.remove('active'))
  const btn=document.getElementById('fs-'+fs)
  if(btn)btn.classList.add('active')
  // Compact mode
  document.getElementById('contacts-list').classList.toggle('compact',!!settings.compact)
  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'))
  const lb=document.getElementById('lang-'+lang)
  if(lb)lb.classList.add('active')
  // Light mode
  document.body.classList.toggle('light',!!settings.lightMode)
  const ltEl=document.getElementById('toggle-light')
  if(ltEl)ltEl.classList.toggle('on',!!settings.lightMode)
}
function toggleHideOnline(){settings.hideOnline=!settings.hideOnline;saveSettings();applySettings();toast(settings.hideOnline?'Статус скрыт':'Статус виден')}
function toggleConfirmDel(){settings.confirmDel=!settings.confirmDel;saveSettings();applySettings()}
function toggleSound(){settings.sound=!settings.sound;saveSettings();applySettings()}
function toggleCompact(){settings.compact=!settings.compact;saveSettings();applySettings()}
function toggleLightMode(){settings.lightMode=!settings.lightMode;saveSettings();applySettings();toast(settings.lightMode?'☀️ Светлая тема':'🌙 Тёмная тема')}
function setFontSize(sz){settings.fontSize=sz;saveSettings();applySettings()}
function clearCache(){
  if(!confirm(t('cacheClearConfirm')))return
  const keep=['fv_s','fv_lang','fv_onboarded']
  Object.keys(localStorage).filter(k=>k.startsWith('fv_')&&!keep.includes(k)).forEach(k=>localStorage.removeItem(k))
  toast(t('cacheCleared'))
}
async function changeNick(){
  const username=document.getElementById('new-nick').value.trim().toLowerCase()
  const msgEl=document.getElementById('nick-msg')
  if(!/^[a-z0-9_]{3,24}$/.test(username)){msgEl.textContent='Только a-z, 0-9, _ (3–24)';msgEl.className='settings-msg err';return}
  msgEl.textContent='Сохраняем...';msgEl.className='settings-msg'
  const{error}=await db.from('forever_profiles').update({username}).eq('id',currentUser.id)
  if(error){msgEl.textContent=error.message.includes('unique')?'Ник уже занят':error.message;msgEl.className='settings-msg err';return}
  myProfile.username=username
  document.getElementById('my-username').textContent=username
  document.getElementById('cur-nick').textContent=username
  document.getElementById('new-nick').value=''
  msgEl.textContent='Ник обновлён ✓';msgEl.className='settings-msg ok'
  toast('Ник обновлён')
}

// ── PROFILE EDITOR ────────────────────────────────────────────────
function initProfileEditor(){
  const picker=document.getElementById('av-picker')
  selectedAvatar=myProfile.avatar_emoji||AVATARS[0]
  picker.innerHTML=AVATARS.map(a=>`<div class="av-option ${a===selectedAvatar?'selected':''}" onclick="selectAvatar('${a}')">${a}</div>`).join('')
  document.getElementById('p-display').value=myProfile.display_name||''
  document.getElementById('p-bio').value=myProfile.bio||''
  document.getElementById('p-status').value=myProfile.status_text||''
}
function selectAvatar(emoji){
  selectedAvatar=emoji
  document.querySelectorAll('.av-option').forEach(el=>el.classList.toggle('selected',el.textContent===emoji))
}
async function saveProfile(){
  const display_name=document.getElementById('p-display').value.trim()
  const bio=document.getElementById('p-bio').value.trim()
  const status_text=document.getElementById('p-status').value.trim()
  const avatar_emoji=selectedAvatar
  const msgEl=document.getElementById('profile-msg')
  msgEl.textContent='Сохраняем...';msgEl.className='settings-msg'
  const{data:saved,error}=await db.from('forever_profiles').update({display_name,bio,avatar_emoji,status_text:status_text||null}).eq('id',currentUser.id).select().single()
  if(error){console.error('saveProfile error:',error);msgEl.textContent='Ошибка: '+error.message;msgEl.className='settings-msg err';return}
  if(!saved){msgEl.textContent='Ошибка: профиль не найден в БД';msgEl.className='settings-msg err';return}
  myProfile={...myProfile,display_name,bio,avatar_emoji,status_text}
  document.getElementById('my-av').textContent=avatar_emoji
  msgEl.textContent='Профиль обновлён ✓';msgEl.className='settings-msg ok'
  toast('Профиль сохранён')
  await loadContacts()
}

// ── CONTACTS ──────────────────────────────────────────────────────
async function loadContacts(){
  const uid=currentUser.id
  // Get accepted contacts both directions
  const{data:sent}=await db.from('forever_contacts').select('contact_id').eq('user_id',uid).eq('status','accepted')
  const{data:recv}=await db.from('forever_contacts').select('user_id').eq('contact_id',uid).eq('status','accepted')
  const ids=new Set()
  if(sent)sent.forEach(r=>ids.add(r.contact_id))
  if(recv)recv.forEach(r=>ids.add(r.user_id))

  let people=[]
  if(ids.size){
    const{data:profiles}=await db.from('forever_profiles').select('*').in('id',[...ids])
    // Get last message time for each contact
    for(const p of (profiles||[])){
      const{data:lastMsg}=await db.from('forever_messages')
        .select('created_at').or(`and(sender_id.eq.${uid},receiver_id.eq.${p.id}),and(sender_id.eq.${p.id},receiver_id.eq.${uid})`)
        .order('created_at',{ascending:false}).limit(1)
      people.push({...p,id:p.id,_type:'person',_lastMsg:lastMsg?.[0]?.created_at||p.created_at})
    }
  }

  // Get channels user is member of (or owns)
  const{data:memberships}=await db.from('forever_channel_members').select('channel_id').eq('user_id',uid)
  const{data:ownedChannels}=await db.from('forever_channels').select('*').eq('owner_id',uid)
  const memberIds=(memberships||[]).map(m=>m.channel_id)
  let channelItems=[]
  if(memberIds.length){
    const{data:memberChannels}=await db.from('forever_channels').select('*').in('id',memberIds)
    channelItems=[...(memberChannels||[])]
  }
  if(ownedChannels){
    ownedChannels.forEach(ch=>{if(!channelItems.find(c=>c.id===ch.id))channelItems.push(ch)})
  }
  // Fetch real member counts for all channel items at once
  if(channelItems.length){
    const chIds=channelItems.map(c=>c.id)
    const{data:memberCounts}=await db.from('forever_channel_members')
      .select('channel_id, count:channel_id.count()')
      .in('channel_id',chIds)
    const countMap={}
    if(memberCounts)memberCounts.forEach(r=>countMap[r.channel_id]=parseInt(r.count)||0)
    channelItems=channelItems.map(ch=>({...ch,member_count:countMap[ch.id]??ch.member_count??0}))
  }
  channelItems=channelItems.map(ch=>({...ch,_type:'channel',_lastMsg:ch.created_at}))

  // Load groups
  await loadGroups()
  const groupItems=(myGroups||[]).map(g=>({...g,_type:'group',_lastMsg:g.created_at}))

  // Load pinned from localStorage
  const pinned=getPinnedChats()

  // Combine and sort: pinned first, then by last message
  const all=[...people,...channelItems,...groupItems]
  all.sort((a,b)=>{
    const aPin=pinned.includes((a._type==='channel'?'ch_':'')+a.id)
    const bPin=pinned.includes((b._type==='channel'?'ch_':'')+b.id)
    if(aPin&&!bPin)return -1
    if(!aPin&&bPin)return 1
    return new Date(b._lastMsg)-new Date(a._lastMsg)
  })

  contacts=people; allContacts=all  // store full list including channels+groups
  // Build unread counts
  await buildUnreadMap(people)
  renderContacts(all)
}

let unreadMap = {}
async function buildUnreadMap(people){
  if(!people.length){unreadMap={};return}
  unreadMap={}
  // Get last opened timestamps from localStorage
  const lastRead=JSON.parse(localStorage.getItem('fv_lastread')||'{}')
  for(const p of people){
    const since=lastRead[p.id]||'1970-01-01'
    const{count}=await db.from('forever_messages')
      .select('*',{count:'exact',head:true})
      .eq('receiver_id',currentUser.id)
      .eq('sender_id',p.id)
      .gt('created_at',since)
    if(count>0)unreadMap[p.id]=count
  }
  updateTitleBadge()
}
function markAsRead(userId){
  const lr=JSON.parse(localStorage.getItem('fv_lastread')||'{}')
  lr[userId]=new Date().toISOString()
  localStorage.setItem('fv_lastread',JSON.stringify(lr))
  delete unreadMap[userId]
  updateTitleBadge()
}
function renderContacts(list){
  const el=document.getElementById('contacts-list')
  if(!list.length){el.innerHTML='<div class="list-empty">Нет контактов.<br>Вкладка «Найти» → добавьте друзей.</div>';return}
  const pinned=getPinnedChats()
  el.innerHTML=list.map(c=>{
    if(c._type==='group'){
      return`<div class="contact-item" onclick="openGroupView(${c.id})">
        <div class="contact-av-wrap"><div class="contact-av" style="background:rgba(168,85,247,0.15);border-color:rgba(168,85,247,0.3)">${c.avatar_emoji||'👥'}</div></div>
        <div class="contact-info">
          <div class="contact-name">${esc(c.name)} <span class="channel-tag" style="background:rgba(168,85,247,0.12);color:var(--purple);border-color:rgba(168,85,247,0.25)">группа</span></div>
          <div class="contact-status">Групповой чат</div>
        </div>
      </div>`
    }
    if(c._type==='channel'){
      const pid='ch_'+c.id
      const isPinned=pinned.includes(pid)
      return`<div class="contact-item ${isPinned?'pinned-chat':''}" onclick="openChannelFromContacts(${c.id})">
        <div class="contact-av-wrap"><div class="contact-av" style="background:linear-gradient(135deg,rgba(168,85,247,0.3),rgba(0,229,255,0.15));border-color:rgba(168,85,247,0.4)">${c.avatar_emoji||'📢'}</div></div>
        <div class="contact-info"><div class="contact-name">${esc(c.name)}</div><div class="contact-status"><span style="color:var(--accent)">канал</span> · ${c.member_count||0} участников</div></div>
        <span class="channel-tag">KN</span>
        <button class="pin-btn" onclick="togglePinChat(event,'${pid}')" title="${isPinned?'Открепить':'Закрепить'}">${isPinned?'📌':'📍'}</button>
      </div>`
    }
    const online=isOnline(c.last_seen)
    const name=c.display_name||c.username
    const roleTag=roleBadge(c.role)
    const pid=c.id
    const isPinned=pinned.includes(pid)
    const status=online?'<span style="color:var(--green)">● онлайн</span>':'<span>офлайн</span>'
    const unread=unreadMap[c.id]||0
    return`<div class="contact-item ${activeChat?.id===c.id?'active':''} ${isPinned?'pinned-chat':''}" onclick="openChat('${c.id}','${esc(c.username)}')">
      <div class="contact-av-wrap"><div class="contact-av">${c.avatar_emoji||'👤'}</div>${online?'<div class="online-dot"></div>':''}</div>
      <div class="contact-info">
        <div class="contact-name">${esc(name)}${roleTag}</div>
        ${c.status_text?`<div class="contact-status-text">${esc(c.status_text)}</div>`:`<div class="contact-status">${status}</div>`}
      </div>
      ${unread>0?`<span class="unread-badge">${unread}</span>`:''}
      <button class="pin-btn" onclick="togglePinChat(event,'${pid}')" title="${isPinned?'Открепить':'Закрепить'}">${isPinned?'📌':'📍'}</button>
    </div>`
  }).join('')
}
function filterContacts(){
  const q=document.getElementById('contacts-search').value.toLowerCase()
  if(!q){renderContacts(allContacts);return}
  renderContacts(allContacts.filter(c=>
    (c.username||'').toLowerCase().includes(q)||
    (c.display_name||'').toLowerCase().includes(q)||
    (c.name||'').toLowerCase().includes(q)  // channels and groups have .name
  ))
}

// ── FIND ──────────────────────────────────────────────────────────
async function searchUsers(){
  const q=document.getElementById('find-input').value.trim().toLowerCase()
  const el=document.getElementById('find-results')
  if(!q)return
  el.innerHTML='<div class="list-empty">Ищем...</div>'
  const{data}=await db.from('forever_profiles').select('*').ilike('username',`%${q}%`).neq('id',currentUser.id).limit(20)
  if(!data||!data.length){el.innerHTML='<div class="list-empty">Никого не найдено</div>';return}
  const ids=data.map(u=>u.id)
  // Check contact status in BOTH directions
  const{data:myReqs}=await db.from('forever_contacts').select('contact_id,status').eq('user_id',currentUser.id).in('contact_id',ids)
  const{data:theirReqs}=await db.from('forever_contacts').select('user_id,status').eq('contact_id',currentUser.id).in('user_id',ids)
  const statusMap={}
  if(myReqs)myReqs.forEach(r=>statusMap[r.contact_id]=r.status==='accepted'?'friend':'sent')
  if(theirReqs)theirReqs.forEach(r=>{
    if(r.status==='accepted')statusMap[r.user_id]='friend'
    else if(!statusMap[r.user_id])statusMap[r.user_id]='incoming'
  })
  el.innerHTML=data.map(u=>{
    const s=statusMap[u.id]
    let btn=''
    if(!s)btn=`<button class="btn-add add" onclick="sendRequest('${u.id}','${esc(u.username)}')">+ Добавить</button>`
    else if(s==='sent')btn=`<button class="btn-add sent" disabled>Отправлено</button>`
    else if(s==='friend')btn=`<button class="btn-add friend" disabled>Контакт ✓</button>`
    else if(s==='incoming')btn=`<button class="btn-add add" onclick="acceptFromFind('${u.id}')">Принять</button>`
    return`<div class="find-item">
      <div class="find-av">${u.avatar_emoji||'👤'}</div>
      <div class="find-info"><div class="find-name">${esc(u.display_name||u.username)}</div><div class="find-bio">${esc(u.bio||'@'+u.username)}</div></div>
      ${btn}
    </div>`
  }).join('')
}
async function sendRequest(contactId,username){
  // Check if relation exists in either direction
  const{data:existing}=await db.from('forever_contacts').select('id,status,user_id,contact_id')
    .or(`and(user_id.eq.${currentUser.id},contact_id.eq.${contactId}),and(user_id.eq.${contactId},contact_id.eq.${currentUser.id})`)
  if(existing&&existing.length>0){
    const rel=existing[0]
    if(rel.status==='accepted'){toast('Вы уже друзья с '+username);searchUsers();return}
    if(rel.status==='pending'&&rel.user_id===currentUser.id){toast('Запрос уже отправлен');searchUsers();return}
    if(rel.status==='pending'&&rel.contact_id===currentUser.id){
      await db.from('forever_contacts').update({status:'accepted'}).eq('id',rel.id)
      toast(username+' добавлен в контакты!')
      await loadContacts();searchUsers();return
    }
  }
  const{error}=await db.from('forever_contacts').insert({user_id:currentUser.id,contact_id:contactId,status:'pending'})
  if(error){toast('Ошибка: '+error.message);return}
  toast('Запрос отправлен → '+username)
  searchUsers()
}
async function acceptFromFind(userId){
  await db.from('forever_contacts').update({status:'accepted'}).eq('user_id',userId).eq('contact_id',currentUser.id)
  toast('Контакт добавлен!')
  await loadContacts();searchUsers()
}

// ── REQUESTS ──────────────────────────────────────────────────────
async function loadRequests(){
  // Get pending requests where I am the receiver
  const{data:reqs}=await db.from('forever_contacts').select('id,user_id,status').eq('contact_id',currentUser.id).eq('status','pending')
  if(!reqs||!reqs.length){
    document.getElementById('req-badge').textContent=0;document.getElementById('req-badge').classList.add('hidden')
    document.getElementById('notif-badge').textContent=0;document.getElementById('notif-badge').classList.add('hidden')
    document.getElementById('req-list').innerHTML='<div class="list-empty">Входящих запросов нет</div>'
    return
  }
  // Get profiles of senders
  const senderIds=reqs.map(r=>r.user_id)
  const{data:profiles}=await db.from('forever_profiles').select('id,username,display_name,avatar_emoji').in('id',senderIds)
  const profileMap={}
  if(profiles)profiles.forEach(p=>profileMap[p.id]=p)
  const count=reqs.length
  document.getElementById('req-badge').textContent=count;document.getElementById('req-badge').classList.toggle('hidden',count===0)
  document.getElementById('notif-badge').textContent=count;document.getElementById('notif-badge').classList.toggle('hidden',count===0)
  updateBottomNavBadge(count)
  const el=document.getElementById('req-list')
  el.innerHTML=reqs.map(r=>{
    const p=profileMap[r.user_id]
    const name=p?.display_name||p?.username||'неизвестный'
    const av=p?.avatar_emoji||'👤'
    return`<div class="req-item">
      <div class="req-from">${av} Запрос от <span>${esc(name)}</span></div>
      <div class="req-btns">
        <button class="btn-accept" onclick="acceptRequest(${r.id},'${esc(name)}')">Принять</button>
        <button class="btn-decline" onclick="declineRequest(${r.id})">Отклонить</button>
      </div>
    </div>`
  }).join('')
}
async function acceptRequest(id,username){await db.from('forever_contacts').update({status:'accepted'}).eq('id',id);toast(`${username} добавлен!`);await loadContacts();await loadRequests()}
async function declineRequest(id){await db.from('forever_contacts').update({status:'declined'}).eq('id',id);toast('Запрос отклонён');await loadRequests()}

// ── CHAT ──────────────────────────────────────────────────────────
async function openChat(userId,username){
  activeChat={id:userId,username}
  lastMsgId=0
  activeChannel=null
  const mySession=++chatSession
  markAsRead(userId)
  document.getElementById('no-chat').style.display='none'
  document.getElementById('active-chat').classList.add('show')
  document.getElementById('channel-view').classList.remove('show')
  // Find contact profile
  const contact=allContacts.find(c=>c.id===userId)
  document.getElementById('ch-av-emoji').textContent=contact?avatarFor(contact):'👤'
  document.getElementById('ch-title').textContent=contact?.display_name||username
  document.getElementById('messages').innerHTML=''
  renderContacts(allContacts)
  closeSidebar()
  // Update online status in header
  updateChatOnline(contact)
  await loadMessages()
}
function updateChatOnline(contact){
  const dot=document.getElementById('ch-online')
  const sub=document.getElementById('ch-sub')
  if(contact&&isOnline(contact.last_seen)){dot.style.display='block';sub.textContent='онлайн'}
  else{dot.style.display='none';sub.textContent='Forever · RKC Studio'}
}
function closeChat(){
  activeChat=null
  document.getElementById('active-chat').classList.remove('show')
  document.getElementById('channel-view').classList.remove('show')
  if(isMobile()){
    // On mobile, show the chat list again
    document.getElementById('no-chat').style.display=''
    mobileNav(mobileCurrentTab||'chats')
  } else {
    document.getElementById('no-chat').style.display=''
  }
}

async function loadMessages(){
  if(!activeChat)return
  const uid=currentUser.id,rid=activeChat.id
  const mySession=chatSession
  const{data}=await db.from('forever_messages').select('*').or(`and(sender_id.eq.${uid},receiver_id.eq.${rid}),and(sender_id.eq.${rid},receiver_id.eq.${uid})`).order('created_at',{ascending:true}).limit(200)
  if(mySession!==chatSession)return // user switched chat while loading
  const container=document.getElementById('messages')
  container.innerHTML=''
  if(!data||!data.length){container.innerHTML='<div class="msg-placeholder" style="text-align:center;color:var(--muted);font-size:10px;margin:auto;letter-spacing:0.1em;text-transform:uppercase">Начните разговор</div>';return}
  data.forEach(m=>appendMsg(m))
  lastMsgId=data[data.length-1].id
  scrollBottom()
  loadReactionsForMessages('dm')
}

function linkify(text){
  // Escape first, then wrap URLs in anchor tags
  const escaped=esc(text)
  return escaped.replace(/(https?:\/\/[^\s<>"']+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" style="color:var(--accent2);text-decoration:underline;word-break:break-all;">$1</a>')
}
function appendMsg(msg){
  const isSent=msg.sender_id===currentUser.id
  const container=document.getElementById('messages')
  const placeholder=container.querySelector('.msg-placeholder')
  if(placeholder)placeholder.remove()
  const div=document.createElement('div')
  div.className=`msg ${isSent?'sent':'recv'}`
  div.dataset.id=msg.id
  const delBtn=isSent?`<button class="msg-del" onclick="deleteMsg(${msg.id},this)" title="Удалить">✕</button>`:''
  div.innerHTML=`<div class="msg-bubble-wrap" style="position:relative"><div class="msg-bubble">${linkify(msg.content)}</div><button class="add-reaction-btn" onclick="showReactionPicker(event,${msg.id},'dm')">😊</button></div><div class="msg-footer"><div class="msg-time">${fmtTime(msg.created_at)}</div>${delBtn}</div><div class="reactions-row" id="reactions-dm-${msg.id}"></div>`
  container.appendChild(div)
}

async function deleteMsg(id,btn){
  if(settings.confirmDel&&!confirm('Удалить сообщение?'))return
  const{error}=await db.from('forever_messages').delete().eq('id',id).eq('sender_id',currentUser.id)
  if(error){toast('Ошибка удаления');return}
  const msgEl=btn.closest('.msg')
  msgEl.style.opacity='0';msgEl.style.transform='scale(0.9)';msgEl.style.transition='all 0.2s'
  setTimeout(()=>msgEl.remove(),200)
}

async function sendMessage(){
  const input=document.getElementById('msg-input')
  const content=input.value.trim()
  if(!content||!activeChat)return
  document.getElementById('btn-send').disabled=true
  input.value='';input.style.height=''
  const{data,error}=await db.from('forever_messages').insert({sender_id:currentUser.id,receiver_id:activeChat.id,content}).select().single()
  document.getElementById('btn-send').disabled=false
  if(error){toast('Ошибка отправки');return}
  if(data.id>lastMsgId){lastMsgId=data.id;appendMsg(data);scrollBottom()}
}
function handleKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage()}}
function autoResize(el){el.style.height='';el.style.height=Math.min(el.scrollHeight,110)+'px'}

// ── POLL ──────────────────────────────────────────────────────────
async function tick(){
  // Light poll: only new messages + requests badge
  await loadRequests()
  if(activeChat){
    const uid=currentUser.id,rid=activeChat.id
    const mySession=chatSession
    const{data}=await db.from('forever_messages').select('*').or(`and(sender_id.eq.${uid},receiver_id.eq.${rid}),and(sender_id.eq.${rid},receiver_id.eq.${uid})`).gt('id',lastMsgId).order('created_at',{ascending:true})
    if(mySession!==chatSession)return // switched chat during fetch
    if(data&&data.length){data.forEach(m=>appendMsg(m));lastMsgId=data[data.length-1].id;scrollBottom()}
  }
  if(activeGroup){
    const gSess=groupChatSession
    const{data:newGMsgs}=await db.from('forever_group_messages')
      .select('*').eq('group_id',activeGroup.id)
      .gt('id',lastGroupMsgId).order('created_at',{ascending:true})
    if(gSess===groupChatSession&&newGMsgs&&newGMsgs.length){
      const senderIds=[...new Set(newGMsgs.map(m=>m.sender_id))]
      const{data:profiles}=await db.from('forever_profiles').select('id,username,display_name,avatar_emoji').in('id',senderIds)
      const profMap={}; profiles?.forEach(p=>profMap[p.id]=p)
      newGMsgs.forEach(m=>appendGroupMsg(m,profMap[m.sender_id]))
      lastGroupMsgId=newGMsgs[newGMsgs.length-1].id
      document.getElementById('gv-messages').scrollTop=99999
    }
  }
  if(activeChannel){
    const chSess=chatSession
    const{data:newChMsgs}=await db.from('forever_channel_messages')
      .select('*').eq('channel_id',activeChannel.id)
      .gt('id',lastChannelMsgId).order('created_at',{ascending:true})
    if(chSess!==chatSession)return // switched channel during fetch
    if(newChMsgs&&newChMsgs.length){
      const container=document.getElementById('cv-messages')
      if(container.querySelector('.ch-empty-state'))container.innerHTML=''
      newChMsgs.forEach(m=>{
        const div=document.createElement('div')
        div.className='channel-msg'
        div.innerHTML=`<div class="msg-bubble">${linkify(m.content)}</div><div class="msg-time">${fmtTime(m.created_at)}</div>`
        container.appendChild(div)
      })
      lastChannelMsgId=newChMsgs[newChMsgs.length-1].id
      container.scrollTop=container.scrollHeight
    }
  }
}


// ── FEED ──────────────────────────────────────────────────────────

let allChannels = []
let activeChannel = null
let lastChannelMsgId = 0

async function loadFeed() {
  const el = document.getElementById('channel-list')
  el.innerHTML = '<div class="list-empty">Загрузка...</div>'
  const { data, error } = await db.from('forever_channels')
    .select('*, forever_channel_members(count)')
    .eq('is_public', true)
    .order('is_pinned', { ascending: false })
  if (error || !data) { el.innerHTML = '<div class="list-empty">Ошибка загрузки</div>'; return }
  // Use real count from relation, sync back to member_count field
  const enriched = data.map(ch => ({
    ...ch,
    member_count: ch.forever_channel_members?.[0]?.count ?? ch.member_count ?? 0
  }))
  // Sort by real count after pinned
  enriched.sort((a,b) => {
    if(a.is_pinned && !b.is_pinned) return -1
    if(!a.is_pinned && b.is_pinned) return 1
    return b.member_count - a.member_count
  })
  allChannels = enriched
  renderFeed(enriched)
}

function renderFeed(list) {
  const el = document.getElementById('channel-list')
  if (!list.length) { el.innerHTML = '<div class="list-empty">Каналов пока нет</div>'; return }
  el.innerHTML = list.map(ch => `
    <div class="channel-card ${ch.is_pinned ? 'pinned' : ''}" onclick="openChannelView(${ch.id})">
      <div class="channel-card-top">
        <div class="channel-av ${ch.is_pinned ? 'pinned-av' : ''}">${ch.avatar_emoji || '📢'}</div>
        <div class="channel-info">
          <div class="channel-name ${ch.is_pinned ? 'pinned-name' : ''}">${esc(ch.name)}</div>
          <div class="channel-meta">
            ${ch.is_pinned ? '<span class="channel-pin-badge">★ Официальный</span>' : ''}
            <span>👥 ${ch.member_count || 0}</span>
          </div>
        </div>
      </div>
      ${ch.description ? `<div class="channel-desc">${esc(ch.description)}</div>` : ''}
    </div>`).join('')
}

function filterFeed() {
  const q = document.getElementById('feed-search').value.toLowerCase()
  renderFeed(allChannels.filter(ch => ch.name.toLowerCase().includes(q) || (ch.description || '').toLowerCase().includes(q)))
}

async function openChannelView(channelId) {
  const ch = allChannels.find(c => c.id === channelId || c.id === +channelId)
  if (!ch) return
  activeChannel = ch
  lastChannelMsgId = 0
  chatSession++

  document.getElementById('no-chat').style.display = 'none'
  document.getElementById('active-chat').classList.remove('show')
  document.getElementById('channel-view').classList.add('show')
  document.getElementById('cv-av').textContent = ch.avatar_emoji || '📢'
  document.getElementById('cv-name').textContent = ch.name
  // Fetch real member count
  const{count:realCount}=await db.from('forever_channel_members').select('*',{count:'exact',head:true}).eq('channel_id',ch.id)
  const displayCount = realCount ?? ch.member_count ?? 0
  document.getElementById('cv-meta').textContent = `${displayCount} участников · Forever`
  const descEl = document.getElementById('cv-desc')
  if(descEl){ descEl.textContent = ch.description || ''; descEl.style.display = ch.description ? 'block' : 'none' }
  closeSidebar()

  await renderChannelJoinBar(ch)
  await loadChannelMessages(ch.id)
}

async function renderChannelJoinBar(ch) {
  const bar = document.getElementById('cv-join-bar')
  // Check if user is member
  const { data: membership } = await db.from('forever_channel_members')
    .select('id').eq('channel_id', ch.id).eq('user_id', currentUser.id).single()
  const isMember = !!membership
  const isOwner = ch.owner_id === currentUser.id

  const delBtn = document.getElementById('cv-delete-btn')
  const editBtn = document.getElementById('cv-edit-btn')
  if (delBtn) delBtn.style.display = isOwner ? 'flex' : 'none'
  if (editBtn) editBtn.style.display = isOwner ? 'flex' : 'none'

  if (isOwner) {
    bar.innerHTML = `
      <textarea class="msg-input" id="cv-input" placeholder="Написать в канал... (Enter — отправить)" rows="1"
        tabindex="0" inputmode="text" onclick="this.focus()"
        onkeydown="handleChannelKey(event)" oninput="autoResize(this)"
        style="flex:1;touch-action:manipulation;-webkit-user-select:text;user-select:text;"></textarea>
      <button class="btn-send" onclick="sendChannelMessage()">➤</button>`
  } else if (isMember) {
    bar.innerHTML = `
      <div class="channel-input-wrap">Только владелец может писать</div>
      <button class="btn-leave" onclick="leaveChannel(${ch.id})">Выйти</button>`
  } else {
    bar.innerHTML = `<button class="btn-join" onclick="joinChannel(${ch.id})">+ Вступить в канал</button>`
  }
}

async function joinChannel(channelId) {
  const ch = allChannels.find(c => c.id === channelId)
  if (!confirm(`Вступить в канал «${ch?.name}»?`)) return
  const { error } = await db.from('forever_channel_members').insert({ channel_id: channelId, user_id: currentUser.id })
  if (error && !error.message.includes('unique')) { toast('Ошибка: ' + error.message); return }
  toast('✓ Вы вступили в канал!')
  await loadFeed()
  activeChannel = allChannels.find(c => c.id === channelId)
  if(activeChannel){
    const{count:mc}=await db.from('forever_channel_members').select('*',{count:'exact',head:true}).eq('channel_id',channelId)
    document.getElementById('cv-meta').textContent = `${mc||0} участников · Forever`
    await renderChannelJoinBar(activeChannel)
  }
}

async function leaveChannel(channelId) {
  const ch = allChannels.find(c => c.id === channelId)
  if (!confirm(`Выйти из канала «${ch?.name}»?`)) return
  await db.from('forever_channel_members').delete().eq('channel_id', channelId).eq('user_id', currentUser.id)
  toast('Вы вышли из канала')
  await loadFeed()
  activeChannel = allChannels.find(c => c.id === channelId)
  if(activeChannel){
    const{count:mc2}=await db.from('forever_channel_members').select('*',{count:'exact',head:true}).eq('channel_id',channelId)
    document.getElementById('cv-meta').textContent = `${mc2||0} участников · Forever`
    await renderChannelJoinBar(activeChannel)
  }
}

async function loadChannelMessages(channelId) {
  const container = document.getElementById('cv-messages')
  container.innerHTML = '<div style="text-align:center;color:var(--muted);font-size:10px;margin:auto;">Загрузка...</div>'
  const { data } = await db.from('forever_channel_messages')
    .select('*').eq('channel_id', channelId)
    .order('created_at', { ascending: true }).limit(100)
  if (!data || !data.length) {
    container.innerHTML = '<div class="ch-empty-state" style="text-align:center;color:var(--muted);font-size:10px;margin:auto;letter-spacing:0.1em;text-transform:uppercase">Сообщений пока нет</div>'
    return
  }
  container.innerHTML = ''
  data.forEach(m => {
    const div = document.createElement('div')
    div.className = 'channel-msg'
    div.innerHTML = `<div class="msg-bubble">${linkify(m.content)}</div><div class="msg-time">${fmtTime(m.created_at)}</div>`
    container.appendChild(div)
  })
  lastChannelMsgId = data[data.length - 1].id
  container.scrollTop = container.scrollHeight
}

function closeChannelView() {
  activeChannel = null
  document.getElementById('channel-view').classList.remove('show')
  if(isMobile()){
    document.getElementById('no-chat').style.display=''
    mobileNav(mobileCurrentTab||'chats')
  } else {
    document.getElementById('no-chat').style.display = ''
  }
}

// ── CREATE CHANNEL ────────────────────────────────────────────────
function openCreateChannel(){
  document.getElementById('ch-name').value=''
  document.getElementById('ch-desc').value=''
  document.getElementById('ch-emoji').value=''
  document.getElementById('ch-av-preview').textContent='📢'
  document.getElementById('ch-msg').textContent=''
  document.getElementById('ch-msg').className='auth-msg'
  document.getElementById('create-channel-modal').classList.remove('hidden')
}
function closeCreateChannel(){
  document.getElementById('create-channel-modal').classList.add('hidden')
}
const _chModal=document.getElementById('create-channel-modal');if(_chModal)_chModal.addEventListener('click', function(e){
  if(e.target===this) closeCreateChannel()
})
let _creatingChannel = false
async function createChannel(){
  if(_creatingChannel)return  // prevent double-tap race condition
  const name=document.getElementById('ch-name').value.trim()
  const desc=document.getElementById('ch-desc').value.trim()
  const emoji=document.getElementById('ch-emoji').value.trim()||'📢'
  const msgEl=document.getElementById('ch-msg')
  const btn=document.querySelector('#create-channel-modal .auth-btn.p')
  if(!name){msgEl.textContent='Введите название';msgEl.className='auth-msg err';return}
  if(name.length<2){msgEl.textContent='Название минимум 2 символа';msgEl.className='auth-msg err';return}

  _creatingChannel=true
  if(btn){btn.disabled=true;btn.textContent='Создаём...'}
  msgEl.textContent='';msgEl.className='auth-msg'

  // Re-check limit fresh from DB (prevents race condition)
  const{count}=await db.from('forever_channels').select('*',{count:'exact',head:true}).eq('owner_id',currentUser.id)
  if((count||0)>=2){
    msgEl.textContent='Максимум 2 канала на пользователя';msgEl.className='auth-msg err'
    _creatingChannel=false;if(btn){btn.disabled=false;btn.textContent='Создать'}
    return
  }

  const{data,error}=await db.from('forever_channels').insert({
    name, description:desc||null, avatar_emoji:emoji,
    owner_id:currentUser.id, is_public:true, is_pinned:false, member_count:1
  }).select().single()
  if(error){
    msgEl.textContent=error.message;msgEl.className='auth-msg err'
    _creatingChannel=false;if(btn){btn.disabled=false;btn.textContent='Создать'}
    return
  }

  await db.from('forever_channel_members').insert({channel_id:data.id,user_id:currentUser.id})

  _creatingChannel=false
  closeCreateChannel()
  toast('Канал «'+name+'» создан!')
  await loadFeed()
  await loadContacts()
  openChannelView(data.id)
}

// ── MINI ADMIN ───────────────────────────────────────────────────
async function miniBanUser(){
  if(!currentViewedProfile)return
  const reason=document.getElementById('pm-ban-reason').value.trim()
  if(!reason){toast('Укажи причину бана');return}
  const{error}=await db.from('forever_profiles').update({is_banned:true,ban_reason:reason}).eq('id',currentViewedProfile.id)
  if(error){toast('Ошибка: '+error.message);return}
  toast('🚫 '+( currentViewedProfile.display_name||currentViewedProfile.username)+' забанен')
  document.getElementById('profile-modal').classList.add('hidden')
  await loadContacts()
}
async function miniUnbanUser(){
  if(!currentViewedProfile)return
  const{error}=await db.from('forever_profiles').update({is_banned:false,ban_reason:null,banned_until:null}).eq('id',currentViewedProfile.id)
  if(error){toast('Ошибка: '+error.message);return}
  toast('✅ Бан снят')
  document.getElementById('profile-modal').classList.add('hidden')
  await loadContacts()
}

// ── EDIT OWN CHANNEL ─────────────────────────────────────────────
function openEditChannel(){
  if(!activeChannel)return
  document.getElementById('edit-ch-name').value=activeChannel.name||''
  document.getElementById('edit-ch-desc').value=activeChannel.description||''
  document.getElementById('edit-ch-emoji').value=activeChannel.avatar_emoji||'📢'
  document.getElementById('edit-ch-av-preview').textContent=activeChannel.avatar_emoji||'📢'
  document.getElementById('edit-ch-msg').textContent=''
  document.getElementById('edit-channel-modal').classList.remove('hidden')
}
function closeEditChannel(){
  document.getElementById('edit-channel-modal').classList.add('hidden')
}
const _editChModal=document.getElementById('edit-channel-modal')
if(_editChModal)_editChModal.addEventListener('click',function(e){if(e.target===this)closeEditChannel()})
async function saveEditChannel(){
  if(!activeChannel)return
  const name=document.getElementById('edit-ch-name').value.trim()
  const description=document.getElementById('edit-ch-desc').value.trim()
  const avatar_emoji=document.getElementById('edit-ch-emoji').value.trim()||'📢'
  const msgEl=document.getElementById('edit-ch-msg')
  if(!name||name.length<2){msgEl.textContent='Название минимум 2 символа';msgEl.className='auth-msg err';return}
  msgEl.textContent='Сохраняем...';msgEl.className='auth-msg'
  const{error}=await db.from('forever_channels').update({name,description:description||null,avatar_emoji}).eq('id',activeChannel.id)
  if(error){msgEl.textContent=error.message;msgEl.className='auth-msg err';return}
  // Update local state
  activeChannel={...activeChannel,name,description,avatar_emoji}
  allChannels=allChannels.map(c=>c.id===activeChannel.id?activeChannel:c)
  // Update header
  document.getElementById('cv-av').textContent=avatar_emoji
  document.getElementById('cv-name').textContent=name
  const descEl=document.getElementById('cv-desc')
  if(descEl){descEl.textContent=description||'';descEl.style.display=description?'block':'none'}
  closeEditChannel()
  toast('Канал обновлён ✓')
  await loadFeed()
  await loadContacts()
}

// ── DELETE OWN CHANNEL ───────────────────────────────────────────
async function deleteMyChannel(){
  if(!activeChannel)return
  const ch=activeChannel
  if(ch.owner_id!==currentUser.id){toast('Только владелец может удалить канал');return}
  if(!confirm(`Удалить канал «${ch.name}»? Все сообщения будут удалены. Это необратимо!`))return

  // Delete messages, members, then channel
  const{error:e1}=await db.from('forever_channel_messages').delete().eq('channel_id',ch.id)
  if(e1){toast('Ошибка удаления сообщений: '+e1.message,true);return}
  const{error:e2}=await db.from('forever_channel_members').delete().eq('channel_id',ch.id)
  if(e2){toast('Ошибка удаления участников: '+e2.message,true);return}
  const{error:e3}=await db.from('forever_channels').delete().eq('id',ch.id)
  if(e3){toast('Ошибка удаления канала: '+e3.message,true);return}

  toast('🗑 Канал «'+ch.name+'» удалён')
  closeChannelView()
  await loadFeed()
  await loadContacts()
}

// ── VIEW CONTACT PROFILE ─────────────────────────────────────────
async function viewContactProfile(){
  if(!activeChat)return
  // Always fetch fresh from DB — cache may be stale
  const{data:contact}=await db.from('forever_profiles').select('*').eq('id',activeChat.id).single()
  if(!contact)return
  currentViewedProfile=contact

  document.getElementById('pm-av').textContent=contact.avatar_emoji||'👤'
  document.getElementById('pm-name').innerHTML=(contact.display_name||contact.username)+roleBadge(contact.role)
  document.getElementById('pm-nick').textContent='@'+contact.username
  document.getElementById('pm-status').textContent=contact.status_text||''

  // Friends count
  const{count:fc1}=await db.from('forever_contacts').select('*',{count:'exact',head:true}).eq('user_id',contact.id).eq('status','accepted')
  const{count:fc2}=await db.from('forever_contacts').select('*',{count:'exact',head:true}).eq('contact_id',contact.id).eq('status','accepted')
  document.getElementById('pm-friends').textContent=(fc1||0)+(fc2||0)

  // Days since registration
  const days=Math.floor((Date.now()-new Date(contact.created_at).getTime())/(86400000))
  document.getElementById('pm-since').textContent=days

  const bioEl=document.getElementById('pm-bio')
  if(contact.bio){bioEl.textContent=contact.bio;bioEl.style.display='block'}
  else bioEl.style.display='none'

  // Show admin section for creator/admin viewing others (not own profile)
  const adminSection=document.getElementById('pm-admin-section')
  const isAdminUser = myProfile.role==='creator'||myProfile.role==='admin'
  if(adminSection && isAdminUser && contact.id!==currentUser.id){
    adminSection.style.display='block'
    document.getElementById('pm-ban-reason').value=''
    const isBanned=contact.is_banned
    const banBtn=document.getElementById('pm-ban-area').querySelector('button:first-child')
    const unbanBtn=document.getElementById('pm-unban-btn')
    if(banBtn)banBtn.style.display=isBanned?'none':'flex'
    if(unbanBtn)unbanBtn.style.display=isBanned?'flex':'none'
  } else if(adminSection){
    adminSection.style.display='none'
  }
  document.getElementById('profile-modal').classList.remove('hidden')
}

// ── PINNED CHATS ──────────────────────────────────────────────────
function getPinnedChats(){try{return JSON.parse(localStorage.getItem('fv_pins')||'[]')}catch(e){return[]}}
function savePinnedChats(arr){localStorage.setItem('fv_pins',JSON.stringify(arr))}
function togglePinChat(e,id){
  e.stopPropagation()
  const pins=getPinnedChats()
  const idx=pins.indexOf(id)
  if(idx>-1)pins.splice(idx,1); else pins.push(id)
  savePinnedChats(pins)
  loadContacts()
}

async function openChannelFromContacts(channelId){
  // Always fetch fresh from DB to avoid stale allChannels
  let ch=allChannels.find(c=>c.id===channelId||c.id===+channelId)
  if(!ch){
    const{data}=await db.from('forever_channels').select('*').eq('id',channelId).single()
    if(!data){toast('Канал не найден');return}
    ch=data
    // merge into allChannels
    allChannels=[...allChannels.filter(c=>c.id!==ch.id),ch]
  }
  openChannelView(ch.id)
}

async function sendChannelMessage(){
  const input=document.getElementById('cv-input')
  if(!input||!activeChannel)return
  const content=input.value.trim()
  if(!content)return
  input.value=''; input.style.height=''
  const{error}=await db.from('forever_channel_messages').insert({channel_id:activeChannel.id,sender_id:currentUser.id,content})
  if(error){toast('Ошибка: '+error.message);return}
  await loadChannelMessages(activeChannel.id)
}
function handleChannelKey(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChannelMessage()}}

// ── TITLE BADGE ──────────────────────────────────────────────────
function updateTitleBadge(){
  const total=Object.values(unreadMap).reduce((a,b)=>a+b,0)
  document.title=total>0?`(${total}) Forever — RKC Studio`:'Forever — RKC Studio'
  updateBottomNavUnread(total)
}

// ── GROUPS ────────────────────────────────────────────────────────
let myGroups=[], activeGroup=null, groupChatSession=0

async function loadGroups(){
  const{data:memberships}=await db.from('forever_group_members').select('group_id').eq('user_id',currentUser.id)
  const{data:owned}=await db.from('forever_groups').select('*').eq('owner_id',currentUser.id)
  const memIds=(memberships||[]).map(m=>m.group_id)
  let groups=[]
  if(memIds.length){
    const{data:memGroups}=await db.from('forever_groups').select('*').in('id',memIds)
    groups=[...(memGroups||[])]
  }
  if(owned)owned.forEach(g=>{if(!groups.find(x=>x.id===g.id))groups.push(g)})
  myGroups=groups
}

function closeModal(id){document.getElementById(id).classList.add('hidden')}

function openCreateGroup(){
  document.getElementById('cg-name').value=''
  document.getElementById('cg-emoji').value=''
  document.getElementById('cg-desc').value=''
  document.getElementById('cg-msg').textContent=''
  document.getElementById('modal-create-group').classList.remove('hidden')
}

async function createGroup(){
  const name=document.getElementById('cg-name').value.trim()
  const emoji=document.getElementById('cg-emoji').value.trim()||'👥'
  const desc=document.getElementById('cg-desc').value.trim()
  const msg=document.getElementById('cg-msg')
  if(!name){msg.textContent='Введи название';msg.style.color='var(--red)';return}
  msg.textContent='Создаём...';msg.style.color='var(--muted)'
  const{data:group,error}=await db.from('forever_groups').insert({
    name,avatar_emoji:emoji,description:desc||null,owner_id:currentUser.id
  }).select().single()
  if(error){msg.textContent='Ошибка: '+error.message;msg.style.color='var(--red)';return}
  await db.from('forever_group_members').insert({group_id:group.id,user_id:currentUser.id})
  closeModal('modal-create-group')
  toast('👥 Группа создана!')
  await loadContacts()
  openGroupView(group.id)
}

async function openGroupView(groupId){
  const group=myGroups.find(g=>g.id===groupId)
  if(!group)return
  activeGroup=group
  activeChat=null; activeChannel=null
  document.getElementById('active-chat').classList.remove('show')
  document.getElementById('channel-view').classList.remove('show')
  document.getElementById('group-view').classList.add('show')
  document.getElementById('no-chat').style.display='none'
  document.getElementById('gv-av').textContent=group.avatar_emoji||'👥'
  document.getElementById('gv-name').textContent=group.name
  const{data:members}=await db.from('forever_group_members').select('*',{count:'exact'}).eq('group_id',groupId)
  document.getElementById('gv-meta').textContent=`${members?.length||0} участников`
  document.getElementById('gv-leave-btn').style.display=group.owner_id===currentUser.id?'none':''
  document.getElementById('gv-invite-btn').style.display=''
  await loadGroupMessages()
  if(isMobile()){
    document.getElementById('sidebar').classList.remove('mobile-visible')
    document.getElementById('group-view').style.cssText='position:fixed;inset:0;top:44px;bottom:56px;z-index:50;background:var(--bg);display:flex;flex-direction:column'
  }
}

async function loadGroupMessages(){
  if(!activeGroup)return
  const sess=++groupChatSession
  const{data}=await db.from('forever_group_messages')
    .select('*').eq('group_id',activeGroup.id)
    .order('created_at',{ascending:true}).limit(60)
  if(sess!==groupChatSession)return
  const el=document.getElementById('gv-messages')
  el.innerHTML=''
  if(!data||!data.length){el.innerHTML='<div class="list-empty" style="padding:20px">Сообщений пока нет. Напиши первым!</div>';return}
  // Load sender profiles
  const senderIds=[...new Set(data.map(m=>m.sender_id))]
  const{data:profiles}=await db.from('forever_profiles').select('id,username,display_name,avatar_emoji').in('id',senderIds)
  const profMap={}; profiles?.forEach(p=>profMap[p.id]=p)
  data.forEach(m=>appendGroupMsg(m,profMap[m.sender_id]))
  el.scrollTop=el.scrollHeight
  loadReactionsForMessages('group')
}

let lastGroupMsgId=0
function appendGroupMsg(msg,profile){
  const el=document.getElementById('gv-messages')
  if(!el)return
  const isMine=msg.sender_id===currentUser.id
  const name=profile?.display_name||profile?.username||'?'
  const av=profile?.avatar_emoji||'👤'
  const time=new Date(msg.created_at).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})
  const div=document.createElement('div')
  div.className='channel-msg'+(isMine?' own':'')
  div.id='gmsg-'+msg.id
  div.innerHTML=`
    ${!isMine?`<div style="font-size:9px;color:var(--accent);margin-bottom:2px;padding-left:4px">${av} ${esc(name)}</div>`:''}
    <div class="msg-bubble-wrap" style="position:relative">
      <div class="msg-bubble">${linkify(esc(msg.content))}</div>
      <button class="add-reaction-btn" onclick="showReactionPicker(event,${msg.id},'group')">😊</button>
    </div>
    <div class="msg-time">${time}</div>
    <div class="reactions-row" id="reactions-group-${msg.id}"></div>`
  el.appendChild(div)
  if(msg.id>lastGroupMsgId)lastGroupMsgId=msg.id
}

async function sendGroupMessage(){
  if(!activeGroup)return
  const inp=document.getElementById('gv-input')
  const content=inp.value.trim()
  if(!content)return
  inp.value=''; inp.style.height=''
  const{data,error}=await db.from('forever_group_messages').insert({
    group_id:activeGroup.id,sender_id:currentUser.id,content
  }).select().single()
  if(!error&&data){
    appendGroupMsg(data,myProfile)
    document.getElementById('gv-messages').scrollTop=99999
  }
}

function handleGroupKey(e){
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendGroupMessage()}
}

function closeGroupView(){
  activeGroup=null
  groupChatSession=0
  document.getElementById('group-view').classList.remove('show')
  document.getElementById('group-view').style.cssText=''
  document.getElementById('no-chat').style.display=''
  if(isMobile())mobileNav(mobileCurrentTab||'chats')
}

async function openGroupInvite(){
  const username=prompt('Введи username игрока:')
  if(!username)return
  const{data:profile}=await db.from('forever_profiles').select('id,username').eq('username',username.trim()).single()
  if(!profile){toast('Пользователь не найден',true);return}
  const{error}=await db.from('forever_group_members').insert({group_id:activeGroup.id,user_id:profile.id})
  if(error&&error.code==='23505'){toast('Уже в группе');return}
  if(error){toast('Ошибка: '+error.message);return}
  toast('✅ '+profile.username+' добавлен в группу!')
  const{data:members}=await db.from('forever_group_members').select('*',{count:'exact'}).eq('group_id',activeGroup.id)
  document.getElementById('gv-meta').textContent=`${members?.length||0} участников`
}

async function leaveGroup(){
  if(!activeGroup)return
  if(!confirm('Покинуть группу?'))return
  await db.from('forever_group_members').delete().eq('group_id',activeGroup.id).eq('user_id',currentUser.id)
  closeGroupView()
  toast('Вы покинули группу')
  await loadContacts()
}

// ── REACTIONS ─────────────────────────────────────────────────────
const REACTION_EMOJIS=['❤️','😂','👍','🔥','😮','💀','🐀']
let reactionPickerEl=null

function showReactionPicker(e,msgId,msgType){
  e.stopPropagation()
  closeReactionPicker()
  const picker=document.createElement('div')
  picker.className='reaction-picker'
  picker.id='reaction-picker'
  REACTION_EMOJIS.forEach(emoji=>{
    const span=document.createElement('span')
    span.textContent=emoji
    span.onclick=(ev)=>{ev.stopPropagation();toggleReaction(msgId,msgType,emoji);closeReactionPicker()}
    picker.appendChild(span)
  })
  const rect=e.target.getBoundingClientRect()
  picker.style.cssText=`position:fixed;top:${rect.top-60}px;left:${Math.min(rect.left,window.innerWidth-200)}px;z-index:300`
  document.body.appendChild(picker)
  reactionPickerEl=picker
  setTimeout(()=>document.addEventListener('click',closeReactionPicker,{once:true}),50)
}

function closeReactionPicker(){
  if(reactionPickerEl){reactionPickerEl.remove();reactionPickerEl=null}
}

async function toggleReaction(msgId,msgType,emoji){
  // Check if already reacted
  const{data:existing}=await db.from('forever_reactions').select('id').eq('message_id',msgId).eq('message_type',msgType).eq('user_id',currentUser.id).eq('emoji',emoji).maybeSingle()
  if(existing){
    await db.from('forever_reactions').delete().eq('id',existing.id)
  } else {
    await db.from('forever_reactions').insert({message_id:msgId,message_type:msgType,user_id:currentUser.id,emoji})
  }
  await renderReactions(msgId,msgType)
}

async function renderReactions(msgId,msgType){
  const{data}=await db.from('forever_reactions').select('emoji,user_id').eq('message_id',msgId).eq('message_type',msgType)
  const el=document.getElementById(`reactions-${msgType}-${msgId}`)
  if(!el)return
  const counts={}
  const mine=new Set()
  data?.forEach(r=>{counts[r.emoji]=(counts[r.emoji]||0)+1;if(r.user_id===currentUser.id)mine.add(r.emoji)})
  if(!Object.keys(counts).length){el.innerHTML='';return}
  el.innerHTML=Object.entries(counts).map(([emoji,count])=>`
    <button class="reaction-btn${mine.has(emoji)?' mine':''}" onclick="toggleReaction(${msgId},'${msgType}','${emoji}')">
      ${emoji}<span class="reaction-count">${count}</span>
    </button>`).join('')
}

// Load reactions for visible messages — batch query (no N+1)
async function loadReactionsForMessages(msgType){
  const prefix=`reactions-${msgType}-`
  const els=document.querySelectorAll(`[id^="${prefix}"]`)
  const ids=[...els].map(el=>parseInt(el.id.replace(prefix,''))).filter(Boolean)
  if(!ids.length)return
  const{data}=await db.from('forever_reactions').select('message_id,emoji,user_id').eq('message_type',msgType).in('message_id',ids)
  if(!data)return
  // Group by message_id
  const byMsg={}
  data.forEach(r=>{if(!byMsg[r.message_id])byMsg[r.message_id]=[];byMsg[r.message_id].push(r)})
  ids.forEach(msgId=>{
    const el=document.getElementById(`reactions-${msgType}-${msgId}`)
    if(!el)return
    const reactions=byMsg[msgId]||[]
    const counts={},mine=new Set()
    reactions.forEach(r=>{counts[r.emoji]=(counts[r.emoji]||0)+1;if(r.user_id===currentUser.id)mine.add(r.emoji)})
    if(!Object.keys(counts).length){el.innerHTML='';return}
    el.innerHTML=Object.entries(counts).map(([emoji,count])=>`<button class="reaction-btn${mine.has(emoji)?' mine':''}" onclick="toggleReaction(${msgId},'${msgType}','${emoji}')">${emoji}<span class="reaction-count">${count}</span></button>`).join('')
  })
}

// ── BOOT ──────────────────────────────────────────────────────────
;(async()=>{
  const{data:{session}}=await db.auth.getSession()
  if(session?.user){
    currentUser=session.user
    const{data:profile}=await db.from('forever_profiles').select('*').eq('id',currentUser.id).single()
    if(!profile){document.getElementById('auth-screen').classList.add('hidden');document.getElementById('setup-screen').classList.remove('hidden')}
    else{
      const{data:arProfile}=await db.from('profiles').select('is_admin').eq('id',currentUser.id).single()
      if(arProfile?.is_admin && !profile.role) profile.role='admin'
      myProfile=profile;startApp()
    }
  }
})()
