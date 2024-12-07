document.addEventListener('DOMContentLoaded', () => {
    const paul = document.querySelector('.paul');
    const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
        '#ffeead', '#ff9f43', '#9b59b6', '#3498db',
        '#a78bfa', '#60a5fa', '#34d399', '#fbbf24'
    ];
    
    function createConfetti() {
        console.log('Creating confetti!');
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const leftPosition = Math.random() * 100;
            const animationDuration = 1.5 + Math.random() * 2;
            const size = 5 + Math.random() * 7;
            const rotation = Math.random() * 360;
            const delay = Math.random() * 0.5;
            
            confetti.style.cssText = `
                position: fixed;
                left: ${leftPosition}vw;
                top: 0;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                animation: confettiFall ${animationDuration}s linear ${delay}s forwards;
                z-index: 9999;
                transform: rotate(${rotation}deg);
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, (animationDuration + delay) * 1000);
        }
    }

    paul.style.animation = 'none';
    paul.offsetHeight;
    
    setTimeout(() => {
        paul.style.animation = 'paulAnimation 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(createConfetti, 2000);
    }, 500);
});
