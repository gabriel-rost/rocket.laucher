export class Rocket {
    constructor(x, y, width, height, speed, energy) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.energy = energy;
        this.projectiles = [];
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(keys, canvasWidth) {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        }
    }

    shoot() {
        if (this.energy > 0) {
            this.projectiles.push({ x: this.x + this.width / 2 - 2.5, y: this.y, width: 5, height: 20, speed: 7 });
            this.energy -= 0.5;
        }
    }

    recharge() {
        this.energy += 0.1;
        if (this.energy > 100) this.energy = 100;
    }

    drawEnergyBar(ctx) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(10, 50, 100, 10);
        ctx.fillStyle = 'lime';
        ctx.fillRect(10, 50, 100 * (this.energy / 100), 10);
    }
}
