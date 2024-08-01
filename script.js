// DECLARE VARIABLES
let timer = 180; //Initial timer
let carPosition = 0; //Initial car position
let randomWords = []; //Array for words from n5_processed.csv
let countdown; //Timer interval

//GET WORDS FROM CSV FILE
function loadWordsFromCSV() {
    //fetch the file itself
    fetch('n5_processed.csv')
        //receive as plain text
        .then(response => response.text())
        //handle the plain text
        .then(text => {
            //put to randomWords array
            const lines = text.split('\n');
            for (let i = 1; i < lines.length; i++) { //Start at 1 to skip header
                const columns = lines[i].split(',');
                if (columns[0]) {
                    randomWords.push(columns[0]);
                }
            }
        });
}

//DISPLAY A RANDOM WORD FROM THE CSV FILE
function displayRandomWord() {
    const randomIndex = Math.floor(Math.random() * randomWords.length); //get a random index
    const wordElement = document.getElementById('word'); //find word id in html file
    wordElement.textContent = randomWords[randomIndex]; //display the random word in html file
}

//TIMER FUNCTION
function startTimer() {
    const timerElement = document.getElementById('timer'); //find timer id in html file
    timerElement.textContent = timer; //initial display of timer

    //update timer every second
    countdown = setInterval(() => {
        timer--; //decrease timer by 1 second
        timerElement.textContent = timer; //update timer display

        //check if timer = 0
        if (timer <= 0) {
            clearInterval(countdown); //stop timer
            alert('GAME OVER!'); //alert game over 
            document.getElementById('inputType').disabled = true; //disable the input field
            document.getElementById('restartButton').style.display = 'block'; //show restart button
        }
    }, 1000); //update every second (1000 milliseconds)
}

//FOR MOVING THE CAR PNG
function moveCar() {
    const carElement = document.querySelector('img'); //find car img tag in html file
    carPosition += 50; //move the car forward by 50 pixels. Change later(?)
    carElement.style.left = carPosition + 'px'; //update car position

    //stop moving the car beyond a certain point
    if (carPosition >= window.innerWidth - carElement.width) {
        alert('You reached the end!'); //alert game win
        clearInterval(countdown); //stop timer
        document.getElementById('inputType').disabled = true; //disable the input field
        document.getElementById('restartButton').style.display = 'block'; //show restart button
    }
}

//FOR CHECKING THE TYPING INPUT
function checkTypedWord(event) {
    const inputElement = document.getElementById('inputType'); //find inputType id in html file
    const wordElement = document.getElementById('word'); //find word id in html file
    const correctMessageElement = document.getElementById('correctMessage'); //find correctMessage id in html file
    
    if (event.key === 'Enter' && inputElement.value === wordElement.textContent) {
        inputElement.value = ''; //clear the input
        displayRandomWord(); //display a new random word
        moveCar(); //move the car right
        correctMessageElement.style.display = 'block'; //show correct text
        setTimeout(() => {
            correctMessageElement.style.display = 'none'; //hide the correct text after 1 second
        }, 1000); //1 second
    }
}

//FOR STARTING THE GAME
function startGame() {
    const inputElement = document.getElementById('inputType'); //find inputType id in html file
    inputElement.disabled = false; //enable the input field
    inputElement.focus(); //focus on the input field
    startTimer(); //start the timer countdown
    displayRandomWord(); //display first random word

    //hide the start button
    const startButton = document.getElementById('startButton');
    startButton.style.display = 'none';
}

//FOR RESTARTING THE GAME(?)
function restartGame() {
    timer = 180; //reset timer back to 180 seconds
    carPosition = 0; //reset the car position
    document.querySelector('img').style.left = carPosition + 'px'; //reset car position
    document.getElementById('timer').textContent = timer; //reset timer
    document.getElementById('inputType').disabled = true; //disable input field initially
    document.getElementById('word').textContent = ''; //clear the displayed word
    document.getElementById('restartButton').style.display = 'none'; //hide the restart button
    document.getElementById('startButton').style.display = 'block'; //show the start button
}

//FUNCTIONS TO CALL WHEN PAGE LOADS
window.onload = function() {
    loadWordsFromCSV(); //load words from CSV file
    
    const startButton = document.getElementById('startButton'); //find startButton id in html file
    startButton.addEventListener('click', startGame); //start the game on button click

    const inputElement = document.getElementById('inputType'); //find inputType id in html file
    inputElement.addEventListener('keydown', checkTypedWord); //check the typed word on keydown

    const restartButton = document.getElementById('restartButton'); //find restartButton id in html file
    restartButton.addEventListener('click', restartGame); //restart the game on button click when it appears later
};
