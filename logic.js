console.log('the main logic of the application. Main movement mechanic');
const board = document.getElementById("board");
const drone = document.getElementById("drone");
const soundPlayer = document.getElementById("soundplayer");
const droneIcon = document.getElementById("icon");
const explosion = document.getElementById("explosion");
const alertBtn = document.getElementById("btnReport");
alertBtn.style.visibility = "collapse";

const isMobile = window.matchMedia("(max-width: 767px)").matches;

const grav = isMobile ? 30 : 50;
const SIZE = isMobile ? 300 : 500;
const WIDTH = SIZE;
const HEIGHT = SIZE;

board.style.width = SIZE +"px";
board.style.height = SIZE +"px";

drone.style.width = grav+"px";
drone.style.height = grav+"px";

droneIcon.style.height = grav+"px";
droneIcon.style.width = grav+"px";

const TOTAL_DISTANCE = Math.pow((HEIGHT - 0),2) + Math.pow((HEIGHT - 0),2);

let xPos = 0;
let yPos = 0;

let compass = 0; //in degrees
let ROTATION_ANGLE = 90;
let submarineIsLocated = false;

window.addEventListener('keydown',(ev)=>{
    action(ev.key);
    // postNotifications()
});

function showInfo(){
    $('#infoModal').modal('toggle');
}

function action(key){
    keyPressNotification(key);
    switch(key){
        case 'ArrowDown':
            // yPos += grav;
            if( shouldMoveVertical('down') ) drone.style.transform = `translate(${xPos}px,${yPos}px)`;
            break;
        case 'ArrowUp':
            // yPos -= grav;
            if( shouldMoveVertical('up') ) drone.style.transform = `translate(${xPos}px,${yPos}px)`;
            break;
        case 'ArrowLeft':
            if( shouldMoveHorizontal('left') ) drone.style.transform = `translate(${xPos}px,${yPos}px)`;
            // drone.style.transform = `translate(${xPos}px,${yPos}px)`;
            break;
        case 'ArrowRight':
            if( shouldMoveHorizontal('right') ) drone.style.transform = `translate(${xPos}px,${yPos}px)`;
            break;

        case 'Shift':
            applyRotation();
            break;

        case 'r':
            report();
            break; 

        case 'i':
            showInfo();
            break;

        case 'report':
            attackLocation();
            break;
    }
}

function applyRotation(){
    compass += ROTATION_ANGLE;
    compass = compass == 360 ? 0 : compass ;
    droneIcon.style.transform = `rotate(${compass}deg)`;
    notifyDirection();
    // drone.style.transform += `translate(${xPos}px,${yPos}px)`;
}

function postNotifications(){console.log(`New Position`, {x:xPos,y:yPos}); calculateDistance();notifyDirection();}

function shouldMoveHorizontal(direction){
    if(direction === 'left'){
        xPos -= grav;
        xPos = isBounded(xPos) ? xPos : xPos+=grav ;
        postNotifications();
        return true;
    }
    if(direction === 'right'){
        xPos += grav;
        xPos = isBounded(xPos) ? xPos : xPos-=grav ;
        postNotifications();
        return true;
    }
    return false;
}

function shouldMoveVertical(direction){
    if(direction === 'up'){
        yPos -= grav;
        yPos = isBounded(yPos) ? yPos : yPos+=grav ;
        postNotifications();
        return true;
    }
    if(direction === 'down'){
        yPos += grav;
        yPos = isBounded(yPos) ? yPos : yPos-=grav ;
        postNotifications();
        return true;
    }
    return false;
}

function isBounded(num){
    return num < WIDTH && num > -1;
}

function calculateDistance(){
    let distance = Math.pow((HEIGHT - xPos),2) + Math.pow((HEIGHT - yPos),2);
    console.log('The DISTANCE TO THE CORE IS '+(distance/1000) 
    +"KM; While Total Distance is "+TOTAL_DISTANCE/1000 +` AND STRENTH ${distance}/${TOTAL_DISTANCE}`);
    let strength = Math.max(1 - (distance/TOTAL_DISTANCE),0);
    console.log('strength is '+strength);
    soundPlayer.volume = strength;
    soundPlayer.currentTime = 0;
    soundPlayer.play();
    submarineIsLocated = strength >= .8;
    alertBtn.style.visibility = submarineIsLocated ? "visible" : "collapse"
}

function keyPressNotification(key){
    console.log(`Pressed ${key} while margins are `+ drone.style.transform);
    console.log(`While the Drone is ${drone.style.width}`)
}

const testLabel = document.getElementById("test");

let dir = "North";
function notifyDirection(){
    const spaceLength = (grav*2);
    switch(compass){
        case 0:
            dir = "North"
            attackY = yPos - spaceLength;
            attackY = Math.max(0,attackY);
            break;

        case 90:
            dir = "East"
            attackX = xPos + spaceLength;
            break;
        case 180:
            dir = "South"
            attackY = yPos + spaceLength;
            break;
        case 270:
            dir = "West"
            attackX = xPos - spaceLength;
            break;
    }
    testLabel.textContent = "Currently facing "+dir;
    explosion.style.transform = `translate(${attackX}px,${attackY}px)`;
}

let attackX = 0, attackY = 0;
function attackLocation(){
    $('#successModal').modal('toggle');
    console.error(`attacking ${attackX},${attackY} WHILE I AM AT ${xPos},${yPos}`);
}

function report(){
    alert(`Azure, do you read me?\nMy location is ${xPos},${yPos} and facing ${dir}\n`)
}