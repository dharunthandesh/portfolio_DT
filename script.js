/* =====================================================
   DHARUN THANDESH PORTFOLIO — script.js
   ===================================================== */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = window.innerWidth/2, my = window.innerHeight/2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  gsap.to(cursor, { x: mx, y: my, duration: .06, overwrite: true });
});

(function followRing() {
  rx += (mx - rx) * .11;
  ry += (my - ry) * .11;
  gsap.set(ring, { x: rx, y: ry });
  requestAnimationFrame(followRing);
})();

document.querySelectorAll('a, button, .sk-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hov'); ring.classList.add('hov'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hov'); ring.classList.remove('hov'); });
});

/* ══════════════════════════════════════
   LOADER
══════════════════════════════════════ */
const pillFill = document.getElementById('pillFill');
const pillPct  = document.getElementById('pillPct');
let pct = 0;

const loaderTick = setInterval(() => {
  pct += Math.random() * 7 + 2;
  if (pct >= 100) { pct = 100; clearInterval(loaderTick); setTimeout(finishLoader, 400); }
  pillFill.style.width = pct + '%';
  pillPct.textContent  = Math.floor(pct) + '%';
}, 75);

function finishLoader() {
  gsap.to('#loader', {
    opacity: 0, duration: .9, ease: 'power2.inOut',
    onComplete: () => {
      document.getElementById('loader').style.display = 'none';
      const site = document.getElementById('site');
      site.classList.remove('hidden');
      gsap.to(site, { opacity: 1, duration: .5 });
      heroEntrance();
      initScrollAnimations();
      initEyeTracking();
    }
  });
}

/* ══════════════════════════════════════
   HERO ENTRANCE
══════════════════════════════════════ */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.h-greet',          { opacity:1, y:0, duration:.7 })
    .to('.nm',               { opacity:1, y:0, clipPath:'inset(0 0 0% 0)', duration:.85, stagger:.14 }, '-=.45')
    .to('.h-sub',            { opacity:1, y:0, duration:.7 }, '-=.65')
    .to('.rt, .rb',          { opacity:1, y:0, duration:.8, stagger:.12 }, '-=.6')
    .to('.av-img',           { opacity:1, y:0, duration:1.1 }, '-=.85')
    .to(['#resumeBtn','#scrollCue'], { opacity:1, duration:.6, stagger:.15 }, '-=.5');
}

/* ══════════════════════════════════════
   EYE / HEAD TRACKING  (parallax on avatar)
══════════════════════════════════════ */
function initEyeTracking() {
  const av = document.getElementById('avImg');
  const heroSec = document.getElementById('hero-section');

  document.addEventListener('mousemove', e => {
    const r = heroSec.getBoundingClientRect();
    if (r.bottom < 0) return; // only when hero is visible

    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const rotX = ((e.clientY - cy) / r.height) * 10;   // tilt up/down
    const rotY = ((e.clientX - cx) / r.width)  * -10;  // tilt left/right
    const tx   = ((e.clientX - cx) / r.width)  * 12;   // subtle translate
    const ty   = ((e.clientY - cy) / r.height) * 8;

    gsap.to(av, {
      rotationX: rotX, rotationY: rotY,
      x: tx, y: ty,
      transformPerspective: 700,
      duration: .8, ease: 'power2.out', overwrite: 'auto'
    });
  });
}

/* ══════════════════════════════════════
   SCROLL ANIMATIONS
══════════════════════════════════════ */
function initScrollAnimations() {

  /* NAV glass on scroll */
  ScrollTrigger.create({
    start: 'top -60', end: 99999,
    toggleClass: { targets: '#nav', className: 'scrolled' }
  });

  /* ── Set initial state for aboutPanel (GSAP owns the x, not CSS) ── */
  gsap.set('#aboutPanel', { opacity: 0, x: 80, pointerEvents: 'none' });

  /* ── PINNED HERO → ABOUT TRANSITION ──
     While pinned, the hero side-texts fade out, the avatar slides left,
     and the About panel smoothly fades in from the right.
  ── */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: '+=100%',        // extra 100vh of scroll distance while pinned
      scrub: 1.4,
      pin: true,
      anticipatePin: 1,
    }
  });

  tl
    /* step 0-30%: hero texts & resume/scroll cue fade out */
    .to('#heroLeft',            { opacity: 0, x: -70, ease: 'power2.in', duration: .35 }, 0)
    .to('#heroRight',           { opacity: 0, x:  70, ease: 'power2.in', duration: .35 }, 0)
    .to(['#resumeBtn','#scrollCue'], { opacity: 0, duration: .25 }, 0)

    /* step 5-70%: avatar slides smoothly to left + shrinks slightly */
    .to('#heroCenter',          { x: '-26vw', scale: .78, ease: 'power2.inOut', duration: .9 }, .05)

    /* step 35-100%: About panel fades + slides in from right */
    .to('#aboutPanel',          { opacity: 1, x: 0, ease: 'power3.out', duration: .7,
                                  pointerEvents: 'auto',
                                  onStart: animateCounters }, .35);

  /* ── SKILLS SECTION ── */
  ScrollTrigger.create({
    trigger: '#skills-section',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.to('#deskAv', { opacity:1, x:0, duration:1, ease:'power3.out' });
      gsap.to('.sk-card', { opacity:1, x:0, duration:.75, stagger:.12, delay:.2, ease:'power3.out' });
    }
  });

  /* ── PROJECTS SECTION ── */
  ScrollTrigger.create({
    trigger: '#projects-section',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.to('#projHead', { opacity:1, y:0, duration:1, ease:'power3.out' });
      gsap.to('.proj-card', { opacity:1, y:0, duration:.8, stagger:.15, delay:.2, ease:'power3.out' });
    }
  });

  /* ── CONTACT ── */
  ScrollTrigger.create({
    trigger: '#contact-section',
    start: 'top 70%',
    once: true,
    onEnter: () => gsap.from('#ctInner', { opacity:0, y:50, duration:1, ease:'power3.out' })
  });
}


/* ══════════════════════════════════════
   COUNTERS
══════════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll('.sn').forEach(el => {
    const target = +el.dataset.n;
    gsap.to(el, {
      innerHTML: target, duration: 1.6, ease: 'power2.out',
      snap: { innerHTML: 1 }
    });
  });
}

/* ══════════════════════════════════════
   CARD TILT (mouse enter)
══════════════════════════════════════ */
document.querySelectorAll('.sk-card, .proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - .5) * 10;
    const y = ((e.clientY - r.top)  / r.height - .5) * -10;
    gsap.to(card, { rotationY: x, rotationX: y, transformPerspective: 600, duration:.4, ease:'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotationY:0, rotationX:0, duration:.5, ease:'power2.out' });
  });
});

/* ══════════════════════════════════════
   SMOOTH SCROLL for nav links
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    gsap.to(window, { scrollTo: target, duration: 1.2, ease: 'power3.inOut' });
  });
});
