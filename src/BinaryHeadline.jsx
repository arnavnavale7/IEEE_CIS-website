import React, { useEffect, useRef } from 'react';

// A small circular binary field follows the pointer throughout the hero grid.
export function BinaryHeadline({ children, className = '' }) {
  const host = useRef(null);
  const canvas = useRef(null);
  useEffect(() => {
    const element = host.current, surface = canvas.current;
    const context = surface.getContext('2d');
    if (!context) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const radius = 30, lifetime = 560;
    const cells = [];
    for (let y = -24; y <= 24; y += 12) {
      for (let x = -25; x <= 25; x += 10) {
        if (Math.hypot(x, y) <= radius) cells.push({ x, y, bit: '0', nextChange: 0, jitterX: 0, jitterY: 0 });
      }
    }
    let frame = 0, width = 0, height = 0, cursor = null, inside = false;
    let trail = [], lastMove = 0, lastDraw = -Infinity, lastStamp = null;
    const allowed = () => !motion.matches && pointer.matches && !document.hidden;
    const randomBit = () => Math.random() < .5 ? '0' : '1';
    function clear() {
      cancelAnimationFrame(frame);
      frame = 0; cursor = null; inside = false; trail = []; lastStamp = null;
      context.clearRect(0, 0, width, height);
    }
    function resize() {
      clear();
      width = element.clientWidth; height = element.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    function draw(now) {
      frame = 0;
      if (!allowed() || !cursor) { clear(); return; }
      const presence = inside ? 1 : Math.max(0, 1 - (now - lastMove) / lifetime);
      if (!presence) { clear(); return; }
      // Cap painting at 25fps; individual digits refresh on staggered timers.
      if (now - lastDraw >= 40) {
        lastDraw = now;
        cells.forEach(cell => {
          if (now < cell.nextChange) return;
          cell.bit = randomBit();
          cell.jitterX = (Math.random() - .5) * 2;
          cell.jitterY = (Math.random() - .5) * 2;
          cell.nextChange = now + 65 + Math.random() * 90;
        });
        context.clearRect(0, 0, width, height);
        context.font = '11px Consolas, monospace';
        context.textAlign = 'center'; context.textBaseline = 'middle';
        context.fillStyle = '#00a9ce';
        trail = trail.filter(point => now - point.time < lifetime);
        for (const point of trail) {
          const fade = 1 - (now - point.time) / lifetime;
          context.globalAlpha = .14 * fade * fade * presence;
          for (const cell of point.cells) {
            // Keep the live circle crisp while its previous positions fade behind it.
            const x = point.x + cell.x, y = point.y + cell.y;
            if (Math.hypot(x - cursor.x, y - cursor.y) > radius + 3) {
              context.fillText(cell.bit, x, y);
            }
          }
        }
        for (const cell of cells) {
          const edge = 1 - .35 * Math.hypot(cell.x, cell.y) / radius;
          context.globalAlpha = .33 * edge * presence;
          context.fillText(cell.bit, cursor.x + cell.x + cell.jitterX, cursor.y + cell.y + cell.jitterY);
        }
        context.globalAlpha = 1;
      }
      frame = requestAnimationFrame(draw);
    }
    function move(event) {
      if (!allowed() || event.pointerType === 'touch') return;
      const bounds = element.getBoundingClientRect();
      const next = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      const now = performance.now();
      if (lastStamp && inside) {
        const distance = Math.hypot(next.x - lastStamp.x, next.y - lastStamp.y);
        const count = Math.min(12, Math.floor(distance / 18));
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            trail.push({
              x: lastStamp.x + (next.x - lastStamp.x) * i / count,
              y: lastStamp.y + (next.y - lastStamp.y) * i / count,
              cells: cells.map(cell => ({ x: cell.x, y: cell.y, bit: cell.bit })),
              time: now,
            });
          }
          lastStamp = next;
          trail = trail.slice(-12);
        }
      } else { lastStamp = next; }
      cursor = next; inside = true; lastMove = now;
      if (!frame) frame = requestAnimationFrame(draw);
    }
    function leave() { inside = false; lastMove = performance.now(); }
    const observer = new ResizeObserver(resize); observer.observe(element);
    element.addEventListener('pointerenter', move); element.addEventListener('pointermove', move);
    element.addEventListener('pointerleave', leave);
    motion.addEventListener('change', clear); pointer.addEventListener('change', clear);
    document.addEventListener('visibilitychange', clear);
    window.addEventListener('blur', clear); window.addEventListener('scroll', clear, { passive: true });
    resize();
    return () => {
      clear(); observer.disconnect();
      element.removeEventListener('pointerenter', move); element.removeEventListener('pointermove', move);
      element.removeEventListener('pointerleave', leave);
      motion.removeEventListener('change', clear); pointer.removeEventListener('change', clear);
      document.removeEventListener('visibilitychange', clear);
      window.removeEventListener('blur', clear); window.removeEventListener('scroll', clear);
    };
  }, []);
  return <div className={`binary-headline ${className}`} ref={host}>{children}<canvas ref={canvas} aria-hidden="true" className="binary-trail"/></div>;
}
