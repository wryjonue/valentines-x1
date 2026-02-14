import "./style.css";
const socket = new WebSocket("ws://localhost:8080");

const RANDOM_PARTICLES: string[] = [
    '❤️', '🩷', '🧡', '💛', '💚', '💙', '🩵', '💜', '🖤', '🩶', '🤍', '🤎',
    '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
    '🫀', '🍫'
];
let mainContainer: HTMLElement;
let pressSpaceContainer: HTMLElement;
let playerContainer: HTMLElement;
async function particler() {
    const particles = document.createElement('div');
    particles.innerText = RANDOM_PARTICLES[Math.floor(random(RANDOM_PARTICLES.length))];
    particles.classList.add('particles');
    particles.style.left = `${random(99)}%`;
    document.body.appendChild(particles);
    particles.style.animation = "particleFloat 5s linear forwards";
    setTimeout(() => {
        particles.remove();
    }, 5000);
    setTimeout(particler, 100);
}

function random(max: number): number {
    return Math.random() * max;
}



let isXth = true;
let playerID = "";
let otherID = "";

let isMovingR = false;
let isMovingL = false;
let playerLeftPos = 0;


window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const playerParam = urlParams.get('player');
    if (playerParam === 'wry') {
        isXth = false;
    }
    playerID = isXth ? 'xth' : 'wry';
    otherID = isXth ? 'wry' : 'xth';
    
    playerLeftPos = isXth ? 0 : 100;
    playerContainer = document.getElementById(`${playerID}-container`)!;
    mainContainer = document.getElementById('main-container')!;
    pressSpaceContainer = document.getElementById('pressspace')!;
    if (isXth) {
        setTimeout(() => {
            dialogueTyper();
        }, 2000)
    } else {
        document.getElementById("xth-container")!.style.bottom = "0";
    }
    document.addEventListener('keydown', (e) => {
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
        } else if (e.code === 'KeyM') {

            isXth = false;
            playerID = 'wry';
            otherID = 'xth';
            alert("Switched to Wryjonue! Refresh to switch back.");
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ArrowRight' || e.code === 'KeyD') isMovingR = false;
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') isMovingL = false;
    });
};

function moveLoop(dir: 'R' | 'L') {
    const stillMoving = dir === 'R' ? isMovingR : isMovingL;
    const playerContainer = document.getElementById(`${playerID}-container`)!;

    if (stillMoving) {
        playerLeftPos += (dir === 'R' ? 0.5 : -0.5);
        playerContainer.style.left = `${playerLeftPos}%`;
        socket.send(JSON.stringify({
            type: 'move',
            id: playerID,
            left: `${playerLeftPos}%`
        }));

        setTimeout(() => moveLoop(dir), 50);
    } else {
        playerContainer.style.animation = "";
    }
}

async function dialogueTyper() {
    let dialogues = [
        "Hello, Bebigurl!",
        "Happy Valentine's Day! This is my present for you!",
        "You will play as a character very submissive to this dialogue box.",
        "Press ←/→ or A/D to move Xthliene.\n Walk to the pressure plate to continue.",
        "Nice, now walk to the heart pressure plate like a good girl.",
        "Yay! You did it! I hope you like it!",
        "That's it! Enjoy your day! ❤️",
        "Really, that's really it!",
        "WHY ARE YOU STILL HERE??? GO ENJOY YOUR DAY!!!",
        "FINE, THERE IS ONE LAST THING...",
        "Press Enter to have a chat",
        " "

    ];
    let tmpDialogue = "";
    for (let j = 0; j < dialogues.length; j++) {
        tmpDialogue = "";
        for (let i = 0; i < dialogues[j].length; i++) {
            const char = dialogues[j].charAt(i);
            tmpDialogue += char;
            mainContainer!.innerHTML = tmpDialogue.replace(/\n/g, '<br/>');
            await wait(50);
        }
        switch (j) {
            case 2:
                await waitForSpace();
                playerContainer.style.bottom = "0";
                break;
            case 3:
                document.getElementById('particle-plate')!.style.bottom = "0"
                await waitForPressurePlate();
                break;
            case 4:
                document.getElementById('heart-plate')!.style.bottom = "0";
                await waitForHeartPlate();
                break;
            default:
                await waitForSpace();
                break;
        }
    };

}


function handleChat() {
    const msg = prompt(`Enter your Message:`);
    if (!msg) return;
    const myText = document.getElementById(`${playerID}-convo`)!;
    myText.innerText = msg;
    socket.send(JSON.stringify({ type: 'message', id: playerID, text: msg }));
    setTimeout(() => { myText.innerText = ""; }, 3000);
}


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

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function waitForSpace(): Promise<void> {
    return new Promise((resolve) => {
        pressSpaceContainer!.style.visibility = 'visible';
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                pressSpaceContainer!.style.visibility = 'hidden';
                window.removeEventListener('keydown', handleKey);
                resolve();
            }
        };
        window.addEventListener('keydown', handleKey);
    });
}
function waitForPressurePlate(): Promise<void> {
    return new Promise((resolve) => {
        const tmpInterval = setInterval(() => {
            if (parseInt(playerContainer.style.left) >= 50) {
                document.getElementById('particle-plate')!.style.display = 'none';
                clearInterval(tmpInterval);
                resolve();
            }
        }, 100);
    });
};
function waitForHeartPlate(): Promise<void> {
    return new Promise((resolve) => {
        const tmpInterval = setInterval(() => {
            if (parseInt(playerContainer.style.left) <= 1) {
                particler();
                document.getElementById('heart-plate')!.style.display = 'none';
                clearInterval(tmpInterval);
                resolve();
            }
        }, 100);
    });
};