const SERVER_URL = "http://192.168.215.53:5000"; // Замініть на ваш реальний сервер

async function submitScore(name, score) {
    try {
        await fetch(`${SERVER_URL}/leaderboard`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, score }),
        });

        updateLeaderboard(); // Оновлюємо лідерборд після надсилання

        // Показуємо повідомлення про успішне збереження
        const saveMessage = document.getElementById("saveMessage");
        saveMessage.style.display = "block";
        setTimeout(() => {
            saveMessage.style.display = "none";
        }, 2000);
        
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
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = ""; // Очищаємо лише список, залишаючи заголовок

    leaderboard.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${player.name} - ${player.score}`;
        leaderboardList.appendChild(li);
    });
}

// Викликаємо оновлення лідерборду при завантаженні сторінки
updateLeaderboard();

function endGame() {
    gameOver = true;
    gameOverScreen.style.display = "block";
    playerNameInputDiv.style.display = "block";
}

// Збереження результату після введення імені
saveNameButton.addEventListener("click", async () => {
    const name = playerNameInput.value.trim() || "Anonymous";
    await submitScore(name, score); // Чекаємо, поки збережеться
    resetGame(); // Потім перезапускаємо гру
});
