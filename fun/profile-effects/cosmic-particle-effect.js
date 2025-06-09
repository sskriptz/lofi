export class CosmicParticleEffect {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;
        this.isActive = false;
        
        this.init();
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '10';
        this.canvas.className = 'cosmic-particle-canvas';
        
        this.ctx = this.canvas.getContext('2d');
        
        // Ensure container has relative positioning
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.8 + 0.2,
            color: this.getRandomCosmicColor(),
            life: Math.random() * 200 + 100,
            maxLife: 300,
            twinkle: Math.random() * Math.PI * 2
        };
    }

    getRandomCosmicColor() {
        const colors = [
            '138, 43, 226',   // Blue Violet
            '75, 0, 130',     // Indigo
            '147, 0, 211',    // Dark Violet
            '72, 61, 139',    // Dark Slate Blue
            '123, 104, 238',  // Medium Slate Blue
            '186, 85, 211',   // Medium Orchid
            '148, 0, 211',    // Dark Violet
            '255, 20, 147'    // Deep Pink
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    updateParticle(particle) {
        // Update position with slight drift
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Twinkle effect
        particle.twinkle += 0.05;
        particle.opacity = (Math.sin(particle.twinkle) + 1) * 0.3 + 0.2;
        
        // Age the particle
        particle.life--;
        
        // Wrap around screen edges
        if (particle.x < 0) particle.x = this.canvas.width;
        if (particle.x > this.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = this.canvas.height;
        if (particle.y > this.canvas.height) particle.y = 0;
        
        return particle.life > 0;
    }

    drawParticle(particle) {
        this.ctx.save();
        
        // Create glowing effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = `rgba(${particle.color}, ${particle.opacity})`;
        
        // Draw particle
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add inner glow
        this.ctx.globalAlpha = particle.opacity * 0.3;
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    animate() {
        if (!this.isActive) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add new particles occasionally
        if (Math.random() < 0.3 && this.particles.length < 50) {
            this.particles.push(this.createParticle());
        }
        
        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            const alive = this.updateParticle(particle);
            if (alive) {
                this.drawParticle(particle);
            }
            return alive;
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.canvas.style.display = 'block';
        
        // Create initial particles
        for (let i = 0; i < 20; i++) {
            this.particles.push(this.createParticle());
        }
        
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.canvas.style.display = 'none';
        this.particles = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
    }
}
