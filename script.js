const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const colors = ["#e56e6e", "orange", "orchid", "lightgreen", "lightseagreen"];

const gridSize = 5;
const cellSize = 100;

const iIndicator = document.getElementById('iIndicator');
const jIndicator = document.getElementById('jIndicator');
const iLooperCircle = document.getElementById('iLooperCircle');
const jLooperCircle = document.getElementById('jLooperCircle');
const playPauseBtn = document.getElementById('playPauseBtn');

let isPlaying = false;
let currentStep = 0;
let intervalId;

// Create a 2D array to track the colors of visited cells
let cellColors = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i <= gridSize; i++) {
        ctx.moveTo(50, i * cellSize + 50);
        ctx.lineTo(gridSize * cellSize + 50, i * cellSize + 50);
        ctx.moveTo(i * cellSize + 50, 50);
        ctx.lineTo(i * cellSize + 50, gridSize * cellSize + 50);
    }
    ctx.stroke();

    // Draw the stored colors in the cells
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (cellColors[i][j]) {
                ctx.fillStyle = cellColors[i][j];
                ctx.fillRect(j * cellSize + 50, i * cellSize + 50, cellSize, cellSize);
                ctx.strokeRect(j * cellSize + 50, i * cellSize + 50, cellSize, cellSize);
                ctx.fillStyle = 'white';
                ctx.font = '16px Arial';
                ctx.fillText(`${i},`, j * cellSize + 90, i * cellSize + 110);
                ctx.fillText(`${j}`, j * cellSize + 105, i * cellSize + 110);
            }
        }
    }
}

function updateIndicators(i, j) {
    iIndicator.textContent = i;
    jIndicator.textContent = j;
    drawGrid();
    drawArrows(i, j);
    updateLooperCircles(i, j);
}

function drawArrows(i, j) {
    ctx.fillStyle = colors[j];
    ctx.font = '12px Arial';
    // Draw the arrows outside the grid
    ctx.fillText(`j = ${j}`, j * cellSize + 75 + cellSize / 2 - 5, 35); // Arrow for j
    ctx.font = '50px Arial';
    ctx.fillText(`↓`, j * cellSize + 50 + cellSize / 2 - 5, 35); // Arrow for j
    ctx.fillStyle = colors[i];
    ctx.font = '12px Arial';
    ctx.fillText(`i = ${i}`, 10, i * cellSize + 50 + cellSize / 2 -15);  // Arrow for i
    ctx.font = '50px Arial';
    ctx.fillText(`→`,0, i * cellSize + 50 + cellSize / 2 + 5);  // Arrow for i
}

function updateLooperCircles(i, j) {
    const iProgress = i / gridSize * 100;
    const jProgress = j / gridSize * 100;
    iLooperCircle.style.borderWidth = `${2 + iProgress * 0.2}px`;
    jLooperCircle.style.borderWidth = `${2 + jProgress * 0.2}px`;
    iLooperCircle.style.borderColor = colors[i];
    jLooperCircle.style.borderColor = colors[j];
}

function visualizeStep() {
    const i = Math.floor(currentStep / gridSize);
    const j = currentStep % gridSize;

    updateIndicators(i, j);
    ctx.fillStyle = colors[j];
    ctx.fillRect(j * cellSize + 50, i * cellSize + 50, cellSize, cellSize);

    // Store the color in the cellColors array
    cellColors[i][j] = colors[i];

    setTimeout(() => {
        currentStep++;
        if (currentStep < gridSize * gridSize && isPlaying) {
            intervalId = setTimeout(visualizeStep, 500);
        } else if (currentStep >= gridSize * gridSize) {
            playPauseBtn.textContent = 'Play';
            isPlaying = false;
            ctx.strokeStyle = 'white'; // Default stroke style
            updateIndicators(i, j); // Ensure the last cell is displayed correctly
        }
    }, 500);
}

function resetVisualization() {
    ctx.strokeStyle = 'black'; // Default stroke style
    cellColors = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    currentStep = 0;
    drawGrid();
    updateIndicators(0, 0); // Ensure indicators are reset to (0, 0)
}

playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        clearTimeout(intervalId);
        playPauseBtn.textContent = 'Play';
        isPlaying = false;
    } else {
        playPauseBtn.textContent = 'Pause';
        isPlaying = true;
        if (currentStep === 0 || currentStep >= gridSize * gridSize) {
            resetVisualization();
        }
        visualizeStep();
    }
});

drawGrid();
updateIndicators(0, 0); // Initialize indicators at the start
