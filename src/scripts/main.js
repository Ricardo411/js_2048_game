'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here
class Game {
    constructor(initialState = null) {
        this.size = 4;
        this.board = initialState ? initialState.map(row => row.slice()) : this.createEmptyBoard();
        this.score = 0;
        this.status = 'start';

        if (!initialState) {
            this.addRandomTile();
            this.addRandomTile();
        }
    }

    createEmptyBoard() {
        return Array.from({ length: this.size }, () => Array(this.size).fill(0));
    }

    getState() {
        return this.board;
    }

    getScore() {
        return this.score;
    }

    getStatus() {
        return this.status;
    }

    start() {
        if (this.status === 'start') {
            this.status = 'playing';
        }
    }

    restart() {
        this.board = this.createEmptyBoard();
        this.score = 0;
        this.status = 'playing';
        this.addRandomTile();
        this.addRandomTile();
    }

    addRandomTile() {
        const emptyCells = [];

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c] === 0) emptyCells.push([r, c]);
            }
        }

        if (emptyCells.length === 0) return;

        const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }

    moveLeft() {
        const oldBoard = JSON.stringify(this.board);
        let newBoard = [];

        for (let row of this.board) {
            let newRow = row.filter(val => val !== 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow[i + 1] = 0;

                    if (newRow[i] === 2048 && this.status !== 'won') {
                        this.status = 'won';
                    }
                }
            }

            newRow = newRow.filter(val => val !== 0);
            while (newRow.length < this.size) {
                newRow.push(0);
            }
            newBoard.push(newRow);
        }

        this.board = newBoard;

        if (JSON.stringify(this.board) !== oldBoard) {
            this.addRandomTile();
            if (!this.canMove()) this.status = 'over';
        }
    }

    moveRight() {
        this.reverseRows();
        this.moveLeft();
        this.reverseRows();
    }

    moveUp() {
        this.transpose();
        this.moveLeft();
        this.transpose();
    }

    moveDown() {
        this.transpose();
        this.moveRight();
        this.transpose();
    }

    reverseRows() {
        this.board = this.board.map(row => row.reverse());
    }

    transpose() {
        const transposed = this.createEmptyBoard();
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                transposed[i][j] = this.board[j][i];
            }
        }
        this.board = transposed;
    }

    canMove() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const val = this.board[r][c];
                if (val === 0) return true;


                if (c < this.size - 1 && val === this.board[r][c + 1]) return true;


                if (r < this.size - 1 && val === this.board[r + 1][c]) return true;
            }
        }
        return false;
    }
}
}

module.exports = Game;











