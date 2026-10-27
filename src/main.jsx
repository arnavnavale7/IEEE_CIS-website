import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { club, team, events, gallery } from './content';
import './style.css';
import './identity.css';
import './motion.css';
import { TopicExplorer, BackToTop } from './interactions';
import './interactions.css';
import './contact.css';
import './type.css';
import { BinaryHeadline } from './BinaryHeadline';
import { gsap, ScrollTrigger, useGSAP, motionOK, finePointer, prefersMotion, reveal, decode, useSiteMotion, useScrolledHeader } from './motion';

const links = [['/', 'Home'], ['/past-events', 'Past events'], ['/upcoming-events', 'Upcoming events'], ['/contact', 'Contact us']];
const Arrow = () => <span aria-hidden="true">↗</span>;
function Logo(){return <img className="logo" src="/images/club-logo-sticker.png" alt="VIT Pune IEEE Computational Intelligence Society"/>}
function SocialIcon({name}){return name==='Instagram'?<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>:<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.3h.04c.39-.74 1.36-1.53 2.79-1.53 2.98 0 3.58 1.96 3.58 4.51v5.27Z"/></svg>}
function NavbarSocials(){return <div className="header-socials" aria-label="Social media">{[['Instagram',club.instagram],['LinkedIn',club.linkedin]].filter(([,url])=>url).map(([name,url])=><a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={`IEEE CIS on ${name}`} title={name}><SocialIcon name={name}/></a>)}</div>}
function App(){
 const [menu,setMenu]=useState(false); const {pathname,hash}=useLocation(); const main=useRef(null);
 useEffect(()=>{if(!menu)return;const close=e=>{if(e.key==='Escape'){setMenu(false);document.querySelector('.menu-toggle')?.focus()}};document.addEventListener('keydown',close);return()=>document.removeEventListener('keydown',close)},[menu]);
 // Layout effect so the scroll position resets before page motion measures scroll triggers.
 useLayoutEffect(()=>{setMenu(false);if(hash){requestAnimationFrame(()=>document.getElementById(hash.slice(1))?.scrollIntoView())}else{window.scrollTo(0,0);} const title=links.find(([p])=>p===pathname)?.[1] || 'Event details'; document.title=`${title} · IEEE CIS VIT Pune`;},[pathname,hash]);
 useSiteMotion(main,pathname); useScrolledHeader();
 return <><a className="skip" href="#main">Skip to content</a><header><div className="container header-inner"><Link to="/" aria-label="IEEE CIS home"><Logo/></Link><button className="menu-toggle" aria-expanded={menu} aria-controls="main-nav" onClick={()=>setMenu(!menu)}>{menu?'Close ✕':'Menu ☰'}</button><nav id="main-nav" className={menu?'open':''} aria-label="Main navigation">{links.map(([to,label])=><NavLink key={to} end={to==='/'} to={to}>{label}</NavLink>)}<NavbarSocials/></nav><a className="header-team" href="/#team">Meet the team <Arrow/></a></div></header><main id="main" ref={main}><Routes><Route path="/" element={<Home/>}/><Route path="/past-events" element={<EventsPage status="past"/>}/><Route path="/upcoming-events" element={<EventsPage status="upcoming"/>}/><Route path="/events/:id" element={<EventDetail/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<section className="container section"><h1>Page not found.</h1><Link className="button" to="/">Back to home</Link></section>}/></Routes></main><Footer/><BackToTop/></>;
}
function Eyebrow({children}){return <p className="eyebrow"><span/> {children}</p>}
function PurposeIcon({kind}){
 const paths={learn:<><path d="m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18"/></>,explore:<><rect x="5" y="5" width="14" height="14" rx="3"/><path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4"/><rect x="9" y="9" width="6" height="6" rx="1"/></>,connect:<><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="19" r="3"/><path d="M8 6h8M6.5 9l4 7m7-7-4 7"/></>};
 return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}
function Home(){
 return <>
 <section className="chapter-hero container">
  <BinaryHeadline className="hero-editorial">
   <div className="hero-title"><h1><span className="headline-top">LEAD <span className="headline-divider" aria-hidden="true">/</span> IMPACT</span><em>INNOVATE<span className="heading-dot">.</span></em></h1><p className="editorial-caption">Different minds. Shared possibilities.</p></div>
   <div className="hero-note"><p>We’re a community of curious minds exploring computational intelligence, sharing ideas and learning by doing.</p><div className="actions"><Link className="button" to="/past-events">Discover the chapter <Arrow/></Link><a className="text-link" href="#about">Our story <span aria-hidden="true">↓</span></a></div></div>
  </BinaryHeadline>
  <TopicExplorer/>
 </section>
 <section id="about" className="container chapter-about section">
  <div className="chapter-about-content"><Eyebrow>OUR PURPOSE</Eyebrow><h2>Intelligence is a field.<br/><em>Curiosity is a starting point.</em></h2><p className="about-intro">IEEE Computational Intelligence Society at Vishwakarma Institute of Technology, Pune brings students together to explore what comes next.</p><p>We make room for questions, experiments and new perspectives. Through conversations and shared learning, we turn an interest in technology into a community.</p></div>
  <div className="purpose-cards">{[['learn','Learn together','Exchange ideas and discover computational intelligence through shared experiences.'],['explore','Explore possibilities','Ask questions, experiment, and see where your curiosity leads.'],['connect','Make connections','Meet the people who will challenge your thinking and build alongside you.']].map(([icon,title,text])=><article className="purpose-card" key={icon}><div className="purpose-icon"><PurposeIcon kind={icon}/></div><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
 </section>
 <TeamCarousel/>
 <section className="container chapter-next section"><div><Eyebrow>THE NEXT CHAPTER</Eyebrow><h2>Stay curious.<br/><em>Stay connected.</em></h2></div><div><p>There’s always another idea to explore. Find out what’s coming up, or start a conversation with the chapter.</p><div className="actions"><Link className="button" to="/upcoming-events">Upcoming events <Arrow/></Link><Link className="text-link" to="/contact">Say hello <Arrow/></Link></div></div></section>
 </>;
}
function TeamCarousel(){
 const [index,setIndex]=useState(0),[selection,setSelection]=useState(0),[hidden,setHidden]=useState(document.hidden),[reduced,setReduced]=useState(false); const touch=useRef(null);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'); const sync=()=>setReduced(q.matches);const visibility=()=>setHidden(document.hidden); sync();q.addEventListener('change',sync);document.addEventListener('visibilitychange',visibility);return()=>{q.removeEventListener('change',sync);document.removeEventListener('visibilitychange',visibility)}},[]);
 const stopped=hidden||reduced;
 useEffect(()=>{if(stopped)return; const timer=setInterval(()=>setIndex(i=>(i+1)%team.length),3500);return()=>clearInterval(timer)},[stopped,index,selection]);
 const selectSlide=i=>{setIndex(i);setSelection(n=>n+1)};
 const step=n=>{setIndex(i=>(i+n+team.length)%team.length);setSelection(v=>v+1)};
 return <section id="team" className="team-section" aria-label="Core team carousel" aria-roledescription="carousel"><div className="container"><div className="section-heading"><div><Eyebrow>THE PEOPLE BEHIND IT</Eyebrow><h2>Meet our core team.</h2></div><span className="preview-label">The people behind our chapter</span></div><div className="carousel-window" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{if(touch.current!==null){const delta=e.changedTouches[0].clientX-touch.current;if(Math.abs(delta)>50)step(delta<0?1:-1);touch.current=null}}}><div className="carousel-track staged-carousel">{team.map((member,i)=><article className="team-slide" key={i} aria-hidden={i!==index} aria-roledescription="slide" aria-label={`${i+1} of ${team.length}`}><div className="portrait">{member.image?<img src={member.image} alt={`${member.name}, ${member.role}`} width="600" height="800" loading={i === 0 ? "eager" : "lazy"}/>:<><svg viewBox="0 0 260 280" aria-hidden="true"><circle cx="130" cy="90" r="50"/><path d="M25 280v-35a105 105 0 0 1 210 0v35Z"/></svg><span>PHOTO COMING SOON</span></>}</div><div className="member-copy"><h3>{member.name}</h3><span className="role">{member.role}</span>{member.bio && <p>{member.bio}</p>}<span className="member-caption">IEEE CIS · VIT Pune</span></div></article>)}</div></div><div className="carousel-controls"><div className="dots" role="group" aria-label="Choose a core team member; use left and right arrow keys" onKeyDown={e=>{const current=Array.from(e.currentTarget.children).indexOf(e.target);if(current<0)return;let next;if(e.key==='ArrowRight')next=(current+1)%team.length;if(e.key==='ArrowLeft')next=(current+team.length-1)%team.length;if(e.key==='Home')next=0;if(e.key==='End')next=team.length-1;if(next===undefined)return;e.preventDefault();selectSlide(next);e.currentTarget.children[next]?.focus()}}>{team.map((member,i)=><button key={i} title={member.name} className={index===i?'selected':''} aria-label={`Show team member ${i+1}`} aria-pressed={index===i} onClick={()=>selectSlide(i)}/>)}</div></div></div></section>
}
function EventArt({event}){return event.image?<img className="event-art" src={event.image} alt={event.title} loading="lazy" width="1600" height="1067"/>:<div className={`event-art art-${event.status}`} aria-hidden="true"><span>{event.category}</span><div className="art-symbol">{event.status==='past'?'↗':'✳'}</div><small>IEEE CIS / VIT PUNE</small></div>}
function EventCard({event,wide=false}){if(!event)return null;return <article className={`event-card ${wide?'wide':''}`}><Link className="event-image-link" to={`/events/${event.id}`} aria-label={`Explore ${event.title}`}><EventArt event={event}/><span className="event-image-hint">Explore event ↗</span></Link><div className="event-copy"><div className="event-meta"><span>{event.category}</span>{event.sample&&<span className="sample">Sample event</span>}</div><h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3><p>{event.description}</p><div className="event-date">{event.date||'Date to be announced'} <span>·</span> {event.venue}</div></div></article>}
function EventsPage({status}){
 const list=events.filter(e=>e.status===status);
 return <><section className="page-heading container centered"><Eyebrow>{status==='past'?'OUR CHAPTER IN ACTION':'LOOKING AHEAD'}</Eyebrow><h1>{status==='past'?'Moments worth sharing.':'More possibilities await.'}</h1><p className="lead">{status==='past'?'The people, conversations and experiences that shape our community.':'New ideas. New connections. Your next opportunity to be part of it.'}</p></section><section className="container events-section">{list.length?<div className="event-grid">{list.map(e=><EventCard event={e} key={e.id} wide={list.length===1}/>)}</div>:<div className="empty-state"><span className="empty-symbol" aria-hidden="true">↗</span><h2>Our next event is on the way.</h2><p>There are no upcoming events announced yet. When an event is confirmed, you’ll find the date, venue, fees and registration link right here.</p><Link className="button" to="/past-events">Look back at Techshift <Arrow/></Link></div>}</section></>;
}
function Gallery({photos,expandable=false}){
 const [expanded,setExpanded]=useState(false); const galleryId=useId(); const grid=useRef(null);
 const collapsed=expandable&&!expanded&&photos.length>3; const shown=collapsed?photos.slice(0,3):photos;
 const {contextSafe}=useGSAP({scope:grid});
 // Newly shown photos rise in one after another; focus moves to the first of them.
 const showRest=contextSafe(()=>{const fresh=[...grid.current.querySelectorAll('.gallery-thumb')].slice(3);ScrollTrigger.refresh();if(prefersMotion())gsap.from(fresh,{y:30,opacity:0,stagger:0.06,duration:0.8,clearProps:'opacity,transform'});fresh[0]?.focus({preventScroll:true})});
 const showMore=()=>{setExpanded(true);requestAnimationFrame(showRest)};
 const [selected,setSelected]=useState(0); const dialog=useRef(null); const trigger=useRef(null); const strip=useRef(null); const swipe=useRef(null);
 const close=()=>dialog.current.close();
 useEffect(()=>{if(!dialog.current?.open)return;const el=strip.current?.children[selected];if(el)strip.current.scrollTo({left:el.offsetLeft-strip.current.clientWidth/2+el.clientWidth/2,behavior:'instant'})},[selected]);
 useEffect(()=>{const el=dialog.current; const restore=()=>{document.body.style.overflow='';trigger.current?.focus()};el.addEventListener('close',restore);return()=>{el.removeEventListener('close',restore);document.body.style.overflow=''}},[]);
 const open=(i,e)=>{trigger.current=e.currentTarget;setSelected(i);dialog.current.showModal();document.body.style.overflow='hidden'};
 const step=delta=>setSelected(i=>(i+delta+photos.length)%photos.length);
 return <><div className="photo-grid" id={galleryId} ref={grid}>{shown.map((photo,i)=><button className="gallery-thumb" onClick={e=>open(i,e)} key={photo.src} aria-label={`Enlarge photo: ${photo.alt}`}><img src={photo.src} alt={photo.alt} loading="lazy" width="1600" height="1067"/><span aria-hidden="true">↗</span></button>)}</div>{collapsed&&<div className="gallery-reveal"><div className="gallery-preview-row" aria-hidden="true">{photos.slice(3,6).map(photo=><img key={photo.src} src={photo.src} alt="" loading="lazy" width="1600" height="1067"/>)}</div><div className="gallery-reveal-action"><button className="button" type="button" aria-expanded={false} aria-controls={galleryId} onClick={showMore}>Show more photos <span aria-hidden="true">↓</span></button><p>{photos.length-3} more photos from the day</p></div></div>}<dialog ref={dialog} className="lightbox" aria-label="Event photo viewer" onClick={e=>{if(e.target===e.currentTarget)close()}} onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1)}if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}}}><div className="lightbox-inner"><button className="lightbox-close" onClick={close} autoFocus aria-label="Close photo viewer">✕</button><img key={photos[selected].src} src={photos[selected].src} alt={photos[selected].alt} onTouchStart={e=>{swipe.current={x:e.touches[0].clientX,y:e.touches[0].clientY}}} onTouchEnd={e=>{if(!swipe.current)return;const dx=e.changedTouches[0].clientX-swipe.current.x,dy=e.changedTouches[0].clientY-swipe.current.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);swipe.current=null}}/><div className="lightbox-controls"><button onClick={()=>step(-1)} aria-label="Previous photo">←</button><p aria-live="polite" aria-atomic="true">{photos[selected].alt}<span>{selected+1} / {photos.length}</span></p><button onClick={()=>step(1)} aria-label="Next photo">→</button></div><div className="lightbox-thumbnails" ref={strip} role="group" aria-label="Choose a gallery photo">{photos.map((photo,i)=><button key={photo.src} type="button" aria-label={`View photo ${i+1}: ${photo.alt}`} aria-pressed={i===selected} onClick={()=>setSelected(i)}><img src={photo.src} alt="" loading="lazy"/></button>)}</div></div></dialog></>;
}
function EventDetail(){
 const {id}=useParams(); const e=events.find(e=>e.id===id);
 if(!e)return <section className="container section"><h1>Event not found.</h1><Link className="button" to="/past-events">Browse events</Link></section>;
 return <section className="container section"><Link className="text-link" to={e.status==='past'?'/past-events':'/upcoming-events'}>← Back to {e.status==='past'?'past':'upcoming'} events</Link><div className="detail-grid"><div><Eyebrow>{e.category}</Eyebrow><h1>{e.title}</h1><p className="lead">{e.description}</p><h2>About the event</h2><div className="event-about">{(Array.isArray(e.details)?e.details:[e.details]).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div>{e.recapUrl && <a className="text-link" href={e.recapUrl} target="_blank" rel="noopener noreferrer">Read the official LinkedIn recap <Arrow/></a>}{e.highlights&&<ul className="highlights">{e.highlights.map(h=><li key={h}>{h}</li>)}</ul>}</div><aside><EventArt event={e}/><dl>{e.date&&<><dt>Date</dt><dd>{e.date}</dd></>}<dt>Venue</dt><dd>{e.venue}</dd><dt>Status</dt><dd>{e.status==='past'?'Event concluded':'Upcoming'}</dd>{e.status==='upcoming'&&<><dt>Registration fee</dt><dd>{e.fee==null?'To be announced':e.fee===0?'Free':`₹${e.fee}`}</dd></>}</dl>{e.status==='upcoming'&&(e.registrationUrl?<a className="button" href={e.registrationUrl} target="_blank" rel="noopener noreferrer">{e.fee===0?'Register now':'Register & pay'} <Arrow/></a>:<><button className="button" disabled>Registration opens soon</button><p className="small">The registration link will appear here when available.</p></>)}</aside></div>{e.gallery?.length>0&&<div className="detail-gallery"><Eyebrow>THE DAY IN PICTURES</Eyebrow><h2>Inside {e.title}.</h2><Gallery key={e.id} photos={e.gallery} expandable/></div>}</section>;
}
function gmailUrl(subject='IEEE CIS enquiry',body=''){
 return `https://mail.google.com/mail/?${new URLSearchParams({view:'cm',fs:'1',to:club.email,su:subject,body})}`;
}
function mailtoUrl(subject='',body=''){return subject||body?`mailto:${club.email}?${new URLSearchParams({subject,body}).toString().replace(/\+/g,'%20')}`:`mailto:${club.email}`}
async function copyText(text,done,failed){try{await navigator.clipboard.writeText(text);done()}catch{failed()}}
const contactTopics=[['Events','Chapter & event enquiries','Find out more about our activities and how you can be part of them.'],['Collaboration','Collaborations','Bring an idea for a talk, a session or a shared learning opportunity.'],['Feedback','Feedback & suggestions','Help us make the chapter a better place to connect and learn.']];
const contactSubjects=['General enquiry','Events','Collaboration','Feedback'];
const contactFields=['name','email','message'];
function checkMessage(v){
 const errors={};
 if(!v.name.trim())errors.name='Enter your name.';
 if(!v.email.trim())errors.email='Enter an email address we can reply to.';
 else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))errors.email='Check the address. It should look like name@example.com.';
 if(!v.message.trim())errors.message='Write a message before preparing the email.';
 return errors;
}
function Field({id,label,hint,error,counter,textarea,...input}){
 const Tag=textarea?'textarea':'input';
 const describedBy=[hint&&`${id}-hint`,counter&&`${id}-count`,error&&`${id}-error`].filter(Boolean).join(' ')||undefined;
 return <div className={`field${error?' has-error':''}`}><div className="field-head"><label htmlFor={`contact-${id}`}>{label}</label>{hint&&<span className="field-hint" id={`${id}-hint`}>{hint}</span>}</div><Tag id={`contact-${id}`} name={id} aria-invalid={error?true:undefined} aria-describedby={describedBy} {...input}/><div className="field-foot">{error&&<span className="field-error" id={`${id}-error`}>{error}</span>}{counter&&<span className="field-count" id={`${id}-count`}>{counter}</span>}</div></div>;
}
function Contact(){
 const stage=useRef(null),card=useRef(null),address=useRef(null),readyHeading=useRef(null),returning=useRef(false);
 const [values,setValues]=useState({name:'',email:'',subject:'General enquiry',message:''});
 const [touched,setTouched]=useState({}),[tried,setTried]=useState(false),[draft,setDraft]=useState(null);
 const [addressNote,setAddressNote]=useState(''),[draftNote,setDraftNote]=useState('');
 const errors=checkMessage(values); const shown=key=>tried||touched[key]?errors[key]:undefined;
 // Background texture for the hero band: rows of random bits, drawn twice so the drift loops.
 const bits=useMemo(()=>Array.from({length:24},()=>Array.from({length:56},()=>Math.random()<.5?'0':'1').join(' ')).join('\n'),[]);

 const {contextSafe}=useGSAP(()=>{
  const q=gsap.utils.selector(stage); const mm=gsap.matchMedia();
  mm.add(motionOK,()=>{
   const {tween,restore}=decode(address.current.firstChild,{duration:1.5});
   const tl=gsap.timeline({defaults:{ease:'expo.out',duration:1.1}});
   tl.from(q('.contact-band'),{opacity:0,scale:.96,duration:1.3})
    .from(q('.contact-intro .eyebrow'),{y:14,opacity:0,duration:.7},'<0.2')
    .from(q('.contact-title .line>span'),{yPercent:110,opacity:0,stagger:.12},'<0.05')
    .from(q('.contact-intro .lead'),{y:18,opacity:0,duration:.8},'<0.35')
    .from(q('.contact-direct'),{y:18,opacity:0,duration:.8},'<0.1')
    .add(tween,'<0.15')
    .from(q('.contact-card'),{y:70,opacity:0,duration:1.25},0.3)
    .from(q('.contact-steps, .contact-form > *'),{y:16,opacity:0,stagger:.05,duration:.7},0.7);
   const cleanups=[reveal(q('.contact-side > *'),{stagger:.08}),reveal(q('.topic-card'),{y:28,stagger:.1}),reveal(q('.contact-aside > *'),{y:40,stagger:.12})];
   gsap.to(q('.contact-bits'),{yPercent:-50,duration:60,ease:'none',repeat:-1});
   return()=>{restore();cleanups.forEach(fn=>fn?.())};
  });
  // A soft light follows the pointer across the band.
  mm.add(`${motionOK} and ${finePointer}`,()=>{
   const band=q('.contact-band')[0],glow=q('.contact-glow')[0];
   gsap.set(glow,{left:0,top:0,xPercent:-50,yPercent:-50,x:band.offsetWidth*.72,y:band.offsetHeight*.3});
   const xTo=gsap.quickTo(glow,'x',{duration:1,ease:'power3'}),yTo=gsap.quickTo(glow,'y',{duration:1,ease:'power3'});
   const move=e=>{const r=band.getBoundingClientRect();xTo(e.clientX-r.left);yTo(e.clientY-r.top)};
   const host=stage.current; host.addEventListener('pointermove',move);
   return()=>host.removeEventListener('pointermove',move);
  });
 },{scope:stage});

 // Step changes: focus the new step, and in motion mode let its parts arrive in order.
 useGSAP(()=>{
  if(draft){readyHeading.current?.focus();if(prefersMotion()){gsap.from('.contact-ready > *',{y:18,opacity:0,stagger:.06,duration:.7,ease:'expo.out'});gsap.from('.ready-mark',{scale:0,rotation:-40,duration:.9,ease:'back.out(2.4)'})}return}
  if(!returning.current)return;
  returning.current=false; card.current.querySelector('#contact-message')?.focus();
  if(prefersMotion())gsap.from('.contact-form > *',{y:14,opacity:0,stagger:.04,duration:.6,ease:'expo.out'});
 },{scope:card,dependencies:[draft]});

 const update=e=>{const {name,value}=e.target;setValues(v=>({...v,[name]:value}))};
 const leave=e=>{const {name}=e.target;if(e.target.value)setTouched(t=>({...t,[name]:true}))};
 const submit=contextSafe(e=>{
  e.preventDefault(); setTried(true);
  const first=contactFields.find(key=>errors[key]);
  if(first){const input=card.current.querySelector(`#contact-${first}`);input.focus();if(prefersMotion())gsap.to(input.closest('.field'),{keyframes:{x:[0,-9,8,-5,3,0]},duration:.45,ease:'none',clearProps:'transform'});return}
  setDraftNote('');
  setDraft({subject:`IEEE CIS enquiry: ${values.subject}`,body:`Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`});
 });
 const edit=()=>{returning.current=true;setDraft(null)};
 const pickTopic=contextSafe(subject=>{
  setValues(v=>({...v,subject}));
  const top=card.current.getBoundingClientRect().top;
  if(top<0||top>innerHeight*.55)card.current.scrollIntoView({behavior:prefersMotion()?'smooth':'auto',block:'start'});
  if(draft){edit();return}
  card.current.querySelector('#contact-message')?.focus({preventScroll:true});
  requestAnimationFrame(contextSafe(()=>{const chip=card.current?.querySelector(`input[value="${subject}"] + span`);if(chip&&prefersMotion())gsap.fromTo(chip,{scale:1},{scale:1.1,duration:.18,yoyo:true,repeat:1,ease:'power2.out'})}));
 });
 const copyAddress=()=>copyText(club.email,()=>setAddressNote('Address copied.'),()=>setAddressNote(`Your browser blocked copying. The address is ${club.email}.`));
 const copyDraft=()=>copyText(`To: ${club.email}\nSubject: ${draft.subject}\n\n${draft.body}`,()=>setDraftNote('Message copied. Paste it into any email app.'),()=>setDraftNote('Your browser blocked copying. Use Open Gmail instead.'));

 return <>
 <section className="contact-stage container" ref={stage} aria-labelledby="contact-title">
  <div className="contact-band" aria-hidden="true"><pre className="contact-bits">{bits}{'\n'}{bits}</pre><span className="contact-glow"/></div>
  <div className="contact-intro">
   <Eyebrow>CONTACT US</Eyebrow>
   <h1 className="contact-title" id="contact-title"><span className="line"><span>Good things start</span></span> <span className="line"><span>with a conversation.</span></span></h1>
   <p className="lead">Ask about an event, suggest a collaboration or share an idea for the chapter.</p>
   <div className="contact-direct">
    <span className="contact-direct-label">Or write to us directly</span>
    <a className="contact-address" href={gmailUrl()} target="_blank" rel="noopener noreferrer" aria-label={`${club.email}, opens Gmail in a new tab`}><span ref={address}>{club.email}</span><Arrow/></a>
    <div className="contact-direct-actions"><button type="button" onClick={copyAddress}>Copy address</button><a href={mailtoUrl()}>Open in mail app</a></div>
    <p className="contact-note" role="status">{addressNote}</p>
   </div>
  </div>
  <div className="contact-card" ref={card}>
   <ol className="contact-steps" data-step={draft?2:1}><li aria-current={draft?undefined:'step'}><span aria-hidden="true">1</span>Write your message</li><li aria-current={draft?'step':undefined}><span aria-hidden="true">2</span>Send it from your inbox</li></ol>
   {draft?<div className="contact-ready">
    <span className="ready-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></span>
    <h2 tabIndex={-1} ref={readyHeading}>Your email is ready</h2>
    <p>Open it in Gmail or your mail app, check it, then press Send.</p>
    <dl className="ready-summary"><div><dt>To</dt><dd>{club.email}</dd></div><div><dt>Subject</dt><dd>{draft.subject}</dd></div></dl>
    <div className="ready-actions"><a className="button" href={gmailUrl(draft.subject,draft.body)} target="_blank" rel="noopener noreferrer">Open Gmail <Arrow/></a><a className="ready-secondary" href={mailtoUrl(draft.subject,draft.body)}>Use mail app</a><button type="button" className="ready-secondary" onClick={copyDraft}>Copy message</button></div>
    <p className="contact-help">Gmail opens in a new tab and may ask you to sign in. Use mail app needs an email app set up on this device.</p>
    <p className="contact-note" role="status">{draftNote}</p>
    <button type="button" className="ready-back" onClick={edit}><span aria-hidden="true">←</span> Edit message</button>
   </div>:<form className="contact-form" noValidate onSubmit={submit}>
    <h2>Send us a message</h2>
    <p className="contact-help">This form prepares an email for you. You send it yourself from Gmail or your mail app.</p>
    <div className="field-row">
     <Field id="name" label="Name" autoComplete="name" maxLength={100} value={values.name} onChange={update} onBlur={leave} error={shown('name')}/>
     <Field id="email" label="Email" hint="So we can reply" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={update} onBlur={leave} error={shown('email')}/>
    </div>
    <fieldset className="subject-chips"><legend>Topic</legend><div>{contactSubjects.map(s=><label key={s}><input type="radio" name="subject" value={s} checked={values.subject===s} onChange={update}/><span>{s}</span></label>)}</div></fieldset>
    <Field id="message" label="Message" textarea rows={6} maxLength={3000} placeholder="What would you like to ask or share?" value={values.message} onChange={update} onBlur={leave} error={shown('message')} counter={`${values.message.length} / 3000`}/>
    <button className="button contact-submit" type="submit">Prepare email <Arrow/></button>
   </form>}
  </div>
  <div className="contact-side">
   <h2>What’s it about?</h2>
   <p>Pick a topic and it goes straight into your message.</p>
   <div className="topic-cards">{contactTopics.map(([subject,title,text])=><button type="button" key={subject} className="topic-card" aria-pressed={values.subject===subject} onClick={()=>pickTopic(subject)}><span className="topic-card-title">{title}</span><span className="topic-card-text">{text}</span><span className="topic-card-cue" aria-hidden="true">{values.subject===subject?'Selected':'Use this topic'}</span></button>)}</div>
  </div>
  <div className="contact-aside">
   <div className="contact-follow"><h3>Follow the chapter</h3><div className="follow-links">{[['Instagram',club.instagram,'@ieee_cisvitpune'],['LinkedIn',club.linkedin,'Company page']].filter(([,url])=>url).map(([name,url,handle])=><a key={name} href={url} target="_blank" rel="noopener noreferrer"><SocialIcon name={name}/><span><strong>{name}</strong><small>{handle}</small></span><Arrow/></a>)}</div></div>
   <div className="contact-location" aria-labelledby="find-us"><div className="contact-location-copy"><h2 id="find-us">Our campus</h2><p><strong>IEEE CIS · VIT Pune</strong><br/>{club.address}</p><a className="text-link" href={club.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps <Arrow/></a></div><div className="contact-map"><iframe title="Vishwakarma Institute of Technology Pune location" src="https://www.google.com/maps?q=Vishwakarma%20Institute%20of%20Technology%20Pune&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div></div>
  </div>
 </section>
 </>;
}
function Socials({full=false}){return <div className={full?'social-list':'socials'}>{[['Instagram',club.instagram],['LinkedIn',club.linkedin],['Email',club.email?gmailUrl():'']].map(([label,url])=>url?<a key={label} href={url} target="_blank" rel="noopener noreferrer"><span className="social-link-label">{label!=='Email' && <SocialIcon name={label}/>} {label}</span> <Arrow/></a>:<span key={label} title="Official link coming soon">{label}{full&&<small>Coming soon</small>}</span>)}</div>}
function Footer(){return <footer><div className="container footer-top"><div><Link to="/" aria-label="IEEE CIS home"><Logo/></Link><p className="footer-tagline">LEAD IMPACT INNOVATE</p></div><div><span className="footer-label">EXPLORE</span><nav aria-label="Footer navigation">{links.map(([to,label])=><Link key={to} to={to}>{label}</Link>)}</nav></div><div><span className="footer-label">CONNECT</span><Socials/><p className="small">Vishwakarma Institute of Technology<br/>Pune, India</p></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} IEEE CIS · VIT Pune</span><span>Made for curious minds.</span></div></footer>}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);




