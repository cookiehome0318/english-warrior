
let coins =
Number(localStorage.getItem("coins")) || 0;

document.getElementById("coins").textContent =
coins;

const items = [

{
id:"blueTheme",
name:"💙 藍色主題",
price:300
},

{
id:"pinkTheme",
name:"🩷 粉紅主題",
price:500
},

{
id:"kingTitle",
name:"👑 王者稱號",
price:1000
}

];

showShop();

function showShop(){

let html="";

items.forEach(item=>{

const owned =
localStorage.getItem(item.id);

html+=`

<div class="shopCard">

<h2>${item.name}</h2>

<p>🪙 ${item.price}</p>

<button
onclick="buy('${item.id}',${item.price})">

${owned ? "✅ 已擁有":"購買"}

</button>

</div>

`;

});

document.getElementById("shopItems").innerHTML =
html;

}

function buy(id,price){

if(localStorage.getItem(id)){

alert("已經購買過");

return;

}

if(coins<price){

alert("金幣不足");

return;

}

coins-=price;

localStorage.setItem("coins",coins);

localStorage.setItem(id,true);

document.getElementById("coins").textContent =
coins;

showShop();

alert("🎉 購買成功");

}