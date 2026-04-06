// ─── Sovix · GSAP Animation Engine ───────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // ── LENIS ─────────────────────────────────────────────────────────────────
  const lenis = new Lenis({ duration: 1.0, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, wheelMultiplier: 1.0 });
  lenis.on('scroll', ScrollTrigger.update);
  lenis.on('scroll', ({ scroll, limit }) => gsap.set('#scroll-progress', { width: `${(scroll / limit) * 100}%` }));
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── INITIAL STATES ────────────────────────────────────────────────────────
  gsap.set(['#gsap-hero-badge','#gsap-hero-h1','#gsap-hero-p','#gsap-hero-btns'], { opacity: 0, y: 40 });
  gsap.set('#gsap-hero-visual', { opacity: 0, x: 60, scale: 0.92 });
  gsap.set('#gsap-card1', { opacity: 0, y: 30, rotation: -6 });
  gsap.set('#gsap-card2', { opacity: 0, y: 50, rotation:  4 });
  gsap.set('.preloader-logo',    { opacity: 0, y: 30 });
  gsap.set('.preloader-tagline', { opacity: 0, y: 10 });
  gsap.set('.preloader-bar-wrap',{ opacity: 0 });
  gsap.set('.booking-modal',     { display: 'none' });
  gsap.set('#back-to-top',       { opacity: 0, y: 20 });

  // ── CUSTOM CURSOR ─────────────────────────────────────────────────────────
  const cursorDot  = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2, ringX = mouseX, ringY = mouseY;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; gsap.set(cursorDot, { x: mouseX, y: mouseY }); });
  gsap.ticker.add(() => { ringX += (mouseX-ringX)*0.1; ringY += (mouseY-ringY)*0.1; gsap.set(cursorRing, { x: ringX, y: ringY }); });
  document.querySelectorAll('a,button,.btn,.service-card,.pricing-card,.testimonial-card,.metric-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
  document.addEventListener('mouseleave', () => gsap.to([cursorDot,cursorRing], { opacity:0, duration:0.25 }));
  document.addEventListener('mouseenter', () => gsap.to([cursorDot,cursorRing], { opacity:1, duration:0.25 }));

  // ── PRELOADER ─────────────────────────────────────────────────────────────
  gsap.timeline({
    onComplete: () => {
      document.getElementById('preloader').style.pointerEvents = 'none';
      runHeroAnimation();
      initHero3D();
      setTimeout(startRotatingWord, 2800);
    }
  })
  .to('.preloader-logo',    { opacity:1, y:0, duration:0.75, ease:'power3.out' }, 0.2)
  .to('.preloader-tagline', { opacity:1, y:0, duration:0.55, ease:'power2.out' }, 0.6)
  .to('.preloader-bar-wrap',{ opacity:1,       duration:0.3  }, 0.75)
  .to('.preloader-fill',    { width:'100%',     duration:1.5,  ease:'power2.inOut' }, 0.85)
  .to(['.preloader-logo','.preloader-tagline','.preloader-bar-wrap'], { opacity:0, y:-25, duration:0.4, stagger:0.06, ease:'power2.in' }, '+=0.25')
  .to('#preloader', { yPercent:-100, duration:0.95, ease:'expo.inOut' });

  // ── HERO ENTRANCE ──────────────────────────────────────────────────────────
  function runHeroAnimation() {
    gsap.timeline()
      .to('#gsap-hero-badge',  { opacity:1, y:0, duration:0.55, ease:'power3.out' })
      .to('#gsap-hero-h1',     { opacity:1, y:0, duration:0.70, ease:'power3.out' }, '-=0.35')
      .to('#gsap-hero-p',      { opacity:1, y:0, duration:0.60, ease:'power3.out' }, '-=0.45')
      .to('#gsap-hero-btns',   { opacity:1, y:0, duration:0.55, ease:'back.out(1.4)' }, '-=0.40')
      .to('#gsap-hero-visual', { opacity:1, x:0, scale:1, duration:0.90, ease:'power3.out' }, '-=0.70')
      .to('#gsap-card1',       { opacity:1, y:0, rotation:0, duration:0.60, ease:'back.out(1.8)' }, '-=0.55')
      .to('#gsap-card2',       { opacity:1, y:0, rotation:0, duration:0.60, ease:'back.out(1.8)' }, '-=0.40');
  }
  gsap.to('#gsap-card1', { y:-18, duration:2.8, ease:'sine.inOut', yoyo:true, repeat:-1 });
  gsap.to('#gsap-card2', { y: 18, duration:3.4, ease:'sine.inOut', yoyo:true, repeat:-1, delay:0.8 });

  // ── HERO 3D ────────────────────────────────────────────────────────────────
  function initHero3D() {
    const heroEl = document.querySelector('.hero');
    const heroVisualEl = document.getElementById('gsap-hero-visual');

    gsap.to('.abstract-shape', { borderRadius:'60% 40% 30% 70% / 60% 30% 70% 40%', scale:1.12, rotate:22, duration:8, ease:'sine.inOut', yoyo:true, repeat:-1 });

    const followGlow = document.createElement('div');
    followGlow.className = 'hero-follow-glow';
    heroVisualEl.appendChild(followGlow);
    const qGL = gsap.quickSetter(followGlow,'left','px');
    const qGT = gsap.quickSetter(followGlow,'top','px');

    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const sz = Math.random()*5+2;
      p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${Math.random()*100}%;opacity:${Math.random()*0.5+0.1};`;
      heroVisualEl.appendChild(p);
      gsap.to(p, { y:(Math.random()-0.5)*90, x:(Math.random()-0.5)*50, duration:3+Math.random()*5, ease:'sine.inOut', yoyo:true, repeat:-1, delay:Math.random()*4 });
    }

    const qGX = gsap.quickSetter('.glow-bg','x','px');       const qGY = gsap.quickSetter('.glow-bg','y','px');
    const qCX = gsap.quickSetter('.hero-content','x','px');   const qCY = gsap.quickSetter('.hero-content','y','px');
    const qSX = gsap.quickSetter('.abstract-shape','x','px'); const qSY = gsap.quickSetter('.abstract-shape','y','px');
    let hmx=0, hmy=0, smx=0, smy=0;

    heroEl.addEventListener('mousemove', e => {
      const r = heroEl.getBoundingClientRect();
      hmx = (e.clientX-r.left-r.width/2)/(r.width/2);
      hmy = (e.clientY-r.top-r.height/2)/(r.height/2);
      const vr = heroVisualEl.getBoundingClientRect();
      gsap.set(followGlow, { opacity:1 }); qGL(e.clientX-vr.left); qGT(e.clientY-vr.top);
      gsap.to('#gsap-hero-visual', { rotateX:hmy*-6, rotateY:hmx*6, duration:0.8, ease:'power2.out', overwrite:'auto' });
      gsap.to('#gsap-card1', { rotateX:hmy*-14, rotateY:hmx*14, transformPerspective:900, duration:0.85, ease:'power2.out', overwrite:'auto' });
      gsap.to('#gsap-card2', { rotateX:hmy*-20, rotateY:hmx*20, transformPerspective:900, duration:1.0,  ease:'power2.out', overwrite:'auto' });
    });
    heroEl.addEventListener('mouseleave', () => {
      hmx=0; hmy=0;
      gsap.to(followGlow, { opacity:0, duration:0.5 });
      gsap.to('#gsap-hero-visual', { rotateX:0, rotateY:0, duration:1.2, ease:'power2.out' });
      gsap.to(['#gsap-card1','#gsap-card2'], { rotateX:0, rotateY:0, duration:1.0, ease:'back.out(1.4)' });
    });
    gsap.ticker.add(() => {
      smx += (hmx-smx)*0.07; smy += (hmy-smy)*0.07;
      qGX(smx*35); qGY(smy*20); qCX(smx*-20); qCY(smy*-12); qSX(smx*70); qSY(smy*48);
    });
  }

  // ── ROTATING WORD ──────────────────────────────────────────────────────────
  const words = ['Experiences','Solutions','Systems','Products','Brands'];
  let wordIndex = 0;
  function startRotatingWord() {
    setInterval(() => {
      const el = document.getElementById('rotating-word'); if (!el) return;
      wordIndex = (wordIndex+1) % words.length;
      gsap.to(el, { opacity:0, y:-18, duration:0.28, ease:'power2.in',
        onComplete: () => { el.textContent = words[wordIndex]; gsap.fromTo(el, { opacity:0, y:18 }, { opacity:1, y:0, duration:0.38, ease:'power3.out' }); }
      });
    }, 2200);
  }

  // ── BOOKING MODAL ──────────────────────────────────────────────────────────
  const bookingModal = document.getElementById('booking-modal');

  function openModal() {
    gsap.set(bookingModal, { display:'flex' });
    gsap.fromTo(bookingModal, { opacity:0 }, { opacity:1, duration:0.25 });
    gsap.fromTo('.modal-box', { scale:0.95, y:20 }, { scale:1, y:0, duration:0.4, ease:'power3.out' });
  }
  function closeModal() {
    gsap.to('.modal-box', { scale:0.95, y:10, duration:0.2, ease:'power2.in' });
    gsap.to(bookingModal, { opacity:0, duration:0.2, delay:0.1,
      onComplete: () => { 
        gsap.set(bookingModal,{display:'none'}); 
      }
    });
  }
  document.querySelectorAll('[data-modal="booking"]').forEach(btn => btn.addEventListener('click', e => { 
    e.preventDefault(); 
    openModal(); 
  }));
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key==='Escape' && bookingModal.style.display==='flex') closeModal(); });

  // ── BACK TO TOP ────────────────────────────────────────────────────────────
  const backToTop = document.getElementById('back-to-top');
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 500) gsap.to(backToTop, { opacity:1, y:0, pointerEvents:'auto', duration:0.4, ease:'back.out(1.5)' });
    else              gsap.to(backToTop, { opacity:0, y:20, pointerEvents:'none', duration:0.3 });
  });
  backToTop.addEventListener('click', () => lenis.scrollTo(0, { duration:1.5 }));

  // ── MOBILE MENU ────────────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  let menuOpen = false;
  gsap.set('#mobile-menu', { xPercent:100 });
  gsap.set('.mobile-nav-link,.mobile-cta', { opacity:0, x:40 });
  function openMenu() {
    menuOpen=true; hamburger.classList.add('open'); lenis.stop();
    gsap.timeline()
      .to('#mobile-menu',     { xPercent:0,  duration:0.5,  ease:'power3.out' })
      .to('.mobile-nav-link', { opacity:1, x:0, duration:0.4, stagger:0.08, ease:'power3.out' }, '-=0.25')
      .to('.mobile-cta',      { opacity:1, x:0, duration:0.4, ease:'back.out(1.5)' }, '-=0.2');
  }
  function closeMenu() {
    menuOpen=false; hamburger.classList.remove('open');
    gsap.timeline({ onComplete:()=>lenis.start() })
      .to('.mobile-nav-link,.mobile-cta', { opacity:0, x:40, duration:0.2, stagger:0.04, ease:'power2.in' })
      .to('#mobile-menu', { xPercent:100, duration:0.45, ease:'power3.in' }, '-=0.1');
  }
  hamburger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  document.querySelectorAll('.mobile-nav-link,.mobile-cta').forEach(l => l.addEventListener('click', closeMenu));

  // ── MAGNETIC BUTTONS ───────────────────────────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, { x:(e.clientX-(r.left+r.width/2))*0.32, y:(e.clientY-(r.top+r.height/2))*0.32, duration:0.3, ease:'power2.out', overwrite:true });
    });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x:0, y:0, duration:0.65, ease:'elastic.out(1,0.45)', overwrite:true }));
  });

  // ── 3D TILT CARDS ─────────────────────────────────────────────────────────
  document.querySelectorAll('.service-card,.pricing-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      gsap.to(card, { rotateX:((e.clientY-r.top-r.height/2)/(r.height/2))*-9, rotateY:((e.clientX-r.left-r.width/2)/(r.width/2))*9, transformPerspective:900, y:-10, scale:1.02, duration:0.35, ease:'power2.out', overwrite:true });
      if (card.classList.contains('service-card')) { card.style.setProperty('--mouse-x',`${((e.clientX-r.left)/r.width)*100}%`); card.style.setProperty('--mouse-y',`${((e.clientY-r.top)/r.height)*100}%`); }
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { rotateX:0, rotateY:0, y:0, scale:1, duration:0.6, ease:'back.out(1.5)', overwrite:true }));
  });

  // ── NAVBAR ─────────────────────────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  lenis.on('scroll', ({ scroll }) => navbar.classList.toggle('scrolled', scroll > 50));

  // ── SMOOTH SCROLL LINKS ────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href==='#') return;
      const t = document.querySelector(href);
      if (t) lenis.scrollTo(t, { offset:-80, duration:1.2 });
    });
  });

  // ── SCROLL REVEALS ─────────────────────────────────────────────────────────
  document.querySelectorAll('.section h2.text-center,.section>.container>h2').forEach(h2 =>
    gsap.fromTo(h2, { opacity:0, y:30 }, { opacity:1, y:0, duration:0.65, ease:'power3.out', scrollTrigger:{ trigger:h2, start:'top 85%' } })
  );
  gsap.fromTo('.service-card', { opacity:0, y:50 }, { opacity:1, y:0, duration:0.65, stagger:0.14, ease:'power3.out', scrollTrigger:{ trigger:'#gsap-services-grid', start:'top 80%' } });
  gsap.fromTo('.diff-section h2,.diff-section>.container>p', { opacity:0, x:-40 }, { opacity:1, x:0, duration:0.7, stagger:0.15, ease:'power3.out', scrollTrigger:{ trigger:'.diff-section', start:'top 78%' } });
  gsap.fromTo('.diff-item', { opacity:0, x:30 }, { opacity:1, x:0, duration:0.5, stagger:0.1, ease:'power3.out', scrollTrigger:{ trigger:'.diff-list', start:'top 80%' } });

  let countersRun = false;
  gsap.fromTo('.metric-card', { opacity:0, y:40, scale:0.9 }, { opacity:1, y:0, scale:1, duration:0.6, stagger:0.12, ease:'back.out(1.5)',
    scrollTrigger:{ trigger:'#gsap-metrics', start:'top 80%', onEnter:()=>{ if(!countersRun){ animateCounters(); countersRun=true; } } }
  });
  function animateCounters() {
    document.querySelectorAll('.counter').forEach(el => {
      const obj={val:0};
      gsap.to(obj, { val:parseInt(el.dataset.target,10), duration:1.8, ease:'power2.out', onUpdate:()=>{ el.textContent=Math.round(obj.val)+(el.dataset.suffix||''); } });
    });
  }
  document.querySelectorAll('.case-study').forEach((cs,i) =>
    gsap.fromTo(cs, { opacity:0, x:i%2===0?-60:60 }, { opacity:1, x:0, duration:0.85, ease:'power3.out', scrollTrigger:{ trigger:cs, start:'top 80%' } })
  );
  gsap.fromTo('.testimonial-card', { opacity:0, y:35 }, { opacity:1, y:0, duration:0.65, stagger:0.15, ease:'power3.out', scrollTrigger:{ trigger:'.testimonials-slider', start:'top 82%' } });
  gsap.fromTo('.process-step',  { opacity:0, y:45 }, { opacity:1, y:0, duration:0.55, stagger:0.1,  ease:'power3.out', scrollTrigger:{ trigger:'#gsap-process', start:'top 80%' } });
  gsap.fromTo('.step-number',   { scale:0.4, opacity:0 }, { scale:1, opacity:1, duration:0.4, stagger:0.1, ease:'back.out(2)', scrollTrigger:{ trigger:'#gsap-process', start:'top 80%' } });
  gsap.fromTo('.pricing-card',  { opacity:0, y:50 }, { opacity:1, y:0, duration:0.6, stagger:0.12,  ease:'back.out(1.3)', scrollTrigger:{ trigger:'.pricing-grid', start:'top 80%' } });
  gsap.fromTo('#contact h2,#contact p,#contact .btn-group', { opacity:0, y:30 }, { opacity:1, y:0, duration:0.65, stagger:0.15, ease:'power3.out', scrollTrigger:{ trigger:'#contact', start:'top 80%' } });
  gsap.fromTo('footer', { opacity:0, y:20 }, { opacity:1, y:0, duration:0.7, ease:'power2.out', scrollTrigger:{ trigger:'footer', start:'top 92%' } });


});
