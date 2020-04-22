//  ##     ##    ###    ########  #### ######## ##    ## ######## 
//  ##     ##   ## ##   ##     ##  ##  ##       ###   ##    ##    
//  ##     ##  ##   ##  ##     ##  ##  ##       ####  ##    ##    
//  ##     ## ##     ## ########   ##  ######   ## ## ##    ##    
//   ##   ##  ######### ##   ##    ##  ##       ##  ####    ##    
//    ## ##   ##     ## ##    ##   ##  ##       ##   ###    ##    
//     ###    ##     ## ##     ## #### ######## ##    ##    ##    

// Variables
var players = [];
var boxes = [];
var currentPlayer;
var runDice;
var walking;
var cheatDice;
var playersInfo = [
    {
        'img':'./media/blue-dot.png'
    },
    {
        'img':'./media/green-dot.png'
    },
    {
        'img':'./media/red-dot.png'
    },
    {
        'img':'./media/yellow-dot.png'
    }
]

// Consts
var diceSpeed = 100;
var figSpeed = 1000;
const gameInterval = 500;
var animatFigMove = true;
const initialBalance = 10000;
var passStartAward = 2000;
var landPrice = 1000;
var landFee = 500;
var buildingPrice = 500;
var buildingFee = 500;
const maxBuildingNum = 5;
const FigMap = [
    [652, 555],
    [664, 454],
    [664, 354],
    [664, 254],
    [664, 154],
    [664, 42],
    [552, 42],
    [452, 42],
    [352, 42],
    [252, 42],
    [139, 42],
    [139, 154],
    [139, 254],
    [139, 354],
    [139, 454],
    [139, 566],
    [252, 567],
    [352, 567],
    [452, 567],
    [552, 567]
]

window.addEventListener('load', initial, false);

//  #### ##    ## #### ######## ####    ###    ##       #### ######## ######## 
//   ##  ###   ##  ##     ##     ##    ## ##   ##        ##       ##  ##       
//   ##  ####  ##  ##     ##     ##   ##   ##  ##        ##      ##   ##       
//   ##  ## ## ##  ##     ##     ##  ##     ## ##        ##     ##    ######   
//   ##  ##  ####  ##     ##     ##  ######### ##        ##    ##     ##       
//   ##  ##   ###  ##     ##     ##  ##     ## ##        ##   ##      ##       
//  #### ##    ## ####    ##    #### ##     ## ######## #### ######## ######## 

function initial() {
    //Button Initialize
    document.getElementById('startButton').addEventListener('click', start, false);
    document.getElementById('resetButton').addEventListener('click', reset, false);
    var diceButton = document.getElementById('diceButton');
    diceButton.addEventListener('click', rollDice, false);
    diceButton.style.visibility = 'hidden';
    
    //Plaza, StartBox
    var plaza = document.getElementById('plaza');
    var boxStart = document.getElementById('box0');
    
    // Lab
    // for (var i = 0; i < 1; i++) {
    //     var playerImg = document.createElement('img');
    //     playerImg.src = playersInfo[i]['img'];
    //     playerImg.id = 'player'+i+'img';
    //     boxStart.appendChild(playerImg);
    //     for (var j = 1; j < 20; j++) {
    //         var playerImg = document.createElement('img');
    //         playerImg.src = playersInfo[i]['img'];
    //         playerImg.id = 'player'+i+'img';
    //         document.getElementById('box'+j).appendChild(playerImg);
    //     }
    // }
    // for (var i = 0; i < 20; i++) {
    //     var mover = document.createElement('img');
    //     mover.src = playersInfo[0]['img'];
    //     mover.id = 'mvFig';
    //     mover.style.top = FigMap[i][0]+'px';
    //     mover.style.left = FigMap[i][1]+'px';
    //     document.getElementById('game-col').appendChild(mover);
    // }

    //Place player Image & Game Data Setting
    for (var i = 0; i < 4; i++) {
        var playerImg = document.createElement('img');
        playerImg.src = playersInfo[i]['img'];
        playerImg.id = 'player'+i+'img';
        boxStart.appendChild(playerImg);
        players[i] = {};
        players[i].balance = initialBalance;
        players[i].loc = 0;
        players[i].isBroke = false;
        playersInfo[i].color = getComputedStyle(document.body).getPropertyValue('--player'+(i+1)+'-color');
    }
    for (var i = 0; i < 20; i++) {
        boxes[i] = {};
        boxes[i].owner = -1;
        boxes[i].buildings = 0;
    }
}

