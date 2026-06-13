/* ============================
   AST Website – app.js
   ============================ */

// ---------- THEME SYSTEM ----------
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('ast-theme', theme);
}

(function initTheme() {
  const saved = localStorage.getItem('ast-theme');
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (sysDark ? 'dark' : 'light'));
})();

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('ast-theme')) applyTheme(e.matches ? 'dark' : 'light');
});

// ---------- SCROLL PROGRESS ----------
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = Math.min(pct, 100) + '%';
});

// ---------- NAVBAR ----------
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const overlay = document.getElementById('mobile-overlay');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  overlay.classList.toggle('active', open);
});

overlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  overlay.classList.remove('active');
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  navA.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
});

// ---------- BACK TO TOP ----------
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- PARTICLES ----------
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 1200,
      y: Math.random() * 700,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      a: Math.random() * 0.5 + 0.1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(165,180,252,${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---------- COUNTDOWN ----------
(function countdown() {
  const target = new Date('2025-12-31T23:59:59');
  function update() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) { return; }
    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1000);
    const fmt = n => String(n).padStart(2, '0');
    document.getElementById('cd-days').textContent = fmt(d);
    document.getElementById('cd-hours').textContent = fmt(h);
    document.getElementById('cd-mins').textContent = fmt(m);
    document.getElementById('cd-secs').textContent = fmt(s);
  }
  update();
  setInterval(update, 1000);
})();

// ---------- SCROLL REVEAL ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ---------- ANIMATED COUNTERS ----------
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = target / 80;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString();
      }, 20);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ---------- ACCORDION ----------
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const isOpen = content.classList.contains('active');
    btn.closest('.accordion').querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
    btn.closest('.accordion').querySelectorAll('.accordion-btn').forEach(b => b.classList.remove('active'));
    if (!isOpen) { content.classList.add('active'); btn.classList.add('active'); }
  });
});

// ---------- FAQ ----------
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains('active');
    btn.closest('.faq-list').querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));
    btn.closest('.faq-list').querySelectorAll('.faq-btn').forEach(b => b.classList.remove('active'));
    if (!isOpen) { answer.classList.add('active'); btn.classList.add('active'); }
  });
});

function filterFaq(btn, cat) {
  document.querySelectorAll('.faq-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
  });
}
window.filterFaq = filterFaq;

// ---------- RESULT SEARCH ----------
function setResultTab(btn, type) {
  document.querySelectorAll('.search-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const ph = { reg: 'Enter Registration Number...', roll: 'Enter Roll Number...', name: 'Enter Student Name...' };
  document.getElementById('result-search').placeholder = ph[type];
  document.getElementById('result-card').style.display = 'none';
}
window.setResultTab = setResultTab;

function searchResult() {
  const val = document.getElementById('result-search').value.trim();
  if (!val) { showToast('Please enter a value to search.', 'error'); return; }
  // Simulate result
  const card = document.getElementById('result-card');
  card.style.display = 'block';
  document.getElementById('r-name').textContent = 'Aarav Sharma';
  document.getElementById('r-class').textContent = 'Class 8';
  document.getElementById('r-regno').textContent = val.toUpperCase();
  document.getElementById('r-roll').textContent = 'AST-ROLL-08-0012';
  document.getElementById('r-rank').textContent = '3';
  document.getElementById('r-score').textContent = '156 / 170';
  document.getElementById('r-percentile').textContent = '99.8%';
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('Result found!', 'success');
}
window.searchResult = searchResult;

// ---------- MULTI-STEP FORM ----------
let currentStep = 1;

function updateProgress(step) {
  document.querySelectorAll('.progress-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === step);
    s.classList.toggle('done', i + 1 < step);
    if (i + 1 < step) s.querySelector('.progress-circle').innerHTML = '<i class="fas fa-check"></i>';
    else s.querySelector('.progress-circle').textContent = i + 1;
  });
}

