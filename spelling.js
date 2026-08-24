// ======================================
// 英文小勇士 Ultimate
// 拼字挑戰－隨機填空版
// 第 1 段
// ======================================

let currentWord = 0;

let score = 0;
let life = 3;
let combo = 0;

let highScore =
Number(localStorage.getItem("spellingHighScore")) || 0;

let coins =
Number(localStorage.getItem("coins")) || 0;

let exp =
Number(localStorage.getItem("exp")) || 0;

let level =
Number(localStorage.getItem("level")) || 1;

let userAnswer = "";

let blankIndexes = [];

let filledLetters = {};

let gameFinished = false;


// ======================================
// 頁面載入
// ======================================

window.onload = function(){

    updateGameInfo();

    newWord();

};


// ======================================
// 隨機選擇單字
// ======================================

function newWord(){

    clearInterval(
        typeof timer !== "undefined"
        ? timer
        : null
    );

    gameFinished = false;

    userAnswer = "";

    filledLetters = {};

    // 隨機抽單字
    currentWord =
    Math.floor(
        Math.random() * words.length
    );

    const word =
    words[currentWord].english
    .toLowerCase();

    // 隨機決定要挖掉幾個字母
    createRandomBlanks(word);

    // 顯示圖片
    showWordImage();

    // 顯示填空
    updateAnswer();

    // 建立可選字母
    createLetters();

    // 清除提示
    const message =
    document.getElementById("message");

    if(message){

        message.innerHTML = "";

    }

    // 播放發音
    setTimeout(function(){

        speakWord();

    },300);

    // 啟動計時
    if(typeof startTimer === "function"){

        startTimer();

    }

}


// ======================================
// 隨機決定挖空位置
// ======================================

function createRandomBlanks(word){

    blankIndexes = [];

    const length =
    word.length;

    // 依照單字長度決定挖空數量
    let blankCount;

    if(length <= 3){

        blankCount = 1;

    }else if(length <= 5){

        blankCount = 2;

    }else if(length <= 7){

        blankCount = 3;

    }else{

        blankCount = 4;

    }

    // 不超過單字長度
    blankCount =
    Math.min(
        blankCount,
        length - 1
    );

    // 隨機選擇位置
    while(
        blankIndexes.length <
        blankCount
    ){

        const index =
        Math.floor(
            Math.random() * length
        );

        if(
            !blankIndexes.includes(index)
        ){

            blankIndexes.push(index);

        }

    }

    // 排序
    blankIndexes.sort(
        function(a,b){

            return a-b;

        }
    );

}


// ======================================
// 顯示目前單字圖片
// ======================================

function showWordImage(){

    const image =
    document.getElementById(
        "wordImage"
    );

    if(!image){

        return;

    }

    const word =
    words[currentWord];

    if(!word){

        image.style.display =
        "none";

        return;

    }

    let imagePath =
    word.image;

    // 如果 words.js 沒有 image
    // 自動使用單字名稱找圖片
    if(!imagePath){

        imagePath =
        "images/" +
        word.english
        .toLowerCase() +
        ".png";

    }

    image.style.display =
    "block";

    image.alt =
    "";

    image.onerror =
    function(){

        console.log(
            "找不到圖片：",
            imagePath
        );

        this.style.display =
        "none";

    };

    image.onload =
    function(){

        this.style.display =
        "block";

    };

    image.src =
    imagePath;

}


// ======================================
// 顯示隨機填空
// ======================================

function updateAnswer(){

    const answer =
    document.getElementById(
        "answer"
    );

    if(!answer){

        return;

    }

    const word =
    words[currentWord].english
    .toLowerCase();

    let html = "";

    for(
        let i=0;
        i<word.length;
        i++
    ){

        // 如果這個位置是挖空
        if(blankIndexes.includes(i)){

            if(
                filledLetters[i]
            ){

                html +=
                "<span class='filled-letter'>" +
                filledLetters[i] +
                "</span> ";

            }else{

                html +=
                "<span class='blank-letter'>_</span> ";

            }

        }else{

            // 沒有挖空的字母直接顯示
            html +=
            "<span class='fixed-letter'>" +
            word[i] +
            "</span> ";

        }

    }

    answer.innerHTML =
    html;

}


