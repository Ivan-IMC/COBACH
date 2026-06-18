// ============================================================
// 1. CARRUSEL 3D
// ============================================================
const items = document.querySelectorAll('.carousel-3d-item');
let currentIndex = 0;

function updateCarousel() {
    items.forEach((item, index) => {
        item.classList.remove('active', 'prev', 'next');
        
        if (index === currentIndex) {
            item.classList.add('active');
        } else if (index === (currentIndex - 1 + items.length) % items.length) {
            item.classList.add('prev');
        } else if (index === (currentIndex + 1) % items.length) {
            item.classList.add('next');
        }
    });
}

document.getElementById('nextBtn').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
});

document.getElementById('prevBtn').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
});

setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}, 6000);

updateCarousel();

// ============================================================
// 2. DOBLE CLIC EN CARRUSEL (PANTALLA COMPLETA)
// ============================================================
const imgModal = document.getElementById("imageModal");
const fullImg = document.getElementById("fullImage");
const closeImgModal = document.querySelector(".close-modal");
const carouselImages = document.querySelectorAll('.carousel-img');

carouselImages.forEach(img => {
    img.addEventListener('dblclick', function() {
        imgModal.style.display = "flex";
        fullImg.src = this.src;
    });
});

closeImgModal.onclick = () => imgModal.style.display = "none";
imgModal.onclick = (e) => {
    if (e.target === imgModal) imgModal.style.display = "none";
};

// ============================================================
// 3. MODAL FORMULARIO MEJORADO
// ============================================================
const formModal = document.getElementById("inscripcionesModal");
const btnOpenForm1 = document.getElementById("openInscripciones");
const btnOpenForm2 = document.getElementById("heroActionBtn");
const btnCloseForm = document.getElementById("closeInscripciones");

btnOpenForm1.onclick = () => formModal.style.display = "flex";
btnOpenForm2.onclick = () => formModal.style.display = "flex";

btnCloseForm.onclick = () => formModal.style.display = "none";
window.onclick = (e) => {
    if (e.target === formModal) formModal.style.display = "none";
};

// ============================================================
// 4. NAVEGACIÓN POR PASOS DEL FORMULARIO
// ============================================================
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');
const progressLines = document.querySelectorAll('.progress-line');
let currentStep = 1;
const totalSteps = steps.length;

function updateFormStep(step) {
    // Actualizar steps
    steps.forEach((s, index) => {
        s.classList.toggle('active', index + 1 === step);
    });
    
    // Actualizar progreso
    progressSteps.forEach((ps, index) => {
        const num = index + 1;
        ps.classList.remove('active', 'done');
        if (num === step) ps.classList.add('active');
        else if (num < step) ps.classList.add('done');
    });
    
    // Actualizar líneas
    progressLines.forEach((line, index) => {
        line.classList.toggle('done', index + 1 < step);
    });
}

// Botones Siguiente
document.querySelectorAll('.next-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Validar campos del paso actual
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const inputs = currentStepEl.querySelectorAll('input[required]');
        let valid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.classList.add('invalid');
                const feedback = input.parentElement.querySelector('.input-feedback');
                if (feedback) {
                    feedback.textContent = '⚠️ Este campo es obligatorio';
                    feedback.classList.add('invalid');
                }
            } else {
                input.classList.remove('invalid');
                input.classList.add('valid');
                const feedback = input.parentElement.querySelector('.input-feedback');
                if (feedback) {
                    feedback.textContent = '✓ Correcto';
                    feedback.classList.remove('invalid');
                    feedback.classList.add('valid');
                }
            }
        });
        
        if (!valid) return;
        
        // Si es el paso 2, actualizar confirmación
        if (currentStep === 2) {
            document.getElementById('confirmNombre').textContent = document.getElementById('nombre').value;
            document.getElementById('confirmCURP').textContent = document.getElementById('curp').value;
            document.getElementById('confirmSecundaria').textContent = document.getElementById('secundaria').value;
            const cardNum = document.getElementById('cardnumber').value;
            document.getElementById('confirmTarjeta').textContent = '•••• ' + cardNum.slice(-4);
        }
        
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormStep(currentStep);
        }
    });
});

// Botones Atrás
document.querySelectorAll('.prev-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateFormStep(currentStep);
        }
    });
});

