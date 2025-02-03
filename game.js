// Отримуємо доступ до елементів
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highscore");
const bestPlayerEl = document.getElementById("bestPlayer");

// Налаштування гри
canvas.width = 800;
canvas.height = 600;
const PLAYER_SIZE = 30;
const BLOCK_SIZE = 30;
let score = 0;
let highScore = 0;
let bestPlayer = "Немає";
let gameOver = false;

// Гравець
const player = {
    x: canvas.width / 2 - PLAYER_SIZE / 2,
    y: canvas.height - PLAYER_SIZE - 10,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    color: "darkviolet",
    speed: 6,
    dx: 0
};

// Блоки, які падають
let blocks = [];

// Функція для малювання прямокутника
function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

// Функція оновлення гри
function update() {
    if (gameOver) return;

    // Очищаємо екран
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Малюємо гравця
    drawRect(player.x, player.y, player.width, player.height, player.color);

    // Оновлюємо позицію гравця
    player.x += player.dx;

    // Обмеження руху гравця в межах екрану
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

    // Додаємо новий блок випадковим чином
    if (Math.random() < 0.02) {
        blocks.push({
            x: Math.random() * (canvas.width - BLOCK_SIZE),
            y: 0,
            width: BLOCK_SIZE,
            height: BLOCK_SIZE,
            speed: 3 + score / 20 // Збільшення швидкості з часом
        });
    }

    // Оновлюємо блоки
    for (let i = 0; i < blocks.length; i++) {
        let block = blocks[i];
        block.y += block.speed;

        // Малюємо блок
        drawRect(block.x, block.y, block.width, block.height, "pink");

        // Перевірка на зіткнення з гравцем
        if (
            block.x < player.x + player.width &&
            block.x + block.width > player.x &&
            block.y < player.y + player.height &&
            block.y + block.height > player.y
        ) {
            endGame();
            return;
        }

        // Видаляємо блоки, які впали за межі екрану
        if (block.y > canvas.height) {
            blocks.splice(i, 1);
            score++;
            scoreEl.textContent = score;
        }
    }

    requestAnimationFrame(update);
}

// Завершення гри
function endGame() {
    gameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Гра закінчена! Натисни R для перезапуску", canvas.width / 4, canvas.height / 2);

    if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;

        let playerName = prompt("Вітаємо! Новий рекорд! Введи своє ім'я:");
        if (playerName) {
            bestPlayer = playerName;
            bestPlayerEl.textContent = bestPlayer;
        }
    }
}

// Перезапуск гри
function resetGame() {
    gameOver = false;
    score = 0;
    scoreEl.textContent = score;
    player.x = canvas.width / 2 - PLAYER_SIZE / 2;
    blocks = [];
    update();
}

// Управління клавішами
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        player.dx = -player.speed;
    }
    if (e.key === "ArrowRight") {
        player.dx = player.speed;
    }
    if (e.key === "r" || e.key === "R") {
        resetGame();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        player.dx = 0;
    }
});

// Запуск гри
update();
