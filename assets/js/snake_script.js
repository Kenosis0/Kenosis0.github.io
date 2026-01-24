const snake_canvas = document.getElementById('gameCanvas');
const snake_ctx = snake_canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('finalScore');
const gameOverScreen = document.getElementById('gameOverScreen');

const TILE = 20;
const GRID = 25;
const SPEED = 100;

let snake, food, dir, nextDir, score, loop, running;

function init() {
    snake = [{x: 5, y: 5}, {x: 4, y: 5}, {x: 3, y: 5}];
    dir = nextDir = 'RIGHT';
    score = 0;
    running = true;
    spawnFood();
    scoreEl.textContent = score;
    gameOverScreen.classList.remove('show');
    clearInterval(loop);
    loop = setInterval(update, SPEED);
}

function spawnFood() {
    do {
        food = {
            x: Math.floor(Math.random() * GRID),
            y: Math.floor(Math.random() * GRID)
        };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function update() {
    dir = nextDir;
    const head = {...snake[0]};
    
    if (dir === 'UP') head.y--;
    if (dir === 'DOWN') head.y++;
    if (dir === 'LEFT') head.x--;
    if (dir === 'RIGHT') head.x++;

    if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
        return endGame();
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    snake_ctx.fillStyle = '#9bbc0f';
    snake_ctx.fillRect(0, 0, snake_canvas.width, snake_canvas.height);

    snake_ctx.fillStyle = '#306230';
    snake_ctx.fillRect(food.x * TILE, food.y * TILE, TILE, TILE);

    snake.forEach((s, i) => {
        snake_ctx.fillStyle = i ? '#306230' : '#0f380f';
        snake_ctx.fillRect(s.x * TILE, s.y * TILE, TILE, TILE);
    });
}

function endGame() {
    clearInterval(loop);
    running = false;
    finalScoreEl.textContent = score;
    gameOverScreen.classList.add('show');
}

function restartGame() {
    init();
}

document.addEventListener('keydown', e => {
    if (!running) return;
    if (e.key === 'ArrowUp' && dir !== 'DOWN') nextDir = 'UP';
    if (e.key === 'ArrowDown' && dir !== 'UP') nextDir = 'DOWN';
    if (e.key === 'ArrowLeft' && dir !== 'RIGHT') nextDir = 'LEFT';
    if (e.key === 'ArrowRight' && dir !== 'LEFT') nextDir = 'RIGHT';
});

['Up', 'Down', 'Left', 'Right'].forEach(d => {
    document.getElementById('btn' + d).onclick = () => {
        if (!running) return;
        if (d === 'Up' && dir !== 'DOWN') nextDir = 'UP';
        if (d === 'Down' && dir !== 'UP') nextDir = 'DOWN';
        if (d === 'Left' && dir !== 'RIGHT') nextDir = 'LEFT';
        if (d === 'Right' && dir !== 'LEFT') nextDir = 'RIGHT';
    };
});

init();