//   ######      ###    ##     ## ######## 
//  ##    ##    ## ##   ###   ### ##       
//  ##         ##   ##  #### #### ##       
//  ##   #### ##     ## ## ### ## ######   
//  ##    ##  ######### ##     ## ##       
//  ##    ##  ##     ## ##     ## ##       
//   ######   ##     ## ##     ## ######## 

function playerTurn() {
    document.getElementById('player').innerHTML = 'Player '+(currentPlayer+1);
    newRecord('Player #'+(currentPlayer+1)+'\'s turn');
    diceButton.style.visibility = 'visible';
}

function rollDice() {
    var diceImg = document.createElement('img');
    diceImg.id = 'diceImg';
    plaza.appendChild(diceImg);
    diceButton.value = 'Stop!';
    diceButton.removeEventListener('click', rollDice, false);
    diceButton.addEventListener('click', stopDice, false);
    runDice = true;
    cheatDice = false;
    var diceNum;
    function diceRolling() {
        if (runDice && !cheatDice) {
            diceNum = Math.floor(1 + Math.random() * 6);
            diceImg.src = './media/die' + diceNum + '.png';
            setTimeout(diceRolling, diceSpeed);
        } else if (!runDice) {
            walkBox(currentPlayer, diceNum);
        }
    }
    diceRolling();
}

function stopDice() {
    runDice = false;
    removeDice(gameInterval);
}

function walkBox(playerNum, steps) {

    //Calculation
    var oldLoc = players[playerNum].loc
    var newLoc = players[playerNum].loc + steps;
    if (newLoc > 19) {
        passingStart(newLoc != 20);
        newLoc -= 20;
    }
    players[playerNum].loc = newLoc;
    
    //Announce
    newRecord('Player #'+(playerNum+1)+' walked '+steps+' step(s) to box #'+newLoc);
    refreshPage();

    //Remove old Fig
    var playerImg = document.getElementById('player'+playerNum+'img');
    playerImg.parentNode.removeChild(playerImg);

    //Moving
    if (animatFigMove) {

        //Animated Functions
        function aniWalk(startCords, endCords, duration) {
            var mvTop = endCords[0] - startCords[0];
            var mvLeft = endCords[1] - startCords[1];
            var startT = Date.now();
            var passedT;
            function go() {
                walking = true;
                passedT = Date.now()-startT;
                if (passedT >= duration) {
                    clearInterval(act);
                    walking = false;
                }
                mover.style.top = (startCords[0]+mvTop*passedT/duration)+'px';
                mover.style.left = (startCords[1]+mvLeft*passedT/duration)+'px';
            }
            var act = setInterval(go, 1);
        }
        function clean() {
            mover.parentNode.removeChild(mover);
            document.getElementById('box'+newLoc).appendChild(playerImg);
            arrivalAction(newLoc);
        }

        //Initializing
        var mover = document.createElement('img');
        mover.src = playersInfo[playerNum]['img'];
        mover.id = 'mvFig';
        mover.style.top = FigMap[oldLoc][0]+'px';
        mover.style.left = FigMap[oldLoc][1]+'px';
        document.getElementById('game-col').appendChild(mover);
        for (var i = 0; i < steps; i++) {
            var delay = figSpeed/steps*i;
            var startCords = FigMap[(oldLoc+i >= 20) ? oldLoc+i-20 : oldLoc+i];
            var endCords = FigMap[(oldLoc+i+1 >= 20) ? oldLoc+i-19 : oldLoc+i+1];
            setTimeout(aniWalk, delay, startCords, endCords, figSpeed/steps);
        }
        setTimeout(clean, figSpeed);

    } else {
        document.getElementById('box'+newLoc).appendChild(playerImg);
        setTimeout(arrivalAction, gameInterval, newLoc);
    }
}

function arrivalAction(boxNum) {
    if (boxNum == 0) {
        ;
    } else if (boxes[boxNum].owner == -1) {
        buyingLand(boxNum);
    } else if (boxes[boxNum].owner == currentPlayer) {
        buildBuilding(boxNum);
    } else {
        boxOwner = boxes[boxNum].owner;
        payingFees(boxNum, boxOwner);
    }
    refreshPage();
    setTimeout(handingToNextPlayer, gameInterval);
}

function passingStart(landORpass) {
    players[currentPlayer].balance += passStartAward;
    if (landORpass) {
        newRecord('Player #'+(currentPlayer+1)+' pass Start, award $'+passStartAward);
    } else {
        newRecord('Player #'+(currentPlayer+1)+' land on Start, award $'+passStartAward);
    }
}

