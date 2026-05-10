/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

/* ─── CURSOR ─── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

window.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});

function animCursor() {
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
}

animCursor();

/* ─── HAMBURGER ─── */
const ham = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

ham.addEventListener('click', () => navLinks.classList.toggle('open'));

/* ─── PARTICLE CANVAS ─── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
const COLORS = ['#3b1ff7', '#ff1f8e', '#00e5ff', '#ffaa00'];
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 2 + 1;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.alpha = Math.random() * 0.6 + 0.2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
  }
}

const N = Math.min(90, Math.floor(W * H / 12000));
for (let i = 0; i < N; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.globalAlpha = (1 - dist / 130) * 0.18;
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animParticles() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  ctx.globalAlpha = 1;
  drawLines();
  ctx.globalAlpha = 1;
  requestAnimationFrame(animParticles);
}

animParticles();

/* ─── SCROLL REVEAL ─── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el) => revealObs.observe(el));

/* ─── SKILL BARS ─── */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const pct = e.target.dataset.pct;
      e.target.style.width = pct + '%';
      setTimeout(() => e.target.classList.add('swept'), 400);
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach((el) => skillObs.observe(el));