// ======================================
// 建立可選字母
// ======================================

function createLetters(){

    const container =
    document.getElementById(
        "letters"
    );

    if(!container){

        return;

    }

    const word =
    words[currentWord].english
    .toLowerCase();

    let letters = [];

    // 加入真正缺少的字母
    blankIndexes.forEach(
        function(index){

            letters.push(
                word[index]
            );

        }
    );

    // 加入干擾字母
    const alphabet =
    "abcdefghijklmnopqrstuvwxyz";

    while(
        letters.length < 8
    ){

        const randomLetter =
        alphabet[
            Math.floor(
                Math.random() *
                alphabet.length
            )
        ];

        letters.push(
            randomLetter
        );

    }

    // 隨機排列
    letters.sort(
        function(){

            return Math.random()-0.5;

        }
    );

    let html = "";

    letters.forEach(
        function(letter,index){

            html += `

            <button
                id="letter${index}"
                onclick="addLetter('${letter}',${index})"
            >
                ${letter}
            </button>

            `;

        }
    );

    container.innerHTML =
    html;

}

// ======================================
// 拼字挑戰－隨機填空版
// 第 2 段
// ======================================


// ======================================
// 點選字母
// ======================================

function addLetter(letter, buttonIndex){

    const word =
    words[currentWord].english
    .toLowerCase();

    // 找出還沒有填寫的空格
    let emptyIndex = -1;

    for(
        let i=0;
        i<blankIndexes.length;
        i++
    ){

        const index =
        blankIndexes[i];

        if(!filledLetters[index]){

            emptyIndex = index;

            break;

        }

    }

    // 已經沒有空格
    if(emptyIndex === -1){

        return;

    }

    // 填入字母
    filledLetters[emptyIndex] =
    letter;

    // 禁用這顆按鈕
    const button =
    document.getElementById(
        "letter" + buttonIndex
    );

    if(button){

        button.disabled = true;

        button.style.opacity =
        "0.45";

    }

    // 更新畫面
    updateAnswer();

    // 檢查是否全部填完
    checkCompleted();

}


// ======================================
// 檢查是否完成
// ======================================

function checkCompleted(){

    const word =
    words[currentWord].english
    .toLowerCase();

    let completed = true;

    for(
        let i=0;
        i<blankIndexes.length;
        i++
    ){

        const index =
        blankIndexes[i];

        if(
            !filledLetters[index]
        ){

            completed = false;

            break;

        }

    }

    if(!completed){

        return;

    }

    // 組合答案
    let answer = "";

    for(
        let i=0;
        i<word.length;
        i++
    ){

        if(blankIndexes.includes(i)){

            answer +=
            filledLetters[i];

        }else{

            answer +=
            word[i];

        }

    }

    // 檢查答案
    if(answer === word){

        correctAnswer();

    }else{

        wrongAnswer();

    }

}


// ======================================
// 答對
// ======================================

