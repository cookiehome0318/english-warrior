// =====================================
// 英文小勇士 Ultimate Quiz v10
// Part 1
// =====================================

let currentWord = 0;
let currentType = "";

let score = 0;
let life = 3;

let combo = 0;

let coins =
Number(localStorage.getItem("coins")) || 0;

let exp =
Number(localStorage.getItem("exp")) || 0;

let level =
Number(localStorage.getItem("level")) || 1;

let highScore =
Number(localStorage.getItem("quizHighScore")) || 0;

let timer = null;
let time = 20;

let isBoss = false;

let userAnswer = "";

let achievement = "";

const questionTypes = [

    "chinese",

    "picture",

    "listening",

    "spelling"

];

window.onload = function(){

    document.getElementById("score").textContent =
    score;

    document.getElementById("life").textContent =
    life;

    document.getElementById("coins").textContent =
    coins;

    document.getElementById("timer").textContent =
    time;

    document.getElementById("level").textContent =
    level;

    document.getElementById("exp").textContent =
    exp;

    document.getElementById("highScore").textContent =
    highScore;

    document.getElementById("combo").textContent =
    "🔥 Combo x0";

    document.getElementById("achievement").textContent =
    "🏅 尚未獲得成就";

    newQuestion();

};

function newQuestion(){

    clearInterval(timer);

    currentWord =
    Math.floor(Math.random()*words.length);

    isBoss =
    score>0 && score%10===0;

    currentType =
    questionTypes[
        Math.floor(
            Math.random()*questionTypes.length
        )
    ];

    switch(currentType){

        case "chinese":

            showChineseQuestion();

            break;

        case "picture":

            showPictureQuestion();

            break;

        case "listening":

            showListeningQuestion();

            break;

        case "spelling":

            showSpellingQuestion();

            break;

    }

    startTimer();

}

function showChineseQuestion(){

    document.getElementById("questionType").textContent =
    "📖 中文 ➜ 英文";

    document.getElementById("quizImage").style.display =
    "none";

    document.getElementById("playButton").style.display =
    "none";

    document.getElementById("question").textContent =
    words[currentWord].chinese;

    createChoices();

}

function showPictureQuestion(){

    document.getElementById("questionType").textContent =
    "🖼️ 看圖選字";

    document.getElementById("quizImage").style.display =
    "block";

    document.getElementById("playButton").style.display =
    "none";

    document.getElementById("quizImage").src =
    words[currentWord].image;

    document.getElementById("question").textContent =
    "請選出正確英文";

    createChoices();

}

function showListeningQuestion(){

    document.getElementById("questionType").textContent =
    "🎧 聽力測驗";

    document.getElementById("quizImage").style.display =
    "none";

    document.getElementById("playButton").style.display =
    "inline-block";

    document.getElementById("question").textContent =
    "請播放後選出正確答案";

    createChoices();

    setTimeout(playWord,300);

}

function showSpellingQuestion(){

    document.getElementById("questionType").textContent =
    "✏️ 拼字測驗";

    document.getElementById("quizImage").style.display =
    "none";

    document.getElementById("playButton").style.display =
    "inline-block";

    document.getElementById("question").textContent =
    "請拼出英文單字";

    userAnswer = "";

    createSpellingButtons();

    setTimeout(playWord,300);

}   

// =====================================
// Ultimate Quiz v10
// Part 2
// =====================================

function createChoices(){

    let options = [];

    options.push(words[currentWord].english);

    while(options.length < 4){

        const randomWord =
        words[
            Math.floor(Math.random()*words.length)
        ].english;

        if(!options.includes(randomWord)){

            options.push(randomWord);

        }

    }

    options.sort(()=>Math.random()-0.5);

    let html="";

    options.forEach(option=>{

        html+=`

<button class="choiceButton"
onclick="checkAnswer('${option}')">

${option}

</button>

`;

    });

    document.getElementById("choices").innerHTML=
    html;

}

function createSpellingButtons(){

    let letters=
    words[currentWord].english
    .toLowerCase()
    .split("");

    const alphabet=
    "abcdefghijklmnopqrstuvwxyz";

    while(letters.length<8){

        letters.push(

            alphabet[
                Math.floor(
                    Math.random()*alphabet.length
                )
            ]

        );

    }

    letters.sort(()=>Math.random()-0.5);

    let html=`

<h2 id="spellingAnswer">

${"_ ".repeat(words[currentWord].english.length)}

</h2>

`;

    letters.forEach((letter,index)=>{

        html+=`

<button

id="letter${index}"

class="letterButton"

onclick="pickLetter('${letter}',${index})">

${letter}

</button>

`;

    });

    html+=`

<br><br>

<button
onclick="clearSpelling()">

🗑️ 清除

</button>

`;

    document.getElementById("choices").innerHTML=
    html;

}

function pickLetter(letter,index){

    userAnswer+=letter;

    document.getElementById(
    "letter"+index
    ).disabled=true;

    let show="";

    for(
        let i=0;
        i<words[currentWord].english.length;
        i++
    ){

        if(userAnswer[i]){

            show+=userAnswer[i]+" ";

        }else{

            show+="_ ";

        }

    }

    document.getElementById(
    "spellingAnswer"
    ).innerHTML=show;

    if(

        userAnswer.length===

        words[currentWord].english.length

    ){

        checkSpelling();

    }

}

function clearSpelling(){

    userAnswer="";

    createSpellingButtons();

}

function checkSpelling(){

    if(

        userAnswer.toLowerCase()===

        words[currentWord].english.toLowerCase()

    ){

        checkAnswer(
            words[currentWord].english
        );

    }else{

        checkAnswer("");

    }

}

