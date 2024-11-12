
const Gameboard = () => {
    const board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    const placeSymbol = (row, col, symbol) => {
        if(board[row][col] === '') {
            board[row][col] = symbol;
            return true;
        }
        return false;
    };

    const checkWiner = (symbol) => {

        for(let i =0; i < 3; i++) {
            if (board[i].every(cell=>cell===symbol)) return true;
            if(board.every(row=>row[i]===symbol)) return true;
        }
        if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) return true; //main diagonal
        if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return true; //secondary diagonal
        return false;
    };

    const isTie = () =>{
        return board.every(row=>row.every(cell=>cell!==''));
    };

    const reset = () => {
        for(let i=0; i<3; i++) {
            for(let j=0; j<3;j++) {
                board[i][j] = '';
            }
        }
    };

    return {
        board,
        placeSymbol,
        checkWiner,
        isTie,
        reset
    };
}

const Player = (symbol) => {
    return {
        symbol,
    };
}

const Game = (() => {
    let currentPlayer = null;
    let gameOver = false;

    const gameboard = Gameboard(); // Create a gameboard instance
    const player1 = Player('X'); // Player 1 is X
    const player2 = Player('O'); // Player 2 is O
    currentPlayer = player1; // Set Player 1 as the first player

    const switchTurn = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    };

    const playMove = (row, col) => {
        if (gameOver) return; // If game is over, don't allow moves

        const moveSuccessful = gameboard.placeSymbol(row, col, currentPlayer.symbol);
        if (!moveSuccessful) return; // If the move is invalid, don't proceed

        if (gameboard.checkWinner(currentPlayer.symbol)) {
            gameOver = true;
            console.log(`${currentPlayer.symbol} wins!`);
            return;
        } else if (gameboard.isTie()) {
            gameOver = true;
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