document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const NUM_OF_ROWS = 5;
    const NUM_OF_COLS = 10;
    const START_SPEED = 4;
    const BRICK_WIDTH = 50;
    const BRICK_HEIGHT = 15;
    const BRICK_SPACING_VERTICAL = 15;
    const BRICK_SPACING_HORIZONTAL = 30;
    const BAT_WIDTH = 100;
    const BAT_HEIGHT = 20;
    const BAT_SPEED = 7;
    const MAX_BAT_SPEED = 10;
    const BALL_HEIGHT = 10;

    let gameStarted = false;
    let gameOver = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    let victoryPlaying = false;

    const ball = {
        x: canvas.width / 2,
        y: canvas.height - 100,
        dx: 0,
        dy: 0,
        speed: START_SPEED,
        size: BALL_HEIGHT
    }

    const bat = {
        x: canvas.width / 2 - BAT_WIDTH / 2,
        y: canvas.height - 30,
        width: BAT_WIDTH,
        height: BAT_HEIGHT,
        speed: BAT_SPEED
    }

    const keys = {
        left: false,
        right: false
    }

    const bricks = [];
    const brickColors = [
        'rgb(153, 51, 0)',
        'rgb(255, 0, 0)',
        'rgb(255, 153, 204)',
        'rgb(0, 255, 0)',
        'rgb(255, 255, 153)'
    ]

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const playSound = (frequency, duration, type = 'square', volume = 0.1) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + duration);
    }

    const sounds = {
        brick: () => playSound(800, 0.1),
        bat: () => playSound(400, 0.1),
        wall: () => playSound(300, 0.1),
        gameOver: () => {
            playSound(200, 0.2);
            setTimeout(() => playSound(150, 0.3), 200);
        },
        victory: () => {
            if (victoryPlaying) return;
            victoryPlaying = true;
            playSound(523.25, 0.12, 'triangle', 0.08);
            setTimeout(() => playSound(659.25, 0.12, 'triangle', 0.08), 120);
            setTimeout(() => playSound(783.99, 0.15, 'triangle', 0.08), 240);
            setTimeout(() => {
                playSound(1046.5, 0.2, 'triangle', 0.08);
                setTimeout(() => {
                    victoryPlaying = false;
                }, 200);
            }, 380);
        }
    }

    const apply3DStyle = (element) => {
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(element.x, element.y + element.height);
        ctx.lineTo(element.x, element.y);
        ctx.lineTo(element.x + element.width, element.y);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.moveTo(element.x + element.width, element.y);
        ctx.lineTo(element.x + element.width, element.y + element.height);
        ctx.lineTo(element.x, element.y + element.height);
        ctx.stroke();
    }

    const initBricks = () => {
        const totalWidth = NUM_OF_COLS * BRICK_WIDTH + (NUM_OF_COLS - 1) * BRICK_SPACING_HORIZONTAL;
        const startX = (canvas.width - totalWidth) / 2;
        const startY = 60;

        for (let row = 0; row < NUM_OF_ROWS; row++) {
            for (let col = 0; col < NUM_OF_COLS; col++) {
                bricks.push({
                    x: startX + col * (BRICK_WIDTH + BRICK_SPACING_HORIZONTAL),
                    y: startY + row * (BRICK_HEIGHT + BRICK_SPACING_VERTICAL),
                    width: BRICK_WIDTH,
                    height: BRICK_HEIGHT,
                    color: brickColors[row],
                    active: true,
                    row: row
                });
            }
        }
    }

    const drawStart = () => {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Helvetica, Verdana, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BREAKOUT', canvas.width / 2, canvas.height / 2);

        // nije +10 jer bi bilo nečitko
        ctx.font = 'bold italic 18px Helvetica, Verdana, sans-serif';
        ctx.fillText('Press SPACE to begin', canvas.width / 2, canvas.height / 2 + 30);
    }

    const drawBrick = (brick) => {
        if (!brick.active) return;

        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

        apply3DStyle(brick);
    }

    const drawBall = () => {
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillRect(ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size);

        const tempBall = {
            x: ball.x - ball.size / 2,
            y: ball.y - ball.size / 2,
            width: ball.size,
            height: ball.size
        }

        apply3DStyle(tempBall);
    }

    const drawBat = () => {
        ctx.fillStyle = 'rgb(220, 220, 220)';
        ctx.fillRect(bat.x, bat.y, bat.width, bat.height);

        apply3DStyle(bat);
    }

    const drawScores = () => {
        ctx.fillStyle = 'white';
        ctx.font = '16px Helvetica, Verdana, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('Score: ' + score, 20, 20);

        ctx.textAlign = 'right';
        ctx.fillText('Best: ' + highScore, canvas.width - 100, 20);
    }

    const drawEndMessage = (message) => {
        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 40px Helvetica, Verdana, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    }

    const checkBrickCollision = () => {
        for (let i = 0; i < bricks.length; i++) {
            const brick = bricks[i];
            if (!brick.active) continue;

            if (ball.x + ball.size / 2 > brick.x &&
                ball.x - ball.size / 2 < brick.x + brick.width &&
                ball.y + ball.size / 2 > brick.y &&
                ball.y - ball.size / 2 < brick.y + brick.height) {

                brick.active = false;
                score++;
                sounds.brick();

                const corners = [
                    { x: brick.x, y: brick.y },
                    { x: brick.x + brick.width, y: brick.y },
                    { x: brick.x, y: brick.y + brick.height },
                    { x: brick.x + brick.width, y: brick.y + brick.height }
                ];

                let hitCorner = false;
                for (const corner of corners) {
                    const dist = Math.sqrt(
                        Math.pow(ball.x - corner.x, 2) +
                        Math.pow(ball.y - corner.y, 2)
                    );
                    if (dist < ball.size) {
                        hitCorner = true;
                        break;
                    }
                }

                const speedMultiplier = 1.05 + (NUM_OF_ROWS - 1 - brick.row) * 0.01;
                ball.speed *= speedMultiplier;
                if (ball.speed > 8) ball.speed = 8;

                if (hitCorner) {
                    ball.speed *= 1.03;
                    if (ball.speed > 8) ball.speed = 8;
                }

                const fromLeft = ball.x < brick.x;
                const fromRight = ball.x > brick.x + brick.width;

                if (fromLeft || fromRight) {
                    ball.dx = -ball.dx;
                } else {
                    ball.dy = -ball.dy;
                }

                const len = Math.hypot(ball.dx, ball.dy);
                if (len > 0) {
                    ball.dx = (ball.dx / len) * ball.speed;
                    ball.dy = (ball.dy / len) * ball.speed;
                }

                break;
            }
        }
    }

    const checkBatCollisions = () => {
        if (ball.x + ball.size / 2 > bat.x &&
            ball.x - ball.size / 2 < bat.x + bat.width &&
            ball.y + ball.size / 2 > bat.y &&
            ball.y - ball.size / 2 < bat.y + bat.height) {

            sounds.bat();

            ball.dy = -Math.abs(ball.dy);

            const hitPos = (ball.x - (bat.x + bat.width / 2)) / (bat.width / 2);
            const angle = hitPos * (Math.PI / 3);
            const newSpeed = ball.speed;

            ball.dx = Math.sin(angle) * newSpeed;
            ball.dy = -Math.abs(Math.cos(angle) * newSpeed);
        }
    }

    const checkWallCollision = () => {
        // lijevi i desni rub
        if (ball.x - ball.size / 2 <= 0 || ball.x + ball.size / 2 >= canvas.width) {
            ball.dx = -ball.dx;
            sounds.wall();
        }

        // gornji rub
        if (ball.y - ball.size / 2 <= 0) {
            ball.dy = -ball.dy;
            sounds.wall();
        }

        // donji rub
        if (ball.y - ball.size / 2 > canvas.height) {
            gameOver = true;
            sounds.gameOver();
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
        }
    }

    const checkVictory = () => {
        const allDestroyed = bricks.every(brick => !brick.active);
        if (allDestroyed) {
            gameOver = true;
            sounds.victory();
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
            return true;
        }

        return false;
    }

    const update = () => {
        if (!gameStarted || gameOver) return;

        const desired = BAT_SPEED + (ball.speed - START_SPEED) * 0.5;
        bat.speed = Math.min(
            MAX_BAT_SPEED,
            Math.max(
                BAT_SPEED,
                Math.min(desired, ball.speed * 0.75)
            )
        );

        if (keys.left && bat.x > 0) {
            bat.x -= bat.speed;
        }

        if (keys.right && bat.x + bat.width < canvas.width) {
            bat.x += bat.speed;
        }

        ball.x += ball.dx;
        ball.y += ball.dy;

        checkWallCollision();
        checkBatCollisions();
        checkBrickCollision();

        if (checkVictory()) {
            return;
        }
    }

    const draw = () => {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            drawStart();
            return;
        }

        bricks.forEach(brick => drawBrick(brick));
        drawBall();
        drawBat();
        drawScores();

        if (gameOver) {
            drawEndMessage(checkVictory() ? 'CONGRATS! YOU WON!' : 'GAME OVER');
        }
    }

    const gameLoop = () => {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    const startGame = () => {
        gameStarted = true;

        ball.x = bat.x + bat.width / 2;
        ball.y = bat.y - 20;

        const direction = Math.random() < 0.5 ? -1 : 1;
        ball.dx = direction * ball.speed * Math.cos(Math.PI / 4);
        ball.dy = -ball.speed * Math.sin(Math.PI / 4);
    }

    const restartGame = () => {
        gameStarted = false;
        gameOver = false;
        score = 0;
        victoryPlaying = false;

        ball.x = canvas.width / 2;
        ball.y = canvas.height - 100;
        ball.dx = 0;
        ball.dy = 0;
        ball.speed = START_SPEED;

        bat.x = canvas.width / 2 - BAT_WIDTH / 2;
        bat.y = canvas.height - 30;

        bricks.length = 0;
        initBricks();
    }

    document.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'Space':
                if (!gameStarted && !gameOver) {
                    startGame();
                } else if (gameOver) {
                    restartGame();
                }
                break;
            case 'ArrowLeft':
                keys.left = true;
                break;
            case 'ArrowRight':
                keys.right = true;
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.code) {
            case 'ArrowLeft':
                keys.left = false;
                break;
            case 'ArrowRight':
                keys.right = false;
                break;
        }
    });

    initBricks();
    gameLoop();
});
