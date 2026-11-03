/* IAmAZING CONTENT // CONFIG
   Este es el ÚNICO archivo que hay que tocar para cambiar datos de contacto,
   clientes, reels y precios. Lo que dice [ PENDIENTE ] lo completa el equipo. */
window.IAMC = {
  domain: 'iamazingcontent.website', // [ PENDIENTE ] confirmar dominio definitivo

  // Formulario de prueba gratis. Pega aquí el endpoint de Formspree (https://formspree.io/f/xxxx)
  // o del webhook que reciba los leads. Si queda vacío, el formulario abre WhatsApp con los datos.
  formEndpoint: '',

  contact: {
    whatsapp: '',              // [ PENDIENTE ] solo números con código de país, ej. '584141234567'
    telegram: '',              // [ PENDIENTE ] usuario sin @, ej. 'iamazingcontent'
    email: '',                 // [ PENDIENTE ] ej. 'hola@iamazingcontent.website'
    instagram: '',             // [ PENDIENTE ] URL completa del perfil
    facebook: '',              // [ PENDIENTE ] URL completa de la página
    linkedin: ''               // [ PENDIENTE ] URL completa de la página de empresa
  },

  // Casos de clientes. Fuente: Trello M1 "Documentar casos de éxito" (datos públicos YouTube, 26-oct-2026).
  // service / start / growth: [ PENDIENTE ] el equipo completa cómo arrancó cada canal y qué hicimos.
  clients: [
    { id: 'C01', name: 'Rigoberto Hidalgo', handle: '@RigobertoHidalgo-', url: 'https://www.youtube.com/@RigobertoHidalgo-',
      niche: 'Debate / Opinión', subs: 577000, videos: 212, top: 4500000,
      service: '', start: '', growth: '' },
    { id: 'C02', name: 'Der Kommandant', handle: '@derkommandantesp', url: 'https://www.youtube.com/@derkommandantesp',
      niche: 'Historia militar', subs: 258000, videos: 393, top: 177000,
      service: '', start: '', growth: '' },
    { id: 'C03', name: 'The Narc Web', handle: '@NarcWeb', url: 'https://www.youtube.com/@NarcWeb',
      niche: 'Noticias / Investigación', subs: 112000, videos: 738, top: null,
      service: '', start: '', growth: '' },
    { id: 'C04', name: 'Repetición Máxima', handle: '@REPETICIONMAXIMA1', url: 'https://www.youtube.com/@REPETICIONMAXIMA1',
      niche: 'Fitness / Combate', subs: 65800, videos: 80, top: 460000,
      service: '', start: '', growth: '' },
    { id: 'C05', name: 'El Sueño de Adán', handle: '@ElSueñodeAdan', url: 'https://www.youtube.com/@ElSue%C3%B1odeAdan',
      niche: 'Ciencia / Divulgación', subs: 8750, videos: 136, top: 613000,
      service: '', start: '', growth: '' }
  ],

  // Reels del carrusel del portafolio. Copia los .mp4 (9:16, < 8 MB) a assets/video/ y pon el nombre aquí.
  reels: [
    { file: '', title: 'Ingeniería visual', tag: 'R01' },
    { file: '', title: 'Automatización', tag: 'R02' },
    { file: '', title: 'Manifiesto', tag: 'R03' },
    { file: '', title: 'Conversión', tag: 'R04' },
    { file: '', title: 'Render', tag: 'R05' },
    { file: 'intro.mp4', title: 'Intro IAMC', tag: 'SYS' }
  ],

  // Precios. Fuente: Trello M2 "SOP & Ofertas Aprobadas" (USD / mes).
  tiers: [
    { id: 'ia', label: 'IA', desc: 'Pipeline automatizado de punta a punta: guion, voz sintética y edición con IA.' },
    { id: 'aug', label: 'Augmentado', desc: 'El mismo pipeline con revisión humana de cada entrega y 2 rondas de ajustes.' },
    { id: 'pro', label: 'Profesional', desc: 'Dirección creativa humana completa sobre el sistema. Máximo control de calidad.' }
  ],
  plans: [
    { name: 'Starter', hours: '5 h de video / mes', note: '≈ 15–20 reels o shorts', price: { ia: 120, aug: 156, pro: 343 },
      items: ['Guion estructurado + voz sintética', 'Edición automatizada con HyperFrames', 'Entrega en 72 h por tanda'] },
    { name: 'Creator', hours: '10 h de video / mes', note: 'Producción continua multiformato', price: { ia: 240, aug: 312, pro: 685 }, featured: true,
      items: ['Control de calidad editorial', 'Subtítulos dinámicos + doblaje', 'Horas acumulables hasta 3 meses'] },
    { name: 'Studio', hours: '20 h de video / mes', note: 'Alto volumen / corporativo', price: { ia: 480, aug: 624, pro: 1371 },
      items: ['Pipeline industrial, batch rendering', 'Múltiples locutores de voz', 'Reporte de rendimiento quincenal'] }
  ]
};