function correctAnswer(){

    combo++;

    const word =
    words[currentWord].english;

    // 基本分數
    score += 10;

    // Combo 加成
    if(combo >= 3){

        score += 5;

    }

    if(combo >= 5){

        score += 10;

    }

    // 金幣
    coins++;

    localStorage.setItem(
        "coins",
        coins
    );

    // EXP
    addExp(10);

    // 最高分
    if(score > highScore){

        highScore =
        score;

        localStorage.setItem(
            "spellingHighScore",
            highScore
        );

    }

    // 顯示訊息
    const message =
    document.getElementById(
        "message"
    );

    if(message){

        if(combo >= 5){

            message.innerHTML =
            "🔥 超強！Combo x" +
            combo;

        }else if(combo >= 3){

            message.innerHTML =
            "⭐ 答對了！Combo x" +
            combo;

        }else{

            message.innerHTML =
            "🎉 答對了！";

        }

        message.style.color =
        "#4caf50";

    }

    // 特效
    createStars();

    // 更新資訊
    updateGameInfo();

    // 成就
    if(score >= 50){

        unlockAchievement(
            "score50",
            "累積 50 分！"
        );

    }

    if(combo >= 5){

        unlockAchievement(
            "combo5",
            "連續答對 5 題！"
        );

    }

    // 延遲進入下一題
    setTimeout(
        function(){

            newWord();

        },
        1000
    );

}


// ======================================
// 答錯
// ======================================

function wrongAnswer(){

    life--;

    combo = 0;

    const word =
    words[currentWord].english;

    // 記錄錯題
    saveWrongWord(word);

    const message =
    document.getElementById(
        "message"
    );

    if(message){

        message.innerHTML =
        "❌ 再試一次！";

        message.style.color =
        "#f44336";

    }

    updateGameInfo();

    // 還有生命
    if(life > 0){

        setTimeout(
            function(){

                resetCurrentQuestion();

            },
            800
        );

    }else{

        gameOver();

    }

}


// ======================================
// 重設目前題目
// ======================================

function resetCurrentQuestion(){

    filledLetters = {};

    userAnswer = "";

    updateAnswer();

    createLetters();

    const message =
    document.getElementById(
        "message"
    );

    if(message){

        message.innerHTML =
        "💪 再試一次！";

        message.style.color =
        "#ff9800";

    }

    speakWord();

}


// ======================================
// 遊戲結束
// ======================================

function gameOver(){

    gameFinished = true;

    clearInterval(
        typeof timer !== "undefined"
        ? timer
        : null
    );

    const message =
    document.getElementById(
        "message"
    );

    if(message){

        message.innerHTML =
        "💔 遊戲結束！";

        message.style.color =
        "#f44336";

    }

    const answer =
    document.getElementById(
        "answer"
    );

    if(answer){

        answer.innerHTML =
        "<span class='game-over'>" +
        words[currentWord].english +
        "</span>";

    }

    const container =
    document.getElementById(
        "letters"
    );

    if(container){

        container.innerHTML =
        `<button onclick="restartGame()">
            🔄 再玩一次
        </button>`;

    }

}


// ======================================
// 重新開始
// ======================================

function restartGame(){

    score = 0;

    life = 3;

    combo = 0;

    gameFinished = false;

    userAnswer = "";

    filledLetters = {};

    updateGameInfo();

    newWord();

}


// ======================================
// 播放英文發音
// ======================================

function speakWord(){

    if(
        typeof speechSynthesis ===
        "undefined"
    ){

        return;

    }

    const word =
    words[currentWord].english;

    speechSynthesis.cancel();

    const utterance =
    new SpeechSynthesisUtterance(
        word
    );

    utterance.lang =
    "en-US";

    utterance.rate =
    0.8;

    utterance.pitch =
    1;

    speechSynthesis.speak(
        utterance
    );

}


// ======================================
// 再播放一次
// ======================================

function repeatSound(){

    speakWord();

}

// ======================================
// 拼字挑戰－隨機填空版
// 第 3 段
// ======================================


// ======================================
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
        "🔥 " + combo;

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
        exp + " / 100";

    }


    if(highScoreElement){

        highScoreElement.textContent =
        highScore;

    }

}


// ======================================
// 增加 EXP
// ======================================

function addExp(value){

    exp += value;

    while(exp >= 100){

        exp -= 100;

        level++;

        showLevelUp();

    }

    localStorage.setItem(
        "exp",
        exp
    );

    localStorage.setItem(
        "level",
        level
    );

    updateGameInfo();

}


// ======================================
// 升級提示
// ======================================

