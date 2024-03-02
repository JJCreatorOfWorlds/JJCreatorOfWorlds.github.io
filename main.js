var firstIndex=0;
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