let turn = 0; // INT - What turn it is
let players = 0 // INT - The number of players

let playerScores = []; // INT 1D ARRAY - The scores of the players
let rollHistory = []; // INT 2D ARRAY - The roll history for each of the players

// 3 PLAYER EXAMPLE
// [
//   [2,4,1] - Player 1's roll history
//   [6,3,2] - Player 2's roll history
//   [3,5,4] - Player 3's roll history
// ]

let canRoll = false; // BOOL - If the player can roll

function sanitiseNumPlayers(number) {
    if (number > 5) { // If the number is more than five, set it to five
        number = 5;
    } else if (number < 2) { // If the number is less than two, set it to two
        number = 2;
    }
    return number; // Return the sanitised number
}

function onStart() {

    turn = 0; // Reset the turn to zero
    players = sanitiseNumPlayers(numPlayers.value); // Sanitise the number of players VIA clamping
    playerScores = []; // Reset player scores

    for (let i = 0; i < 5; i++) { // Reset the text of the scoreboard
        playerScores.push(0); // Fill the player scores array with zeros
        document.getElementById("player" + (i + 1)).textContent = "";
        document.getElementById("player" + (i + 1) + "History").textContent = "";
    }
    for (let i = 0; i < players; i++) { // Set the text of the scoreboard for each of the players
        document.getElementById("player" + (i + 1)).textContent = "Player " + (i + 1) + " - 0";
        document.getElementById("player" + (i + 1) + "History").textContent = "...";
    }

    rollHistory = [ // Reset roll history
        [],
        [],
        [],
        [],
        []
    ]; 

    startContainer.style.display = "none"; // Hide the start container
    gameContainer.style.display = "block"; // Show the game container
    canRoll = true; // Allow the player to roll the dice
}

startBtn.onclick = onStart;

function checkForSpecialRolls(playerScores, playerHistory, roll) {
    if (roll == 1) { // If the roll is one, set the roller's score to zero
        statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled a 1 resetting their score!";
        playerScores[turn % players] = 0;
        return 0;
    }
    if (playerHistory.length >= 2) {
        if (roll == playerHistory[playerHistory.length - 2]) {
            if (playerHistory.length >= 3) {
                if (roll == playerHistory[playerHistory.length - 3]) {
                    statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled three " + roll + "'s giving them " + (roll * 3) + "!";
                    return roll * 3;
                }
            }
            statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled two " + roll + "'s giving them " + (roll * 2) + "!";
            return roll * 2;
        }
    }
    statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled a " + roll + "!";
    return roll;
}

function changeDice() {
    let roll = Math.round(Math.random() * 5) + 1; // Choose a random number between 1 and 6
    dice.src = "Dice/Dice-" + roll + ".svg"; // Update dice image
}

function updateDiceRoll() {
    let roll = Math.round(Math.random() * 5) + 1; // INT - Choose a random number between 1 and 6
    let turnPlayer = turn % players; // INT - Get the player from the turn number

    dice.src = "Dice/Dice-" + roll + ".svg"; // Update dice image

    rollHistory[turnPlayer].push(roll); // Push the roll into the players roll history

    roll = checkForSpecialRolls(playerScores, rollHistory[turnPlayer], roll); // Calculate the dice rolls score by checking for doubles, triples, and rolls of 1's
    playerScores[turnPlayer] += roll; // Add the roll to the players score

    scoreText = "Player " + (turnPlayer + 1) + " - " + playerScores[turnPlayer];
    historyText = rollHistory[turnPlayer].join(", ");

    document.getElementById("player" + (turnPlayer + 1)).textContent = scoreText;
    document.getElementById("player" + (turnPlayer + 1) + "History").textContent = historyText;

    if (playerScores[turnPlayer] >= 30) { // End the game if the player has reached more than 30 points
        statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " reached 30 first and won!";
        return;
    }

    turn++; // Increase the turn by 1
    canRoll = true; // Allow the player to roll as the animation is finished
}

function onDiceRoll() {
    if (canRoll == false) { // Stop the player from rolling the dice if the animation is ongoing
        return;
    }

    canRoll = false; // Make it so the player can't roll during the animation

    for (let i = 0; i < 9; i++) {
        setTimeout(() => { changeDice() }, i*100);
    }
    setTimeout(() => { updateDiceRoll() }, 1000);
}

dice.onclick = onDiceRoll;