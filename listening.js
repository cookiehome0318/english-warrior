// =======================================
// Ultimate Listening v1.0
// 第二段
// =======================================

let currentWord = 0;

let score = 0;

let combo = 0;

let life = 3;

let highScore =
Number(localStorage.getItem("listeningHighScore")) || 0;

let achievement = "";

window.onload = function(){

    document.getElementById("score").textContent =
    score;

    document.getElementById("life").textContent =
    life;

    document.getElementById("highScore").textContent =
    highScore;

    document.getElementById("combo").textContent =
    "🔥 Combo x0";

    document.getElementById("achievement").textContent =
"🏅 尚未獲得成就";

  newQuestion();
updateAccuracy();
updateLearningWrongCount();

};

function playWord(){

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

function newQuestion(){

    currentWord =
    Math.floor(Math.random()*words.length);

    createChoices();

setTimeout(playWord,150);

}
function createChoices(){

    let choices = [];

    choices.push(currentWord);

    while(choices.length < 4){

        let random =
        Math.floor(Math.random()*words.length);

        if(!choices.includes(random)){

            choices.push(random);

        }

    }

    choices.sort(()=>Math.random()-0.5);

    let html = "";

    choices.forEach(index=>{

        html += `
        <button
            class="pictureButton"
            onclick="checkAnswer(${index})">

            <img
                src="${words[index].image}"
                width="150"
                height="150">

        </button>
        `;

    });

    document.getElementById("choices").innerHTML =
    html;

}
function checkAnswer(index){

    const message =
    document.getElementById("message");

    if(index===currentWord){

    score++;

    combo++;

    checkAchievement();

        document.getElementById("score").textContent =
        score;

        document.getElementById("combo").textContent =
        "🔥 Combo x"+combo;

        if(score>highScore){

            highScore=score;

            localStorage.setItem(
                "listeningHighScore",
                highScore
            );

            document.getElementById("highScore").textContent =
            highScore;

        }

        message.innerHTML="✅ 答對！";

createStars();

        message.style.color="#28a745";

    }else{

        combo=0;

        life--;

        document.getElementById("life").textContent =
        life;

        document.getElementById("combo").textContent =
        "🔥 Combo x0";

   message.innerHTML=
"❌ 答錯！<br><br>再聽一次！";

playWord();

        message.style.color="#dc3545";

        if(life<=0){

            setTimeout(gameOver,1200);

            return;

        }

    }

    setTimeout(function(){

        message.innerHTML="";

        newQuestion();

    },1200);

}
function gameOver(){

    const message =
    document.getElementById("message");

    message.innerHTML = `
        💀<br>
        遊戲結束！<br><br>

        ⭐ 本次分數：${score}<br>

        🏆 最高分：${highScore}
    `;

    message.style.color = "#dc3545";

    document.getElementById("choices").innerHTML = "";

    const restart =
    document.createElement("button");

    restart.innerHTML = "🔄 再玩一次";

    restart.className = "restartButton";

    restart.onclick = restartGame;

    document.getElementById("choices")
    .appendChild(restart);

}

function restartGame(){

    score = 0;

    combo = 0;

    life = 3;

    achievement = "🏅 尚未獲得成就";

    document.getElementById("score").textContent =
    score;

    document.getElementById("combo").textContent =
    "🔥 Combo x0";

    document.getElementById("life").textContent =
    life;

    document.getElementById("achievement").textContent =
    achievement;

    document.getElementById("message").innerHTML =
    "";

    newQuestion();

}

function createStars(){

    for(let i=0;i<12;i++){

        const star =
        document.createElement("div");

        star.className="star";

        star.innerHTML="⭐";

        star.style.left=
        Math.random()*window.innerWidth+"px";

        star.style.top=
        (window.innerHeight-120)+"px";

        document.body.appendChild(star);

        setTimeout(function(){

            star.remove();

        },700);

    }

}
function checkAchievement(){

    const badge =
    document.getElementById("achievement");

    let newAchievement =
    "🏅 尚未獲得成就";

    if(score>=50){

        newAchievement="👑 英文王者";

    }else if(score>=20){

        newAchievement="🥇 英文大師";

    }else if(score>=10){

        newAchievement="🥈 英文高手";

    }else if(score>=5){

        newAchievement="🥉 英文新手";

    }

    if(newAchievement!==achievement){

        achievement=newAchievement;

        badge.innerHTML=achievement;

        if(achievement!=="🏅 尚未獲得成就"){

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
        ${text}
    `;

    popup.style.display = "block";

    popup.style.animation = "none";

    void popup.offsetWidth;

    popup.style.animation = "achievementPop .8s";

    setTimeout(function(){

        popup.style.display = "none";

    },2200);

}
// ======================================
// Step 6-4
// 最高 Combo
// ======================================

let highCombo =
    Number(localStorage.getItem("highCombo")) || 0;

const highComboElement =
    document.createElement("h2");

highComboElement.innerHTML =
    "🔥 最高 Combo：<span>" +
    highCombo +
    "</span>";

document
    .querySelector("body")
    .insertBefore(
        highComboElement,
        document.querySelector("button")
    );

    // ======================================
// 第十段：學習中心錯題數量
// ======================================

function updateLearningWrongCount(){

    let wrongWords =
        JSON.parse(
            localStorage.getItem("wrongWords")
        ) || [];

    const count =
        document.getElementById(
            "learningWrongCount"
        );

    if(count){

        count.textContent =
            wrongWords.length;

    }

}