let answer = 0;
let score = 0;
let life = 3;

let highScore = Number(localStorage.getItem("highScore")) || 0;

document.getElementById("highScore").textContent = highScore;
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
function speakWord() {

    const speech = new SpeechSynthesisUtterance(words[answer].english);

    speech.lang = "en-US";
    speech.rate = 0.8;
    speech.pitch = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(speech);

}

function newQuestion() {

    answer = Math.floor(Math.random() * words.length);

    document.getElementById("quizImage").src = words[answer].image;

    speakWord();

    let options = [words[answer].english];

    while (options.length < 4) {

        let randomWord =
            words[Math.floor(Math.random() * words.length)].english;

        if (!options.includes(randomWord)) {
            options.push(randomWord);
        }
    }

    options = shuffle(options);

    let html = "";

    options.forEach(option => {

        html += `
        <button onclick="checkAnswer('${option}')">
            ${option}
        </button><br><br>
        `;

    });

    document.getElementById("choices").innerHTML = html;

}

function checkAnswer(choice) {

    const message = document.getElementById("message");

    if (choice === words[answer].english) {

        score++;

document.getElementById("score").innerHTML = score;

if (score > highScore) {

    highScore = score;

    localStorage.setItem("highScore", highScore);

    document.getElementById("highScore").innerHTML = highScore;

}

        message.innerHTML = "✅ 答對！";
        message.style.color = "green";

    } else {

        life--;

        document.getElementById("life").innerHTML = life;

        if (life <= 0) {

            message.innerHTML =
                "💀 遊戲結束！<br>你的分數：" + score;
document.getElementById("choices").style.display = "none";
document.getElementById("restartBtn").style.display = "inline-block";
            message.style.color = "red";

            score = 0;
            life = 3;

            document.getElementById("score").innerHTML = score;
            document.getElementById("life").innerHTML = life;

        } else {

            message.innerHTML =
                "❌ 答錯！<br>正確答案：" + words[answer].english;

            message.style.color = "red";

        }

    }

    setTimeout(function () {

        message.innerHTML = "";

        newQuestion();

    }, 1500);

}

function restartGame() {

    score = 0;
    life = 3;

    document.getElementById("score").textContent = score;
    document.getElementById("life").textContent = life;
    document.getElementById("message").innerHTML = "";

    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("choices").style.display = "block";

    newQuestion();

}

newQuestion();