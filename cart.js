let cartItems = JSON.parse(localStorage.getItem("masterItems") || null);
let cartPrices = JSON.parse(localStorage.getItem("masterPrices") || null);
let localAlert = localStorage.getItem("masterAlert");

let preTax = 0;
let tax = 0;

function populateCart() {
    console.log(localAlert);
    console.log(cartItems);
    console.log(cartPrices);

let nameList = document.getElementById("itemNames")
    for(let i = 0; i < cartItems.length; ++i) {
        var li = document.createElement('li');
        li.innerText = cartItems[i];
        nameList.appendChild(li);
    }
    let priceList = document.getElementById("itemPrices")
    for(let i = 0; i < cartPrices.length; ++i) {
        var li = document.createElement('li');
        li.innerText = cartPrices[i];
        priceList.appendChild(li);
    }
    updateTotal();
}

function updateTotal() {
    for(let i = 0; i < cartPrices.length; ++i) {
        preTax = cartPrices[i] + preTax;
    }
    getTax();
    document.getElementById("toPay").innerText = (Math.round((preTax + tax) * 100) / 100) + "$";
}

function getTax () {
    tax = (preTax * 0.06875);
    document.getElementById("taxTotal").innerText = Math.round(tax * 100) / 100;
}

//------------------------------------------------------------------------------------------------------
function submitOrder() {
    alert("Website not yet finished, if you somehow want to order something email me a screenshot of your cart and ill make you an invoice");
}
