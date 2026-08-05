// ======================================
// 英文小勇士 Ultimate Spelling
// Step 1-1
// ======================================

let currentWord = 0;
let userAnswer = "";

window.onload = function () {

    newWord();

};

function newWord(){

    clearInterval(timer);

    checkBoss();

    currentWord =
    Math.floor(
        Math.random() * words.length
    );

    userAnswer = "";

    document.getElementById("wordImage").src =
    words[currentWord].image;

    updateAnswer();

    createLetters();

    if(isBoss){

        document.getElementById("message").innerHTML =
        "👑 BOSS 關卡！";

        document.getElementById("message").style.color =
        "#ff9800";

    }else{

        document.getElementById("message").innerHTML =
        "";

    }

    setTimeout(function(){

        speakWord();

    },300);

    startTimer();

}

// ======================================
// Step 1-2
// ======================================

function updateAnswer(){

    let html = "";

    const answer =
    words[currentWord].english;

    for(let i=0;i<answer.length;i++){

        if(userAnswer[i]){

            html += userAnswer[i] + " ";

        }else{

            html += "_ ";

        }

    }
document.getElementById("answer").innerHTML =
    
    html;

}

function createLetters(){

    let letters =
    words[currentWord].english
    .toLowerCase()
    .split("");

    const alphabet =
    "abcdefghijklmnopqrstuvwxyz";

    while(letters.length < 8){

        letters.push(

            alphabet[
                Math.floor(
                    Math.random()*alphabet.length
                )
            ]

        );

    }

    letters.sort(()=>Math.random()-0.5);

    let html = "";

    letters.forEach((letter,index)=>{

        html += `

<button
id="letter${index}"
onclick="addLetter('${letter}',${index})">

${letter}

</button>

`;

    });

    document.getElementById("letters").innerHTML =
    html;

}

function addLetter(letter,index){

    userAnswer += letter;

    document.getElementById(
        "letter"+index
    ).disabled = true;

    updateAnswer();

    if(
        userAnswer.length ===
        words[currentWord].english.length
    ){

        setTimeout(function(){

            checkAnswer();

        },300);

    }

}

// ======================================
// Step 1-3
// ======================================

function speakWord(){

    speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(
        words[currentWord].english
    );

    speech.lang = "en-US";

    speech.rate = 0.8;

    speech.pitch = 1;

    speech.volume = 1;

    speechSynthesis.speak(speech);

}

// ======================================
// Step 1-4
// ======================================

function clearAnswer(){

    userAnswer = "";

    updateAnswer();

    document
    .querySelectorAll("#letters button")
    .forEach(function(btn){

        btn.disabled = false;

    });

}

function checkAnswer(){

    const correct =
    words[currentWord].english.toLowerCase();

    if(userAnswer.toLowerCase()===correct){

        removeWrongWord(correct);

        createStars();

        document.getElementById("message").innerHTML =
        "🎉 答對！";

        document.getElementById("message").style.color =
        "#28a745";

        setTimeout(function(){

            document.getElementById("message").innerHTML =
            "";

            nextWord();

        },1000);

    }else{

        saveWrongWord(correct);

        document.getElementById("message").innerHTML =
        "❌ 答錯！<br>正確答案：" +
        words[currentWord].english;

        document.getElementById("message").style.color =
        "#dc3545";

        wrongAnswer();

    }

}

// ======================================
// Step 2-1
// ======================================

let score = 0;
let life = 3;

function nextWord(){

    clearInterval(timer);

    score++;

    combo++;

    if(combo === 5){

        unlockAchievement(
            "combo5",
            "連續答對 5 題"
        );

    }

    if(isBoss){

        unlockAchievement(
            "boss1",
            "首次擊敗 Boss"
        );

        coins += 100;

        addExp(50);

    }else{

        coins += 10;

        addExp(10);

    }

    if(score > highScore){

        highScore = score;

        localStorage.setItem(
            "spellingHighScore",
            highScore
        );

    }

    localStorage.setItem(
        "coins",
        coins
    );

    document.getElementById("score").textContent =
    score;

    document.getElementById("combo").textContent =
    "🔥 Combo x" + combo;

    document.getElementById("coins").textContent =
    coins;

    newWord();

}

function wrongAnswer(){

    combo = 0;

    life--;

    document.getElementById("life").textContent =
    life;

    document.getElementById("combo").textContent =
    "🔥 Combo x0";

    if(life <= 0){

        gameOver();

        return;

    }

    setTimeout(function(){

        document.getElementById("message").innerHTML =
        "";

        newWord();

    },1500);

}


function gameOver(){

    clearInterval(timer);

    document.getElementById("letters").innerHTML = "";

    document.getElementById("message").innerHTML =

    `
    💀<br><br>

    遊戲結束<br><br>

    ⭐ 分數：${score}<br><br>

    <button onclick="restartGame()">

    🔄 再玩一次

    </button>

    `;

}

function restartGame(){

    score = 0;

    life = 3;

    document.getElementById("score").textContent =
    score;

    document.getElementById("life").textContent =
    life;

    document.getElementById("message").innerHTML =
    "";

    newWord();

}

