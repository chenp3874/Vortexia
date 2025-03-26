/**
 * 梵高星空螺旋效果
 * 模仿《星夜》中的漩涡效果
 */

const VanGoghSpiral = {
    canvas: null,
    ctx: null,
    spiralPoints: [],
    stars: [],
    animationFrame: null,
    time: 0,
    
    /**
     * 初始化梵高螺旋效果
     */
    init() {
        this.canvas = document.getElementById('vangoghSpiral');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        
        // 设置canvas尺寸
        this.resize();
        
        // 创建螺旋点
        this.createSpiralPoints();
        
        // 创建星星
        this.createStars();
        
        // 开始动画
        this.animate();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize());
    },
    
    /**
     * 调整canvas尺寸
     */
    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // 重新创建螺旋点和星星
        this.createSpiralPoints();
        this.createStars();
    },
    
    /**
     * 创建螺旋点
     */
    createSpiralPoints() {
        this.spiralPoints = [];
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        // 创建主螺旋
        for (let i = 0; i < 500; i++) {
            const angle = 0.1 * i;
            const radius = (maxRadius / 50) * angle;
            
            if (radius > maxRadius) break;
            
            this.spiralPoints.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
                angle: angle,
                radius: radius,
                centerX: centerX,
                centerY: centerY,
                size: Math.random() * 2 + 1,
                speed: 0.002 + Math.random() * 0.001,
                color: this.getVanGoghColor(i / 500),
                opacity: 0.7 + Math.random() * 0.3,
                pulse: Math.random() * Math.PI * 2
            });
        }
        
        // 创建第二个螺旋
        const secondaryCenterX = centerX + maxRadius * 0.5;
        const secondaryCenterY = centerY - maxRadius * 0.3;
        const secondaryMaxRadius = maxRadius * 0.5;
        
        for (let i = 0; i < 200; i++) {
            const angle = 0.15 * i;
            const radius = (secondaryMaxRadius / 40) * angle;
            
            if (radius > secondaryMaxRadius) break;
            
            this.spiralPoints.push({
                x: secondaryCenterX + radius * Math.cos(angle),
                y: secondaryCenterY + radius * Math.sin(angle),
                angle: angle,
                radius: radius,
                centerX: secondaryCenterX,
                centerY: secondaryCenterY,
                size: Math.random() * 1.5 + 0.5,
                speed: 0.003 + Math.random() * 0.002,
                color: this.getVanGoghColor(i / 200 + 0.5),
                opacity: 0.6 + Math.random() * 0.4,
                pulse: Math.random() * Math.PI * 2
            });
        }
    },
    
    /**
     * 获取梵高风格的颜色
     */
    getVanGoghColor(position) {
        // 梵高《星夜》的颜色
        const colors = [
            [255, 210, 125], // 黄色
            [100, 149, 237], // 蓝色
            [255, 255, 255], // 白色
            [70, 130, 180],  // 钢蓝色
            [135, 206, 250]  // 淡蓝色
        ];
        
        const index = Math.floor(position * colors.length);
        const nextIndex = (index + 1) % colors.length;
        const colorRatio = (position * colors.length) - index;
        
        const r = Math.floor(colors[index][0] * (1 - colorRatio) + colors[nextIndex][0] * colorRatio);
        const g = Math.floor(colors[index][1] * (1 - colorRatio) + colors[nextIndex][1] * colorRatio);
        const b = Math.floor(colors[index][2] * (1 - colorRatio) + colors[nextIndex][2] * colorRatio);
        
        return `rgb(${r}, ${g}, ${b})`;
    },
    
    /**
     * 创建背景星星
     */
    createStars() {
        this.stars = [];
        const numStars = Math.floor((this.canvas.width * this.canvas.height) / 1000);
        
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2,
                opacity: Math.random() * 0.8,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02
            });
        }
    },
    
    /**
     * 更新动画状态
     */
    update() {
        this.time += 0.01;
        
        // 更新螺旋点
        this.spiralPoints.forEach(point => {
            point.angle += point.speed;
            point.x = point.centerX + point.radius * Math.cos(point.angle);
            point.y = point.centerY + point.radius * Math.sin(point.angle);
            point.pulse += 0.05;
            point.size = (Math.sin(point.pulse) * 0.5 + 1) * (point.radius / 100 + 1);
        });
        
        // 更新星星
        this.stars.forEach(star => {
            star.pulse += star.pulseSpeed;
            star.opacity = 0.3 + Math.sin(star.pulse) * 0.3;
        });
    },
    
    /**
     * 绘制梵高风格的螺旋和星空
     */
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(10, 20, 50, 0.8)');
        gradient.addColorStop(1, 'rgba(20, 40, 80, 0.8)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景星星
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });
        
        // 绘制螺旋点
        this.spiralPoints.forEach(point => {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
            this.ctx.fillStyle = point.color;
            this.ctx.globalAlpha = point.opacity;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
            
            // 绘制笔触效果
            if (point.size > 1.5) {
                this.ctx.beginPath();
                this.ctx.moveTo(
                    point.x + point.size * 2 * Math.cos(point.angle + Math.PI/2),
                    point.y + point.size * 2 * Math.sin(point.angle + Math.PI/2)
                );
                this.ctx.lineTo(
                    point.x - point.size * 2 * Math.cos(point.angle + Math.PI/2),
                    point.y - point.size * 2 * Math.sin(point.angle + Math.PI/2)
                );
                this.ctx.strokeStyle = point.color;
                this.ctx.globalAlpha = point.opacity * 0.3;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            }
        });
        
        // 添加梵高风格的笔触效果
        this.drawVanGoghBrushStrokes();
    },
    
    /**
     * 绘制梵高风格的笔触效果
     */
    drawVanGoghBrushStrokes() {
        const numStrokes = 30;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.45;
        
        this.ctx.globalAlpha = 0.1;
        
        for (let i = 0; i < numStrokes; i++) {
            const angle = (Math.PI * 2 / numStrokes) * i + this.time * 0.1;
            const radius = maxRadius * 0.7;
            
            const startX = centerX + radius * 0.5 * Math.cos(angle);
            const startY = centerY + radius * 0.5 * Math.sin(angle);
            const endX = centerX + radius * Math.cos(angle);
            const endY = centerY + radius * Math.sin(angle);
            
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            
            // 控制点，创建弯曲的笔触
            const controlX = centerX + radius * 0.7 * Math.cos(angle + 0.2);
            const controlY = centerY + radius * 0.7 * Math.sin(angle + 0.2);
            
            this.ctx.quadraticCurveTo(controlX, controlY, endX, endY);
            
            const strokeColor = this.getVanGoghColor(i / numStrokes);
            this.ctx.strokeStyle = strokeColor;
            this.ctx.lineWidth = 3 + Math.sin(this.time + i) * 2;
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    },
    
    /**
     * 动画循环
     */
    animate() {
        this.update();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
};

// 当DOM加载完成后初始化梵高螺旋效果
document.addEventListener('DOMContentLoaded', () => VanGoghSpiral.init());