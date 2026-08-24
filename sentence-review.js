// ======================================
// 📚 英文小勇士 - 句子錯題再練習
// ======================================

let wrongSentences = [];
let currentSentence = -1;
let answered = false;


// ======================================
// 讀取錯題
// ======================================

function loadWrongSentences(){

    wrongSentences =
        JSON.parse(
            localStorage.getItem("wrongSentences")
        ) || [];

    if(wrongSentences.length === 0){

        document.getElementById("sentence").style.display =
            "none";

        document.getElementById("sentenceChinese").style.display =
            "none";

        document.getElementById("speakBtn").style.display =
            "none";

        document.getElementById("choices").style.display =
            "none";

        document.getElementById("message").style.display =
            "none";

        document.getElementById("emptyMessage").textContent =
            "🎉 太棒了！目前沒有需要複習的句子。";

        return;
    }

    loadSentence();

}


// ======================================
// 載入一題錯題
// ======================================

function loadSentence(){

    answered = false;

    if(wrongSentences.length === 0){

        loadWrongSentences();

        return;
    }

    currentSentence =
        Math.floor(
            Math.random() *
            wrongSentences.length
        );

    const word =
        wrongSentences[currentSentence];

    document.getElementById("sentence").textContent =
        word.sentence;

    document.getElementById("sentenceChinese").textContent =
        word.sentenceChinese;

    document.getElementById("message").textContent =
        "";

    createChoices();

}


// ======================================
// 建立答案選項
// ======================================

function createChoices(){

    const word =
        wrongSentences[currentSentence];

    const correct =
        word.english.toLowerCase();

    let choices = [correct];


    // 從錯題中找其他答案
    let others =
        wrongSentences
        .filter(function(item){

            return item.english.toLowerCase() !==
                   correct;

        })
        .sort(function(){

            return Math.random() - 0.5;

        });


    // 如果錯題不足，從 words 補答案
    if(others.length < 3 && typeof words !== "undefined"){

        let allOthers =
            words
            .filter(function(item){

                return item.english.toLowerCase() !==
                       correct;

            })
            .sort(function(){

                return Math.random() - 0.5;

            });


        allOthers.forEach(function(item){

            if(others.length < 3){

                const exists =
                    others.some(function(other){

                        return other.english.toLowerCase() ===
                               item.english.toLowerCase();

                    });

                if(!exists){

                    others.push(item);

                }

            }

        });

    }


    for(let i = 0; i < others.length && choices.length < 4; i++){

        choices.push(
            others[i].english.toLowerCase()
        );

    }


    choices.sort(function(){

        return Math.random() - 0.5;

    });


    const container =
        document.getElementById("choices");

    container.innerHTML = "";


    choices.forEach(function(choice){

        const button =
            document.createElement("button");

        button.textContent =
            choice;

        button.onclick = function(){

            checkAnswer(
                choice,
                correct
            );

        };

        container.appendChild(button);

    });

}


// ======================================
// 檢查答案
// ======================================

function checkAnswer(choice, correct){

    if(answered){

        return;

    }


    // =========================
    // 答對
    // =========================

    if(choice === correct){

        answered = true;

        document.getElementById("message").textContent =
            "🎉 答對了！";

        document
            .querySelectorAll("#choices button")
            .forEach(function(btn){

                btn.disabled = true;

            });


        // 從錯題中移除
        wrongSentences.splice(
            currentSentence,
            1
        );


        localStorage.setItem(
            "wrongSentences",
            JSON.stringify(
                wrongSentences
            )
        );


        // 1 秒後下一題
        setTimeout(function(){

            if(wrongSentences.length === 0){

                document.getElementById("sentence").textContent =
                    "";

                document.getElementById("sentenceChinese").textContent =
                    "";

                document.getElementById("choices").innerHTML =
                    "";

                document.getElementById("message").textContent =
                    "🎉 太棒了！所有句子都複習完成！";

                return;

            }

            loadSentence();

        }, 1000);


        return;
    }


    // =========================
    // 答錯
    // =========================

    document.getElementById("message").textContent =
        "❌ 再試一次！";

}


// ======================================
// 🔊 播放句子
// ======================================

function speakSentence(){

    const word =
        wrongSentences[currentSentence];

    if(!word || !word.sentence){

        return;

    }

    speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(
            word.sentence
        );

    speech.lang = "en-US";

    speech.rate = 0.8;

    speech.pitch = 1;

    speechSynthesis.speak(
        speech
    );

}


// ======================================
// 🚀 頁面載入
// ======================================

window.onload = function(){

    loadWrongSentences();

};