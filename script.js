// Factory to represent each cell in board
let Cell = () => {

    // represents current player at cell
    let player = null;

    // change player
    const markCell = (newPlayer) => {
        player = newPlayer; 
    }

    // getter for player at cell
    const getPlayer = () => {
        return player;
    }

    // reset cell value
    const resetCellValue = () => {
        player = null;
    }

    // tells if cell is free or not
    const isFree = () => {
        return player == null;
    }

    return {getPlayer, markCell, resetCellValue, isFree};
}

// Factory to represent each player
let Player = (name, marker) => {

    let score = 0;
    const getName = () => {
        return name;
    }

    const getMarker = () => {
        return marker;
    }

    const getScore = () => {
        return score;
    }

    const updateScore = () => {
        score++;
    }

    return {getName, getMarker, getScore, updateScore};
}

// module to represent game board state
let gameboard = (() => {

    // represents board
    let board = [];

    // represents winner if there is one
    let winner = null;


    // getter for board
    const getBoard = () => {
        return board;
    }

    // getter for winner
    const getWinner = () => {
        return winner;
    }

    // creates 3 by 3 grid for board
    // all values are initialized to default cell
    const createBoard = () => {
        winner = null;
        for (let i = 0; i < 3; i++)
        {
            board[i] = [];
            for (let j = 0; j < 3; j++)
            {
                board[i][j] = Cell(i, j);
            }
        }
        return board;
    }

    // reset board by resetting each cell's value and winner
    const resetBoard = () => {
        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                board[i][j].resetCellValue();
            }
        }
        winner = null;
        return board;
    }

    // plays turn if winner has not been determined yet and cell is free
    const playTurn = (player, row, col) => {
        if (winner == null && board[row][col].isFree())
        {
            board[row][col].markCell(player);
            return true;
        }
        else return false;
    }

    // checks if winner exists
    const winnerExists = () => {

        // check rows/cols
        for (let i = 0; i < 3; i++)
        {
            let rowFound = true;
            let rowFirst = board[i][0].getPlayer();

            let colFound = true;
            let colFirst = board[0][i].getPlayer();
            for (let j = 0; j < 3; j++)
            {
                if (board[i][j] === null || board[i][j].getPlayer() !== rowFirst)
                {
                    rowFound = false;
                }

                if (board[j][i] === null || board[j][i].getPlayer() !== colFirst)
                {
                    colFound = false;
                }
            }

            if (rowFound)
            {
                winner = rowFirst;
                return rowFirst;
            } 
            else if (colFound) 
            {
                winner = colFirst;
                return colFirst;
            }
        }

        // check diagonals
        let negDiagFound = true;
        let negDiagFirst = board[0][0].getPlayer();

        let posDiagFound = true;
        let posDiagFirst = board[0][2].getPlayer();

        for (let i = 0; i < 3; i++)
        {
            if (board[i][i] === null || board[i][i].getPlayer() !== negDiagFirst)
            {
                negDiagFound = false;
            }

            if (board[i][2 - i] === null || board[i][2-i].getPlayer() !== posDiagFirst)
            {
                posDiagFound = false;
            }
        }

        if (negDiagFound)
        {
            winner = negDiagFirst;
            return negDiagFirst;
        } 
        else if (posDiagFound) 
        {
            winner = posDiagFirst;
            return posDiagFirst;
        }
        return null;
    }

    return {getBoard, createBoard, resetBoard, playTurn, winnerExists, getWinner};
})();


