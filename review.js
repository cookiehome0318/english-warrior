// ======================================
// 英文小勇士
// 錯題再練習
// Part 1
// ======================================

let wrongWords = JSON.parse(
    localStorage.getItem("wrongWords")
) || [];

let currentWord = null;

let userAnswer = "";


function loadWord(){

    if(wrongWords.length===0){

        document.getElementById("message").innerHTML =
        "🎉 恭喜！全部錯題完成！";

        document.getElementById("letters").innerHTML = "";

        document.getElementById("answer").innerHTML = "";

        document.getElementById("wordImage").style.display =
        "none";

        return;

    }

    document.getElementById("wrongCount").textContent =
    wrongWords.length;

    const english =
    wrongWords[
        Math.floor(Math.random()*wrongWords.length)
    ];

    currentWord =
    words.find(function(item){

        return item.english.toLowerCase()===english;

    });

    userAnswer = "";

    document.getElementById("wordImage").style.display =
    "block";

    document.getElementById("wordImage").src =
    currentWord.image;

    updateAnswer();

    createLetters();

    setTimeout(function(){

        speakWord();

    },300);

}

function updateAnswer(){

    let html = "";

    for(let i=0;i<currentWord.english.length;i++){

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
    currentWord.english
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

    letters.forEach(function(letter,index){

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
        currentWord.english.length
    ){

        setTimeout(function(){

            checkAnswer();

        },300);

    }

}

function checkAnswer(){

    const correct =
    currentWord.english.toLowerCase();

    if(userAnswer.toLowerCase()===correct){

        removeWrongWord(correct);

        document.getElementById("message").innerHTML =
        "🎉 答對！";

        document.getElementById("message").style.color =
        "#28a745";

        setTimeout(function(){

            loadWord();

        },800);

    }else{

        document.getElementById("message").innerHTML =
        "❌ 再試一次";

        document.getElementById("message").style.color =
        "#dc3545";

        clearAnswer();

    }

}

function removeWrongWord(word){

    wrongWords =
    wrongWords.filter(function(item){

        return item !== word;

    });

    localStorage.setItem(

        "wrongWords",

        JSON.stringify(wrongWords)

    );

}

function clearAnswer(){

    userAnswer = "";

    updateAnswer();

    document
    .querySelectorAll("#letters button")
    .forEach(function(btn){

        btn.disabled = false;

    });

}

function undoLetter(){

    if(userAnswer.length===0){

        return;

    }

    const last =
    userAnswer[
        userAnswer.length-1
    ];

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
            btn.textContent===last
        ){

            btn.disabled=false;

            break;

        }

    }

}

function speakWord(){

    speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(
        currentWord.english
    );

    speech.lang="en-US";

    speech.rate=0.8;

    speechSynthesis.speak(speech);

}

function goHome(){

    location.href="index.html";

}

// ======================================
// 啟動 Review Game
// ======================================

// 啟動錯題再練習
window.onload = function(){

    loadWord();

};