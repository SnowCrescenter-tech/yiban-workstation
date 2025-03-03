/**
 * 高级动画和交互功能库
 */

// GSAP动画库的简易版本实现
export class Animation {
  static fadeIn(element, duration = 0.5, delay = 0) {
    if (!element) return;
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}s ease ${delay}s`;
    
    // 使用 requestAnimationFrame 来确保 DOM 更新后再应用过渡效果
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        element.style.opacity = '1';
      });
    });
    
    return new Promise(resolve => {
      setTimeout(() => resolve(), (duration + delay) * 1000);
    });
  }
  
  static fadeOut(element, duration = 0.5, delay = 0) {
    if (!element) return;
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}s ease ${delay}s`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '0';
    });
    
    return new Promise(resolve => {
      setTimeout(() => resolve(), (duration + delay) * 1000);
    });
  }
  
  static slideIn(element, direction = 'up', distance = '30px', duration = 0.5, delay = 0) {
    if (!element) return;
    
    let translateFrom = '';
    let translateTo = '';
    
    switch(direction) {
      case 'up':
        translateFrom = `translateY(${distance})`;
        translateTo = 'translateY(0)';
        break;
      case 'down':
        translateFrom = `translateY(-${distance})`;
        translateTo = 'translateY(0)';
        break;
      case 'left':
        translateFrom = `translateX(${distance})`;
        translateTo = 'translateX(0)';
        break;
      case 'right':
        translateFrom = `translateX(-${distance})`;
        translateTo = 'translateX(0)';
        break;
    }
    
    element.style.opacity = '0';
    element.style.transform = translateFrom;
    element.style.transition = `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`;
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = translateTo;
      });
    });
    
    return new Promise(resolve => {
      setTimeout(() => resolve(), (duration + delay) * 1000);
    });
  }
  
  static stagger(elements, animation, interval = 0.1) {
    if (!elements || !elements.length) return;
    
    elements.forEach((el, index) => {
      const delay = index * interval;
      animation(el, delay);
    });
  }
}

// 创建平滑滚动效果
export function smoothScroll(target, duration = 500) {
  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }
  
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  
  requestAnimationFrame(animation);
}

// 视觉反馈动画
export function visualFeedback(element, type = 'success') {
  if (!element) return;
  
  const originalClassName = element.className;
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#6366f1'
  };
  
  const animationDuration = 500;
  
  element.style.transition = `background-color ${animationDuration}ms ease`;
  element.style.backgroundColor = colors[type];
  
  setTimeout(() => {
    element.style.backgroundColor = '';
    
    // 恢复原始className
    setTimeout(() => {
      element.className = originalClassName;
    }, animationDuration);
  }, animationDuration);
}

// 页面转场效果
export class PageTransition {
  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.style.position = 'fixed';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.style.backgroundColor = '#fff';
    this.overlay.style.zIndex = '9999';
    this.overlay.style.transform = 'translateY(100%)';
    this.overlay.style.transition = 'transform 0.5s ease-in-out';
    
    document.body.appendChild(this.overlay);
  }
  
  async start() {
    this.overlay.style.transform = 'translateY(0)';
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  
  async end() {
    this.overlay.style.transform = 'translateY(-100%)';
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

// 交互式卡片效果 - 3D 效果
export function init3DCardEffect(element, intensity = 10) {
  if (!element) return;
  
  const card = element;
  
  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseleave', handleMouseLeave);
  card.addEventListener('mouseenter', handleMouseEnter);
  
  function handleMouseMove(e) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / rect.width * 2) * intensity;
    const rotateX = (mouseY / rect.height * -2) * intensity;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
  
  function handleMouseLeave() {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  }
  
  function handleMouseEnter() {
    card.style.transition = 'none';
  }
}

// 粒子效果
export class ParticleEffect {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.options = Object.assign({
      count: 50,
      color: '#3b82f6',
      radius: 3,
      speed: 0.5,
      opacity: 0.7,
      connectParticles: false
    }, options);
    
    this.canvas.width = canvas.offsetWidth;
    this.canvas.height = canvas.offsetHeight;
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => {
      this.canvas.width = canvas.offsetWidth;
      this.canvas.height = canvas.offsetHeight;
      this.init();
    });
  }
  
  init() {
    this.particles = [];
    
    for (let i = 0; i < this.options.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: Math.random() * this.options.speed * 2 - this.options.speed,
        vy: Math.random() * this.options.speed * 2 - this.options.speed,
        radius: Math.random() * this.options.radius + 1,
        color: this.options.color,
        opacity: Math.random() * this.options.opacity
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      
      // 更新位置
      p.x += p.vx;
      p.y += p.vy;
      
      // 边界检测
      if (p.x < 0) {
        p.x = this.canvas.width;
      } else if (p.x > this.canvas.width) {
        p.x = 0;
      }
      
      if (p.y < 0) {
        p.y = this.canvas.height;
      } else if (p.y > this.canvas.height) {
        p.y = 0;
      }
      
      // 绘制粒子
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fill();
      
      // 连接粒子
      if (this.options.connectParticles) {
        for (let j = i + 1; j < this.particles.length; j++) {
          let p2 = this.particles[j];
          let distance = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          
          if (distance < 100) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = p.color;
            this.ctx.globalAlpha = p.opacity * 0.5;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
          }
        }
      }
    }
    
    requestAnimationFrame(this.animate.bind(this));
  }
}
