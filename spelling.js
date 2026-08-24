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

    // 只挑選有圖片路徑的單字，避免沒有圖片的單字造成破圖
    const imageWords = words.filter(function(word){
        return word && word.image;
    });

    if(imageWords.length === 0){
        console.error("沒有可用的圖片單字");
        return;
    }

    // 找到原始 words 陣列中的索引
    const selectedWord =
    imageWords[Math.floor(Math.random() * imageWords.length)];

    currentWord = words.indexOf(selectedWord);

    userAnswer = "";

    const wordImage = document.getElementById("wordImage");

    wordImage.style.display = "block";
    wordImage.alt = selectedWord.chinese || selectedWord.english || "圖片";

    const imagePath =
        selectedWord.image ||
        ("images/" + selectedWord.english.toLowerCase() + ".png");

    wordImage.onerror = function(){
        console.warn("找不到圖片：", imagePath);
        this.style.display = "none";
    };

    wordImage.src = imagePath;

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

    if(!popup){

        return;

    }

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

    isBoss = (
        score > 0 &&
        score % 10 === 0
    );

}


// ======================================
// Step 3-2
// Combo
// ======================================

let combo = 0;


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
        Math.random() *
        window.innerWidth + "px";

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
    document.getElementById(
        "achievementPopup"
    );

    if(popup){

        popup.innerHTML =
        "🏆<br><br>" + text;

        popup.style.display = "block";

        setTimeout(function(){

            popup.style.display = "none";

        },2500);

    }

    const achievement =
    document.getElementById("achievement");

    if(achievement){

        achievement.innerHTML =
        "🏅 " + text;

    }

}


// ======================================
// Step 4-1
// 錯題紀錄
// ======================================

let wrongWords =
JSON.parse(
    localStorage.getItem("spellingWrongWords")
) || [];


function saveWrongWord(word){

    if(!wrongWords.includes(word)){

        wrongWords.push(word);

        localStorage.setItem(
            "spellingWrongWords",
            JSON.stringify(wrongWords)
        );

    }

}


// ======================================
// Step 4-2
// 提示功能
// ======================================

function showHint(){

    const word =
    words[currentWord].english;

    if(!word) return;

    const firstLetter =
    word.charAt(0);

    const message =
    document.getElementById("message");

    if(!message){

        return;

    }

    message.innerHTML =

    "💡 提示：第一個字母是 <strong>" +
    firstLetter +
    "</strong>";

    message.style.color =
    "#2196f3";

}


// ======================================
// Step 4-3
// 再聽一次發音
// ======================================

function repeatSound(){

    speakWord();

}


// ======================================
// Step 4-4
// 返回上一個字母
// ======================================

function removeLetter(){

    if(userAnswer.length === 0){

        return;

    }

    userAnswer =
    userAnswer.slice(0,-1);

    document
    .querySelectorAll("#letters button")
    .forEach(function(btn){

        btn.disabled = false;

    });

    updateAnswer();

}


// ======================================
// Step 4-5
// 鍵盤輸入
// ======================================

document.addEventListener(
    "keydown",
    function(event){

        const key =
        event.key.toLowerCase();

        if(
            key.length === 1 &&
            key >= "a" &&
            key <= "z"
        ){

            const buttons =
            document.querySelectorAll(
                "#letters button"
            );

            for(let i=0;i<buttons.length;i++){

                const button =
                buttons[i];

                if(
                    !button.disabled &&
                    button.textContent
                    .trim()
                    .toLowerCase() === key
                ){

                    button.click();

                    break;

                }

            }

        }

        if(event.key === "Backspace"){

            removeLetter();

        }

        if(event.key === "Enter"){

            if(
                userAnswer.length ===
                words[currentWord].english.length
            ){

                checkAnswer();

            }

        }

    }
);

// ======================================
// Step 4-6
// 防止圖片破圖
// ======================================

function setWordImage(){

    const image =
    document.getElementById("wordImage");

    if(!image) return;

    const word =
    words[currentWord];

    if(!word){

        image.style.display =
        "none";

        return;

    }

    let imagePath =
    word.image;

    if(!imagePath){

        imagePath =
        "images/" +
        word.english.toLowerCase() +
        ".png";

    }

    image.onerror = function(){

        console.log(
            "找不到圖片：",
            imagePath
        );

        this.style.display =
        "none";

    };

    image.onload = function(){

        this.style.display =
        "block";

    };

    image.src =
    imagePath;

}


