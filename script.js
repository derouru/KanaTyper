// DECLARE VARIABLES
let timer = 180; //Initial timer
let carPosition = 0; //Initial car position
let randomWords = []; //Array for words from n5_processed.csv
let countdown; //Timer interval
let velocity = 0;
let distance = 0;
let currentWord
let friction = 0.999999;  //For slowing/smoothing the car animation
var audioCorrect = new Audio('correct.mp3');
var audioWin = new Audio('win.mp3');

//GET WORDS FROM CSV FILE
async function loadWordsFromCSV() {
    // fetch csv; convert to plaintext; store in string array
    const url = 'n5_processed.csv'            
    const response = await fetch(url)       
    const text = await response.text()              
    const lines = text.split('\r').slice(1)
    
    // map array of lines to array of n5 word objects
    randomWords = lines.map((line) => {
        const [kana, romaji, ...meaning] = line.split(',')
        return {
            'kana': kana.slice(1),          // .slice(1) removes the '\n' character at the start 
            'romaji': romaji, 
            'meaning': meaning.join(',')    // .join(',') reunites all strings that were split earlier
        } 
    })

    // console.log(randomWords)
}

//DISPLAY A RANDOM WORD FROM THE CSV FILE
function displayRandomWord() {
    const randomIndex = Math.floor(Math.random() * randomWords.length); //get a random index
    currentWord = randomWords[randomIndex]
    const wordElement = document.getElementById('word'); //find word id in html file
    wordElement.textContent = `${currentWord.kana}`; //display the random word in html file
    const meaningElement = document.getElementById('meaning');
    meaningElement.textContent = `${currentWord.meaning}`
    
    console.log(currentWord)
    
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
    const carElement = document.getElementById('car'); //find car img tag in html file
    const backgroundElement = document.querySelector('.background'); //find bg img tag in html file
    //carPosition += 50; //move the car forward by 50 pixels. Change later(?)
    //carElement.style.left = carPosition + 'px'; //update car position
    carPosition += velocity/40; //move the car forward by the current velocity divided by 25
    carElement.style.left = carPosition + 'px'; //update car position

    //slow the car using "friction"
    velocity *= friction;

    //move background to the left whenever car moves
    const backgroundSpeed = 20;
    backgroundElement.style.backgroundPositionX = `-${carPosition * backgroundSpeed}px`; 

    //if the velocity is very small, just stop the animation directly
    if (Math.abs(velocity) > 0.01) {
        requestAnimationFrame(moveCar);
    }

    //check if screen is wide
    if (window.innerWidth <= 600) { //if small screen
        stopThreshold = window.innerWidth - carElement.width*1.2;
    } else { //else if big screen
        stopThreshold = window.innerWidth - carElement.width*1.4;
    }
    //stop moving the car beyond a certain point
    if (carPosition >= stopThreshold) {
        alert('You reached the end!'); //alert game win
        clearInterval(countdown); //stop timer
        document.getElementById('inputType').disabled = true; //disable the input field
        carPosition = 0; //reset the car position
        velocity = 0; //reset velocity
        document.getElementById('restartButton').style.display = 'block'; //show restart button

        audioWin.play()
    }
}

//FOR CHECKING THE TYPING INPUT
async function checkTypedWord(event) {
    if (event.key !== 'Enter') return;

    const inputElement = document.getElementById('inputType'); //find inputType id in html file
    const correctMessageElement = document.getElementById('correctMessage'); //find correctMessage id in html file
    const wrongMessageElement = document.getElementById('wrongMessage');
    console.log(currentWord.kana, inputElement.value)
    if ([currentWord.kana, currentWord.romaji].includes(inputElement.value)) {
        messageId = 'correctMessage'

        speedUp()
        displayRandomWord()
        moveCar()

        audioCorrect.play()
    } else {
        messageId = 'wrongMessage'
    }

    inputElement.value = ''; //clear the input
    messageElement = document.getElementById(messageId)
    messageElement.style.display = 'block';
    
    await delay(1000)
    
    correctMessageElement.style.display = 'none'; //hide the correct text after 1 second
    wrongMessageElement.style.display = 'none'; //hide the correct text after 1 second
}

//FOR STARTING THE GAME
function startGame() {
    slowDown()
    setDistance()
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
    velocity = 0
    distance = 0
    timer = 180; //reset timer back to 180 seconds
    carPosition = 0; //reset the car position
    document.getElementById('car').style.left = carPosition + 'px'; //reset car position
    document.getElementById('timer').textContent = timer; //reset timer
    document.getElementById('inputType').disabled = true; //disable input field initially
    document.getElementById('word').textContent = ''; //clear the displayed word
    document.getElementById('meaning').textContent = ''; //clear the displayed word
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

// UTILITY FUNCTIONS //

function speedUp() {
    velocity += 10
    updateVelocity()
}

async function slowDown() {
    const constantDecrement = 1.5
    const percentageDecrement = 0.1
    let totalDecrement

    const delayTime = 700
    while(true) {
        await delay(delayTime)
        totalDecrement =  constantDecrement + velocity * percentageDecrement 
        
        if (velocity <= totalDecrement) {velocity = 0}
        else {velocity = Math.floor((velocity - totalDecrement) * 100) / 100}
        console.log(velocity)   

        updateVelocity()
    }
}

function reallySlowDown() {
}


function updateVelocity() {
    velocity = Math.floor(velocity * 100) / 100
    document.getElementById('velocity').textContent = `velocity: ${velocity}m/s`
}

async function setDistance() {
    const interval = 100 
    console.log(distance)
    while(true) {
        await delay(interval)
        distance = Math.floor((distance + velocity * interval / 1000) * 100) / 100

        document.getElementById('distance').textContent = `distance: ${distance}m`
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}