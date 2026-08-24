// ======================================
// 英文小勇士
// 🏠 首頁錯題提醒
// ======================================

function updateWrongCount(){

    let wrongWords =
        JSON.parse(
            localStorage.getItem("wrongWords")
        ) || [];

    const count =
        document.getElementById("wrongCount");

    if(!count){
        return;
    }

    if(wrongWords.length > 0){

        count.textContent =
            "🔴 有 " +
            wrongWords.length +
            " 題需要複習";

    }else{

        count.textContent =
            "目前沒有錯題";

    }

}


// ======================================
// 頁面載入
// ======================================

window.onload = function(){

    updateWrongCount();

};