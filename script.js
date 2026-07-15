const canvas = document.getElementById('ascii-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let cols, rows;
const CELL_SIZE = 18; // Size of each grid cell

// Characters to use for the effect, ordered by perceived "density"
const chars = [' ', '.', '-', '+', '=', '*', 'o', 'O', '#', 'A', 'M', '@'];

// Mouse state
let mouse = {
  x: -1000,
  y: -1000,
  radius: 200 // Area of effect radius
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

// Track mouse movement
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Also track touch for mobile
window.addEventListener('touchmove', (e) => {
  if(e.touches.length > 0) {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }
});

let time = 0;

function draw() {
  ctx.clearRect(0, 0, width, height);
  
  ctx.fillStyle = '#0A0A0A'; // Black text for the grid
  ctx.font = `bold ${CELL_SIZE * 0.8}px "Space Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  time += 0.05;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Cell center coordinates
      const cx = i * CELL_SIZE + CELL_SIZE / 2;
      const cy = j * CELL_SIZE + CELL_SIZE / 2;

      // Distance to mouse
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base sine wave pattern
      let val = Math.sin(i * 0.2 + time) * Math.cos(j * 0.2 + time);
      
      // Influence from mouse (creates a ripple/wave displacement effect)
      let interaction = 0;
      if (dist < mouse.radius) {
        // Map distance to a 0-1 scale inverted
        const influence = 1 - (dist / mouse.radius);
        // Create an organic ripple
        interaction = Math.sin(influence * Math.PI * 2 - time * 2) * influence;
      }

      // Combine base pattern and mouse interaction
      let combined = val + interaction * 2;
      
      // Normalize combined value to 0-1 range to pick a character
      let normalized = (Math.sin(combined) + 1) / 2;
      
      // Find character index
      let charIndex = Math.floor(normalized * (chars.length - 1));
      
      // Clamp index
      charIndex = Math.max(0, Math.min(chars.length - 1, charIndex));

      // Displace position slightly for a chaotic glitch feel near the mouse
      let drawX = cx;
      let drawY = cy;
      
      if (dist < mouse.radius) {
         const displacement = (1 - dist / mouse.radius) * 10;
         drawX += Math.cos(combined * 10) * displacement;
         drawY += Math.sin(combined * 10) * displacement;
      }

      const char = chars[charIndex];
      
      // Only draw if not a space to save rendering performance
      if (char !== ' ') {
        ctx.fillText(char, drawX, drawY);
      }
    }
  }

  requestAnimationFrame(draw);
}

// Init
resize();
draw();
