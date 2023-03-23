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

    // getter methods
    const getName = () => {
        return name;
    }

    const getMarker = () => {
        return marker;
    }

    const getScore = () => {
        return score;
    }

    // method to increment score when there's a win
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
    // returns null if no winner/tie, 0 if tie, winner if winner exists
    const winnerExists = () => {

        // checks for tie
        let cellsFilled = true;

        // check rows/cols
        for (let i = 0; i < 3; i++)
        {
            let rowFound = true;
            let rowFirst = board[i][0].getPlayer();

            let colFound = true;
            let colFirst = board[0][i].getPlayer();

            for (let j = 0; j < 3; j++)
            {
                // check for tie
                if (board[i][j].getPlayer() === null) cellsFilled = false;

                // check for current row having winner
                if (board[i][j].getPlayer() === null || board[i][j].getPlayer() !== rowFirst)
                {
                    rowFound = false;
                }

                // check for current col having winner
                if (board[j][i].getPlayer() === null || board[j][i].getPlayer() !== colFirst)
                {
                    colFound = false;
                }
            }

            // returns if found
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
            if (board[i][i].getPlayer() === null || board[i][i].getPlayer() !== negDiagFirst)
            {
                negDiagFound = false;
            }

            if (board[i][2 - i].getPlayer() === null || board[i][2-i].getPlayer() !== posDiagFirst)
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
        else if (cellsFilled)
        {
            winner = 0;
            return 0;
        }
        return null;
    }

    return {getBoard, createBoard, resetBoard, playTurn, winnerExists, getWinner};
})();


// module to handle display of board on screen
let displayHandler = (() => {

    // current board and players
    let board = gameboard.getBoard();
    let p1 = null;
    let p2 = null;

    // DOM elements
    let htmlBoard = document.querySelector(".board");
    let resetButton = document.querySelector(".reset");
    let startOverButton = document.querySelector(".start-over")
    let playerOneDiv = document.querySelector(".score-keeper .p1");
    let playerTwoDiv = document.querySelector(".score-keeper .p2");
    let winnerDiv = document.querySelector(".winner");
    let form = document.querySelector("form");
    let main = document.querySelector(".main");
    let startMenu = document.querySelector(".start-game");

    // all event listeners
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

    resetButton.addEventListener('click', () => {
        gameController.newRound();
    })

    startOverButton.addEventListener('click', () => {
        main.style['visibility'] = 'hidden';
        startMenu.style['visibility'] = 'visible';
    })

    // main method that renders and styles ALL HTML on page
    const renderBoard = (player) => {
        board = gameboard.getBoard();
        updateBoard();
        setScoreKeeper();
        resetStyle();
        styleScoreKeeper(player);
        setWinnerDiv();
    }

    // helper methods

    // helper method to set score keeper content
    const setScoreKeeper = () => {
        playerOneDiv.textContent = p1.getName() + " (" + p1.getMarker() + ") : " + p1.getScore();
        playerTwoDiv.textContent = p2.getName() + " (" + p2.getMarker() + ") : " + p2.getScore();
    }

    // helper method to set result div
    const setWinnerDiv = () => {
        let winner = gameboard.getWinner();
        let content = "Result: ";
        if (winner === 0)
        {
            content += "Tie!"
        }
        else if (winner !== null)
        {
            content += winner.getName() + " wins!";
        }
        winnerDiv.textContent = content;
    }

    // helper method to update board
    const updateBoard = () =>
    {
        // reset HTML
        htmlBoard.innerHTML = "";
        for (let i = 0; i < 3; i++)
        {
            // add rows for board
            let row = document.createElement('div');
            row.classList.add("row");
            row.classList.add(i.toString());

            for (let j = 0; j < 3; j++)
            {
                // add cols for board
                let col = document.createElement('div');
                col.classList.add("col");
                col.classList.add(j.toString());

                // set text content for cell
                let player = board[i][j].getPlayer();
                if (player === null)
                {
                    col.classList.add("unclicked");
                    col.textContent = '';
                }
                else
                {
                    col.classList.add("clicked");
                    col.textContent = player.getMarker();
                }

                // col.textContent = player == null ? '' : player.getMarker();

                // add event listener for cell
                col.addEventListener('click', () => {
                    gameController.playTurn(i, j);
                })

                // append to row
                row.appendChild(col);
            }

            // append row to board
            htmlBoard.appendChild(row);
        }
    }

    // all styling methods
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
        else if (winner === 0)
        {
            resetStyle();
        }

        else if (player === p1)
        {
            styleActivePlayer(playerOneDiv, playerTwoDiv);
        }

        else styleActivePlayer(playerTwoDiv, playerOneDiv);

    }

    // styling helper methods
    const styleWin = (div, otherDiv) =>
    {
        div.style['background-color'] = "#7AC74F";
        otherDiv.style['background-color'] = "#E87461";
    }

    const styleActivePlayer = (div, otherDiv) => {
        div.style['background-color'] = "#F49D37";
        div.style['box-shadow'] = "0px 0px 10px black"
        otherDiv.style['background-color'] = "#FFEED6";
        otherDiv.style['box-shadow'] = "none";
    }

    const resetStyle = () => {
        playerOneDiv.style['background-color'] = "#FFEED6";
        playerOneDiv.style['box-shadow'] = "none";

        playerTwoDiv.style['background-color'] = "#FFEED6";
        playerTwoDiv.style['box-shadow'] = "none";
    }

    return {renderBoard};

})();


// module to handle control of game
let gameController = (() => {

    let currentPlayer = null;
    let player1 = null;
    let player2 = null;

    // initializes new game
    const initializeGame = (p1, p2) => {
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

    // resets player
    const resetPlayer = () => {
        currentPlayer = player1;
    }

    // plays a turn
    const playTurn = (row, col) => 
    {
        // update current player if move was valid
        if (gameboard.playTurn(currentPlayer, row, col))
        {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            winner = gameboard.winnerExists();
            if (winner !== null && winner !== 0) winner.updateScore();
            displayHandler.renderBoard(currentPlayer);

        }

    }

    // gets current player
    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    return {initializeGame, newRound, playTurn, resetPlayer, getCurrentPlayer};

})();



