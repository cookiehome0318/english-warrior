// ======================================
// 📝 英文小勇士 - 句子練習
// 🎲 四種詞性平均隨機出題
// ======================================

let currentSentence = -1;
let currentSentenceData = null;
let hiddenWord = "";
let answered = false;

let currentPartOfSpeech = "";

// ======================================
// 🎲 詞性出題袋
// ======================================

let partOfSpeechQueue = [];


// ======================================
// 建立新的詞性出題順序
// ======================================

function createPartOfSpeechQueue(){

    const types = [
        "noun",
        "verb",
        "adjective",
        "adverb"
    ];

    // 隨機打亂
    types.sort(function(){
        return Math.random() - 0.5;
    });

    // 避免新一輪第一個
    // 跟上一題相同
    if(
        types.length > 1 &&
        types[0] === currentPartOfSpeech
    ){

        const randomIndex =
            Math.floor(
                Math.random() *
                (types.length - 1)
            ) + 1;

        const temp = types[0];

        types[0] = types[randomIndex];

        types[randomIndex] = temp;

    }

    partOfSpeechQueue = types;

}


// ======================================
// 取得詞性中文名稱
// ======================================

function getPartOfSpeechName(type){

    const names = {

        noun: "名詞",

        verb: "動詞",

        adjective: "形容詞",

        adverb: "副詞"

    };

    return names[type] || type;

}


// ======================================
// 找出句子中的英文單字
// ======================================