function buyingLand(boxNum) {
    if (players[currentPlayer].balance >= landPrice) {
        var buy = window.confirm('Buying this Place?');
        if (buy) {
            players[currentPlayer].balance -= landPrice;
            boxes[boxNum].owner = currentPlayer;
            newRecord('Player #'+(currentPlayer+1)+' buy box #'+boxNum+' with $'+landPrice);
        }
    }
}

function buildBuilding(boxNum) {
    if (players[currentPlayer].balance >= buildingPrice && boxes[boxNum].buildings < maxBuildingNum) {
        var build = window.confirm('Build a new Building?')
        if (build) {
            players[currentPlayer].balance -= buildingPrice;
            boxes[boxNum].buildings += 1;
            newRecord('Player #'+(currentPlayer+1)+' build a new building on box #'+boxNum+' with $'+buildingPrice+', box #'+boxNum+' now has '+boxes[boxNum].buildings+' building(s)');
        }
    }
}

function payingFees(boxNum, boxOwner) {
    var fee = landFee + buildingFee*boxes[boxNum].buildings;
    if (fee <= players[currentPlayer].balance) {
        players[currentPlayer].balance -= fee;
        players[boxOwner].balance += fee;
        newRecord('Player #'+(currentPlayer+1)+' pays $'+fee+' of passing fees to Player #'+boxOwner);
    } else {
        window.alert('Oops! Player #'+(currentPlayer+1)+' is Broke!');
        players[boxOwner].balance += broke(currentPlayer);
        newRecord('Player #'+(currentPlayer+1)+' is Broke');
    }
}

// Int = Next Player Num (-1 if Game Ends)
function handingToNextPlayer() {
    if (!gameEnd()) {
        do {
            currentPlayer = (currentPlayer == 3) ? 0 : currentPlayer+1;
        } while (players[currentPlayer]['isBroke'])
        playerTurn();
        return currentPlayer;
    } else {
        for (var i = 0; i < 4; i++) {
            if (!players[i]['isBroke']) {
                var winner = i+1;
                break;
            }
        }
        window.alert('Game Ends, Player #'+winner+' Wins!');
        newRecord('Game Ends, Player #'+winner+' wins the game');
        return -1;
    }
}

//  ##     ## ######## #### ##       #### ######## #### ########  ######  
//  ##     ##    ##     ##  ##        ##     ##     ##  ##       ##    ## 
//  ##     ##    ##     ##  ##        ##     ##     ##  ##       ##       
//  ##     ##    ##     ##  ##        ##     ##     ##  ######    ######  
//  ##     ##    ##     ##  ##        ##     ##     ##  ##             ## 
//  ##     ##    ##     ##  ##        ##     ##     ##  ##       ##    ## 
//   #######     ##    #### ######## ####    ##    #### ########  ######  

// Bool = Game is End or Not
function gameEnd() {
    var brokeCount = 0;
    for (var i = 0; i < 4; i++) {
        brokeCount = (players[i]['isBroke']) ? brokeCount+1 : brokeCount;
    }
    return (brokeCount == 3)
}

// Int = Broke Player Remains Balance
function broke(playerNum) {
    //Reset Players' Properties
    for (var i = 0; i < 20; i++) {
        if (boxes[i].owner == playerNum) {
            boxes[i].owner = -1;
            boxes[i].buildings = 0;
        }
    }

    //Remove Player Image from Board
    var playerImg = document.getElementById('player'+playerNum+'img');
    playerImg.parentNode.removeChild(playerImg);

    restBalance = players[playerNum].balance

    //Clear Player Datas
    players[playerNum].balance = 0;
    players[playerNum].loc = -1;
    players[playerNum].isBroke = true;

    //Return rest player Balance
    return restBalance;
}

// Void
function changeBackground(boxNum, color) {
    document.getElementById('box'+boxNum).style.backgroundColor = color;
    if (boxNum/5 > 0 && boxNum%5 == 0) {
        document.getElementById('box'+boxNum+'-1').style.backgroundColor = color;
        document.getElementById('box'+boxNum+'-2').style.backgroundColor = color;
    }
}

// Void
function changeBuildingNum(boxNum, buildingNum) {
    var buildingNode = document.getElementById('building'+boxNum+'Num')
    if (buildingNode) {
        buildingNode.innerHTML = buildingNum;
    }
    else {
        buildingNode = document.createElement('p');
        buildingNode.id = 'building'+boxNum+'Num';
        buildingNode.innerHTML = buildingNum;
        document.getElementById('building'+boxNum).appendChild(buildingNode)
    }
}

