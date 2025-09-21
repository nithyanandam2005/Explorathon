// Smooth scroll for internal links
document.querySelectorAll('header nav a, .btn.ghost').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
hamburger?.addEventListener('click', () => {
  const nav = document.querySelector('header nav');
  if (!nav) return;
  nav.classList.toggle('show');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('header nav a').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.querySelector('header nav');
    nav?.classList.remove('show');
  });
});

// Countdown to Oct 9, 2025 09:00:00 local time
const target = new Date('2025-10-09T09:00:00');
const dd = document.getElementById('dd');
const hh = document.getElementById('hh');
const mm = document.getElementById('mm');
const ss = document.getElementById('ss');

function updateCountdown(){
  const now = new Date();
  let diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / (1000*60*60*24)); 
  diff -= d*24*60*60*1000;
  const h = Math.floor(diff / (1000*60*60)); 
  diff -= h*60*60*1000;
  const m = Math.floor(diff / (1000*60)); 
  diff -= m*60*1000;
  const s = Math.floor(diff / 1000);
  
  if (dd) dd.textContent = String(d).padStart(2,'0');
  if (hh) hh.textContent = String(h).padStart(2,'0');
  if (mm) mm.textContent = String(m).padStart(2,'0');
  if (ss) ss.textContent = String(s).padStart(2,'0');
}

setInterval(updateCountdown, 1000); 
updateCountdown();

// Parallax tilt for hero art
const art = document.querySelector('.hero-art');
if (art) {
  const base = { x: -6, y: 0 };
  art.addEventListener('mousemove', (e) => {
    const rect = art.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - .5;
    const py = (e.clientY - rect.top) / rect.height - .5;
    const rotateY = base.x + px * 12;
    const rotateX = -py * 8;
    art.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });
  art.addEventListener('mouseleave', () => {
    art.style.transform = 'perspective(1000px) rotateY(-6deg)';
  });
}

// Particles background canvas
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, dpr = Math.min(2, window.devicePixelRatio || 1);

function resize(){
  width = window.innerWidth; 
  height = window.innerHeight; 
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}

resize();
window.addEventListener('resize', resize);

const NUM = 120;
const particles = Array.from({ length: NUM }, () => ({
  x: Math.random() * width,
  y: Math.random() * height,
  vx: (Math.random() - .5) * .4,
  vy: (Math.random() - .5) * .4,
  r: Math.random() * 2 + .4,
}));

function loop(){
  ctx.clearRect(0,0,width,height);
  
  // Draw particles
  for (let i=0; i<particles.length; i++){
    const p = particles[i];
    p.x += p.vx; 
    p.y += p.vy;
    
    // Wrap around screen edges
    if (p.x < -10) p.x = width+10; 
    if (p.x > width+10) p.x = -10;
    if (p.y < -10) p.y = height+10; 
    if (p.y > height+10) p.y = -10;
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(124,77,255,0.5)';
    ctx.fill();
  }
  
  // Draw connections between nearby particles
  for (let i=0; i<particles.length; i++){
    for (let j=i+1; j<particles.length; j++){
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y; 
      const dist = Math.hypot(dx,dy);
      
      if (dist < 120){
        ctx.strokeStyle = `rgba(124,77,255,${(1 - dist/120)*.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); 
        ctx.moveTo(a.x,a.y); 
        ctx.lineTo(b.x,b.y); 
        ctx.stroke();
      }
    }
  }
  
  requestAnimationFrame(loop);
}

loop();

// Team section animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, observerOptions);

// Team member animation observer
const memberObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    }
  });
}, observerOptions);

// Sponsors section animations
const sponsorObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, index * 150);
    }
  });
}, observerOptions);

// Initialize team animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const sectionTitles = document.querySelectorAll('.team-section-title');
  sectionTitles.forEach(title => observer.observe(title));

  const teamMembers = document.querySelectorAll('.team-member');
  teamMembers.forEach(member => memberObserver.observe(member));

  // Initialize sponsor animations
  const sponsorCards = document.querySelectorAll('.sponsor-card');
  sponsorCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.95)';
    card.style.transition = 'all 0.6s ease';
    sponsorObserver.observe(card);
  });

  // Animate tier badges
  const tierBadges = document.querySelectorAll('.tier-badge');
  const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }
    });
  }, observerOptions);

  tierBadges.forEach(badge => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(20px) scale(0.9)';
    badge.style.transition = 'all 0.5s ease';
    badgeObserver.observe(badge);
  });

  // Sponsor card hover effects with 3D tilt
  sponsorCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(-10px) scale(1.02)';
    });
  });

  // Add loading animation for sponsor images
  document.querySelectorAll('.sponsor-image img').forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
      this.style.transform = 'scale(1)';
    });
    
    // Set initial styles
    img.style.opacity = '0';
    img.style.transform = 'scale(0.8)';
    img.style.transition = 'all 0.3s ease';
  });

  // Sponsors hero content animation
  const sponsorsHeroContent = document.querySelector('.sponsors-hero-content');
  if (sponsorsHeroContent) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    sponsorsHeroContent.style.opacity = '0';
    sponsorsHeroContent.style.transform = 'translateY(50px)';
    sponsorsHeroContent.style.transition = 'all 0.8s ease';
    heroObserver.observe(sponsorsHeroContent);
  }
});

// Performance optimization: Throttle scroll events
let ticking = false;

function updateScrollEffects() {
  // Add any scroll-based effects here if needed
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile menu if open
    const nav = document.querySelector('header nav');
    const hamburger = document.querySelector('.hamburger');
    nav?.classList.remove('show');
    hamburger?.classList.remove('active');
  }
});

// Navigation active state management
function updateActiveNavLink() {
  const sections = ['home', 'about', 'themes', 'timeline', 'prizes', 'team', 'sponsors'];
  const navLinks = document.querySelectorAll('header nav a');
  
  let currentSection = 'home';
  const scrollPosition = window.scrollY + 100;

  sections.forEach(section => {
    const element = document.getElementById(section);
    if (element && scrollPosition >= element.offsetTop) {
      currentSection = section;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Update active nav link on scroll
window.addEventListener('scroll', updateScrollEffects);
window.addEventListener('load', updateActiveNavLink);