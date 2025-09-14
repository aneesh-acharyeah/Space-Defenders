// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');

let score = 0;
let level = 1;
let isGameOver = false;
let spaceship = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 50, speed: 5 };
let bullets = [];
let aliens = [];
let alienSpeed = 2;
let alienDirection = 1;  // 1 for right, -1 for left
let powerUps = [];
let gameInterval;

// Spaceship and Bullet movement
const spaceshipImage = new Image();
spaceshipImage.src = 'https://example.com/spaceship.png'; // You can replace this with an actual image URL or use a shape

// Alien Properties
const alienImage = new Image();
alienImage.src = 'https://example.com/alien.png'; // Alien image URL

// Power-up Properties
const powerUpImage = new Image();
powerUpImage.src = 'https://example.com/powerup.png'; // Power-up image URL

// Draw functions
function drawSpaceship() {
  ctx.drawImage(spaceshipImage, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawBullet(bullet) {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(bullet.x, bullet.y, 5, 10);
}

function drawAlien(alien) {
  ctx.drawImage(alienImage, alien.x, alien.y, alien.width, alien.height);
}

function drawPowerUp(powerUp) {
  ctx.drawImage(powerUpImage, powerUp.x, powerUp.y, 20, 20);
}

// Create Alien
function createAlien() {
  let x = Math.random() * (canvas.width - 40);
  let alien = { x: x, y: -40, width: 40, height: 40, speed: alienSpeed };
  aliens.push(alien);
}

// Create Bullet
function createBullet() {
  let bullet = { x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y, speed: 4 };
  bullets.push(bullet);
}

// Check for Collision with Aliens
function checkCollisions() {
  for (let i = 0; i < aliens.length; i++) {
    for (let j = 0; j < bullets.length; j++) {
      let alien = aliens[i];
      let bullet = bullets[j];

      if (bullet.x < alien.x + alien.width &&
        bullet.x + 5 > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + 10 > alien.y) {
        aliens.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        scoreDisplay.textContent = score;
      }
    }
  }
}

// Move Aliens
function moveAliens() {
  for (let alien of aliens) {
    alien.y += alien.speed;
  }

  // Reverse Alien Direction when hitting borders
  if (aliens.length > 0) {
    let firstAlien = aliens[0];
    let lastAlien = aliens[aliens.length - 1];
    if (firstAlien.x <= 0 || lastAlien.x + lastAlien.width >= canvas.width) {
      alienDirection *= -1;
      aliens.forEach(alien => alien.y += 20);  // Move aliens down when changing direction
    }

    for (let alien of aliens) {
      alien.x += alienDirection * 2;
    }
  }
}

// Check for Game Over
function checkGameOver() {
  for (let alien of aliens) {
    if (alien.y + alien.height >= spaceship.y) {
      isGameOver = true;
      alert('Game Over!');
      clearInterval(gameInterval);
    }
  }
}

// Move Spaceship
function moveSpaceship() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && spaceship.x > 0) {
      spaceship.x -= spaceship.speed;
    } else if (e.key === 'ArrowRight' && spaceship.x < canvas.width - spaceship.width) {
      spaceship.x += spaceship.speed;
    } else if (e.key === ' ' && !isGameOver) {
      createBullet();
    }
  });
}

// Update Game State
function update() {
  if (isGameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSpaceship();
  moveAliens();

  for (let bullet of bullets) {
    bullet.y -= bullet.speed;
    drawBullet(bullet);
  }

  for (let alien of aliens) {
    drawAlien(alien);
  }

  checkCollisions();
  checkGameOver();

  if (aliens.length === 0) {
    level += 1;
    levelDisplay.textContent = level;
    alienSpeed += 0.5;
    createAlienWave();
  }
}

// Create Alien Wave
function createAlienWave() {
  let numberOfAliens = level * 5;
  for (let i = 0; i < numberOfAliens; i++) {
    createAlien();
  }
}

// Start Game
function startGame() {
  createAlienWave();
  gameInterval = setInterval(update, 1000 / 60); // 60 FPS
}

startGame();
