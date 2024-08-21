const cvs = document.getElementById('canvas');
const ctx = cvs.getContext("2d");

const spaceship = new Image();
const bg = new Image();
const asteroidImg = new Image();
const explosionImg = new Image();

spaceship.src = "img/original spaceship.png";
bg.src = "img/space.png";
asteroidImg.src = "img/aesteroidNew.png";
explosionImg.src = "img/explosion.png";

const backgroundMusic = new Audio("effects/background.mp3");
backgroundMusic.loop = true;

const playBackgroundMusic = () => {
    backgroundMusic.play().catch(error => {
        console.error("Failed to play background music: ", error);
    });
};

let spaceshipScale = 0.12;
let asteroidScale = 0.1;

let shipX = 10;
let shipY = 150;
let gravity = 0.8;
let lift = -18;
let speed = 3.5;
let scoreText = 0;
let finish = false;
let previousScore = 0;

const scoreMusic = new Audio("effects/superMarioCoin.wav");
const hurt = new Audio("effects/falling.wav");

let asteroids = [
    {
        x: cvs.width,
        y: Math.random() * (cvs.height - asteroidImg.height * asteroidScale)
    }
];

let frameCount = 0;

const mvUp = () => {
    shipY += lift;
};

const startGame = () => {
    document.addEventListener("keydown", mvUp);
    playBackgroundMusic(); 

    if (!finish) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);

        ctx.drawImage(bg, 0, 0, cvs.width, cvs.height);

        frameCount++;

        if (frameCount % 100 === 0) {
            asteroids.push({
                x: cvs.width,
                y: Math.random() * (cvs.height - asteroidImg.height * asteroidScale)
            });
        }

        for (let i in asteroids) {
            ctx.drawImage(asteroidImg, asteroids[i].x, asteroids[i].y, asteroidImg.width * asteroidScale, asteroidImg.height * asteroidScale);
            asteroids[i].x -= speed;

            if (shipX + spaceship.width * spaceshipScale >= asteroids[i].x &&
                shipX <= asteroids[i].x + asteroidImg.width * asteroidScale &&
                (shipY <= asteroids[i].y + asteroidImg.height * asteroidScale &&
                 shipY + spaceship.height * spaceshipScale >= asteroids[i].y)) {
                finish = true;
                ctx.drawImage(explosionImg, asteroids[i].x - 10, asteroids[i].y - 10, explosionImg.width * spaceshipScale, explosionImg.height * spaceshipScale);
                hurt.play();
                setTimeout(() => {
                    previousScore = scoreText;
                    showGameOverMenu();
                }, 300);
            }

            if (asteroids[i].x + asteroidImg.width * asteroidScale < shipX && !asteroids[i].scored) {
                scoreText++;
                asteroids[i].scored = true;
                scoreMusic.play();
            }
        }

        shipY += gravity;

        if (shipY + spaceship.height * spaceshipScale >= cvs.height || shipY <= 0) {
            finish = true;
            ctx.drawImage(explosionImg, shipX - 10, shipY - 10, explosionImg.width * spaceshipScale, explosionImg.height * spaceshipScale);
            setTimeout(() => {
                previousScore = scoreText;
                showGameOverMenu();
            }, 300);
        }

        ctx.drawImage(spaceship, shipX, shipY, spaceship.width * spaceshipScale, spaceship.height * spaceshipScale);
        ctx.fillStyle = "#FFF";
        ctx.font = "16px 'Press Start 2P', cursive";  
        ctx.fillText("Score: " + scoreText, cvs.width - 160, 30);
        requestAnimationFrame(startGame);
    }
};

const showGameOverMenu = () => {
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = "#000033"; 
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px 'Press Start 2P', cursive";  
    ctx.textAlign = "center";

    ctx.fillText("GAME OVER", cvs.width / 2, 150);
    ctx.fillText("SCORE: " + previousScore, cvs.width / 2, 200);
    ctx.fillText("Press R to Retry", cvs.width / 2, 250);
    ctx.fillText("Press Q to Quit", cvs.width / 2, 300);

    document.addEventListener("keydown", handleGameOverMenu);
};

const handleGameOverMenu = (event) => {
    if (event.key === 'r' || event.key === 'R') {
        scoreText = 0;
        shipY = 150;
        asteroids = [];
        finish = false;
        document.removeEventListener("keydown", handleGameOverMenu);
        startGame();
    } else if (event.key === 'q' || event.key === 'Q') {
        window.close(); 
    }
};

window.onload = () => {
    startGame();
};

spaceship.onerror = function() {
    console.error("Failed to load spaceship image.");
};
