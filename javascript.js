// Dane gry
let gameState = {
    currentPlayer: 1,
    players: [
        { position: 0, money: 1000 },
        { position: 0, money: 1000 }
    ],
    cells: [],
    gameOver: false
};

// Typy pól
const cellTypes = [
    { type: 'start', label: 'START', emoji: '🏁', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'bonus', label: 'BONUS', emoji: '⭐', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'penalty', label: 'KARA', emoji: '❌', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'bonus', label: 'BONUS', emoji: '⭐', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'penalty', label: 'KARA', emoji: '❌', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'bonus', label: 'BONUS', emoji: '⭐', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'penalty', label: 'KARA', emoji: '❌', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'bonus', label: 'BONUS', emoji: '⭐', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'penalty', label: 'KARA', emoji: '❌', price: 0 },
{ type: 'normal', label: 'Ulica', emoji: '🏠', price: 100 },
{ type: 'bonus', label: 'BONUS', emoji: '⭐', price: 0 }
];

// Inicjalizacja gry
function initGame() {
    gameState.cells = cellTypes.map(cell => ({ ...cell, owner: null }));
    createBoard();
    updateDisplay();
}

// Tworzenie planszy
function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    gameState.cells.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.className = `cell ${cell.type}`;
        cellDiv.id = `cell-${index}`;

        let ownerClass = '';
        if (cell.owner === 0) ownerClass = 'owned1';
        if (cell.owner === 1) ownerClass = 'owned2';
        cellDiv.className += ` ${ownerClass}`;

        cellDiv.innerHTML = `
        <div>${cell.emoji}</div>
        <div class="cell-label">${cell.label}</div>
        <div class="players" id="players-${index}"></div>
        `;

        board.appendChild(cellDiv);
    });

    updatePlayerPositions();
}

// Aktualizacja pozycji graczy
function updatePlayerPositions() {
    // Wyczyść wszystkie pozycje
    document.querySelectorAll('.players').forEach(el => el.innerHTML = '');

    // Dodaj graczy na ich pozycje
    gameState.players.forEach((player, index) => {
        const playersDiv = document.getElementById(`players-${player.position}`);
        const marker = document.createElement('span');
        marker.className = 'player-marker';
        marker.textContent = index === 0 ? '🔵' : '🔴';
        playersDiv.appendChild(marker);
    });
}

// Rzut kostką
function rollDice() {
    if (gameState.gameOver) return;

    const diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-result').textContent = `🎲 ${diceValue}`;

    const playerIndex = gameState.currentPlayer - 1;
    const player = gameState.players[playerIndex];

    // Ruch gracza
    player.position = (player.position + diceValue) % gameState.cells.length;

    // Sprawdzenie przejścia przez start
    if (player.position < diceValue && player.position !== 0) {
        player.money += 200;
        showMessage('🎉 Przeszedłeś przez START! +200 💰');
    }

    setTimeout(() => {
        handleCellAction(playerIndex);
        updateDisplay();
        updatePlayerPositions();

        // Sprawdzenie bankructwa
        if (player.money <= 0) {
            gameState.gameOver = true;
            showMessage(`🏆 Gracz ${3 - gameState.currentPlayer} WYGRAŁ!`);
            document.getElementById('roll-btn').disabled = true;
            return;
        }

        // Zmiana tury
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        updateDisplay();
    }, 500);
}

// Akcja na polu
function handleCellAction(playerIndex) {
    const player = gameState.players[playerIndex];
    const cell = gameState.cells[player.position];

    if (cell.type === 'start') {
        showMessage('🏁 Jesteś na starcie!');
    }
    else if (cell.type === 'bonus') {
        player.money += 100;
        showMessage('⭐ BONUS! +100 💰');
    }
    else if (cell.type === 'penalty') {
        player.money -= 50;
        showMessage('❌ KARA! -50 💰');
    }
    else if (cell.type === 'normal') {
        if (cell.owner === null) {
            // Pole wolne - można kupić
            if (player.money >= cell.price) {
                player.money -= cell.price;
                cell.owner = playerIndex;
                showMessage(`🏠 Kupiłeś ulicę za ${cell.price} 💰`);
                createBoard(); // Przerysuj planszę
            } else {
                showMessage('💸 Nie masz wystarczająco pieniędzy');
            }
        }
        else if (cell.owner !== playerIndex) {
            // Pole należy do innego gracza - płacimy czynsz
            const rent = 50;
            player.money -= rent;
            gameState.players[cell.owner].money += rent;
            showMessage(`🏠 Zapłaciłeś czynsz ${rent} 💰 graczowi ${cell.owner + 1}`);
        }
        else {
            showMessage('🏠 To twoja własność!');
        }
    }
}

// Pokazanie wiadomości
function showMessage(msg) {
    document.getElementById('message').textContent = msg;
}

// Aktualizacja wyświetlania
function updateDisplay() {
    document.getElementById('player1-money').textContent = gameState.players[0].money;
    document.getElementById('player1-position').textContent = gameState.players[0].position;
    document.getElementById('player2-money').textContent = gameState.players[1].money;
    document.getElementById('player2-position').textContent = gameState.players[1].position;
    document.getElementById('turn').textContent = gameState.currentPlayer;
}

// Reset gry
function resetGame() {
    gameState = {
        currentPlayer: 1,
        players: [
            { position: 0, money: 1000 },
            { position: 0, money: 1000 }
        ],
        cells: [],
        gameOver: false
    };
    document.getElementById('roll-btn').disabled = false;
    document.getElementById('dice-result').textContent = '';
    document.getElementById('message').textContent = '';
    initGame();
}

// Uruchomienie gry
initGame();
