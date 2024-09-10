export class Asteroid {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }

    draw(ctx) {
        ctx.fillStyle = 'orange';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.y += this.speed;
    }

    isOutOfBounds(canvasHeight) {
        return this.y > canvasHeight;
    }
}