function showLevelUp(){

    const popup =
    document.getElementById(
        "achievementPopup"
    );

    if(!popup){

        return;

    }

    popup.innerHTML =
    "🎉<br><br>" +
    "升級了！<br><br>" +
    "Lv. " + level;

    popup.style.display =
    "block";

    setTimeout(
        function(){

            popup.style.display =
            "none";

        },
        2000
    );

}


// ======================================
// 星星特效
// ======================================

function createStars(){

    for(
        let i=0;
        i<15;
        i++
    ){

        const star =
        document.createElement(
            "div"
        );

        star.innerHTML =
        "⭐";

        star.style.position =
        "fixed";

        star.style.left =
        Math.random() *
        window.innerWidth +
        "px";

        star.style.top =
        Math.random() *
        window.innerHeight +
        "px";

        star.style.fontSize =
        "24px";

        star.style.zIndex =
        "9999";

        star.style.pointerEvents =
        "none";

        document.body.appendChild(
            star
        );

        setTimeout(
            function(){

                star.remove();

            },
            1000
        );

    }

}


// ======================================
// 成就系統
// ======================================

let achievements =
JSON.parse(
    localStorage.getItem(
        "achievements"
    )
) || {};


function unlockAchievement(
    key,
    text
){

    if(achievements[key]){

        return;

    }

    achievements[key] =
    true;

    localStorage.setItem(
        "achievements",
        JSON.stringify(
            achievements
        )
    );

    const popup =
    document.getElementById(
        "achievementPopup"
    );

    if(popup){

        popup.innerHTML =
        "🏆<br><br>" +
        text;

        popup.style.display =
        "block";

        setTimeout(
            function(){

                popup.style.display =
                "none";

            },
            2500
        );

    }

}


// ======================================
// 錯題紀錄
// ======================================

let wrongWords =
JSON.parse(
    localStorage.getItem(
        "spellingWrongWords"
    )
) || [];


function saveWrongWord(word){

    if(
        !wrongWords.includes(word)
    ){

        wrongWords.push(word);

        localStorage.setItem(
            "spellingWrongWords",
            JSON.stringify(
                wrongWords
            )
        );

    }

}


// ======================================
// 提示
// ======================================

function showHint(){

    const word =
    words[currentWord]
    .english
    .toLowerCase();

    // 找一個尚未填寫的空格
    let targetIndex = -1;

    for(
        let i=0;
        i<blankIndexes.length;
        i++
    ){

        const index =
        blankIndexes[i];

        if(!filledLetters[index]){

            targetIndex = index;

            break;

        }

    }

    if(targetIndex === -1){

        return;

    }


    // ==================================
    // 每一題第一次提示免費
    // 第二次開始扣 1 金幣
    // ==================================

    if(typeof hintUsed === "undefined"){

        hintUsed = false;

    }

    if(hintUsed){

        if(coins <= 0){

            const message =
            document.getElementById("message");

            if(message){

                message.innerHTML =
                "🪙 金幣不足，無法使用提示";

                message.style.color =
                "#f44336";

            }

            return;

        }

        coins--;

        localStorage.setItem(
            "coins",
            coins
        );

    }

    // 記錄這一題已經使用過免費提示
    hintUsed = true;


    const message =
    document.getElementById(
        "message"
    );

    if(message){

        message.innerHTML =
        "💡 提示：這個空格是 " +
        "<strong>" +
        word[targetIndex] +
        "</strong>";

        message.style.color =
        "#2196f3";

    }

    updateGameInfo();

}


// ======================================
// 計時器
// ======================================

let timeLeft = 30;

let timer = null;


function startTimer(){

    clearInterval(timer);

    timeLeft = 30;

    updateTimer();

    timer =
    setInterval(
        function(){

            if(gameFinished){

                clearInterval(timer);

                return;

            }

            timeLeft--;

            updateTimer();

            if(timeLeft <= 0){

                clearInterval(timer);

                timeOut();

            }

        },
        1000
    );

}


