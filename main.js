var self;

const app = new Vue({
    el: '#app',
    data: {
        page: "home",
        error: "",
        loadingData: true,
        //data that drives categories and items
        siteData: null,
        slideIndex: 0,
        slideImages: ["img/bag.png", "img/botwSword.jpg", "img/trollskull.png", "img/orrery.png", "img/quilt.png"],
        currentSlideImage: "img/bag.png",

        selectedCategory: null,
        selectedCategoryItems: [],
    },
    created: function () {
        self = this;
        self.getSiteData();
    },
    methods: {
        getSiteData(){
            $.get('https://api.npoint.io/978b41969ecee7834702', function (info) {
                self.siteData = info;
                self.loadingData = false;
                self.automaticSlide();
            });
        },
        automaticSlide(){
            setTimeout(self.automaticSlide, 5000);
            self.slideIndex++;
            if(self.slideIndex == self.slideImages.length){
                self.slideIndex = 0;
            }
            self.currentSlideImage = self.slideImages[self.slideIndex];
        },
    }
});