// module to handle display of board on screen
let displayHandler = (() => {

    // current board
    let board = gameboard.getBoard();

    // DOM elements
    let htmlBoard = document.querySelector(".board");
    let resetButton = document.querySelector(".main button");
    let startOverButton = document.querySelector(".start-over")
    let playerOneDiv = document.querySelector(".score-keeper .p1");
    let playerTwoDiv = document.querySelector(".score-keeper .p2");
    let form = document.querySelector("form");
    let main = document.querySelector(".main");
    let startMenu = document.querySelector(".start-game");
    let p1 = null;
    let p2 = null;

    

    // renders HTML on page
    const renderBoard = (player) => {
        board = gameboard.getBoard();
        updateDOM();
        setScoreKeeper();
        resetStyle();
        styleScoreKeeper(player);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // get values from input fields
        let p1name = document.querySelector("#p1-name").value;
        let p2name = document.querySelector("#p2-name").value;
        let p1marker = document.querySelector("#p1-marker").value;
        let p2marker = document.querySelector("#p2-marker").value;

        // initialize players
        p1 = Player(p1name, p1marker);
        p2 = Player(p2name, p2marker);

        // reset style
        main.style['visibility'] = 'visible';
        startMenu.style['visibility'] = 'hidden';

        // initialize game
        gameController.initializeGame(p1, p2);


    })

    // method to initialize buttons
    const addButtonHandlers = () => {
        resetButton.addEventListener('click', () => {
            gameController.newRound();
        })

        startOverButton.addEventListener('click', () => {
            main.style['visibility'] = 'hidden';
            startMenu.style['visibility'] = 'visible';
        })


    }

    const setScoreKeeper = () => {
        playerOneDiv.textContent = p1.getName() + " (" + p1.getMarker() + ") : " + p1.getScore();
        playerTwoDiv.textContent = p2.getName() + " (" + p2.getMarker() + ") : " + p2.getScore();
    }

    const styleScoreKeeper = (player) => {
        let winner = gameboard.getWinner();

        if (winner === p1)
        {
            styleWin(playerOneDiv, playerTwoDiv);
        }

        else if (winner === p2)
        {
            styleWin(playerTwoDiv, playerOneDiv);
        }

        else if (player === p1)
        {
            styleActivePlayer(playerOneDiv, playerTwoDiv);
        }

        else styleActivePlayer(playerTwoDiv, playerOneDiv);

    }

    const styleWin = (div, otherDiv) =>
    {
        div.style['background-color'] = "green";
        otherDiv.style['background-color'] = "red";
    }

    const styleActivePlayer = (div, otherDiv) => {
        div.style['border'] = "2px solid black";
        otherDiv.style['border'] = "none";
    }

    const resetStyle = () => {
        playerOneDiv.style['background-color'] = "white";
        playerOneDiv.style['border'] = "none";

        playerTwoDiv.style['background-color'] = "white";
        playerTwoDiv.style['border'] = "none";
    }


    // helper method to update DOM
    const updateDOM = () =>
    {
        htmlBoard.innerHTML = "";
        for (let i = 0; i < 3; i++)
        {
            let row = document.createElement('div');
            row.classList.add("row");
            row.classList.add(i.toString());
            for (let j = 0; j < 3; j++)
            {
                let col = document.createElement('div');
                col.classList.add("col");
                col.classList.add(j.toString());
                let player = board[i][j].getPlayer();
                col.textContent = player == null ? '' : player.getMarker();

                col.addEventListener('click', () => {
                    gameController.playTurn(i, j);
                })
                row.appendChild(col);
            }
            htmlBoard.appendChild(row);
        }
    }

    return {addButtonHandlers, renderBoard};

})();


let gameController = (() => {
    let currentPlayer = null;
    let player1 = null;
    let player2 = null;

    // initializes new game
    const initializeGame = (p1, p2) => {
        newGame(p1, p2);
        displayHandler.addButtonHandlers();
    }

    const newGame = (p1, p2) => {
        currentPlayer = p1;
        player1 = p1;
        player2 = p2;
        gameboard.createBoard();
        displayHandler.renderBoard(currentPlayer);
    }

    // resets game
    const newRound = () => {
        gameboard.resetBoard();
        resetPlayer();
        displayHandler.renderBoard(currentPlayer);
    }

    // plays a turn
    const playTurn = (row, col) => 
    {
        // update current player if move was valid
        if (gameboard.playTurn(currentPlayer, row, col))
        {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            winner = gameboard.winnerExists();
            if (winner !== null) winner.updateScore();
            displayHandler.renderBoard(currentPlayer);

        }

    }

    // resets player
    const resetPlayer = () => {
        currentPlayer = player1;
    }

    // gets current player
    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    return {initializeGame, newGame, newRound, playTurn, resetPlayer, getCurrentPlayer};

})();



