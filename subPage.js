let localAlert = localStorage.getItem("masterAlert");
let cartItems = JSON.parse(localStorage.getItem("masterItems") || null);
let cartPrices = JSON.parse(localStorage.getItem("masterPrices") || null);

function addItem(name, price) {
    cartItems.push(name);
    cartPrices.push(price);
    localAlert++;
    updateCart();
    console.log(cartItems, cartPrices);
}
function removeItem(name, price) {
    if(localAlert > 0 && (cartItems.indexOf(name) != -1)) {
        localAlert--;
        cartItems.splice(cartItems.indexOf(name), 1);
        cartPrices.splice(cartPrices.indexOf(price), 1);
        updateCart();
        console.log(cartItems, cartPrices);
    }
    else {
        alert("None of this item in cart!");
    }
}

function updateCart() {
    localStorage.setItem("masterAlert", localAlert);
    if(localStorage.getItem("masterAlert") > 0){
        document.getElementById("localAlert").innerText = localStorage.getItem("masterAlert");
    }
    else {
        document.getElementById("localAlert").innerText = 0;
    }
    localStorage.setItem("masterItems", JSON.stringify(cartItems));
    localStorage.setItem("masterPrices", JSON.stringify(cartPrices));
}