(() => {
  'use strict';
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header + mobile menu
  const header = $('#siteHeader');
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  const onScrollHeader = () => header.classList.toggle('scrolled', scrollY > 36);
  onScrollHeader();
  addEventListener('scroll', onScrollHeader, {passive:true});
  menuBtn?.addEventListener('click', () => {
    const open = menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    menuBtn.classList.remove('open'); mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false'); mobileMenu.setAttribute('aria-hidden','true');
  }));

  // Reveal observer
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
  }, {threshold:.12, rootMargin:'0px 0px -40px'});
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Cart micro interaction
  let cartCount = 0;
  const toast = $('#toastMsg');
  let toastTimer;
  function showToast(text){ toast.textContent = text; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2200); }
  $$('.quick-add').forEach(btn => btn.addEventListener('click', () => {
    cartCount++; $('#cartCount').textContent = cartCount;
    showToast(`${btn.dataset.product} added to your bag`);
  }));

  // Brew explorer
  const brewData = {
    espresso:{index:'01', title:'Espresso', caption:'ESPRESSO', image:'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1300&q=86', desc:"Concentrated, syrupy and aromatic. Dial in fine and let pressure reveal the coffee's sweetest core.", time:'25–30 sec', grind:'Fine', coffee:'18 g', water:'93°C', taste:'Rich · sweet · concentrated'},
    pour:{index:'02', title:'Pour Over', caption:'POUR OVER', image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1300&q=86', desc:'Clean, bright and articulate. A slow controlled pour gives delicate aromatics room to open.', time:'2:45–3:30', grind:'Medium', coffee:'20 g', water:'94°C', taste:'Clean · bright · layered'},
    press:{index:'03', title:'French Press', caption:'FRENCH PRESS', image:'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1300&q=86', desc:'Full-bodied and comforting. A longer immersion brings out rounded sweetness and texture.', time:'4 min', grind:'Coarse', coffee:'30 g', water:'93°C', taste:'Round · rich · comforting'},
    cold:{index:'04', title:'Cold Brew', caption:'COLD BREW', image:'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1300&q=86', desc:'Silky, mellow and low in perceived acidity. Brew it slow and serve it colder than your plans.', time:'12–16 hr', grind:'Coarse', coffee:'80 g', water:'Cold', taste:'Smooth · cocoa · mellow'}
  };
  const brewVisual = $('.brew-visual'); const brewDetails = $('#brewDetails');
  $$('.brew-tab').forEach(btn => btn.addEventListener('click', () => {
    const d = brewData[btn.dataset.method]; if(!d) return;
    $$('.brew-tab').forEach(b=>b.classList.toggle('active',b===btn));
    brewVisual.classList.add('swap'); brewDetails.classList.add('fade-swap');
    setTimeout(()=>{
      $('#brewImage').src=d.image; $('#brewImage').alt=`${d.title} brewing method`;
      $('#brewIndex').textContent=d.index; $('#brewCaption').textContent=d.caption; $('#brewTitle').textContent=d.title;
      $('#brewDescription').textContent=d.desc; $('#brewTime').textContent=d.time; $('#brewGrind').textContent=d.grind;
      $('#brewCoffee').textContent=d.coffee; $('#brewWater').textContent=d.water; $('#brewTaste').textContent=d.taste;
      brewVisual.classList.remove('swap'); brewDetails.classList.remove('fade-swap');
    },220);
  }));

  // Flavor explorer
  const flavorData = {
    chocolate:{desc:'Deep cocoa notes with a smooth toasted finish.', product:'Midnight No. 01', value:'8.8', width:'88%', image:'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85'},
    nutty:{desc:'Roasted almond, praline and a quietly creamy finish.', product:'Slow Sunday', value:'7.4', width:'74%', image:'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=900&q=85'},
    caramel:{desc:'Burnt sugar sweetness with a silky, golden finish.', product:'Golden Hour', value:'8.1', width:'81%', image:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85'},
    fruity:{desc:'Ripe berry brightness layered with juicy stone fruit.', product:'Altitude Reserve', value:'7.8', width:'78%', image:'https://images.unsplash.com/photo-1461988091159-192b6df7054f?auto=format&fit=crop&w=900&q=85'},
    floral:{desc:'Jasmine-like aromatics with a tea-like, elegant finish.', product:'Altitude Reserve', value:'6.9', width:'69%', image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85'}
  };
  const flavorImageWrap = $('.flavor-image');
  $$('.flavor-btn').forEach(btn => btn.addEventListener('click', () => {
    const d=flavorData[btn.dataset.flavor]; if(!d)return;
    $$('.flavor-btn').forEach(b=>b.classList.toggle('active',b===btn)); flavorImageWrap.classList.add('swap');
    setTimeout(()=>{ $('#flavorDescription').textContent=d.desc; $('#flavorProduct').textContent=d.product; $('#flavorValue').textContent=d.value; $('#flavorMeter').style.width=d.width; $('#flavorImage').src=d.image; flavorImageWrap.classList.remove('swap'); },190);
  }));

  // Testimonials
  const testimonials=[
    {q:'“Finally, coffee that tastes as intentional as the packaging looks.”',name:'Maya Chen',meta:'Brooklyn, NY · Golden Hour',img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80'},
    {q:'“The Altitude Reserve is bright, elegant and impossible not to brew twice.”',name:'Julian Reed',meta:'Austin, TX · Altitude Reserve',img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80'},
    {q:'“Slow Sunday turned our kitchen into the best coffee shop in the neighborhood.”',name:'Elena Rossi',meta:'Chicago, IL · Slow Sunday',img:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80'}
  ];
  let ti=0; const tContent=$('.testimonial-content');
  function setTestimonial(next){ ti=(next+testimonials.length)%testimonials.length; const t=testimonials[ti]; tContent.classList.add('changing'); setTimeout(()=>{ $('#testimonialQuote').textContent=t.q; $('#testimonialName').textContent=t.name; $('#testimonialMeta').textContent=t.meta; $('#testimonialImage').src=t.img; $('#testimonialCurrent').textContent=String(ti+1).padStart(2,'0'); $('#testimonialBar').style.width=`${((ti+1)/testimonials.length)*100}%`; tContent.classList.remove('changing'); },180); }
  $('#testimonialPrev')?.addEventListener('click',()=>setTestimonial(ti-1)); $('#testimonialNext')?.addEventListener('click',()=>setTestimonial(ti+1));

  // Subscription
  $$('.frequency-btn').forEach(btn=>btn.addEventListener('click',()=>{ $$('.frequency-btn').forEach(b=>b.classList.toggle('active',b===btn)); $('#subscribeBtn span').textContent=`Subscribe — ${btn.dataset.frequency}`; }));
  $('#subscribeBtn')?.addEventListener('click',()=>showToast('Subscription option selected'));

  // Newsletter validation
  $('#newsletterForm')?.addEventListener('submit',e=>{ e.preventDefault(); const email=$('#newsletterEmail'); const msg=$('#newsletterMessage'); const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()); msg.className=valid?'success':'error'; msg.textContent=valid?'You’re on the list. See you in your inbox.':'Please enter a valid email address.'; if(valid) email.value=''; });

  // Counters
  let counted=false; const stats=$('.stats-grid');
  if(stats){ const counterObserver=new IntersectionObserver(entries=>{ if(entries[0].isIntersecting&&!counted){ counted=true; $$('.counter').forEach(el=>{ const target=+el.dataset.target; const suffix=el.dataset.suffix||''; if(reducedMotion){el.textContent=target+suffix;return;} const start=performance.now(),duration=1200; function tick(now){const p=Math.min((now-start)/duration,1);const eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased)+(p===1?suffix:'');if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);}); counterObserver.disconnect(); }},{threshold:.4}); counterObserver.observe(stats); }

  // Magnetic button
  $$('.magnetic').forEach(btn=>{ if(reducedMotion)return; btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect(); const x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.12;btn.style.transform=`translate(${x}px,${y}px)`}); btn.addEventListener('mouseleave',()=>btn.style.transform=''); });

  // Horizontal values + mild parallax
  const valuesSection=$('.values-section'), valuesTrack=$('#valuesTrack'), philosophy=$('.philosophy'), philosophyText=$('#philosophyText');
  let raf=false;
  function motion(){ if(reducedMotion||innerWidth<992){raf=false;return;} if(valuesSection){const r=valuesSection.getBoundingClientRect(); const max=valuesSection.offsetHeight-innerHeight; const progress=Math.min(Math.max(-r.top/max,0),1); const distance=Math.max(valuesTrack.scrollWidth-innerWidth*.72,0); valuesTrack.style.transform=`translateX(${-progress*distance}px)`;} if(philosophy){const r=philosophy.getBoundingClientRect(); const p=(innerHeight-r.top)/(innerHeight+r.height); if(p>=0&&p<=1) philosophyText.style.transform=`translateX(${(p-.5)*-5}vw)`;} $$('.parallax-img img').forEach(img=>{const r=img.parentElement.getBoundingClientRect(); if(r.bottom>0&&r.top<innerHeight){const p=(r.top-innerHeight/2)/innerHeight; img.style.transform=`scale(1.08) translateY(${p*18}px)`;}}); raf=false; }
  addEventListener('scroll',()=>{if(!raf){requestAnimationFrame(motion);raf=true;}},{passive:true}); addEventListener('resize',motion); motion();
  $('#year').textContent=new Date().getFullYear();
})();
