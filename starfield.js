/**
 * 星空背景和流星动画模块
 */

const Starfield = {
    canvas: null,
    ctx: null,
    stars: [],
    shootingStars: [],
    vanGoghStars: [], // 新增梵高风格星星数组
    animationFrame: null,
    
    /**
     * 初始化星空背景
     */
    init() {
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'starfield';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        // 获取绘图上下文
        this.ctx = this.canvas.getContext('2d');
        
        // 设置canvas尺寸
        this.resize();
        
        // 创建星星
        this.createStars();
        
        // 创建梵高风格星星
        this.createVanGoghStars();
        
        // 开始动画
        this.animate();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => this.resize());
        
        // 定期创建流星
        setInterval(() => this.createShootingStar(), 3000);
    },
    
    /**
     * 调整canvas尺寸
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // 重新创建星星
        this.createStars();
        // 重新创建梵高风格星星
        this.createVanGoghStars();
    },
    
    /**
     * 创建星星
     */
    createStars() {
        this.stars = [];
        const numStars = Math.floor((this.canvas.width * this.canvas.height) / 2000);
        
        for (let i = 0; i < numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5,
                alpha: Math.random(),
                alphaChange: Math.random() * 0.02 - 0.01
            });
        }
    },
    
    /**
     * 创建流星
     */
    createShootingStar() {
        const star = {
            x: Math.random() * this.canvas.width,
            y: 0,
            length: Math.random() * 80 + 20,
            speed: Math.random() * 10 + 5,
            angle: Math.PI / 4
        };
        
        this.shootingStars.push(star);
        
        // 3秒后移除流星
        setTimeout(() => {
            const index = this.shootingStars.indexOf(star);
            if (index > -1) {
                this.shootingStars.splice(index, 1);
            }
        }, 3000);
    },
    
    /**
     * 创建梵高风格星星
     */
    createVanGoghStars() {
        this.vanGoghStars = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;
        
        // 梵高星空的颜色
        const vanGoghColors = [
            'rgba(255, 210, 125, 0.8)', // 黄色
            'rgba(100, 149, 237, 0.8)', // 蓝色
            'rgba(255, 255, 255, 0.8)', // 白色
            'rgba(70, 130, 180, 0.8)',  // 钢蓝色
            'rgba(135, 206, 250, 0.8)'  // 淡蓝色
        ];
        
        // 创建螺旋状的星星
        for (let i = 0; i < 200; i++) {
            const angle = 0.1 * i;
            const spiralRadius = (radius / 30) * angle;
            const x = centerX + spiralRadius * Math.cos(angle);
            const y = centerY + spiralRadius * Math.sin(angle);
            
            this.vanGoghStars.push({
                x: x,
                y: y,
                radius: Math.random() * 2 + 1,
                color: vanGoghColors[Math.floor(Math.random() * vanGoghColors.length)],
                angle: angle,
                spiralRadius: spiralRadius,
                speed: 0.001 * Math.random(),
                centerX: centerX,
                centerY: centerY,
                pulseSpeed: 0.03 + Math.random() * 0.02,
                pulseAmount: 0,
                originalRadius: Math.random() * 2 + 1
            });
        }
    },
    
    /**
     * 更新星星状态
     */
    updateStars() {
        this.stars.forEach(star => {
            // 更新星星闪烁
            star.alpha += star.alphaChange;
            
            if (star.alpha <= 0) {
                star.alpha = 0;
                star.alphaChange = Math.abs(star.alphaChange);
            } else if (star.alpha >= 1) {
                star.alpha = 1;
                star.alphaChange = -Math.abs(star.alphaChange);
            }
        });
        
        // 更新梵高风格星星
        this.vanGoghStars.forEach(star => {
            // 旋转效果
            star.angle += star.speed;
            star.x = star.centerX + star.spiralRadius * Math.cos(star.angle);
            star.y = star.centerY + star.spiralRadius * Math.sin(star.angle);
            
            // 脉动效果
            star.pulseAmount += star.pulseSpeed;
            star.radius = star.originalRadius + Math.sin(star.pulseAmount) * 0.5;
        });
        
        // 更新流星位置
        this.shootingStars.forEach(star => {
            star.x += Math.cos(star.angle) * star.speed;
            star.y += Math.sin(star.angle) * star.speed;
        });
    },
    
    /**
     * 绘制星空
     */
    draw() {
        // 清空画布
        this.ctx.fillStyle = 'rgba(10, 14, 41, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星星
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            this.ctx.fill();
        });
        
        // 绘制梵高风格星星
        this.vanGoghStars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color;
            this.ctx.fill();
            
            // 添加星星光晕
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(
                star.x, star.y, star.radius * 0.5,
                star.x, star.y, star.radius * 2
            );
            gradient.addColorStop(0, star.color);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
        
        // 绘制流星
        this.shootingStars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.moveTo(star.x, star.y);
            this.ctx.lineTo(
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            
            const gradient = this.ctx.createLinearGradient(
                star.x, star.y,
                star.x - Math.cos(star.angle) * star.length,
                star.y - Math.sin(star.angle) * star.length
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    },
    
    /**
     * 动画循环
     */
    animate() {
        this.updateStars();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
};

// 当DOM加载完成后初始化星空背景
document.addEventListener('DOMContentLoaded', () => Starfield.init());