import './style.css'
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
let wryContainer: HTMLElement;
let xthContainer: HTMLElement;
let wryText: HTMLElement;
let xthText: HTMLElement;
window.onload = () => {
    wryContainer = document.getElementById('wry-container') as HTMLElement;
    xthContainer = document.getElementById('xth-container') as HTMLElement;
    wryText = document.getElementById('wry-convo') as HTMLElement;
    xthText = document.getElementById('xth-convo') as HTMLElement;
    document.addEventListener('keyup', (evt) => {
        if (evt.code === 'ArrowRight') {
            wryMovingR = false;
        } else if (evt.code === 'ArrowLeft') {
            wryMovingL = false;
        } else if (evt.code === 'KeyD') {
            xthMovingR = false;
        } else if (evt.code === 'KeyA') {
            xthMovingL = false;
        } else if (evt.code === 'Enter') {
            prompt("Enter a message for Xthliene to say:")?.split('\n').forEach((line, index) => {
                setTimeout(() => {
                    xthText.innerText = line;
                }, index * 2000);
            });
        }
    })
    document.addEventListener('keydown', (event) => {
        console.log(event.code);
        if (event.code === 'ArrowRight') {
            if (!wryMovingR) {
                wryContainer.style.animation = "wryWalk 0.7s linear infinite";
                wryMovingR = true;
                wryMoveRight();
            }
        } else if (event.code === 'ArrowLeft') {
            if (!wryMovingL) {
                wryContainer.style.animation = "wryWalk 0.7s linear infinite";
                wryMovingL = true;
                wryMoveLeft();
            }
        } else if (event.code === 'KeyD') {
            if (!xthMovingR) {
                xthContainer.style.animation = "wryWalk 0.7s linear infinite";
                xthMovingR = true;
                xthMoveRight();
            }
        } else if (event.code === 'KeyA') {
            if (!xthMovingL) {
                xthContainer.style.animation = "wryWalk 0.7s linear infinite";
                xthMovingL = true;
                xthMoveLeft();
            }
        }
    })
};


let wryMovingR: boolean = false
let wryMovingL: boolean = false
let xthMovingR: boolean = false
let xthMovingL: boolean = false
let wryLeftPos: number = 100;
let xthLeftPos: number = 0;
async function wryMoveRight() {
    if (wryMovingR) {
        setTimeout(wryMoveRight, 50);
    } else if (!wryMovingL) {
        wryContainer.style.animation = "";
    }
    console.log(wryContainer.style.left);
    wryLeftPos += 0.5;
    wryContainer.style.left = `${wryLeftPos}%`;
}
async function wryMoveLeft() {
    if (wryMovingL) {
        setTimeout(wryMoveLeft, 50);
    } else if (!wryMovingR) {
        wryContainer.style.animation = "";
    }
    wryLeftPos -= 0.5;
    wryContainer.style.left = `${wryLeftPos}%`;
}
async function xthMoveRight() {
    if (xthMovingR) {
        setTimeout(xthMoveRight, 50);
    } else if (!xthMovingL) {
        xthContainer.style.animation = "";
    }
    xthLeftPos += 0.5;
    xthContainer.style.left = `${xthLeftPos}%`;
}
async function xthMoveLeft() {
    if (xthMovingL) {
        setTimeout(xthMoveLeft, 50);
    } else if (!xthMovingR) {
        xthContainer.style.animation = "";
    }
    xthLeftPos -= 0.5;
    xthContainer.style.left = `${xthLeftPos}%`;
}