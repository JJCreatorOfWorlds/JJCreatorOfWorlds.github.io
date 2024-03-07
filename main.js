let firstIndex=0;
let cartItems = JSON.parse(localStorage.getItem("masterItems") || null);
let cartPrices = JSON.parse(localStorage.getItem("masterPrices") || null);
let localAlert = localStorage.getItem("masterAlert");


function automaticSlide(){
    setTimeout(automaticSlide, 5000);
    var pics;
    const img=document.querySelectorAll('.slide-img');
    for(pics=0; pics<img.length; pics++){
        img[pics].style.display="none";
    }
    firstIndex++;
    if(firstIndex > img.length){
        firstIndex =1;
    }
    img[firstIndex -1].style.display="block";
}
automaticSlide();

function updateCart() {
    check();
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

function check () {
    console.log(localStorage.getItem("masterAlert"));
    console.log(JSON.parse(localStorage.getItem("masterItems")));
    console.log(JSON.parse(localStorage.getItem("masterPrices")));
}