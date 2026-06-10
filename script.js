/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 2200);
});

/* ─── THEME TOGGLE ─── */
const themeToggle = document.getElementById('theme-toggle');
const themeStorageKey = 'portfolio-theme';
const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

function getSavedTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    return;
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', theme === 'light');
  themeToggle.setAttribute(
    'aria-label',
    theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
  );
}

const savedTheme = getSavedTheme();
applyTheme(savedTheme || (prefersLight.matches ? 'light' : 'dark'));

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  saveTheme(nextTheme);
  applyTheme(nextTheme);
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

/* ─── CONTACT FORM with EmailJS ─── */
(function() {
  emailjs.init("iu8LEMcXAiYHdupfY");
})();

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('#submit-btn');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    const templateParams = {
      to_email: 'aashirwad2103@gmail.com',
      from_email: document.getElementById('email').value,
      from_name: document.getElementById('name').value,
      message: document.getElementById('message').value
    };

    emailjs.send('service_z0lu2yp', 'template_i7n5e91', templateParams)
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
        setTimeout(() => {
          formStatus.textContent = '';
          formStatus.className = 'form-status';
        }, 5000);
      })
      .catch((error) => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        formStatus.textContent = 'Error sending message. Please try again.';
        formStatus.className = 'form-status error';
        console.error('EmailJS error:', error);
      });
  });
}

/* ─── SCROLL TO TOP ─── */
const scrollTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/* ─── AI CHATBOT LOGIC ─── */
const chatKnowledge = {
  experience: "Aashirwad is a Software Development Engineer with experience at ZopSmart (Jan 2024 – May 2025). He worked on Java Spring Boot microservices, Kafka integration, and improved API response times by 50%.",
  skills: "His technical arsenal includes Java, Spring Boot, Microservices, Kafka, Docker, Kubernetes, Azure, MySQL, and React.",
  education: "Aashirwad holds a Bachelor of Technology in Computer Science Engineering from Lovely Professional University (2020-2024) with a CGPA of 8.18.",
  projects: "Featured projects include an E-Commerce Website (Java/Spring Boot), a Real-Time Chat App (React/Node.js), and a CI/CD Deployment Pipeline.",
  contact: "You can reach Aashirwad via email at aashirwad2103@gmail.com or by phone at +91 8699141864. He is based in Bangalore, India.",
  default: "I'm not sure I understand. You can ask about Aashirwad's experience, skills, education, projects, or contact details!"
};

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');

function appendMessage(text, isBot) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${isBot ? 'bot-msg' : 'user-msg'}`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotResponse(input) {
  const query = input.toLowerCase();
  if (query.includes('experience') || query.includes('work') || query.includes('zopsmart')) return chatKnowledge.experience;
  if (query.includes('skill') || query.includes('tech') || query.includes('know')) return chatKnowledge.skills;
  if (query.includes('education') || query.includes('college') || query.includes('university') || query.includes('lpu')) return chatKnowledge.education;
  if (query.includes('project') || query.includes('build')) return chatKnowledge.projects;
  if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach')) return chatKnowledge.contact;
  return chatKnowledge.default;
}

function handleBotReply(userInput) {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-msg typing-indicator';
  typingDiv.textContent = 'Typing...';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  setTimeout(() => {
    chatMessages.removeChild(typingDiv);
    const response = getBotResponse(userInput);
    appendMessage(response, true);
  }, 1000);
}

chatToggle.addEventListener('click', () => {
  const isVisible = chatWindow.style.display === 'flex';
  chatWindow.style.display = isVisible ? 'none' : 'flex';
  chatToggle.querySelector('.chat-open-icon').style.display = isVisible ? 'block' : 'none';
  chatToggle.querySelector('.chat-close-icon').style.display = isVisible ? 'none' : 'block';
  if (!isVisible) chatInput.focus();
});

function sendMessage() {
  const text = chatInput.value.trim();
  if (text) {
    appendMessage(text, false);
    chatInput.value = '';
    handleBotReply(text);
  }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
