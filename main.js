let turn = 0;
let players = 0

let playerScores = [];
let rollHistory = [];

function sanitiseNumPlayers(number) {
    if (number > 5) {
        number = 5;
    } else if (number < 2) {
        number = 2;
    }
    return number;
}

function onStart() {
    turn = 0;
    players = sanitiseNumPlayers(numPlayers.value);
    playerScores = new Array(players).fill(0);
    rollHistory = [
        [],
        [],
        [],
        [],
        []
    ];
}

startBtn.onclick = onStart;

function checkForSpecialRolls(playerScores, playerHistory, roll) {
    if (roll == 1) {
        statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled a 1 resetting their score!";
        playerScores[turn % players] = 0;
        return 0;
    }
    if (playerHistory.length >= 2) {
        if (roll == playerHistory[playerHistory.length - 2]) {
            if (playerHistory.length >= 3) {
                if (roll == playerHistory[playerHistory.length - 3]) {
                    statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled three " + roll + "'s giving them " + roll * 3;
                    return roll * 3;
                }
            }
            statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled two " + roll + "'s giving them " + roll * 2;
            return roll * 2;
        }
    }
    statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " rolled a " + roll;
    return roll;
}

function onDiceRoll() {
    let roll = Math.round(Math.random() * 5) + 1;
    let turnPlayer = turn % players;

    if (players == 0) {
        return;
    }
    
    rollHistory[turnPlayer].push(roll);

    roll = checkForSpecialRolls(playerScores, rollHistory[turnPlayer], roll);
    playerScores[turnPlayer] += roll;

    console.log(playerScores[turnPlayer]);

    if (playerScores[turnPlayer] >= 30) {
        statusBar.textContent = "Player " + ((turn % players) + 1).toString() + " reached 30 first and won!";
        players = 0;
        return;
    }

    turn++;
}

dice.onclick = onDiceRoll;