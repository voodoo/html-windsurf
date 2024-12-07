document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const reset = document.querySelector('#reset');
    const moveCount = document.querySelector('#moveCount');
    const matchCount = document.querySelector('#matchCount');
    
    const icons = [
        'fa-heart', 'fa-star', 'fa-moon', 'fa-sun',
        'fa-cloud', 'fa-tree', 'fa-bell', 'fa-fire'
    ];
    
    // Create audio elements
    const flipSound = new Audio('data:audio/wav;base64,UklGRpQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAGAACBhYqFbF1fdJivrJBhNjVgodHRrGstPG2Sy8vFnmhKR2uk0cm0ekVBWpDGwLyrfWBXbZrEuJXB');
    const matchSound = new Audio('data:audio/wav;base64,UklGRogHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXQHAAB+goaHfGVeZIqkqJyEWDY2VYi1yLyVaEA+WI7Cv7qjdVJJWYu5vLWecVdPXYu2tJ+NZ1FNWYKxuLW0iXBgW2qRsLKo');
    const winSound = new Audio('data:audio/wav;base64,UklGRrwHAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YagHAAB8gYWGfWdeZYukqZ2FWTc3VYm2ybmWaUE/WY/DwLukdlNKWoy6vbakc1hQXoy3taCOaFJOWoOyubW1inFhXGuSsbOp');
    
    flipSound.volume = 0.3;
    matchSound.volume = 0.3;
    winSound.volume = 0.4;
    
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let canFlip = true;

    function createDeck() {
        return [...icons, ...icons]
            .map(icon => ({
                icon,
                id: Math.random()
            }))
            .sort(() => Math.random() - 0.5);
    }

    function createCard(cardData) {
        const card = document.createElement('div');
        card.classList.add('square');
        card.innerHTML = `<i class="fas ${cardData.icon}"></i>`;
        card.dataset.id = cardData.id;
        
        card.addEventListener('click', () => flipCard(card));
        return card;
    }

    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        flipSound.currentTime = 0;
        flipSound.play();
        
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            moveCount.textContent = moves;
            canFlip = false;
            checkMatch();
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        const match = card1.querySelector('i').classList.toString() === 
                     card2.querySelector('i').classList.toString();

        if (match) {
            setTimeout(() => {
                matchSound.currentTime = 0;
                matchSound.play();
                
                card1.classList.add('matched');
                card2.classList.add('matched');
                matches++;
                matchCount.textContent = matches;
                
                if (matches === icons.length) {
                    setTimeout(() => {
                        winSound.play();
                        celebrateWin();
                    }, 500);
                }
            }, 500);
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        setTimeout(() => {
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }

    function celebrateWin() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            font-size: 1.5rem;
            z-index: 100;
            animation: fadeIn 0.5s ease-out;
        `;
        message.innerHTML = `
            <h2 style="color: #4CAF50; margin-bottom: 1rem;">Congratulations! 🎉</h2>
            <p>You won in ${moves} moves!</p>
            <button onclick="this.parentElement.remove()" style="margin-top: 1rem;">Play Again</button>
        `;
        document.body.appendChild(message);
    }

    function initGame() {
        grid.innerHTML = '';
        cards = createDeck();
        flippedCards = [];
        moves = 0;
        matches = 0;
        canFlip = true;
        moveCount.textContent = '0';
        matchCount.textContent = '0';
        
        cards.forEach(cardData => {
            grid.appendChild(createCard(cardData));
        });
    }

    reset.addEventListener('click', initGame);
    initGame();
}); 