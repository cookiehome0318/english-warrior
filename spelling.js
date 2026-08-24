// ======================================
// 英文小勇士 Ultimate Spelling
// Step 1-1
// ======================================

let currentWord = 0;
let userAnswer = [];
let hintUsed = false;

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

   userAnswer = [];
hintUsed = false;
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

    for(let i = 0; i < answer.length; i++){

        if(userAnswer[i]){

html +=
    userAnswer[i].toLowerCase() + " ";

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

    const answer =
        words[currentWord].english.toLowerCase();

    // 找下一個還沒有填入的位置
    let position = -1;

    for(let i = 0; i < answer.length; i++){

        if(!userAnswer[i]){

            position = i;

            break;

        }

    }

    if(position === -1){

        return;

    }

    userAnswer[position] =
        letter.toLowerCase();

    document.getElementById(
        "letter" + index
    ).disabled = true;

    updateAnswer();

    // 全部填完
    let complete = true;

    for(let i = 0; i < answer.length; i++){

        if(!userAnswer[i]){

            complete = false;

            break;

        }

    }

    if(complete){

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

   userAnswer = [];

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

  if(userAnswer.join("").toLowerCase() === correct){

        let totalCorrect =
        Number(localStorage.getItem("totalCorrect")) || 0;

        totalCorrect++;

        localStorage.setItem(
            "totalCorrect",
            totalCorrect
        );

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

        let totalWrong =
        Number(localStorage.getItem("totalWrong")) || 0;

        totalWrong++;

        localStorage.setItem(
            "totalWrong",
            totalWrong
        );

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

    // ==============================
    // 最高 Combo
    // ==============================

    let highCombo =
    Number(localStorage.getItem("highCombo")) || 0;

    if(combo > highCombo){

        highCombo = combo;

        localStorage.setItem(
            "highCombo",
            highCombo
        );

    }

    // ==============================
    // Combo 成就
    // ==============================

    if(combo === 5){

        unlockAchievement(
            "combo5",
            "連續答對 5 題"
        );

    }

    // ==============================
    // Boss 獎勵
    // ==============================

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

    // ==============================
    // 最高分
    // ==============================

    if(score > highScore){

        highScore = score;

        localStorage.setItem(
            "spellingHighScore",
            highScore
        );

    }

    // ==============================
    // 儲存金幣
    // ==============================

    localStorage.setItem(
        "coins",
        coins
    );

    // ==============================
    // 更新畫面
    // ==============================

    document.getElementById("score").textContent =
    score;

    document.getElementById("combo").textContent =
    "🔥 Combo x" + combo;

    document.getElementById("coins").textContent =
    coins;

    // ==============================
    // 下一題
    // ==============================

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

    time = isBoss ? 20 : 60;

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

// ======================================
// Step 3-5
// 💡 隨機提示一個正確字母
// ======================================

function hint(){

    const answer =
        words[currentWord].english.toLowerCase();

    // 找出還沒有填入的位置
    let availablePositions = [];

    for(let i = 0; i < answer.length; i++){

        if(!userAnswer[i]){

            availablePositions.push(i);

        }

    }

    if(availablePositions.length === 0){

        return;

    }

    // 每題第一次提示免費
    if(!hintUsed){

        hintUsed = true;

    }else{

        // 第二次開始才扣金幣
        if(coins < 20){

            alert("🪙 金幣不足！");

            return;

        }

        coins -= 20;

        localStorage.setItem(
            "coins",
            coins
        );

        document.getElementById("coins").textContent =
            coins;

    }

    // 隨機選一個還沒填的位置
    const randomPosition =
        availablePositions[
            Math.floor(
                Math.random() *
                availablePositions.length
            )
        ];

    const correctLetter =
        answer[randomPosition];

    // 直接填入正確字母
    userAnswer[randomPosition] =
        correctLetter;

    // 找到相同的字母按鈕並停用
    const buttons =
        document.querySelectorAll(
            "#letters button"
        );

    for(const btn of buttons){

        if(
            !btn.disabled &&
            btn.textContent.toLowerCase() ===
            correctLetter
        ){

            btn.disabled = true;

            break;

        }

    }

    updateAnswer();

}

// ======================================
// Step 3-6
// 返回上一個字母
// ======================================

function undoLetter(){

    // 找最後一個已填入的字母
    let lastPosition = -1;

    for(let i = userAnswer.length - 1; i >= 0; i--){

        if(userAnswer[i]){

            lastPosition = i;
            break;

        }

    }

    if(lastPosition === -1){

        return;

    }

    const lastLetter =
        userAnswer[lastPosition];

    userAnswer[lastPosition] = null;

    updateAnswer();

    const buttons =
        document.querySelectorAll(
            "#letters button"
        );

    for(const btn of buttons){

        if(
            btn.disabled &&
            btn.textContent.toLowerCase() ===
            lastLetter.toLowerCase()
        ){

            btn.disabled = false;

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