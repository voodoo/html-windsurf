class Game2048 {
    constructor(size = 4) {
        this.size = size;
        this.board = Array(size).fill().map(() => Array(size).fill(0));
        this.score = 0;
        this.gameBoard = document.getElementById('game-board');
        this.scoreDisplay = document.getElementById('score');
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.scoreDisplay.textContent = this.score;
        this.gameBoard.innerHTML = '';
        
        // Create grid cells
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.classList.add('tile');
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.gameBoard.appendChild(cell);
            }
        }
        
        // Add first two tiles
        this.addRandomTile();
        this.addRandomTile();
        this.updateBoard();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': this.move('up'); break;
                case 'ArrowDown': this.move('down'); break;
                case 'ArrowLeft': this.move('left'); break;
                case 'ArrowRight': this.move('right'); break;
            }
        });

        document.getElementById('new-game').addEventListener('click', () => {
            this.initializeGame();
        });
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }

        if (emptyCells.length > 0) {
            const {row, col} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    move(direction) {
        let moved = false;
        const oldBoard = this.board.map(row => [...row]);

        switch(direction) {
            case 'up': moved = this.moveUp(); break;
            case 'down': moved = this.moveDown(); break;
            case 'left': moved = this.moveLeft(); break;
            case 'right': moved = this.moveRight(); break;
        }

        // Only add a new tile and update if the board actually changed
        if (this.boardChanged(oldBoard)) {
            this.addRandomTile();
            this.updateBoard();
        }
    }

    boardChanged(oldBoard) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (oldBoard[i][j] !== this.board[i][j]) {
                    return true;
                }
            }
        }
        return false;
    }

    moveUp() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = 0; row < this.size; row++) {
                if (this.board[row][col] !== 0) {
                    column.push(this.board[row][col]);
                }
            }
            
            const mergedColumn = this.mergeTiles(column);
            
            for (let row = 0; row < this.size; row++) {
                const newValue = row < mergedColumn.length ? mergedColumn[row] : 0;
                if (this.board[row][col] !== newValue) {
                    moved = true;
                }
                this.board[row][col] = newValue;
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = this.size - 1; row >= 0; row--) {
                if (this.board[row][col] !== 0) {
                    column.push(this.board[row][col]);
                }
            }
            
            const mergedColumn = this.mergeTiles(column);
            
            for (let row = this.size - 1; row >= 0; row--) {
                const newValue = this.size - 1 - row < mergedColumn.length ? mergedColumn[this.size - 1 - row] : 0;
                if (this.board[row][col] !== newValue) {
                    moved = true;
                }
                this.board[row][col] = newValue;
            }
        }
        return moved;
    }

    moveLeft() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const currentRow = [];
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] !== 0) {
                    currentRow.push(this.board[row][col]);
                }
            }
            
            const mergedRow = this.mergeTiles(currentRow);
            
            for (let col = 0; col < this.size; col++) {
                const newValue = col < mergedRow.length ? mergedRow[col] : 0;
                if (this.board[row][col] !== newValue) {
                    moved = true;
                }
                this.board[row][col] = newValue;
            }
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let row = 0; row < this.size; row++) {
            const currentRow = [];
            for (let col = this.size - 1; col >= 0; col--) {
                if (this.board[row][col] !== 0) {
                    currentRow.push(this.board[row][col]);
                }
            }
            
            const mergedRow = this.mergeTiles(currentRow);
            
            for (let col = this.size - 1; col >= 0; col--) {
                const newValue = this.size - 1 - col < mergedRow.length ? mergedRow[this.size - 1 - col] : 0;
                if (this.board[row][col] !== newValue) {
                    moved = true;
                }
                this.board[row][col] = newValue;
            }
        }
        return moved;
    }

    mergeTiles(tiles) {
        const mergedTiles = [];
        for (let i = 0; i < tiles.length; i++) {
            if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
                const mergedValue = tiles[i] * 2;
                this.score += mergedValue;
                mergedTiles.push(mergedValue);
                i++;
            } else {
                mergedTiles.push(tiles[i]);
            }
        }
        return mergedTiles;
    }

    updateBoard() {
        this.scoreDisplay.textContent = this.score;
        const tiles = this.gameBoard.querySelectorAll('.tile');
        
        tiles.forEach((tile, index) => {
            const row = Math.floor(index / this.size);
            const col = index % this.size;
            const value = this.board[row][col];
            
            tile.textContent = value !== 0 ? value : '';
            tile.className = 'tile';
            if (value !== 0) {
                tile.classList.add(`tile-${value}`);
            }
        });

        // Check for game over
        if (this.isGameOver()) {
            alert('Game Over! Your score: ' + this.score);
        }
    }

    isGameOver() {
        // Check if any cell is empty
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
                
                // Check if any adjacent cells can be merged
                const current = this.board[row][col];
                if (row > 0 && this.board[row-1][col] === current) return false;
                if (row < this.size-1 && this.board[row+1][col] === current) return false;
                if (col > 0 && this.board[row][col-1] === current) return false;
                if (col < this.size-1 && this.board[row][col+1] === current) return false;
            }
        }
        return true;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});
