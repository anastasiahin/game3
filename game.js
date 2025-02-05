const SERVER_URL = "http://localhost:5000"; // Заміни на свій сервер

async function submitScore(name, score) {
    try {
        await fetch(`${SERVER_URL}/leaderboard`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, score }),
        });
        updateLeaderboard();
    } catch (error) {
        console.error("Помилка надсилання результату:", error);
    }
}

async function updateLeaderboard() {
    try {
        const response = await fetch(`${SERVER_URL}/leaderboard`);
        const leaderboard = await response.json();
        displayLeaderboard(leaderboard);
    } catch (error) {
        console.error("Помилка отримання лідерборду:", error);
    }
}

function displayLeaderboard(leaderboard) {
    const leaderboardDiv = document.getElementById("leaderboard");
    leaderboardDiv.innerHTML = "<b>🏆 Топ-10 гравців:</b><br>";

    leaderboard.forEach((player, index) => {
        leaderboardDiv.innerHTML += `${index + 1}. ${player.name} - ${player.score}<br>`;
    });
}

// Викликаємо оновлення лідерборду на старті
updateLeaderboard();

// Змінюємо кінець гри, щоб зберігати результат
function endGame() {
    gameOver = true;
    gameOverScreen.style.display = "block";
    playerNameInputDiv.style.display = "block";
}

// При натисканні Enter відправляємо результат
document.addEventListener("keydown", event => {
    if (gameOver && event.code === "Enter") {
        const name = playerNameInput.value.trim() || "Anonymous";
        submitScore(name, score);
        resetGame();
    }
});