// ======================================
// Step 4-7
// 更新遊戲資訊
// ======================================

function updateGameInfo(){

    const scoreElement =
    document.getElementById("score");

    const lifeElement =
    document.getElementById("life");

    const comboElement =
    document.getElementById("combo");

    const coinsElement =
    document.getElementById("coins");

    const levelElement =
    document.getElementById("level");

    const expElement =
    document.getElementById("exp");

    const highScoreElement =
    document.getElementById("highScore");


    if(scoreElement){

        scoreElement.textContent =
        score;

    }


    if(lifeElement){

        lifeElement.textContent =
        life;

    }


    if(comboElement){

        comboElement.textContent =
        "🔥 Combo x" + combo;

    }


    if(coinsElement){

        coinsElement.textContent =
        coins;

    }


    if(levelElement){

        levelElement.textContent =
        level;

    }


    if(expElement){

        expElement.textContent =
        exp;

    }


    if(highScoreElement){

        highScoreElement.textContent =
        highScore;

    }

}


// ======================================
// 重新開始遊戲
// ======================================

function resetSpellingGame(){

    score = 0;

    life = 3;

    combo = 0;

    userAnswer = "";

    updateGameInfo();

    newWord();

}


// ======================================
// 安全初始化
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        updateGameInfo();

    }
);


// ======================================
// 確保圖片在每次換題時正確載入
// ======================================

const originalNewWord =
newWord;

newWord = function(){

    originalNewWord();

    setTimeout(function(){

        setWordImage();

    },50);

};


// ======================================
// 頁面離開時停止計時
// ======================================

window.addEventListener(
    "beforeunload",
    function(){

        clearInterval(timer);

    }
);

// ======================================
// 第 4 段
// 最後初始化與錯誤保護
// ======================================

// 確保圖片元素存在
function ensureImageElement(){

    const image =
    document.getElementById("wordImage");

    if(!image){

        console.warn(
            "找不到 wordImage 圖片元素"
        );

        return false;

    }

    return true;

}


// ======================================
// 圖片載入測試
// ======================================

function checkCurrentImage(){

    if(!ensureImageElement()){

        return;

    }

    const image =
    document.getElementById("wordImage");

    const word =
    words[currentWord];

    if(!word){

        image.style.display = "none";

        return;

    }

    let imagePath =
    word.image;

    if(!imagePath){

        imagePath =
        "images/" +
        word.english.toLowerCase() +
        ".png";

    }

    image.alt =
    word.chinese || word.english;

    image.onerror = function(){

        console.warn(
            "圖片不存在： " + imagePath
        );

        this.style.display =
        "none";

    };

    image.onload = function(){

        this.style.display =
        "block";

    };

    image.src =
    imagePath;

}


// ======================================
// 防止瀏覽器快取舊圖片
// ======================================

function refreshWordImage(){

    if(!ensureImageElement()){

        return;

    }

    const image =
    document.getElementById("wordImage");

    const word =
    words[currentWord];

    if(!word){

        return;

    }

    let imagePath =
    word.image;

    if(!imagePath){

        imagePath =
        "images/" +
        word.english.toLowerCase() +
        ".png";

    }

    image.onerror = function(){

        this.style.display =
        "none";

    };

    image.onload = function(){

        this.style.display =
        "block";

    };

    image.src =
    imagePath;
}


// ======================================
// 頁面完成後再次確認圖片
// ======================================

window.addEventListener(
    "load",
    function(){

        setTimeout(function(){

            checkCurrentImage();

        },100);

    }
);


// ======================================
// 圖片切換時再次確認
// ======================================

setInterval(function(){

    if(
        typeof currentWord !== "undefined" &&
        typeof words !== "undefined"
    ){

        const image =
        document.getElementById("wordImage");

        if(image){

            if(
                image.style.display !== "none" &&
                image.complete &&
                image.naturalWidth === 0
            ){

                refreshWordImage();

            }

        }

    }

},1000);


// ======================================
// 完成
// ======================================