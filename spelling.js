// ======================================
// 英文小勇士 Ultimate v6.0
// Spelling Challenge
// ======================================

let currentWord = 0;
let userAnswer = "";

let score = 0;
let life = 3;

let highScore =
Number(localStorage.getItem("spellingHighScore")) || 0;

let achievement = "";

window.onload = function(){

    document.getElementById("score").textContent =
    score;

    document.getElementById("life").textContent =
    life;

    document.getElementById("highScore").textContent =
    highScore;

    document.getElementById("achievement").textContent =
    "🏅 尚未獲得成就";

    newWord();

};

function speakWord(){

    speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(
        words[currentWord].english
    );

    speech.lang="en-US";
    speech.rate=.8;
    speech.pitch=1;
    speech.volume=1;

    speechSynthesis.speak(speech);

}

function newWord(){

    currentWord =
    Math.floor(Math.random()*words.length);

    userAnswer="";

    document.getElementById("wordImage").src =
    words[currentWord].image;

    updateAnswer();

    createLetters();

    setTimeout(speakWord,400);

}

function updateAnswer(){

    if(userAnswer===""){

        document.getElementById("answer").innerHTML =
        "_ ".repeat(words[currentWord].english.length);

    }else{

        document.getElementById("answer").textContent =
        userAnswer;

    }

}

function createLetters(){

    let letters =
    words[currentWord].english
    .toUpperCase()
    .split("");

    const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

    updateAnswer();

    const btn =
    document.getElementById("letter"+index);

    btn.disabled = true;

    btn.style.opacity = "0.35";

    btn.style.transform = "scale(.9)";

    if(
        userAnswer.length ===
        words[currentWord].english.length
    ){

        setTimeout(checkAnswer,300);

    }

}

function clearAnswer(){

    userAnswer = "";

    updateAnswer();

    document
    .querySelectorAll("#letters button")
    .forEach(btn=>{

        btn.disabled = false;

        btn.style.opacity = "1";

        btn.style.transform = "scale(1)";

    });

}

function checkAnswer(){

    const message =
    document.getElementById("message");

    const correct =
    words[currentWord].english.toLowerCase();

    if(userAnswer.toLowerCase() === correct){

        score++;

        checkAchievement();

        document.getElementById("score").textContent =
        score;

        if(score > highScore){

            highScore = score;

            localStorage.setItem(
                "spellingHighScore",
                highScore
            );

            document.getElementById("highScore").textContent =
            highScore;

        }

        message.innerHTML = "🎉 答對！";

        message.style.color = "#28a745";

        createStars();

        const star =
        document.getElementById("starAnimation");

        if(star){

            star.innerHTML = "⭐ +1";

            star.style.animation = "none";

            void star.offsetWidth;

            star.style.animation = "pop .8s";

        }

        setTimeout(function(){

            message.innerHTML = "";

            newWord();

        },1200);

    }else{

        life--;

        document.getElementById("life").textContent =
        life;

        message.innerHTML =
        "❌ 答錯！<br><br>正確答案：<b>" +
        words[currentWord].english +
        "</b>";

        message.style.color = "#dc3545";

        if(life <= 0){

            setTimeout(gameOver,1500);

        }else{

            setTimeout(function(){

                message.innerHTML = "";

                newWord();

            },1500);

        }

    }

}

function gameOver(){

    const message =
    document.getElementById("message");

    message.innerHTML = `
        💀<br><br>
        遊戲結束！<br><br>

        ⭐ 本次分數：${score}<br>

        🏆 最高分：${highScore}
    `;

    message.style.color = "#dc3545";

    document.getElementById("letters").innerHTML = "";

    const restart =
    document.createElement("button");

    restart.className = "restartButton";

    restart.innerHTML = "🔄 再玩一次";

    restart.onclick = restartGame;

    document.getElementById("letters")
    .appendChild(restart);

}

function restartGame(){

    score = 0;

    life = 3;

    userAnswer = "";

    achievement = "🏅 尚未獲得成就";

    document.getElementById("score").textContent =
    score;

    document.getElementById("life").textContent =
    life;

    document.getElementById("achievement").textContent =
    achievement;

    document.getElementById("message").innerHTML =
    "";

    const letters =
    document.getElementById("letters");

    if(letters){

        letters.innerHTML = "";

    }

    const star =
    document.getElementById("starAnimation");

    if(star){

        star.innerHTML = "";

    }

    newWord();

}

function createStars(){

    for(let i=0;i<12;i++){

        const star =
        document.createElement("div");

        star.className = "star";

        star.innerHTML = "⭐";

        star.style.left =
        Math.random()*window.innerWidth + "px";

        star.style.top =
        Math.random()*window.innerHeight + "px";

        document.body.appendChild(star);

        setTimeout(function(){

            star.remove();

        },1200);

    }

}

function checkAchievement(){

    const badge =
    document.getElementById("achievement");

    let newAchievement =
    "🏅 尚未獲得成就";

    if(score >= 50){

        newAchievement = "👑 英文王者";

    }else if(score >= 20){

        newAchievement = "🥇 英文大師";

    }else if(score >= 10){

        newAchievement = "🥈 英文高手";

    }else if(score >= 5){

        newAchievement = "🥉 英文新手";

    }

    if(newAchievement !== achievement){

        achievement = newAchievement;

        if(badge){

            badge.textContent = achievement;

        }

        if(
            achievement !==
            "🏅 尚未獲得成就"
        ){

            showAchievementPopup(achievement);

        }

    }

}

function showAchievementPopup(text){

    const popup =
    document.getElementById("achievementPopup");

    if(!popup){

        return;

    }

    popup.innerHTML = `
        🎉<br><br>
        成就解鎖！<br><br>
        <strong>${text}</strong>
    `;

    popup.style.display = "block";

    popup.style.animation = "none";

    void popup.offsetWidth;

    popup.style.animation =
    "achievementPop .8s";

    setTimeout(function(){

        popup.style.display = "none";

    },2000);

}