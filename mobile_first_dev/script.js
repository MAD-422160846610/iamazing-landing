const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let cols, rows;
const CELL_SIZE = 16;

// Characters ordered by visual density
const chars = ['.', '-', '+', '=', 'o', 'x', 'O', '#', 'M', '@'];

// Mouse state
let mouse = {
  x: -9999,
  y: -9999,
  radius: 220
};

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  cols = Math.ceil(width / CELL_SIZE);
  rows = Math.ceil(height / CELL_SIZE);
}

window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
});

window.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
});

window.addEventListener('touchend', () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

let time = 0;

function draw() {
  // Always reset globalAlpha before clearing
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, width, height);

  ctx.font = `bold ${CELL_SIZE * 0.85}px "Space Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  time += 0.04;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const cx = i * CELL_SIZE + CELL_SIZE / 2;
      const cy = j * CELL_SIZE + CELL_SIZE / 2;

      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base slow wave
      const val = Math.sin(i * 0.18 + time) * Math.cos(j * 0.18 + time);

      // Mouse ripple
      let interaction = 0;
      if (dist < mouse.radius) {
        const influence = 1 - dist / mouse.radius;
        interaction = Math.sin(influence * Math.PI * 3 - time * 2) * influence;
      }

      const combined = val + interaction * 2.5;
      const normalized = (Math.sin(combined) + 1) / 2;
      const charIndex = Math.max(0, Math.min(chars.length - 1, Math.floor(normalized * chars.length)));
      const char = chars[charIndex];

      // Position displacement near mouse
      let drawX = cx;
      let drawY = cy;
      if (dist < mouse.radius) {
        const influence = 1 - dist / mouse.radius;
        const displacement = influence * 8;
        drawX += Math.cos(combined * 8) * displacement;
        drawY += Math.sin(combined * 8) * displacement;
      }

      // Opacity: base is solid, brighter near mouse
      let alpha;
      if (dist < mouse.radius) {
        const influence = 1 - dist / mouse.radius;
        // Near mouse center: bright blue highlight, high opacity
        alpha = 0.5 + influence * 0.5;
        // Switch color near mouse to Digital Blue for the effect
        ctx.fillStyle = dist < mouse.radius * 0.4
          ? '#1E90FF'  // Digital Blue at core
          : '#8D939F'; // Raw Cement on edges
      } else {
        // Ambient grid: always visible at 50% opacity
        alpha = 0.5;
        ctx.fillStyle = '#5F6368'; // Ash Gray for ambient
      }

      ctx.globalAlpha = alpha;
      ctx.fillText(char, drawX, drawY);
    }
  }

  // IMPORTANT: Reset globalAlpha after all drawing
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}

resize();
draw();