// ============================================================
// 5. VALIDACIÓN EN TIEMPO REAL
// ============================================================
document.querySelectorAll('#formInscripcion input[required]').forEach(input => {
    input.addEventListener('blur', function() {
        const feedback = this.parentElement.querySelector('.input-feedback');
        if (this.value.trim()) {
            this.classList.remove('invalid');
            this.classList.add('valid');
            if (feedback) {
                feedback.textContent = '✓ Correcto';
                feedback.classList.remove('invalid');
                feedback.classList.add('valid');
            }
        } else {
            this.classList.remove('valid');
            this.classList.add('invalid');
            if (feedback) {
                feedback.textContent = '⚠️ Este campo es obligatorio';
                feedback.classList.remove('valid');
                feedback.classList.add('invalid');
            }
        }
    });
});

// Formateo de tarjeta de crédito
document.getElementById('cardnumber').addEventListener('input', function(e) {
    let value = this.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    this.value = value;
});

// Formateo de fecha de expiración
document.getElementById('exp').addEventListener('input', function(e) {
    let value = this.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.value = value;
});

// ============================================================
// 6. ENVÍO DEL FORMULARIO CON EFECTO DE CARGA
// ============================================================
document.getElementById("formInscripcion").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('.submit-form-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Mostrar loader
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simular proceso de registro (2 segundos)
    setTimeout(() => {
        // Ocultar loader
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Obtener nombre para el mensaje de éxito
        const nombre = document.getElementById('nombre').value;
        
        // Cerrar formulario
        formModal.style.display = "none";
        
        // Resetear formulario
        this.reset();
        
        // Mostrar modal de éxito con el nombre
        showSuccessModal(nombre);
        
        // Resetear pasos del formulario
        currentStep = 1;
        updateFormStep(1);
        
        // Limpiar validaciones
        document.querySelectorAll('#formInscripcion input').forEach(input => {
            input.classList.remove('valid', 'invalid');
            const feedback = input.parentElement.querySelector('.input-feedback');
            if (feedback) {
                feedback.textContent = '';
                feedback.classList.remove('valid', 'invalid');
            }
        });
    }, 2000);
});

// ============================================================
// 7. MODAL DE ÉXITO CON CONFETI
// ============================================================
function showSuccessModal(nombre) {
    const modal = document.getElementById('successModal');
    const nombreSpan = document.getElementById('successNombre');
    nombreSpan.textContent = nombre || 'Estudiante';
    
    modal.classList.add('show');
    
    // Iniciar confeti después de que el modal aparezca
    setTimeout(() => {
        iniciarConfeti();
    }, 300);
}

// Cerrar modal de éxito
document.getElementById('closeSuccessModal').addEventListener('click', () => {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    // Limpiar confeti
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Cerrar al hacer clic fuera
document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        const modal = document.getElementById('successModal');
        modal.classList.remove('show');
        const canvas = document.getElementById('confettiCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// ============================================================
// 8. EFECTO CONFETI
// ============================================================
function iniciarConfeti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    
    const particles = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
    
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.5 + 0.5;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/4, this.size, this.size/2);
            ctx.restore();
        }
    }
    
    for (let i = 0; i < 150; i++) {
        particles.push(new Confetti());
    }
    
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateConfetti);
    }
    
    animateConfetti();
}

// ============================================================
// 9. EFECTO ONDA (RIPPLE) EN BOTONES
// ============================================================
const buttons = document.querySelectorAll('.js-btn');

buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        let ripple = document.createElement('span');
        let rect = btn.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.position = 'absolute';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '0px';
        ripple.style.height = '0px';
        ripple.style.borderRadius = '50%';
        ripple.style.transition = 'width 0.4s ease-out, height 0.4s ease-out, opacity 0.4s ease-out';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.width = '260px';
            ripple.style.height = '260px';
            ripple.style.opacity = '0';
        }, 10);
        
        setTimeout(() => { ripple.remove(); }, 400);
    });
});

// ============================================================
// 10. EFECTO DE LLUVIA DE LUZ
// ============================================================
const rainCanvas = document.getElementById('rainCanvas');
const rainCtx = rainCanvas.getContext('2d');
const heroCard = document.getElementById('heroCard');
let rainDrops = [];

function resizeRainCanvas() {
    rainCanvas.width = rainCanvas.parentElement.clientWidth;
    rainCanvas.height = rainCanvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeRainCanvas);
resizeRainCanvas();

