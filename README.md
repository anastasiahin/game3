<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Avoid the Blocks!</title>
    <style>
        body { text-align: center; background-color: lightgray; }
        canvas { background: white; display: block; margin: auto; }
        #gameOver { display: none; font-size: 24px; font-weight: bold; color: red; }
    </style>
</head>
<body>
    <h1>Avoid the Blocks!</h1>
    <canvas id="gameCanvas"></canvas>
    <p id="score">Score: 0</p>
    <p id="gameOver">Game Over! Press 'R' to Restart</p>
    
    <script>
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        canvas.width = 1000;
        canvas.height = 700;

        const playerSize = 30;
        const blockSize = 30;
        let playerX = canvas.width / 2 - playerSize / 2;
        let playerY = canvas.height - playerSize;
        let moveLeft = false;
        let moveRight = false;

        let blocks = [];
        let score = 0;
        let gameOver = false;

        function drawPlayer() {
            ctx.fillStyle = "darkviolet";
            ctx.fillRect(playerX, playerY, playerSize, playerSize);
        }

        function drawBlocks() {
            ctx.fillStyle = "pink";
            blocks.forEach(block => ctx.fillRect(block.x, block.y, blockSize, blockSize));
        }

        function updateBlocks() {
            blocks.forEach(block => block.y += block.speed);
            blocks = blocks.filter(block => block.y < canvas.height);

            if (Math.random() * 400 < 30 + (score / 10) * 5) {
                blocks.push({ x: Math.random() * (canvas.width - blockSize), y: 0, speed: 3 + (score / 25) });
            }
        }

        function checkCollision() {
            for (let block of blocks) {
                if (
                    block.x < playerX + playerSize &&
                    block.x + blockSize > playerX &&
                    block.y < playerY + playerSize &&
                    block.y + blockSize > playerY
                ) {
                    gameOver = true;
                    document.getElementById("gameOver").style.display = "block";
                }
            }
        }

        function update() {
            if (!gameOver) {
                if (moveLeft && playerX > 0) playerX -= 6;
                if (moveRight && playerX < canvas.width - playerSize) playerX += 6;

                updateBlocks();
                checkCollision();

                score++;
                document.getElementById("score").textContent = "Score: " + score;
            }

            draw();
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer();
            drawBlocks();
        }

        function resetGame() {
            gameOver = false;
            playerX = canvas.width / 2 - playerSize / 2;
            blocks = [];
            score = 0;
            document.getElementById("score").textContent = "Score: 0";
            document.getElementById("gameOver").style.display = "none";
        }

        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") moveLeft = true;
            if (event.key === "ArrowRight") moveRight = true;
            if (event.key === "r" && gameOver) resetGame();
        });

        window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowLeft") moveLeft = false;
            if (event.key === "ArrowRight") moveRight = false;
        });

        setInterval(update, 16);
    </script>
</body>
</html>