// ======================================
// 更新時間
// ======================================

function updateTimer(){

    const timerElement =
    document.getElementById(
        "timer"
    );

    if(timerElement){

        timerElement.textContent =
        timeLeft;

    }

}


// ======================================
// 時間到
// ======================================

function timeOut(){

    combo = 0;

    const message =
    document.getElementById(
        "message"
    );

    if(message){

        message.innerHTML =
        "⏰ 時間到！";

        message.style.color =
        "#ff9800";

    }

    life--;

    updateGameInfo();

    if(life <= 0){

        gameOver();

        return;

    }

    setTimeout(
        function(){

            newWord();

        },
        1000
    );

}


// ======================================
// 回到上一題／重新開始
// ======================================

function resetSpellingGame(){

    clearInterval(timer);

    score = 0;

    life = 3;

    combo = 0;

userAnswer = "";

filledLetters = {};

hintUsed = false;

    updateGameInfo();

    newWord();

}


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
// 拼字挑戰－隨機填空版
// 第 4 段／最後
// ======================================


// ======================================
// 清除目前答案
// ======================================

function clearAnswer(){

    filledLetters = {};

    userAnswer = "";

    updateAnswer();

    document
    .querySelectorAll(
        "#letters button"
    )
    .forEach(
        function(button){

            button.disabled = false;

            button.style.opacity = "1";

        }
    );

}


// ======================================
// 移除最後一個填入的字母
// ======================================

function removeLetter(){

    const indexes =
    blankIndexes.slice().reverse();

    for(
        let i=0;
        i<indexes.length;
        i++
    ){

        const index =
        indexes[i];

        if(filledLetters[index]){

            delete filledLetters[index];

            break;

        }

    }

    // 恢復所有按鈕
    document
    .querySelectorAll(
        "#letters button"
    )
    .forEach(
        function(button){

            button.disabled = false;

            button.style.opacity = "1";

        }
    );

    updateAnswer();

}


// ======================================
// 鍵盤輸入
// ======================================

document.addEventListener(
    "keydown",
    function(event){

        if(gameFinished){

            return;

        }

        const key =
        event.key.toLowerCase();


        // A-Z
        if(
            key.length === 1 &&
            key >= "a" &&
            key <= "z"
        ){

            const buttons =
            document.querySelectorAll(
                "#letters button"
            );

            for(
                let i=0;
                i<buttons.length;
                i++
            ){

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


        // Backspace
        if(
            event.key ===
            "Backspace"
        ){

            event.preventDefault();

            removeLetter();

        }


        // R
        // 再聽一次
        if(
            event.key.toLowerCase()
            === "r"
        ){

            speakWord();

        }

    }
);


// ======================================
// 圖片檢查
// ======================================

function checkImage(){

    const image =
    document.getElementById(
        "wordImage"
    );

    if(!image){

        return;

    }

    const word =
    words[currentWord];

    if(!word){

        image.style.display =
        "none";

        return;

    }

    let path =
    word.image;

    if(!path){

        path =
        "images/" +
        word.english
        .toLowerCase() +
        ".png";

    }

    image.onerror =
    function(){

        console.warn(
            "圖片不存在：",
            path
        );

        this.style.display =
        "none";

    };

    image.onload =
    function(){

        this.style.display =
        "block";

    };

    image.src =
    path;

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
// 防止圖片載入失敗造成錯誤
// ======================================

window.addEventListener(
    "load",
    function(){

        setTimeout(
            function(){

                checkImage();

            },
            200
        );

    }
);


// ======================================
// 完成
// ======================================

// ======================================
// HTML 按鈕名稱相容
// ======================================

// 回首頁
function goHome(){

    window.location.href =
    "index.html";

}


// 提示
function hint(){

    showHint();

}


// 返回一個字母
function undoLetter(){

    removeLetter();

}