// Simple menu toggle for mobile
document.querySelector(".menu-btn").addEventListener("click", () => {
     document.querySelector(".nav-menu").classList.toggle("show");
   });

// Scroll reveal animations
ScrollReveal().reveal('.showcase');
ScrollReveal().reveal('.portfolio-screenshot', { delay: 500 });
ScrollReveal().reveal('.social', { delay: 500 });

// Tetris Game
const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const COLORS = ['#000', '#9fc131', '#5fd3c7', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];

let board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
let score = 0;
let level = 1;
let lines = 0;
let dropTime = 1000;
let lastTime = 0;
let gameRunning = false;

const TETROMINOES = [
    [], // empty
    [ // I
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    [ // O
        [2,2],
        [2,2]
    ],
    [ // T
        [0,3,0],
        [3,3,3],
        [0,0,0]
    ],
    [ // S
        [0,4,4],
        [4,4,0],
        [0,0,0]
    ],
    [ // Z
        [5,5,0],
        [0,5,5],
        [0,0,0]
    ],
    [ // J
        [6,0,0],
        [6,6,6],
        [0,0,0]
    ],
    [ // L
        [0,0,7],
        [7,7,7],
        [0,0,0]
    ]
];

class Piece {
    constructor(type) {
        this.type = type;
        this.shape = TETROMINOES[type];
        this.x = Math.floor(COLS / 2) - Math.floor(this.shape[0].length / 2);
        this.y = 0;
    }

    rotate() {
        const rotated = this.shape[0].map((_, i) =>
            this.shape.map(row => row[i]).reverse()
        );
        if (!this.collision(0, 0, rotated)) {
            this.shape = rotated;
        }
    }

    collision(x, y, shape = this.shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const newX = this.x + col + x;
                    const newY = this.y + row + y;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && board[newY][newX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    move(dx, dy) {
        if (!this.collision(dx, dy)) {
            this.x += dx;
            this.y += dy;
            return true;
        }
        return false;
    }

    drop() {
        while (this.move(0, 1)) {}
        this.lock();
    }

    lock() {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col] !== 0) {
                    board[this.y + row][this.x + col] = this.type;
                }
            }
        }
        clearLines();
        spawnPiece();
    }
}

let currentPiece;

function spawnPiece() {
    const type = Math.floor(Math.random() * 7) + 1;
    currentPiece = new Piece(type);
    if (currentPiece.collision(0, 0)) {
        gameOver();
    }
}

function clearLines() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            lines++;
            score += 100 * level;
            level = Math.floor(lines / 10) + 1;
            dropTime = Math.max(100, 1000 - (level - 1) * 50);
            updateUI();
            row++; // check the same row again
        }
    }
}

function gameOver() {
    gameRunning = false;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 40);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw board
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col] !== 0) {
                ctx.fillStyle = COLORS[board[row][col]];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
    // Draw current piece
    if (currentPiece) {
        ctx.fillStyle = COLORS[currentPiece.type];
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col] !== 0) {
                    ctx.fillRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                    ctx.strokeStyle = '#000';
                    ctx.lineWidth = 1;
                    ctx.strokeRect((currentPiece.x + col) * BLOCK_SIZE, (currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            }
        }
    }
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, i * BLOCK_SIZE);
        ctx.stroke();
    }
    for (let i = 0; i <= COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(i * BLOCK_SIZE, 0);
        ctx.lineTo(i * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }
}

function updateUI() {
    scoreElement.textContent = `Score: ${score}`;
    levelElement.textContent = `Level: ${level}`;
    linesElement.textContent = `Lines: ${lines}`;
}

function gameLoop(time = 0) {
    if (!gameRunning) return;
    const deltaTime = time - lastTime;
    lastTime = time;
    if (deltaTime > dropTime) {
        if (!currentPiece.move(0, 1)) {
            currentPiece.lock();
        }
        lastTime = time;
    }
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    score = 0;
    level = 1;
    lines = 0;
    dropTime = 1000;
    gameRunning = true;
    spawnPiece();
    updateUI();
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning && e.key === 'r') {
        startGame();
        return;
    }
    if (!gameRunning) return;
    switch (e.key) {
        case 'ArrowLeft':
            currentPiece.move(-1, 0);
            break;
        case 'ArrowRight':
            currentPiece.move(1, 0);
            break;
        case 'ArrowDown':
            currentPiece.move(0, 1);
            break;
        case 'ArrowUp':
            currentPiece.rotate();
            break;
        case ' ':
            e.preventDefault();
            currentPiece.drop();
            break;
    }
});

// Start game on page load
startGame();