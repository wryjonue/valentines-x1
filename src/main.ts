import "./style.css";
const socket = new WebSocket("ws://localhost:8080");

const RANDOM_PARTICLES: string[] = [
    '❤️', '🩷', '🧡', '💛', '💚', '💙', '🩵', '💜', '🖤', '🩶', '🤍', '🤎',
    '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
    '🫀', '🍫'
];

async function main() {
    const particles = document.createElement('div');
    particles.innerText = RANDOM_PARTICLES[Math.floor(random(RANDOM_PARTICLES.length))];
    particles.classList.add('particles');
    particles.style.left = `${random(99)}%`;
    document.body.appendChild(particles);
    particles.style.animation = "particleFloat 5s linear forwards";
    setTimeout(() => {
        particles.remove();
    }, 5000);
    setTimeout(main, 100);
}



function random(max: number): number {
    return Math.random() * max;
}



main();

let isXth = true;
let playerID = "";
let otherID = "";

// State for "Your" character only
let isMovingR = false;
let isMovingL = false;
let playerLeftPos = 0;

window.onload = () => {
    let name = prompt("Enter your name:");
    isXth = name?.toLowerCase() === "xthliene";

    // Define Roles
    playerID = isXth ? 'xth' : 'wry';
    otherID = isXth ? 'wry' : 'xth';

    // Set initial positions (Match your CSS/HTML)
    playerLeftPos = isXth ? 0 : 100;

    const playerContainer = document.getElementById(`${playerID}-container`)!;
    const otherContainer = document.getElementById(`${otherID}-container`)!;

    // Key Listeners
    document.addEventListener('keydown', (e) => {
        // Support both Arrow keys and WASD for "The Player"
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            if (!isMovingR) {
                isMovingR = true;
                playerContainer.style.animation = "wryWalk 0.7s linear infinite";
                moveLoop('R');
            }
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            if (!isMovingL) {
                isMovingL = true;
                playerContainer.style.animation = "wryWalk 0.7s linear infinite";
                moveLoop('L');
            }
        } else if (e.code === 'Enter') {
            handleChat();
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowRight' || e.code === 'KeyD') isMovingR = false;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') isMovingL = false;
    });
};

// Unified Movement Loop
function moveLoop(dir: 'R' | 'L') {
    const stillMoving = dir === 'R' ? isMovingR : isMovingL;
    const playerContainer = document.getElementById(`${playerID}-container`)!;

    if (stillMoving) {
        playerLeftPos += (dir === 'R' ? 0.5 : -0.5);
        playerContainer.style.left = `${playerLeftPos}%`;

        // Sync to Server
        socket.send(JSON.stringify({
            type: 'move',
            id: playerID,
            left: `${playerLeftPos}%`
        }));

        setTimeout(() => moveLoop(dir), 30);
    } else {
        playerContainer.style.animation = "";
    }
}

// Unified Chat
function handleChat() {
    const msg = prompt(`Message as ${playerID}:`);
    if (!msg) return;

    const myText = document.getElementById(`${playerID}-convo`)!;
    myText.innerText = msg;

    socket.send(JSON.stringify({ type: 'message', id: playerID, text: msg }));

    setTimeout(() => { myText.innerText = ""; }, 3000);
}

// Socket Listener (The "Other" person)
let otherMoverTimeout: number;
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const targetContainer = document.getElementById(`${data.id}-container`);
    const targetText = document.getElementById(`${data.id}-convo`);

    if (data.type === 'move' && targetContainer) {
        targetContainer.style.left = data.left;
        targetContainer.style.animation = "wryWalk 0.7s linear infinite";

        clearTimeout(otherMoverTimeout);
        otherMoverTimeout = setTimeout(() => {
            targetContainer.style.animation = "";
        }, 300);
    } else if (data.type === 'message' && targetText) {
        targetText.innerText = data.text;
        setTimeout(() => { targetText.innerText = ""; }, 3000);
    }
};