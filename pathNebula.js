const PathNebula = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    stars: [],
    minSpeedColor: [100, 149, 237], // 蓝色
    maxSpeedColor: [128, 0, 128],   // 紫色
    starColors: [
        [255, 223, 186], // 更亮的金色
        [173, 216, 230], // 更亮的浅蓝色
        [255, 255, 255], // 白色
        [135, 206, 250], // 更亮的天空蓝
        [221, 160, 221]  // 淡紫色
    ],
    
    init() {
        this.canvas = document.getElementById('pathNebula');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        this.canvas.addEventListener('pointerdown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('pointermove', (e) => this.draw(e));
        this.canvas.addEventListener('pointerup', () => this.stopDrawing());
        this.canvas.addEventListener('pointerleave', () => this.stopDrawing());
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    },
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    startDrawing(e) {
        this.isDrawing = true;
        this.addStar(e);
    },
    
    calculateSpeed(now, e) {  // 添加e参数
        if (this.stars.length > 0) {
            const lastStar = this.stars[this.stars.length - 1];
            const dx = e.clientX - lastStar.x;
            const dy = e.clientY - lastStar.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const timeDiff = now - lastStar.createdAt;
            return distance / timeDiff;
        }
        return 0;
    },
    
    addStar(e) {
        const now = Date.now();
        const star = {
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 3 + 1, // 保持原有尺寸
            opacity: 1,
            color: this.getRandomStarColor(),
            speed: this.calculateSpeed(now, e),
            createdAt: now,
            lifespan: 5000 + Math.random() * 3000 // 延长生命周期至5-8秒
        };
        
        // 增加随机偏移范围
        star.x += (Math.random() - 0.5) * 20;
        star.y += (Math.random() - 0.5) * 20;
        
        this.stars.push(star);
    },
    
    getRandomStarColor() {
        const color = this.starColors[Math.floor(Math.random() * this.starColors.length)];
        return `rgb(${color[0]},${color[1]},${color[2]})`;
    },
    
    draw(e) {
        if (!this.isDrawing) return;
        this.addStar(e);
    },
    
    stopDrawing() {
        this.isDrawing = false;
    },
    
    update() {
        const now = Date.now();
        
        // 更新星星状态
        this.stars = this.stars.filter(star => {
            const age = now - star.createdAt;
            star.opacity = 1 - (age / star.lifespan);
            return age < star.lifespan;
        });
    },
    
    drawStars() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            // 增加星星的亮度
            const glowColor = star.color.replace('rgb', 'rgba').replace(')', `,${star.opacity * 0.8})`);
            
            // 绘制星星
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = glowColor;
            this.ctx.fill();
            
            // 绘制光晕
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2); // 保持原有光晕范围
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, star.size * 2
            );
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(1, star.color.replace('rgb', 'rgba').replace(')', ',0)'));
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    },
    
    animate() {
        this.update();
        this.drawStars();
        requestAnimationFrame(() => this.animate());
    }
};

document.addEventListener('DOMContentLoaded', () => PathNebula.init());