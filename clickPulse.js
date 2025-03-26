/**
 * Click-Pulse 点击星光涟漪效果
 * 用户在页面任意位置点击时，触发一圈扩散的星光涟漪动画
 */

const ClickPulse = {
    canvas: null,
    ctx: null,
    pulses: [],
    vanGoghColors: [
        [255, 210, 125], // 黄色
        [100, 149, 237], // 蓝色
        [255, 255, 255], // 白色
        [70, 130, 180],  // 钢蓝色
        [135, 206, 250]  // 淡蓝色
    ],
    
    /**
     * 初始化点击涟漪效果
     */
    init() {
        this.canvas = document.getElementById('clickPulse');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // 设置canvas尺寸
        this.resize();
        
        // 添加点击事件监听
        document.addEventListener('click', (e) => this.createPulse(e));
        
        // 添加触摸事件监听（移动端）
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.createPulse({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        });
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize());
        
        // 开始动画
        this.animate();
    },
    
    /**
     * 调整canvas尺寸
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    /**
     * 创建点击涟漪
     */
    createPulse(event) {
        // 获取点击位置
        const x = event.clientX;
        const y = event.clientY;
        
        // 获取当前时间作为随机种子
        const now = Date.now();
        
        // 创建涟漪对象
        const pulse = {
            x: x,
            y: y,
            radius: 0,
            maxRadius: Math.min(window.innerWidth, window.innerHeight) * 0.3,
            particles: [],
            startTime: now,
            colorIndex: Math.floor(Math.random() * this.vanGoghColors.length),
            nextColorIndex: Math.floor(Math.random() * this.vanGoghColors.length)
        };
        
        // 创建涟漪粒子
        const numParticles = 60;
        for (let i = 0; i < numParticles; i++) {
            const angle = (Math.PI * 2 / numParticles) * i;
            const speed = 0.5 + Math.random() * 1.5;
            const size = 1 + Math.random() * 2;
            const lifespan = 1000 + Math.random() * 1000; // 粒子寿命1-2秒
            
            pulse.particles.push({
                angle: angle,
                speed: speed,
                size: size,
                x: x,
                y: y,
                opacity: 1,
                lifespan: lifespan,
                startTime: now
            });
        }
        
        this.pulses.push(pulse);
        
        // 3秒后移除涟漪
        setTimeout(() => {
            const index = this.pulses.indexOf(pulse);
            if (index > -1) {
                this.pulses.splice(index, 1);
            }
        }, 3000);
    },
    
    /**
     * 获取梵高风格的颜色
     */
    getVanGoghColor(colorIndex, nextColorIndex, progress) {
        const currentColor = this.vanGoghColors[colorIndex];
        const nextColor = this.vanGoghColors[nextColorIndex];
        
        const r = Math.floor(currentColor[0] * (1 - progress) + nextColor[0] * progress);
        const g = Math.floor(currentColor[1] * (1 - progress) + nextColor[1] * progress);
        const b = Math.floor(currentColor[2] * (1 - progress) + nextColor[2] * progress);
        
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    /**
     * 更新涟漪状态
     */
    update() {
        const now = Date.now();
        
        this.pulses.forEach(pulse => {
            // 更新涟漪半径
            const age = now - pulse.startTime;
            const progress = Math.min(age / 2000, 1); // 2秒内完成扩散
            pulse.radius = pulse.maxRadius * progress;
            
            // 更新粒子位置
            pulse.particles.forEach(particle => {
                const particleAge = now - particle.startTime;
                const particleProgress = Math.min(particleAge / particle.lifespan, 1);
                
                // 粒子沿着角度方向移动
                const distance = pulse.radius * particleProgress;
                particle.x = pulse.x + Math.cos(particle.angle) * distance;
                particle.y = pulse.y + Math.sin(particle.angle) * distance;
                
                // 粒子透明度随时间衰减
                particle.opacity = 1 - particleProgress;
            });
        });
    },
    
    /**
     * 绘制涟漪效果
     */
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制所有涟漪
        this.pulses.forEach(pulse => {
            const age = Date.now() - pulse.startTime;
            const progress = Math.min(age / 2000, 1); // 2秒内完成扩散
            
            // 绘制涟漪光环
            this.ctx.beginPath();
            this.ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                pulse.x, pulse.y, 0,
                pulse.x, pulse.y, pulse.radius
            );
            
            const color = this.getVanGoghColor(pulse.colorIndex, pulse.nextColorIndex, progress);
            gradient.addColorStop(0, `${color.replace('rgb', 'rgba').replace(')', ', 0)')}`);
            gradient.addColorStop(0.5, `${color.replace('rgb', 'rgba').replace(')', ', 0.1)')}`);
            gradient.addColorStop(1, `${color.replace('rgb', 'rgba').replace(')', ', 0)')}`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // 绘制粒子
            pulse.particles.forEach(particle => {
                if (particle.opacity <= 0) return;
                
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `${color.replace('rgb', 'rgba').replace(')', `, ${particle.opacity})`)}`; 
                this.ctx.fill();
                
                // 绘制粒子光晕
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                const particleGradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );
                particleGradient.addColorStop(0, `${color.replace('rgb', 'rgba').replace(')', `, ${particle.opacity * 0.5})`)}`);
                particleGradient.addColorStop(1, `${color.replace('rgb', 'rgba').replace(')', ', 0)')}`);
                this.ctx.fillStyle = particleGradient;
                this.ctx.fill();
            });
        });
    },
    
    /**
     * 动画循环
     */
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
};

// 当DOM加载完成后初始化点击涟漪效果
document.addEventListener('DOMContentLoaded', () => ClickPulse.init());