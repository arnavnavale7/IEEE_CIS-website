import React, { useEffect, useRef } from 'react';

// Dynamic code matrix background matching reference:
// Full-screen monospace character wall with continuous live scrambling across every row
export function MatrixRain() {
  const canvas = useRef(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const parent = el.parentElement || el;
    const ctx = el.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');

    // Characters matching the reference screenshots: uppercase, digits, programming & cyber symbols
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const charLen = chars.length;
    const fontSize = 13;
    let charWidth = 8;
    let charHeight = 17;
    let cols = 0;
    let rows = 0;
    let grid = []; // 2D array: grid[r][c] = { char, colorType }
    let frameId = 0;
    let width = 0;
    let height = 0;
    let lastTime = 0;
    const updateInterval = 65; // Scramble tick rate (ms) for fluid dynamic changes

    // Mouse coordinates for interactive dynamic ripple
    let mouseX = -9999;
    let mouseY = -9999;

    // Palette: tailored blue/cyan tones on white background
    const COLORS = [
      'rgba(0, 120, 215, 0.35)', // 0: Faint base blue (majority)
      'rgba(0, 120, 215, 0.35)', // 1: Faint base blue
      'rgba(0, 105, 195, 0.58)', // 2: Medium blue
      'rgba(0, 165, 245, 0.95)', // 3: Bright electric cyan accent
      'rgba(16, 40, 80, 0.75)'   // 4: Deep navy accent
    ];

    function getRandomColorType() {
      const r = Math.random();
      if (r < 0.65) return 0; // faint base
      if (r < 0.85) return 2; // medium
      if (r < 0.95) return 3; // electric cyan
      return 4; // deep navy
    }

    function setup() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.offsetWidth || window.innerWidth;
      height = parent.offsetHeight || window.innerHeight;
      el.width = Math.round(width * ratio);
      el.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      ctx.font = `600 ${fontSize}px Consolas, Monaco, "Courier New", monospace`;
      ctx.textBaseline = 'top';

      const metrics = ctx.measureText('M');
      charWidth = metrics.width > 0 ? metrics.width : 8;
      charHeight = Math.round(fontSize * 1.34);

      cols = Math.ceil(width / charWidth) + 1;
      rows = Math.ceil(height / charHeight) + 1;

      // Populate initial grid of characters
      grid = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
          row.push({
            char: chars.charAt(Math.floor(Math.random() * charLen)),
            colorType: getRandomColorType()
          });
        }
        grid.push(row);
      }
    }

    function render(currentTime) {
      if (reduced.matches) {
        frameId = requestAnimationFrame(render);
        return;
      }

      // Throttle dynamic scramble ticks to ~15-18fps so characters are visibly active and deciphering
      if (currentTime - lastTime >= updateInterval) {
        lastTime = currentTime;

        // Dynamic mutation: in every row, continuously scramble 8%-14% of the characters
        for (let r = 0; r < rows; r++) {
          const row = grid[r];
          if (!row) continue;
          const y = r * charHeight;

          // Mutate characters dynamically
          for (let c = 0; c < cols; c++) {
            const cell = row[c];
            const x = c * charWidth;

            // Check distance to mouse cursor for interactive dynamic scramble
            const distSq = (x - mouseX) * (x - mouseX) + (y - mouseY) * (y - mouseY);
            const isNearMouse = distSq < 140 * 140;

            // Scramble condition: random chance OR mouse hover proximity
            if (isNearMouse) {
              if (Math.random() < 0.4) {
                cell.char = chars.charAt(Math.floor(Math.random() * charLen));
                cell.colorType = 3; // Electric cyan near cursor
              }
            } else if (Math.random() < 0.09) {
              cell.char = chars.charAt(Math.floor(Math.random() * charLen));
              if (Math.random() < 0.15) {
                cell.colorType = getRandomColorType();
              }
            }
          }
        }
      }

      // Draw entire canvas cleanly each frame
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `600 ${fontSize}px Consolas, Monaco, "Courier New", monospace`;
      ctx.textBaseline = 'top';

      for (let r = 0; r < rows; r++) {
        const row = grid[r];
        if (!row) continue;
        const y = r * charHeight;

        for (let c = 0; c < cols; c++) {
          const cell = row[c];
          ctx.fillStyle = COLORS[cell.colorType];
          ctx.fillText(cell.char, c * charWidth, y);
        }
      }

      frameId = requestAnimationFrame(render);
    }

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    const onResize = () => {
      cancelAnimationFrame(frameId);
      setup();
      frameId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('resize', onResize);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(parent);

    setup();
    frameId = requestAnimationFrame(render);

    const onVisibility = () => {
      if (!document.hidden && !frameId) {
        frameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvas} className="matrix-rain-canvas" aria-hidden="true" />;
}