function nextStep(step) {
  if (step === 2 && !validateStep1()) return;
  if (step === 3) {
    const checks = document.querySelectorAll('input[name="subjects"]:checked');
    if (checks.length === 0) {
      document.getElementById('err-subjects').textContent = 'Please select at least one subject.';
      return;
    } else document.getElementById('err-subjects').textContent = '';
    buildPreview();
  }
  document.getElementById('step-' + currentStep).classList.remove('active');
  document.getElementById('step-' + step).classList.add('active');
  currentStep = step;
  updateProgress(step);
  document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.nextStep = nextStep;

function prevStep(step) {
  document.getElementById('step-' + currentStep).classList.remove('active');
  document.getElementById('step-' + step).classList.add('active');
  currentStep = step;
  updateProgress(step);
}
window.prevStep = prevStep;

function validateStep1() {
  let valid = true;
  const checks = [
    { id: 's-name', err: 'err-name', msg: 'Full name is required.' },
    { id: 's-dob', err: 'err-dob', msg: 'Date of birth is required.' },
    { id: 's-gender', err: 'err-gender', msg: 'Please select gender.' },
    { id: 's-class', err: 'err-class', msg: 'Please select class.' },
    { id: 's-school', err: 'err-school', msg: 'School name is required.' },
    { id: 's-email', err: 'err-email', msg: 'Valid email is required.' },
  ];
  checks.forEach(c => {
    const el = document.getElementById(c.id);
    const val = el.value.trim();
    if (!val) {
      document.getElementById(c.err).textContent = c.msg;
      el.classList.add('error');
      valid = false;
    } else {
      document.getElementById(c.err).textContent = '';
      el.classList.remove('error');
    }
  });
  // Mobile validation
  const mob = document.getElementById('s-mobile').value.trim();
  if (!/^\d{10}$/.test(mob)) {
    document.getElementById('err-mobile').textContent = 'Enter a valid 10-digit mobile number.';
    document.getElementById('s-mobile').classList.add('error');
    valid = false;
  } else {
    document.getElementById('err-mobile').textContent = '';
    document.getElementById('s-mobile').classList.remove('error');
  }
  const pmob = document.getElementById('s-pmobile').value.trim();
  if (!/^\d{10}$/.test(pmob)) {
    document.getElementById('err-pmobile').textContent = 'Enter a valid 10-digit mobile number.';
    valid = false;
  } else document.getElementById('err-pmobile').textContent = '';
  // Pin
  const pin = document.getElementById('s-pin').value.trim();
  if (!/^\d{6}$/.test(pin)) {
    document.getElementById('err-pin').textContent = 'Enter a valid 6-digit pincode.';
    valid = false;
  } else document.getElementById('err-pin').textContent = '';
  if (!valid) showToast('Please fix the errors before proceeding.', 'error');
  return valid;
}

function buildPreview() {
  const fields = {
    'Full Name': val('s-name'), 'Date of Birth': val('s-dob'),
    'Gender': val('s-gender'), 'Class': val('s-class'),
    'School': val('s-school'), 'Board': val('s-board'),
    'Email': val('s-email'), 'Mobile': val('s-mobile'),
    'Parent Name': val('s-parent'), 'City': val('s-city'),
    'State': val('s-state'),
  };
  const subjects = [...document.querySelectorAll('input[name="subjects"]:checked')].map(c => c.value).join(', ');
  fields['Subjects'] = subjects;
  fields['Language'] = val('s-lang');
  fields['Exam Mode'] = 'Online';

  const container = document.getElementById('preview-content');
  container.innerHTML = Object.entries(fields).map(([k, v]) =>
    `<div class="preview-row"><label>${k}</label><span>${v || '—'}</span></div>`
  ).join('');
}

function val(id) { return document.getElementById(id)?.value || ''; }

// Submit
document.getElementById('student-form').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!document.getElementById('declaration').checked) {
    document.getElementById('err-declaration').textContent = 'Please accept the declaration.';
    return;
  }
  document.getElementById('err-declaration').textContent = '';

  const btn = document.getElementById('submit-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;

  setTimeout(() => {
    const regNo = 'AST2025-' + val('s-class').replace('Class ', '') + '-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('reg-number').textContent = regNo;
    document.getElementById('step-3').classList.remove('active');
    document.getElementById('step-success').classList.add('active');
    updateProgress(4);
    showToast('Registration successful! 🎉', 'success');
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 1800);
});

function downloadReceipt() {
  showToast('Receipt download started...', 'success');
}
window.downloadReceipt = downloadReceipt;

function resetForm() {
  document.getElementById('student-form').reset();
  document.getElementById('step-success').classList.remove('active');
  document.getElementById('step-1').classList.add('active');
  currentStep = 1;
  updateProgress(1);
}
window.resetForm = resetForm;

// ---------- INSTITUTION FORM ----------
function submitInstitution(e) {
  e.preventDefault();
  const name = document.getElementById('i-name').value.trim();
  if (!name) { showToast('Institution name is required.', 'error'); return; }
  const btn = e.target;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
  btn.disabled = true;
  setTimeout(() => {
    const id = 'AST-INST-' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('inst-id').textContent = id;
    document.getElementById('institution-success').style.display = 'block';
    btn.style.display = 'none';
    showToast('Institution registered successfully!', 'success');
    document.getElementById('institution-success').scrollIntoView({ behavior: 'smooth' });
  }, 1500);
}
window.submitInstitution = submitInstitution;

// ---------- CONTACT FORM ----------
function submitContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'var(--success)';
    e.target.reset();
    showToast('Your message has been sent. We\'ll reply shortly!', 'success');
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1500);
}
window.submitContact = submitContact;

// ---------- TOAST ----------
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.classList.remove('show'); }, 3500);
}
window.showToast = showToast;

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---------- INPUT LIVE VALIDATION ----------
document.getElementById('s-mobile')?.addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
});
document.getElementById('s-pmobile')?.addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
});
document.getElementById('s-pin')?.addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 6);
});
document.getElementById('s-aadhaar')?.addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 12);
});
