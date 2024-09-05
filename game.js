// Configurações do Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Configurações do jogo
const rocketWidth = 50;
const rocketHeight = 30;
const asteroidSize = 40;
const rocketSpeed = 5;
const asteroidSpeed = 2;
const projectileWidth = 5;
const projectileHeight = 20;
const projectileSpeed = 7;
const energyBarWidth = 100;
const energyBarHeight = 10;
const energyDecrement = 0.5; // Quantidade de energia reduzida por disparo automático
const energyRechargeRate = 0.1; // Taxa de recarga da energia
const autoFireInterval = 200; // Intervalo para disparo automático em milissegundos

// Dados do jogo
let rocketX = canvas.width / 2 - rocketWidth / 2;
let rocketY = canvas.height - rocketHeight - 10;
let asteroids = [];
let projectiles = [];
let keys = {};
let score = 0;
let energy = 100; // Energia inicial
let lastFireTime = 0;

// Função para desenhar o foguete
function drawRocket() {
    ctx.fillStyle = 'green';
    ctx.fillRect(rocketX, rocketY, rocketWidth, rocketHeight);
}

// Função para desenhar um asteroide
function drawAsteroid(x, y) {
    ctx.fillStyle = 'orange';
    ctx.fillRect(x, y, asteroidSize, asteroidSize);
}

// Função para desenhar um projétil
function drawProjectile(x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, projectileWidth, projectileHeight);
}

// Função para desenhar a pontuação
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Pontuação: ${score}`, 10, 30);
}

// Função para desenhar a barra de energia
function drawEnergyBar() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(10, 50, energyBarWidth, energyBarHeight);
    ctx.fillStyle = 'lime';
    ctx.fillRect(10, 50, energyBarWidth * (energy / 100), energyBarHeight);
}

// Função para atualizar a posição dos asteroides
function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].y += asteroidSpeed;
        if (asteroids[i].y > canvas.height) {
            asteroids.splice(i, 1); // Remove asteroides que saíram da tela
        }
    }
}

// Função para adicionar um novo asteroide
function addAsteroid() {
    const x = Math.random() * (canvas.width - asteroidSize);
    asteroids.push({ x: x, y: -asteroidSize });
}

// Função para atualizar a posição dos projéteis
function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].y -= projectileSpeed;
        if (projectiles[i].y < 0) {
            projectiles.splice(i, 1); // Remove projéteis que saíram da tela
        }
    }
}

// Função para verificar colisões
function checkCollisions() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        if (rocketX < asteroid.x + asteroidSize &&
            rocketX + rocketWidth > asteroid.x &&
            rocketY < asteroid.y + asteroidSize &&
            rocketY + rocketHeight > asteroid.y) {
            alert('Game Over!');
            document.location.reload();
            return;
        }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectile = projectiles[i];
        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            if (projectile.x < asteroid.x + asteroidSize &&
                projectile.x + projectileWidth > asteroid.x &&
                projectile.y < asteroid.y + asteroidSize &&
                projectile.y + projectileHeight > asteroid.y) {
                asteroids.splice(j, 1); // Remove o asteroide atingido
                projectiles.splice(i, 1); // Remove o projétil que atingiu o asteroide
                score++; // Incrementa a pontuação
                break;
            }
        }
    }
}

// Função para disparar projéteis
function shootProjectile() {
    if (energy > energyDecrement) {
        projectiles.push({
            x: rocketX + rocketWidth / 2 - projectileWidth / 2,
            y: rocketY
        });
        energy -= energyDecrement; // Reduz a energia
        lastFireTime = Date.now();
    }
}

// Função para atualizar o jogo
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRocket();
    updateAsteroids();
    updateProjectiles();
    for (let asteroid of asteroids) {
        drawAsteroid(asteroid.x, asteroid.y);
    }
    for (let projectile of projectiles) {
        drawProjectile(projectile.x, projectile.y);
    }
    drawScore();
    drawEnergyBar();
    checkCollisions();
    if (Math.random() < 0.02) addAsteroid(); // Adiciona um asteroide com chance
}

// Função para controlar o foguete
function handleKeydown(event) {
    keys[event.key] = true;
}
function handleKeyup(event) {
    keys[event.key] = false;
}

// Função para mover o foguete
function moveRocket() {
    if (keys['ArrowLeft'] && rocketX > 0) {
        rocketX -= rocketSpeed;
    }
    if (keys['ArrowRight'] && rocketX < canvas.width - rocketWidth) {
        rocketX += rocketSpeed;
    }
}

// Função para recarregar a energia
function rechargeEnergy() {
    if (energy < 100) {
        energy += energyRechargeRate;
        if (energy > 100) energy = 100; // Limita a energia a 100
    }
}

// Função principal de animação
function gameLoop() {
    const now = Date.now();
    const timeSinceLastFire = now - lastFireTime;

    moveRocket();
    update();
    
    if (keys[' '] && timeSinceLastFire >= autoFireInterval) {
        shootProjectile();
    }

    rechargeEnergy(); // Recarrega a energia ao longo do tempo

    requestAnimationFrame(gameLoop);
}

// Eventos de teclado
document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);

// Inicia o jogo
gameLoop();