// Void
function newRecord(message) {
    var record = document.getElementById('record-tab');
    var now = new Date;
    Hours = (now.getHours() < 10) ? '0'+now.getHours() : now.getHours();
    Minutes = (now.getMinutes() < 10) ? '0'+now.getMinutes() : now.getMinutes();
    Seconds = (now.getSeconds() < 10) ? '0'+now.getSeconds() : now.getSeconds();
    newRecordData = document.createElement('li');
    newRecordData.innerHTML = Hours+':'+Minutes+':'+Seconds+' - '+message;
    record.appendChild(newRecordData);
    record.parentNode.scrollTop = record.scrollHeight;
}

// Void
function refreshPage() {
    //Player Info
    for (var i = 0; i < 4; i++) {
        var node = document.getElementById('player'+(i+1)+'box').children;
        node[0].innerHTML = 'Balance: '+players[i].balance;
        node[1].innerHTML = 'Location: '+players[i].loc;
        node[2].innerHTML = 'isBroke: '+players[i].isBroke;
    }

    //Game Board
    for (var i = 0; i < 20; i++) {
        //Box Background
        tmpOwner = boxes[i].owner;
        if (tmpOwner != -1) {
            changeBackground(i, playersInfo[tmpOwner].color);
        } else {
            changeBackground(i, 'transparent');
        }
        
        //Building Nums
        if (i != 0) {
            changeBuildingNum(i, boxes[i].buildings);
        }
    }
}

// Bool = Dice is Found or Not
function removeDice(rmvAfter) {
    diceImg = document.getElementById('diceImg')
    if (diceImg) {
        diceButton.style.visibility = 'hidden';
        diceButton.value = 'Roll Dice!';
        diceButton.removeEventListener('click', stopDice, false);
        diceButton.addEventListener('click', rollDice, false);
        setTimeout(function() {plaza.removeChild(diceImg);}, rmvAfter)
    }
    return diceImg;
}

//  ########  ##     ## ######## ########  #######  ##    ##  ######  
//  ##     ## ##     ##    ##       ##    ##     ## ###   ## ##    ## 
//  ##     ## ##     ##    ##       ##    ##     ## ####  ## ##       
//  ########  ##     ##    ##       ##    ##     ## ## ## ##  ######  
//  ##     ## ##     ##    ##       ##    ##     ## ##  ####       ## 
//  ##     ## ##     ##    ##       ##    ##     ## ##   ### ##    ## 
//  ########   #######     ##       ##     #######  ##    ##  ######  

function start() {
    refreshPage();
    document.getElementById('playerTitle').innerHTML = 'Current Player';
    newRecord('Game Starts');
    currentPlayer = 0;
    playerTurn()
}

function reset() {
    for (var i = 0; i < 4; i++) {
        var node = document.getElementById('player'+(i+1)+'box').children;
        node[0].innerHTML = 'Balance: ';
        node[1].innerHTML = 'Location: ';
        node[2].innerHTML = 'isBroke: ';
        var playerImg = document.getElementById('player'+i+'img');
        if (playerImg) {
            playerImg.parentNode.removeChild(playerImg);
        }
    }
    for (var i = 0; i < 20; i++) {
        changeBackground(i, 'transparent');
        if (i != 0) {
            changeBuildingNum(i, '');
        }
    }
    removeDice(0);
    document.getElementById('player').innerHTML = '';
    document.getElementById('playerTitle').innerHTML = 'Press Start to Play the Game';

    newRecord('Game Reset');
    players = [];
    boxes = [];
    initial();
}

//   ######  ##     ## ########    ###    ########  ######  
//  ##    ## ##     ## ##         ## ##      ##    ##    ## 
//  ##       ##     ## ##        ##   ##     ##    ##       
//  ##       ######### ######   ##     ##    ##     ######  
//  ##       ##     ## ##       #########    ##          ## 
//  ##    ## ##     ## ##       ##     ##    ##    ##    ## 
//   ######  ##     ## ######## ##     ##    ##     ######  

// Void
function assignDiceNum(newDiceNum, printToRecord) {
    if (runDice) {
        if (printToRecord) {
            newRecord('Maually assigned Dice Num to '+newDiceNum);
        }
        cheatDice = true;
        removeDice(gameInterval);
        walkBox(currentPlayer, newDiceNum);
    }
}

// Void
function kickOutPlayer(playerNum, printToRecord) {
    if (printToRecord) {
        newRecord('Maually kick out player #'+playerNum);
    }
    playerNum -= 1;
    if (playerNum == currentPlayer) {
        removeDice(0);
        broke(playerNum);
        handingToNextPlayer();
    } else {
        broke(playerNum);
    }
    refreshPage();
}

// Int = Next Player Num (-1 if Game Ends)
function doNothing() {
    removeDice(0);
    return handingToNextPlayer();
}