// ======================================
// Step 2-2
// 倒數計時
// ======================================

let timer = null;

let time = 30;

function startTimer(){

    clearInterval(timer);

    time = isBoss ? 20 : 30;

    document.getElementById("timer").textContent =
    time;

    timer = setInterval(function(){

        time--;

        document.getElementById("timer").textContent =
        time;

        if(time <= 0){

            clearInterval(timer);

            document.getElementById("message").innerHTML =
            "⏰ 時間到！";

            document.getElementById("message").style.color =
            "#ff5722";

            wrongAnswer();

        }

    },1000);

}

// ======================================
// Step 2-3
// 金幣、Combo、最高分
// ======================================

let coins =
Number(localStorage.getItem("coins")) || 0;

let combo = 0;

let highScore =
Number(localStorage.getItem("spellingHighScore")) || 0;

document.getElementById("coins").textContent =
coins;

// ======================================
// Step 2-4
// EXP / Level
// ======================================

let exp =
Number(localStorage.getItem("exp")) || 0;

let level =
Number(localStorage.getItem("level")) || 1;

document.getElementById("level").textContent =
level;

document.getElementById("exp").textContent =
exp;

function addExp(value){

    exp += value;

    while(exp >= 100){

        exp -= 100;

        level++;

        levelUp();

    }

    localStorage.setItem(
        "exp",
        exp
    );

    localStorage.setItem(
        "level",
        level
    );

    document.getElementById("exp").textContent =
    exp;

    document.getElementById("level").textContent =
    level;

}

function levelUp(){

    const popup =
    document.getElementById(
        "achievementPopup"
    );

    popup.innerHTML =

    "🎉<br><br>" +

    "Level Up!<br><br>" +

    "Lv." + level;

    popup.style.display = "block";

    setTimeout(function(){

        popup.style.display = "none";

    },2000);

}

// ======================================
// Step 3-1
// Boss Mode
// ======================================

let isBoss = false;

function checkBoss(){

    isBoss = (score > 0 && score % 10 === 0);

}
// ======================================
// Step 3-3
// 星星特效
// ======================================

function createStars(){

    for(let i=0;i<20;i++){

        const star =
        document.createElement("div");

        star.className = "star";

        star.innerHTML = "⭐";

        star.style.left =
        Math.random()*window.innerWidth + "px";

        star.style.top =
        (window.innerHeight/2) + "px";

        document.body.appendChild(star);

        setTimeout(function(){

            star.remove();

        },1200);

    }

}
// ======================================
// Step 3-4
// 成就系統
// ======================================

let achievements = JSON.parse(
    localStorage.getItem("achievements")
) || {};

function unlockAchievement(key, text){

    if(achievements[key]) return;

    achievements[key] = true;

    localStorage.setItem(
        "achievements",
        JSON.stringify(achievements)
    );

    const popup =
    document.getElementById("achievementPopup");

    popup.innerHTML =
    "🏆<br><br>" + text;

    popup.style.display = "block";

    document.getElementById("achievement").innerHTML =
    "🏅 " + text;

    setTimeout(function(){

        popup.style.display = "none";

    },2500);

}

// ======================================
// Step 3-5
// 提示功能
// ======================================

function hint(){

    if(coins < 20){

        alert("🪙 金幣不足！");

        return;

    }

    const answer =
    words[currentWord].english.toLowerCase();

    if(userAnswer.length >= answer.length){

        return;

    }

    coins -= 20;

    localStorage.setItem(
        "coins",
        coins
    );

    document.getElementById("coins").textContent =
    coins;

    const letter =
    answer[userAnswer.length];

    const buttons =
    document.querySelectorAll(
        "#letters button"
    );

    buttons.forEach(function(btn){

        if(
            !btn.disabled &&
            btn.textContent === letter
        ){

            btn.click();

        }

    });

}

// ======================================
// Step 3-6
// 返回上一個字母
// ======================================

function undoLetter(){

    if(userAnswer.length===0){

        return;

    }

    const lastLetter =
    userAnswer[userAnswer.length-1];

    userAnswer =
    userAnswer.slice(0,-1);

    updateAnswer();

    const buttons =
    document.querySelectorAll(
        "#letters button"
    );

    for(const btn of buttons){

        if(
            btn.disabled &&
            btn.textContent===lastLetter
        ){

            btn.disabled=false;

            break;

        }

    }

}

function goHome(){

    window.location.href = "index.html";

}
// ======================================
// Review System
// ======================================

let wrongWords = JSON.parse(
    localStorage.getItem("wrongWords")
) || [];

function saveWrongWord(word){

    word = word.toLowerCase();

    if(!wrongWords.includes(word)){

        wrongWords.push(word);

        localStorage.setItem(

            "wrongWords",

            JSON.stringify(wrongWords)

        );

    }

}

// ======================================
// Review System 2
// 答對後移除錯題
// ======================================

function removeWrongWord(word){

    word = word.toLowerCase();

    wrongWords =
    wrongWords.filter(function(item){

        return item !== word;

    });

    localStorage.setItem(

        "wrongWords",

        JSON.stringify(wrongWords)

    );

}