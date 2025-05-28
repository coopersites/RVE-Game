// game.js
class Game {
    constructor() {
        this.setupCanvas();
        this.setupEventListeners();
        this.playerPosition = { x: 400, y: 300 };
        this.lessons = {
            'Math': 'Learn about basic arithmetic and algebra',
            'Science': 'Explore the natural world and scientific method',
            'English': 'Study language and literature',
            'History': 'Discover past events and their impact'
        };
    }

    setupCanvas() {
        this.canvas = document.getElementById('paintCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupEventListeners() {
        // Character creation canvas events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        
        // Color picker
        document.getElementById('colorPicker').addEventListener('change', (e) => {
            this.ctx.strokeStyle = e.target.value;
        });

        // Image upload
        document.getElementById('imageUpload').addEventListener('change', this.handleImageUpload.bind(this));
        
        // Clear canvas
        document.getElementById('clearCanvas').addEventListener('click', () => {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });

        // Start game
        document.getElementById('startGame').addEventListener('click', this.startGame.bind(this));

        // Movement controls
        document.addEventListener('keydown', this.handleMovement.bind(this));
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
    }

    draw(e) {
        if (!this.isDrawing) return;
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    handleImageUpload(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    startGame() {
        const playerName = document.getElementById('playerName').value;
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }

        document.getElementById('startScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';

        // Create player character
        const playerChar = document.createElement('div');
        playerChar.className = 'player';
        playerChar.style.backgroundImage = `url(${this.canvas.toDataURL()})`;
        playerChar.style.backgroundSize = 'cover';
        document.getElementById('gameMap').appendChild(playerChar);

        // Create classrooms
        this.createClassrooms();
        this.updatePlayerPosition();
    }

    createClassrooms() {
        const classrooms = [
            { subject: 'Math', x: 100, y: 100 },
            { subject: 'Science', x: 600, y: 100 },
            { subject: 'English', x: 100, y: 400 },
            { subject: 'History', x: 600, y: 400 }
        ];

        classrooms.forEach(room => {
            const classroom = document.createElement('div');
            classroom.className = 'classroom';
            classroom.textContent = room.subject;
            classroom.style.left = `${room.x}px`;
            classroom.style.top = `${room.y}px`;
            classroom.addEventListener('click', () => this.enterClassroom(room.subject));
            document.getElementById('gameMap').appendChild(classroom);
        });
    }

    handleMovement(e) {
        const speed = 10;
        switch(e.key) {
            case 'ArrowUp':
                this.playerPosition.y = Math.max(0, this.playerPosition.y - speed);
                break;
            case 'ArrowDown':
                this.playerPosition.y = Math.min(550, this.playerPosition.y + speed);
                break;
            case 'ArrowLeft':
                this.playerPosition.x = Math.max(0, this.playerPosition.x - speed);
                break;
            case 'ArrowRight':
                this.playerPosition.x = Math.min(750, this.playerPosition.x + speed);
                break;
        }
        this.updatePlayerPosition();
    }

    updatePlayerPosition() {
        const player = document.querySelector('.player');
        player.style.left = `${this.playerPosition.x}px`;
        player.style.top = `${this.playerPosition.y}px`;
    }

    enterClassroom(subject) {
        const lesson = document.getElementById('lesson');
        document.getElementById('lessonTitle').textContent = subject;
        document.getElementById('lessonContent').textContent = this.lessons[subject];
        lesson.style.display = 'block';

        document.getElementById('closeLessonBtn').onclick = () => {
            lesson.style.display = 'none';
        };
    }
}

// Start the game
window.onload = () => {
    new Game();
};
