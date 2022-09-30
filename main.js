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

function finishFade() {
    gameContainer.style.opacity = "1"; // Update game container
}

function finishSetup() {
    startContainer.style.display = "none"; // Hide the start container
    
    gameContainer.style.display = "block"; // Show the game container
    setTimeout(() => { finishFade() }, 50); // Fixes glitch with game container not fading in

    canRoll = true; // Allow the player to roll the dice
}

function onStart() {

    turn = 0; // Reset the turn to zero
    players = sanitiseNumPlayers(numPlayers.value); // Sanitise the number of players VIA clamping
    playerScores = []; // Reset player scores

    for (let i = 0; i < 5; i++) {

        // Fill the player scores array with zeros
        playerScores.push(0);

        //Reset the text of the scoreboard
        document.getElementById("player" + (i + 1)).textContent = "";
        document.getElementById("player" + (i + 1) + "History").textContent = "";
    }
    for (let i = 0; i < players; i++) {

        // Set the text of the scoreboard for each of the players
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

    // Update title to fit screen
    title.style.fontSize = "4em";
    title.style.padding = "20px 0px";

    // Update starting container
    startContainer.style.opacity = "0";

    setTimeout(() => { finishSetup() }, 600); // Wait until title transition is finished
}

startBtn.onclick = onStart;

function checkForSpecialRolls(playerScores, playerHistory, roll) {
    if (roll == 1) { // If the roll is one, set the roller's score to zero

        // Display the roll
        statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled a 1 resetting their score!";

        playerScores[turn % players] = 0; // Set the roller's score to zero
        return 0; // Add zero to the players total
    }

    // If the player has rolled twice or more, continue (Prevents array access errors)
    if (playerHistory.length >= 2) {

        // If the player has rolled two of the same number in a row, continue
        if (roll == playerHistory[playerHistory.length - 2]) {

            // If the player has rolled thrice or more, continue (Prevents array access errors)
            if (playerHistory.length >= 3) {

                // If the player has rolled three of the same number in a row, continue
                if (roll == playerHistory[playerHistory.length - 3]) { 

                    // Display the roll and return the roll
                    statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled three " + roll + "'s giving them " + (roll * 3) + "!";
                    return roll * 3;
                }
            }

            // Display the roll and return the roll
            statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled two " + roll + "'s giving them " + (roll * 2) + "!";
            return roll * 2;
        }
    }

    // Display the roll and return the roll
    statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled a " + roll + "!";
    return roll;
}

function changeDice() {
    let roll = Math.round(Math.random() * 5) + 1; // INT - Choose a random number between 1 and 6
    dice.src = "Dice/Dice-" + roll + ".svg"; // Update dice image
}

function updateDiceRoll() {
    let roll = Math.round(Math.random() * 5) + 1; // INT - Choose a random number between 1 and 6
    let turnPlayer = turn % players; // INT - Get the player from the turn number

    dice.src = "Dice/Dice-" + roll + ".svg"; // Update dice image

    rollHistory[turnPlayer].push(roll); // Push the roll into the players roll history

    // Calculate the dice rolls score by checking for doubles, triples, and rolls of 1's
    roll = checkForSpecialRolls(playerScores, rollHistory[turnPlayer], roll);
    playerScores[turnPlayer] += roll; // Add the roll to the players score

    // Create the string that will replace the players scoreboard entry
    scoreText = "Player " + (turnPlayer + 1) + " - " + playerScores[turnPlayer];
    historyText = rollHistory[turnPlayer].join(", ");

    // Update the score and the roll history of the player who rolled
    document.getElementById("player" + (turnPlayer + 1)).textContent = scoreText;
    document.getElementById("player" + (turnPlayer + 1) + "History").textContent = historyText;

    // End the game if the player has reached more than 30 points
    if (playerScores[turnPlayer] >= 30) {
        statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " reached 30 first and won!";
        return;
    }

    turn++; // Increase the turn by 1
    canRoll = true; // Allow the player to roll as the animation is finished
}

function onDiceRoll() {
    // Stop the player from rolling the dice if the animation is ongoing
    if (canRoll == false) { 
        return;
    }

    canRoll = false; // Make it so the player can't roll during the animation

    for (let i = 0; i < 9; i++) {
        setTimeout(() => { changeDice() }, i*100); // Change the dice image nine times with 100 milliseconds in between
    }
    setTimeout(() => { updateDiceRoll() }, 1000); // Update the dice after 1000 milliseconds, 100 milliseconds after the animation has finished
}

dice.onclick = onDiceRoll;