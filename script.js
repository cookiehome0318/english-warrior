let index = 0;

function showWord() {

    document.getElementById("wordImage").src = words[index].image;

    document.getElementById("english").textContent = words[index].english;

    document.getElementById("chinese").textContent = words[index].chinese;

    speakWord();

}

function nextWord() {

    index++;

    if (index >= words.length) {

        index = 0;

    }

    showWord();

}

function previousWord() {

    index--;

    if (index < 0) {

        index = words.length - 1;

    }

    showWord();

}

function speakWord() {

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(words[index].english);

    speech.lang = "en-US";
    speech.rate = 0.8;
    speech.pitch = 1;
    speech.volume = 1;

    speechSynthesis.speak(speech);

}

window.onload = function () {

    showWord();

};