class RainDrop {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * rainCanvas.width;
        this.y = initial ? Math.random() * rainCanvas.height : Math.random() * -100 - 20;
        this.length = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2.5;
        this.speedX = 0;
        const colors = ['#00FF00', '#00FFFF', '#8A2BE2', '#FF00FF', '#FFA500', '#00FA9A'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.bounced = false;
        this.life = 100;
        this.thickness = Math.random() * 2 + 1;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.bounced) {
            this.life -= 2;
            this.speedY += 0.2;
        } else {
            const rect = heroCard.getBoundingClientRect();
            const canvasRect = rainCanvas.getBoundingClientRect();
            const heroRect = {
                left: rect.left - canvasRect.left,
                right: rect.right - canvasRect.left,
                top: rect.top - canvasRect.top,
                bottom: rect.bottom - canvasRect.top
            };

            if (this.y + this.length >= heroRect.top && 
                this.x >= heroRect.left && 
                this.x <= heroRect.right &&
                this.y < heroRect.bottom) {
                this.bounced = true;
                this.speedY = -(Math.random() * 3 + 1.5);
                this.speedX = (Math.random() - 0.5) * 4;
                this.length = this.length / 2;
            }
        }

        if (this.y > rainCanvas.height || this.life <= 0) {
            this.reset();
        }
    }

    draw() {
        rainCtx.beginPath();
        rainCtx.moveTo(this.x, this.y);
        rainCtx.lineTo(this.x + this.speedX, this.y + this.length);
        rainCtx.strokeStyle = this.color;
        rainCtx.lineWidth = this.thickness;
        rainCtx.globalAlpha = this.bounced ? Math.max(0, this.life / 100) : 0.9;
        rainCtx.stroke();
        rainCtx.globalAlpha = 1;
    }
}

for (let i = 0; i < 250; i++) {
    rainDrops.push(new RainDrop());
}

function animateRain() {
    rainCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
    rainDrops.forEach(drop => {
        drop.update();
        drop.draw();
    });
    requestAnimationFrame(animateRain);
}

animateRain();

// ============================================================
// 11. EFECTO DE PARTÍCULAS FLOTANTES
// ============================================================
const particlesCanvas = document.getElementById('particlesCanvas');
const pCtx = particlesCanvas.getContext('2d');
let particles = [];

function resizeParticlesCanvas() {
    particlesCanvas.width = particlesCanvas.parentElement.clientWidth;
    particlesCanvas.height = particlesCanvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeParticlesCanvas);
resizeParticlesCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = particlesCanvas.width;
        if (this.x > particlesCanvas.width) this.x = 0;
        if (this.y < 0) this.y = particlesCanvas.height;
        if (this.y > particlesCanvas.height) this.y = 0;
    }

    draw() {
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        pCtx.fill();
    }
}

for (let i = 0; i < 80; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ============================================================
// 12. EFECTO DE ESCRITURA (TYPING)
// ============================================================
const typingElement = document.getElementById('typingText');
const texts = ['Construye tu futuro hoy', 'Educación de Excelencia', '¡Únete a la familia COBACH!'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = 500;
    }
    
    setTimeout(typeEffect, speed);
}

typeEffect();

// ============================================================
// 13. CONTADOR ANIMADO (ESTADÍSTICAS)
// ============================================================
const statNumbers = document.querySelectorAll('.stat-number');
let animated = false;

function animateCounters() {
    if (animated) return;
    
    const triggerPoint = window.innerHeight * 0.8;
    const statsSection = document.querySelector('.stats-section');
    const rect = statsSection.getBoundingClientRect();
    
    if (rect.top < triggerPoint) {
        animated = true;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
}

window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// ============================================================
// 14. ANIMACIÓN DE ENTRADA PARA ZIGZAG (SCROLL REVEAL)
// ============================================================
const zigzagCards = document.querySelectorAll('.zigzag-card');

function revealCards() {
    const triggerPoint = window.innerHeight * 0.85;
    
    zigzagCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < triggerPoint) {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 150);
        }
    });
}

window.addEventListener('scroll', revealCards);
window.addEventListener('load', revealCards);

// ============================================================
// 15. BOTÓN VOLVER ARRIBA
// ============================================================
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 16. MENÚ HAMBURGUESA (MÓVIL)
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ============================================================
// 17. NAVBAR SCROLL EFFECT
// ============================================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================================
// 18. EFECTO 3D EN TARJETAS DEL EQUIPO
// ============================================================
const teamCards = document.querySelectorAll('.team-card');

teamCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============================================================
// 19. INICIALIZAR FORMULARIO EN PASO 1
// ============================================================
updateFormStep(1);