function getCandidateWords(sentence){

    const allWords =
        sentence.match(
            /[A-Za-z]+(?:'[A-Za-z]+)?/g
        ) || [];


    const ignoredWords = [

        "a",
        "an",
        "the",
        "is",
        "am",
        "are",
        "i",
        "my",
        "this",
        "that",
        "to",
        "of",
        "in",
        "on",
        "at",
        "and",
        "it",
        "can",
        "we",
        "he",
        "she"

    ];


    return allWords.filter(function(word){

        return (

            word.length > 2 &&

            !ignoredWords.includes(
                word.toLowerCase()
            )

        );

    });

}


// ======================================
// 載入新題目
// ======================================

function loadSentence(){

    answered = false;

    hiddenWord = "";

    currentSentenceData = null;


    if(
        !words ||
        words.length === 0
    ){

        document.getElementById(
            "sentence"
        ).textContent =
            "目前沒有句子";

        return;

    }


    // ======================================
    // 如果詞性出題袋空了
    // 就重新產生四種詞性的順序
    // ======================================

    if(
        partOfSpeechQueue.length === 0
    ){

        createPartOfSpeechQueue();

    }


    // ======================================
    // 取得下一個詞性
    // ======================================

    currentPartOfSpeech =
        partOfSpeechQueue.shift();


    // ======================================
    // 找出這個詞性的單字
    // ======================================

    let availableWords =
        words.filter(function(item){

            return (
                item.partOfSpeech ===
                currentPartOfSpeech
            );

        });


    // 如果這個詞性沒有單字
    // 就重新建立詞性袋
    if(
        availableWords.length === 0
    ){

        // 移除沒有資料的詞性
        partOfSpeechQueue =
            partOfSpeechQueue.filter(
                function(type){

                    return words.some(
                        function(item){

                            return (
                                item.partOfSpeech ===
                                type
                            );

                        }
                    );

                }
            );


        // 從有資料的詞性重新建立
        const availableTypes = [

            "noun",
            "verb",
            "adjective",
            "adverb"

        ].filter(function(type){

            return words.some(
                function(item){

                    return (
                        item.partOfSpeech ===
                        type
                    );

                }
            );

        });


        availableTypes.sort(function(){

            return Math.random() - 0.5;

        });


        if(
            availableTypes.length > 1 &&
            availableTypes[0] ===
            currentPartOfSpeech
        ){

            const temp =
                availableTypes[0];

            availableTypes[0] =
                availableTypes[1];

            availableTypes[1] =
                temp;

        }


        partOfSpeechQueue =
            availableTypes;


        if(
            partOfSpeechQueue.length > 0
        ){

            currentPartOfSpeech =
                partOfSpeechQueue.shift();


            availableWords =
                words.filter(
                    function(item){

                        return (
                            item.partOfSpeech ===
                            currentPartOfSpeech
                        );

                    }
                );

        }

    }


    // ======================================
    // 🎲 隨機選這個詞性的單字
    // ======================================

    const word =
        availableWords[
            Math.floor(
                Math.random() *
                availableWords.length
            )
        ];


    currentSentence =
        words.indexOf(word);


    // ======================================
    // 🎲 隨機選句子
    // ======================================

    let sentenceList =
        word.sentences || [];


    let selectedSentence;


    if(
        sentenceList.length > 0
    ){

        selectedSentence =
            sentenceList[
                Math.floor(
                    Math.random() *
                    sentenceList.length
                )
            ];

    }else{

        selectedSentence = {

            english:
                word.sentence ||
                word.english,

            chinese:
                word.sentenceChinese ||
                word.chinese

        };

    }


    const sentence =
        typeof selectedSentence === "string"

            ? selectedSentence

            : selectedSentence.english;


    const chinese =
        typeof selectedSentence === "string"

            ? (
                word.sentenceChinese ||
                word.chinese
            )

            : (
                selectedSentence.chinese ||
                word.sentenceChinese ||
                word.chinese
            );


    currentSentenceData = {

        english: sentence,

        chinese: chinese,

        word: word

    };


    // ======================================
    // 🎯 找出要挖空的單字
    // ======================================

    let candidates =
        getCandidateWords(sentence);


    const targetWord =
        word.english.toLowerCase();


    const targetExists =
        candidates.some(function(item){

            return (
                item.toLowerCase() ===
                targetWord
            );

        });


    if(targetExists){

        hiddenWord =
            targetWord;

    }else if(
        candidates.length > 0
    ){

        hiddenWord =
            candidates[
                Math.floor(
                    Math.random() *
                    candidates.length
                )
            ].toLowerCase();

    }else{

        hiddenWord =
            targetWord;

    }


    // ======================================
    // 挖空
    // ======================================

    const escapedWord =
        hiddenWord.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const hiddenSentence =
        sentence.replace(

            new RegExp(
                "\\b" +
                escapedWord +
                "\\b",
                "i"
            ),

            "_____"

        );


    // ======================================
    // 顯示句子
    // ======================================

    document.getElementById(
        "sentence"
    ).textContent =
        hiddenSentence;


    // ======================================
    // 顯示中文
    // ======================================

    document.getElementById(
        "sentenceChinese"
    ).textContent =
        chinese;


    // ======================================
    // 清除訊息
    // ======================================

    document.getElementById(
        "message"
    ).textContent =
        "";


    // ======================================
    // 顯示詞性
    // ======================================

    const partOfSpeechElement =
        document.getElementById(
            "partOfSpeech"
        );


    if(partOfSpeechElement){

        partOfSpeechElement.textContent =
            "請找出「" +
            getPartOfSpeechName(
                currentPartOfSpeech
            ) +
            "」";

    }


    // ======================================
    // 建立選項
    // ======================================

    createChoices();

}


// ======================================
// 建立答案選項
// ======================================

function createChoices(){

    const correct =
        hiddenWord.toLowerCase();


    let choices = [

        correct

    ];


    // ======================================
    // 優先從相同詞性找答案
    // ======================================

    let others =
        words.filter(function(item){

            return (

                item.partOfSpeech ===
                currentPartOfSpeech &&

                item.english.toLowerCase() !==
                correct

            );

        });


    // 隨機排序
    others.sort(function(){

        return Math.random() - 0.5;

    });


    // 加入最多 3 個
    for(
        let i = 0;

        i < others.length &&
        choices.length < 4;

        i++
    ){

        choices.push(

            others[i].english
                .toLowerCase()

        );

    }


    // ======================================
    // 如果同詞性不足 4 個
    // 再用其他單字補足
    // ======================================

    if(
        choices.length < 4
    ){

        let allOthers =
            words.filter(function(item){

                return (

                    item.english
                        .toLowerCase() !==
                    correct &&

                    !choices.includes(
                        item.english
                            .toLowerCase()
                    )

                );

            });


        allOthers.sort(function(){

            return Math.random() - 0.5;

        });


        for(
            let i = 0;

            i < allOthers.length &&
            choices.length < 4;

            i++
        ){

            choices.push(

                allOthers[i].english
                    .toLowerCase()

            );

        }

    }


    // ======================================
    // 🎲 打亂選項
    // ======================================

    choices.sort(function(){

        return Math.random() - 0.5;

    });


    const container =
        document.getElementById(
            "choices"
        );


    container.innerHTML = "";


    choices.forEach(function(choice){

        const button =
            document.createElement(
                "button"
            );


        // 強制小寫
        button.textContent =
            choice.toLowerCase();


        button.onclick =
            function(){

                checkAnswer(

                    choice.toLowerCase(),

                    correct,

                    button

                );

            };


        container.appendChild(
            button
        );

    });

}


// ======================================
// 檢查答案
// ======================================

function checkAnswer(
    choice,
    correct,
    button
){

    if(answered){

        return;

    }


    choice =
        choice.toLowerCase();


    correct =
        correct.toLowerCase();


    // ======================================
    // 🎉 答對
    // ======================================

    if(
        choice === correct
    ){

        answered = true;


        document.getElementById(
            "message"
        ).textContent =
            "🎉 答對了！";


        document
            .querySelectorAll(
                "#choices button"
            )
            .forEach(function(btn){

                btn.disabled = true;

            });


        setTimeout(function(){

            loadSentence();

        }, 1000);


        return;

    }


    // ======================================
    // ❌ 答錯
    // ======================================

    document.getElementById(
        "message"
    ).textContent =
        "❌ 再試一次！";


    // ======================================
    // 記錄錯題
    // ======================================

    let wrongSentences =
        JSON.parse(
            localStorage.getItem(
                "wrongSentences"
            )
        ) || [];


    const wrongData = {

        english:
            hiddenWord,

        chinese:
            currentSentenceData.chinese,

        sentence:
            currentSentenceData.english,

        sentenceChinese:
            currentSentenceData.chinese

    };


    const alreadyExists =
        wrongSentences.some(
            function(item){

                return (

                    item.sentence ===
                    wrongData.sentence &&

                    item.english ===
                    wrongData.english

                );

            }
        );


    if(!alreadyExists){

        wrongSentences.push(
            wrongData
        );


        localStorage.setItem(

            "wrongSentences",

            JSON.stringify(
                wrongSentences
            )

        );

    }

}


// ======================================
// 🔊 播放完整英文句子
// ======================================

function speakSentence(){

    if(
        !currentSentenceData
    ){

        return;

    }


    speechSynthesis.cancel();


    const speech =
        new SpeechSynthesisUtterance(

            currentSentenceData.english

        );


    speech.lang =
        "en-US";


    speech.rate =
        0.8;


    speech.pitch =
        1;


    speech.volume =
        1;


    speechSynthesis.speak(
        speech
    );

}


// ======================================
// ➡️ 下一題
// ======================================

function nextSentence(){

    loadSentence();

}


// ======================================
// 🚀 頁面載入
// ======================================

window.onload = function(){

    createPartOfSpeechQueue();

    loadSentence();

};