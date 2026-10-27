// Shared GSAP setup. Every tween is created inside a matchMedia handler for
// motionOK, so reduced-motion visitors get the finished layout with no motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

export const motionOK = '(prefers-reduced-motion: no-preference)';
export const finePointer = '(hover: hover) and (pointer: fine)';
export const prefersMotion = () => matchMedia(motionOK).matches;
export { gsap, ScrollTrigger, useGSAP };

// Fades and lifts elements as they scroll into view. Elements stay focusable
// (opacity, not visibility), and focusing one reveals it straight away.
export function reveal(targets, { y = 34, stagger = 0.1, duration = 0.9, start = 'clamp(top 90%)' } = {}) {
  const items = gsap.utils.toArray(targets);
  if (!items.length) return;
  const pending = new Set(items);
  const show = batch => {
    batch.forEach(el => pending.delete(el));
    gsap.to(batch, { opacity: 1, y: 0, stagger, duration, overwrite: true, clearProps: 'opacity,transform' });
  };
  gsap.set(items, { opacity: 0, y });
  ScrollTrigger.batch(items, { start, once: true, onEnter: show });
  const onFocus = event => {
    const hit = [...pending].filter(el => el.contains(event.target));
    if (hit.length) show(hit);
  };
  document.addEventListener('focusin', onFocus);
  return () => document.removeEventListener('focusin', onFocus);
}

// Types a text node in from flickering binary digits, left to right. Works on
// the existing text node so React keeps ownership of it.
export function decode(node, { duration = 1.3 } = {}) {
  const text = node.nodeValue;
  const state = { progress: 0 };
  let live = true;
  const paint = () => {
    if (!live) return;
    const shown = Math.floor(state.progress * text.length);
    let out = text.slice(0, shown);
    for (let i = shown; i < text.length; i++) out += /[\s.@]/.test(text[i]) ? text[i] : Math.random() < 0.5 ? '0' : '1';
    node.nodeValue = out;
  };
  paint();
  const tween = gsap.to(state, { progress: 1, duration, ease: 'power1.inOut', onUpdate: paint, onComplete: () => { node.nodeValue = text; } });
  const restore = () => { live = false; node.nodeValue = text; };
  return { tween, restore };
}

// Page-level motion for the shared layout: hero sequence, page headings,
// scroll reveals and gentle scroll-linked drift. Re-runs on each route.
export function useSiteMotion(scope, pathname) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(motionOK, () => {
      const q = gsap.utils.selector(scope);
      const cleanups = [];
      const add = fn => fn && cleanups.push(fn);

      if (q('.hero-editorial').length) {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.15 } });
        tl.from(q('.headline-top'), { yPercent: 70, opacity: 0 })
          .from(q('.hero-title em'), { yPercent: 55, opacity: 0 }, '<0.14')
          .from(q('.heading-dot'), { scale: 0, duration: 0.7, ease: 'back.out(3)' }, '-=0.55')
          .from(q('.editorial-caption, .hero-note > p'), { y: 18, opacity: 0, stagger: 0.08, duration: 0.8 }, '-=0.75')
          .from(q('.hero-note .actions > *'), { y: 14, opacity: 0, stagger: 0.08, duration: 0.7 }, '<0.18')
          .from(q('.topic-tabs button'), { y: 20, opacity: 0, stagger: 0.06, duration: 0.7 }, '<0.12')
          .from(q('.topic-panel:not([hidden])'), { y: 12, opacity: 0, duration: 0.7 }, '<0.2');
        // The headline settles back as the page scrolls past it.
        gsap.to(q('.hero-title'), { y: -50, ease: 'none', scrollTrigger: { trigger: q('.hero-editorial')[0], start: 'top top', end: 'bottom top', scrub: 0.6 } });
      }

      const heading = q('.page-heading > *');
      if (heading.length) {
        gsap.from(heading, { y: 28, opacity: 0, stagger: 0.09, duration: 0.95, ease: 'expo.out' });
        gsap.to(q('.page-heading')[0], { '--drift': '46px', ease: 'none', scrollTrigger: { trigger: q('.page-heading')[0], start: 'top top', end: 'bottom top', scrub: true } });
      }

      add(reveal(q('.chapter-about-content > *'), { stagger: 0.08 }));
      add(reveal(q('.purpose-card'), { y: 40, stagger: 0.12 }));
      add(reveal(q('.team-section .section-heading, .team-section .carousel-window, .team-section .carousel-controls'), { stagger: 0.1 }));
      add(reveal(q('.chapter-next > div'), { stagger: 0.14 }));
      add(reveal(q('.event-card, .empty-state'), { y: 48, stagger: 0.12, duration: 1 }));
      add(reveal(q('.detail-grid > div > *'), { y: 24, stagger: 0.06 }));
      add(reveal(q('.detail-grid aside'), { y: 40 }));
      add(reveal(q('.detail-gallery > .eyebrow, .detail-gallery > h2, .gallery-thumb, .gallery-reveal'), { y: 30, stagger: 0.08 }));
      add(reveal(gsap.utils.toArray('footer .footer-top > div, footer .footer-bottom'), { y: 24, stagger: 0.1 }));

      return () => cleanups.forEach(fn => fn());
    });
  }, { scope, dependencies: [pathname], revertOnUpdate: true });
}

// Header gains a shadow once the page scrolls. Visual state only, so it runs
// regardless of motion settings.
export function useScrolledHeader() {
  useGSAP(() => {
    const header = document.querySelector('header');
    if (!header) return;
    ScrollTrigger.create({ start: 8, end: '+=100000', onToggle: self => header.classList.toggle('is-scrolled', self.isActive) });
  });
}
