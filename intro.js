document.addEventListener('DOMContentLoaded', () => {
  const introContainer = document.getElementById('iamazing-intro-container');
  const video = document.getElementById('intro-source-video');
  const canvas = document.getElementById('intro-ascii-canvas');

  if (!introContainer || !video || !canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // IAmazing brand hex colors (indexed by palette)
  const COLORS = ['#5F6368', '#8D939F', '#1E90FF'];

  // Palette as RGB for distance calculation
  const PALETTE_RGB = [
    { r: 95,  g: 99,  b: 104 }, // Ash Gray
    { r: 141, g: 147, b: 159 }, // Raw Cement
    { r: 30,  g: 144, b: 255 }, // Digital Blue
  ];

  // ASCII density ramp - light to dense
  const DENSITY = " .,:;i1tfLCG08@";

  const CELL = 7; // pixels per cell — smaller = denser grid
  let cols, rows;
  let tempCanvas, tCtx;
  let animId = null;
  let introDone = false;

  function initLayout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    cols = Math.floor(w / CELL);
    rows = Math.floor(h / (CELL * 1.6));

    tempCanvas = document.createElement('canvas');
    tempCanvas.width = cols;
    tempCanvas.height = rows;
    tCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

    ctx.font = `bold ${Math.floor(CELL * 1.55)}px "Space Mono", monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }

  function getClosestColorIndex(r, g, b) {
    let minDist = Infinity, idx = 0;
    for (let i = 0; i < PALETTE_RGB.length; i++) {
      const p = PALETTE_RGB[i];
      const d = (p.r - r) ** 2 + (p.g - g) ** 2 + (p.b - b) ** 2;
      if (d < minDist) { minDist = d; idx = i; }
    }
    return idx;
  }

  function renderFrame() {
    if (introDone || video.paused || video.ended) return;

    const w = canvas.width;
    const h = canvas.height;

    // --- Stretch video to fill canvas (Full Screen characters, no crop) ---
    tCtx.fillStyle = '#000000';
    tCtx.fillRect(0, 0, cols, rows);
    tCtx.drawImage(video, 0, 0, cols, rows);

    const px = tCtx.getImageData(0, 0, cols, rows).data;

    // Clear canvas
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, w, h);

    const cellH = h / rows;
    const cellW = w / cols;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = (row * cols + col) * 4;
        const r = px[i], g = px[i + 1], b = px[i + 2];

        // Perceptual luminosity
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        // Pick ASCII char by brightness
        const charIdx = Math.min(DENSITY.length - 1, Math.floor((lum / 255) * DENSITY.length));
        const char = DENSITY[charIdx];
        if (char === ' ') continue;

        // Pick brand color
        const ci = getClosestColorIndex(r, g, b);
        ctx.fillStyle = COLORS[ci];
        
        // Maximize contrast: make characters fully opaque. Depth is now handled entirely by the ASCII density.
        ctx.globalAlpha = 1;

        ctx.fillText(char, col * cellW, row * cellH);
      }
    }

    ctx.globalAlpha = 1;
    animId = requestAnimationFrame(renderFrame);
  }

  video.addEventListener('play', () => {
    initLayout();
    animId = requestAnimationFrame(renderFrame);
  });

  video.addEventListener('ended', () => {
    introDone = true;
    if (animId) cancelAnimationFrame(animId);
    introContainer.classList.add('fade-out');
    setTimeout(() => { introContainer.style.display = 'none'; }, 1500);
  });

  window.addEventListener('resize', () => { if (!introDone) initLayout(); });

  video.play().catch(() => { introContainer.style.display = 'none'; });
});