function playWord(){

    speechSynthesis.cancel();

    const speech=

    new SpeechSynthesisUtterance(

        words[currentWord].english

    );

    speech.lang="en-US";

    speech.rate=0.8;

    speech.pitch=1;

    speech.volume=1;

    speechSynthesis.speak(speech);

}


// =====================================
// Ultimate Quiz v10
// Part 3
// =====================================

function checkAnswer(choice){

    clearInterval(timer);

    const message =
    document.getElementById("message");

    const correct =
    words[currentWord].english;

    if(choice===correct){

        if(isBoss){

            score+=5;
            coins+=100;
            addExp(50);

        }else{

            score++;
            coins+=10;
            addExp(10);

        }

        combo++;

        if(score>highScore){

            highScore=score;

            localStorage.setItem(
                "quizHighScore",
                highScore
            );

        }

        localStorage.setItem(
            "coins",
            coins
        );

        document.getElementById("score").textContent=
        score;

        document.getElementById("coins").textContent=
        coins;

        document.getElementById("combo").textContent=
        "🔥 Combo x"+combo;

        document.getElementById("highScore").textContent=
        highScore;

        checkAchievement();

        createStars();

        if(isBoss){

            createStars();

            createStars();

            message.innerHTML=
            "👑 Boss Clear!<br>⭐ +5<br>🪙 +100";

        }else{

            message.innerHTML=
            "✅ 答對！<br>🪙 +10";

        }

        message.style.color="#28a745";

        playWord();

    }else{

        combo=0;

        life--;

        document.getElementById("life").textContent=
        life;

        document.getElementById("combo").textContent=
        "🔥 Combo x0";

        message.innerHTML=
        "❌ 答錯！<br><br>正確答案：<br>"+correct;

        message.style.color="#dc3545";

        if(life<=0){

            gameOver();

            return;

        }

    }

    setTimeout(function(){

        message.innerHTML="";

        newQuestion();

    },1200);

}

function startTimer(){

    clearInterval(timer);

    time=isBoss ? 15 : 20;

    document.getElementById("timer").textContent=
    time;

    timer=setInterval(function(){

        time--;

        document.getElementById("timer").textContent=
        time;

        if(time<=0){

            clearInterval(timer);

            combo=0;

            life--;

            document.getElementById("life").textContent=
            life;

            document.getElementById("combo").textContent=
            "🔥 Combo x0";

            document.getElementById("message").innerHTML=
            "⏰ 時間到！";

            document.getElementById("message").style.color=
            "#dc3545";

            if(life<=0){

                gameOver();

                return;

            }

            setTimeout(function(){

                document.getElementById("message").innerHTML="";

                newQuestion();

            },1000);

        }

    },1000);

}

function gameOver(){

    clearInterval(timer);

    document.getElementById("choices").innerHTML="";

    document.getElementById("message").innerHTML=`

    💀<br><br>

    遊戲結束！<br><br>

    ⭐ 分數：${score}<br>

    🏆 最高分：${highScore}<br>

    🪙 金幣：${coins}<br>

    🔥 Combo：${combo}<br><br>

    <button onclick="restartGame()">

    🔄 再玩一次

    </button>

    `;

}

function restartGame(){

    score=0;

    combo=0;

    life=3;

    document.getElementById("score").textContent=
    score;

    document.getElementById("life").textContent=
    life;

    document.getElementById("combo").textContent=
    "🔥 Combo x0";

    document.getElementById("message").innerHTML="";

    newQuestion();

}
// =====================================
// Ultimate Quiz v10
// Part 4
// =====================================

function addExp(amount){

    exp += amount;

    while(exp >= 100){

        exp -= 100;

        level++;

        coins += 100;

        showLevelUp();

    }

    localStorage.setItem("exp", exp);
    localStorage.setItem("level", level);
    localStorage.setItem("coins", coins);

    document.getElementById("exp").textContent =
    exp;

    document.getElementById("level").textContent =
    level;

    document.getElementById("coins").textContent =
    coins;

}

function showLevelUp(){

    const popup =
    document.getElementById("achievementPopup");

    popup.innerHTML = `
        🎉<br><br>
        LEVEL UP!<br><br>
        ⭐ Lv.${level}<br>
        🪙 +100
    `;

    popup.style.display = "block";

    setTimeout(function(){

        popup.style.display = "none";

    },2200);

}

function checkAchievement(){

    let title = "🏅 尚未獲得成就";

    if(score >= 50){

        title = "👑 英文王者";

    }else if(score >= 30){

        title = "🥇 英文大師";

    }else if(score >= 20){

        title = "🥈 英文高手";

    }else if(score >= 10){

        title = "🥉 英文新手";

    }

    if(title !== achievement){

        achievement = title;

        document.getElementById("achievement").textContent =
        achievement;

        showAchievementPopup(title);

    }

}

function showAchievementPopup(text){

    const popup =
    document.getElementById("achievementPopup");

    popup.innerHTML = `
        🎉<br><br>
        ${text}
    `;

    popup.style.display = "block";

    setTimeout(function(){

        popup.style.display = "none";

    },2000);

}

function createStars(){

    for(let i=0;i<12;i++){

        const star =
        document.createElement("div");

        star.innerHTML = "⭐";

        star.className = "star";

        star.style.position = "fixed";

        star.style.left =
        Math.random()*window.innerWidth + "px";

        star.style.top =
        Math.random()*window.innerHeight + "px";

        star.style.fontSize =
        (20 + Math.random()*20) + "px";

        star.style.pointerEvents = "none";

        star.style.zIndex = "9999";

        document.body.appendChild(star);

        star.animate(

            [

                {
                    transform:"translateY(0px)",
                    opacity:1
                },

                {
                    transform:"translateY(-120px)",
                    opacity:0
                }

            ],

            {

                duration:1200

            }

        );

        setTimeout(function(){

            star.remove();

        },1200);

    }

}

