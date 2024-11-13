
const Gameboard = () => {
    // Initialize a 3x3 gameboard
    const board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    // Function to place a symbol on the board
    const placeSymbol = (row, col, symbol) => {
        if (board[row][col] === '') {
            board[row][col] = symbol;
            return true; // Successful move
        }
        return false; // Invalid move
    };

    // Function to check if there's a winner
    const checkWinner = (symbol) => {
        // Check rows, columns, and diagonals
        for (let i = 0; i < 3; i++) {
            if (board[i].every(cell => cell === symbol)) return true; // Check row
            if (board.every(row => row[i] === symbol)) return true; // Check column
        }
        if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) return true; // Check main diagonal
        if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return true; // Check secondary diagonal
        return false;
    };

    // Function to check for a tie
    const isTie = () => {
        return board.every(row => row.every(cell => cell !== ''));
    };

    // Function to reset the gameboard
    const reset = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = '';
            }
        }
    };

    return {
        board,
        placeSymbol,
        checkWinner,
        isTie,
        reset
    };
};

const Player = (symbol, name) => {
    return {
        symbol,
        name,
    };
};

const DomManager = () => {
    const topContainer = document.querySelector(".game.top.text");
    const bottomContainer = document.querySelector(".game.bottom.text");

    const gameConditionContainer = document.querySelector(".game.condition");

    

    const boardContainer = document.querySelector(".game.board");
    
    const createBoard = () => {
        var index = 1;
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {

                const cellElement = document.createElement("div")

                cellElement.classList.add(`cell-${index}`);

                cellElement.addEventListener("click", () => {
                    Game.playMove(i,j);
                    updateBoard(Game.getBoard());
                });
                
                boardContainer.appendChild(cellElement);

                index++;
            }
        }
    };

    const updateGameCondition = (text) => {
        gameConditionContainer.textContent = text;
    };

    const updateNames = (player, playerName) => {
        const dds = document.querySelector(`.score-container > .${player}.name`);
        dds.textContent = playerName+":";
    }

    const getPlayerName = (player) => {

        const playerNameInput = document.querySelector(`#${player}-name`);
        if(playerNameInput.value.trim() === ""){
            console.log(playerNameInput.placeholder)
            return playerNameInput.placeholder;
        }
        else {
            console.log(playerNameInput.value.trim())
            updateNames(player, playerNameInput.value.trim());
            return playerNameInput.value.trim();
        }
    }

    

    const updateBoard = (board) => {
        for(let i=0; i<3;i++) {
            for(let j=0; j<3; j++) {
                const cellId = i * 3 + j + 1;
                const cellElement = document.querySelector(`.cell-${cellId}`);
                cellElement.textContent = board[i][j];
                
            }
        }
    };

    createBoard();
    return {
        updateBoard,
        updateGameCondition,
        getPlayerName,

    };
};

const Game = (() => {
    let currentPlayer = null;
    let gameOver = false;

    const gameboard = Gameboard(); // Create a gameboard instance

    const player1 = Player('X'); // Player 1 is X
    const player2 = Player('O'); // Player 2 is O

    currentPlayer = player1; // Set Player 1 as the first player

    const domManager = DomManager();


    const switchTurn = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    };

    const playMove = (row, col) => {
        if (gameOver) return; // If game is over, don't allow moves


        player1.name = domManager.getPlayerName("player1");

        player2.name = domManager.getPlayerName("player2");

        const moveSuccessful = gameboard.placeSymbol(row, col, currentPlayer.symbol);
        if (!moveSuccessful) return; // If the move is invalid, don't proceed

        if (gameboard.checkWinner(currentPlayer.symbol)) {
            domManager.updateGameCondition(`${currentPlayer.name} wins!`)
            gameOver = true;
            console.log(`${currentPlayer.symbol} wins!`);
            return;
        } else if (gameboard.isTie()) {
            gameOver = true;
            domManager.updateGameCondition("It's a tie!")
            console.log("It's a tie!");
            return;
        }

        switchTurn(); // Switch the turn to the next player
    };

    const resetGame = () => {
        gameboard.reset();
        gameOver = false;
        currentPlayer = player1; // Reset to Player 1
    };

    return {
        playMove,
        resetGame,
        getCurrentPlayer: () => currentPlayer.symbol,
        getBoard: () => gameboard.board,
    };
})();





