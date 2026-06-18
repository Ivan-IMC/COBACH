// --- 1. CONFIGURACIÓN DEL NUEVO CARRUSEL 3D ---
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

// Auto avance cada 6 segundos
setInterval(() => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
}, 6000);

// Inicializar el carrusel 3D
updateCarousel();


// --- 2. DOBLE CLIC EN CARRUSEL (PANTALLA COMPLETA) ---
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


// --- 3. VENTANA FLOTANTE DEL FORMULARIO (MODAL) ---
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

document.getElementById("formInscripcion").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("¡Felicidades! Tu registro escolar ha sido procesado exitosamente. Se ha simulado el cobro de tu ficha escolar ($350.00 MXN). ¡Éxito en tu proceso!");
    formModal.style.display = "none";
    this.reset();
});


// --- 4. EFECTO ONDA (RIPPLE EFFECT) EN LOS BOTONES ---
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


// --- 5. EFECTO DE LLUVIA DE LUZ (NATURAL Y CORTA) ---
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
        
        if(this.bounced) {
            rainCtx.globalAlpha = Math.max(0, this.life / 100);
        } else {
            rainCtx.globalAlpha = 0.9;
        }
        
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