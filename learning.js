// ======================================
// 英文小勇士
// 📊 學習中心
// 第一段：基本資料與出題
// ======================================

let currentWord = 0;

let score = 0;

let combo = 0;

let life = 3;

let coins =
    Number(localStorage.getItem("coins")) || 0;

let level =
    Number(localStorage.getItem("level")) || 1;

let exp =
    Number(localStorage.getItem("exp")) || 0;


// ======================================
// 初始化畫面
// ======================================

window.onload = function(){

    document.getElementById("level").textContent =
        level;

    document.getElementById("exp").textContent =
        exp;

    document.getElementById("coins").textContent =
        coins;

    document.getElementById("score").textContent =
        score;

    document.getElementById("combo").textContent =
        combo;

    document.getElementById("life").textContent =
        life;

    newQuestion();
    updateAccuracy();

};


// ======================================
// 新題目
// ======================================

function newQuestion(){

    currentWord =
        Math.floor(
            Math.random() * words.length
        );

    document.getElementById("question").textContent =
        "請選出正確的英文單字";

    showWord();

    createChoices();

    setTimeout(function(){

        playWord();

    },200);

}


// ======================================
// 顯示圖片
// ======================================

function showWord(){

    document.getElementById("wordImage").innerHTML = `

        <img
            src="${words[currentWord].image}"
            width="180"
            height="180"
        >

        <h2>
            ${words[currentWord].chinese}
        </h2>

    `;

}

// ======================================
// 第二段：建立答案選項
// ======================================

function createChoices(){

    let choices = [];

    // 正確答案
    choices.push(currentWord);

    // 加入 3 個不同的錯誤答案
    while(choices.length < 4){

        let random =
            Math.floor(
                Math.random() * words.length
            );

        if(!choices.includes(random)){

            choices.push(random);

        }

    }

    // 打亂選項順序
    choices.sort(function(){

        return Math.random() - 0.5;

    });

    let html = "";

    choices.forEach(function(index){

        html += `

        <button
            class="pictureButton"
            onclick="checkAnswer(${index})">

            ${words[index].english}

        </button>

        `;

    });

    document.getElementById("choices").innerHTML =
        html;

}

// ======================================
// 第三段：判斷答案
// ======================================

function checkAnswer(index){

    const message =
        document.getElementById("message");

    // ==============================
    // 答對
    // ==============================

    if(index === currentWord){

score++;

combo++;

addLearningStats(true);

        coins += 10;

        message.innerHTML =
            "🎉 答對！";

        message.style.color =
            "#28a745";

        document.getElementById("score").textContent =
            score;

        document.getElementById("combo").textContent =
            combo;

        document.getElementById("coins").textContent =
            coins;

        localStorage.setItem(
            "coins",
            coins
        );

    }

    // ==============================
    // 答錯
    // ==============================

    else{

combo = 0;

life--;

addLearningStats(false);

        message.innerHTML =
            "❌ 答錯！<br><br>" +
            "正確答案：" +
            words[currentWord].english;

        message.style.color =
            "#dc3545";

        document.getElementById("combo").textContent =
            combo;

        document.getElementById("life").textContent =
            life;

        // 記錄錯題
        saveWrongWord(
            words[currentWord].english.toLowerCase()
        );

    }

    // ==============================
    // 短暫顯示結果後進下一題
    // ==============================

    setTimeout(function(){

        if(life <= 0){

            gameOver();

            return;

        }

        message.innerHTML = "";

        newQuestion();

    },1200);

}

// ======================================
// 第四段：錯題、遊戲結束、重新開始
// ======================================

function saveWrongWord(word){

    let wrongWords =
        JSON.parse(
            localStorage.getItem("wrongWords")
        ) || [];

    word = word.toLowerCase();

    if(!wrongWords.includes(word)){

        wrongWords.push(word);

    }

    localStorage.setItem(
        "wrongWords",
        JSON.stringify(wrongWords)
    );

}


// ======================================
// 遊戲結束
// ======================================

function gameOver(){

    document.getElementById("question").innerHTML =
        "💀 遊戲結束！";

    document.getElementById("wordImage").innerHTML =
        "本次分數：" + score;

    document.getElementById("choices").innerHTML = `

        <button
            onclick="restartGame()">

            🔄 再玩一次

        </button>

    `;

    document.getElementById("message").innerHTML =
        "❤️ 生命已用完";

}


// ======================================
// 重新開始
// ======================================

function restartGame(){

    score = 0;

    combo = 0;

    life = 3;

    document.getElementById("score").textContent =
        score;

    document.getElementById("combo").textContent =
        combo;

    document.getElementById("life").textContent =
        life;

    document.getElementById("message").innerHTML =
        "";

    newQuestion();

}


// ======================================
// 播放英文單字
// ======================================

function playWord(){

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
// 回首頁
// ======================================

function goHome(){

    location.href = "index.html";

}

// ======================================
// 第五段：學習統計與 EXP
// ======================================

function addLearningStats(isCorrect){

    let totalCorrect =
        Number(localStorage.getItem("totalCorrect")) || 0;

    let totalWrong =
        Number(localStorage.getItem("totalWrong")) || 0;

    if(isCorrect){

        totalCorrect++;

        localStorage.setItem(
            "totalCorrect",
            totalCorrect
        );

        addLearningExp(10);

    }else{

        totalWrong++;

        localStorage.setItem(
            "totalWrong",
            totalWrong
        );

    }

    updateAccuracy();

}


// ======================================
// 增加 EXP
// ======================================

function addLearningExp(amount){

    exp += amount;

    while(exp >= 100){

        exp -= 100;

        level++;

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

// ======================================
// 第六段：答對率
// ======================================

function updateAccuracy(){

    let totalCorrect =
        Number(localStorage.getItem("totalCorrect")) || 0;

    let totalWrong =
        Number(localStorage.getItem("totalWrong")) || 0;

    let totalAnswered =
        totalCorrect + totalWrong;

    let accuracy = 0;

    if(totalAnswered > 0){

        accuracy =
            Math.round(
                (totalCorrect / totalAnswered) * 100
            );

    }

    let accuracyElement =
        document.getElementById("accuracy");

    if(accuracyElement){

        accuracyElement.textContent =
            accuracy + "%";

    }

}