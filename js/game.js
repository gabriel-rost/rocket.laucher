import { Rocket } from './rocket.js';
import { Asteroid } from './asteroid.js';
import { Projectile } from './projectile.js';

class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.rocket = new Rocket(canvas.width / 2 - 25, canvas.height - 40, 50, 30, 5, 100);
        this.asteroids = [];
        this.keys = {};
        this.score = 0;
        this.lastFireTime = 0;
        this.autoFireInterval = 200;
    }

    addAsteroid() {
        const x = Math.random() * (this.canvas.width - 40);
        this.asteroids.push(new Asteroid(x, -40, 40, 2));
    }

    updateAsteroids() {
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            let asteroid = this.asteroids[i];
            asteroid.update();
            if (asteroid.isOutOfBounds(this.canvas.height)) {
                this.asteroids.splice(i, 1);
            }
        }
    }

    updateProjectiles() {
        for (let i = this.rocket.projectiles.length - 1; i >= 0; i--) {
            let projectile = this.rocket.projectiles[i];
            projectile.y -= 7;
            if (projectile.y < 0) {
                this.rocket.projectiles.splice(i, 1);
            }
        }
    }

    checkCollisions() {
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            let asteroid = this.asteroids[i];
            if (this.rocket.x < asteroid.x + asteroid.size &&
                this.rocket.x + this.rocket.width > asteroid.x &&
                this.rocket.y < asteroid.y + asteroid.size &&
                this.rocket.y + this.rocket.height > asteroid.y) {
                alert('Game Over!');
                document.location.reload();
                return;
            }
        }

        for (let i = this.rocket.projectiles.length - 1; i >= 0; i--) {
            let projectile = this.rocket.projectiles[i];
            for (let j = this.asteroids.length - 1; j >= 0; j--) {
                let asteroid = this.asteroids[j];
                if (projectile.x < asteroid.x + asteroid.size &&
                    projectile.x + projectile.width > asteroid.x &&
                    projectile.y < asteroid.y + asteroid.size &&
                    projectile.y + projectile.height > asteroid.y) {
                    this.asteroids.splice(j, 1);
                    this.rocket.projectiles.splice(i, 1);
                    this.score++;
                    break;
                }
            }
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.rocket.move(this.keys, this.canvas.width);
        this.updateAsteroids();
        this.updateProjectiles();
        this.checkCollisions();

        this.rocket.draw(this.ctx);
        this.rocket.drawEnergyBar(this.ctx);

        for (let asteroid of this.asteroids) {
            asteroid.draw(this.ctx);
        }

        for (let projectile of this.rocket.projectiles) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(projectile.x, projectile.y, 5, 20);
        }

        this.ctx.fillStyle = 'white';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Pontuação: ${this.score}`, 10, 30);
    }

    gameLoop() {
        const now = Date.now();
        const timeSinceLastFire = now - this.lastFireTime;

        if (this.keys[' '] && timeSinceLastFire >= this.autoFireInterval) {
            this.rocket.shoot();
            this.lastFireTime = now;
        }

        this.rocket.recharge();

        if (Math.random() < 0.02) {
            this.addAsteroid();
        }

        this.update();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    start() {
        document.addEventListener('keydown', (event) => this.keys[event.key] = true);
        document.addEventListener('keyup', (event) => this.keys[event.key] = false);
        this.gameLoop();
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(canvas, ctx);
game.start();
