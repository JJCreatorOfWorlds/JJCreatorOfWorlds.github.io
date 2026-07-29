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

        // flattened list of all projects (no categories)
        allProjects: [],
    },
    created: function () {
        self = this;
        self.getSiteData();
    },
    methods: {
        getSiteData(){
            $.get('https://api.npoint.io/978b41969ecee7834702', function (info) {
                self.siteData = info;

                // build a single flat array of all projects from the category references
                self.allProjects = [];
                if(self.siteData && Array.isArray(self.siteData.categories)){
                    self.siteData.categories.forEach(function(category){
                        var key = category.categoryObject;
                        var items = self.siteData[key];
                        if(Array.isArray(items)){
                            items.forEach(function(it){
                                // keep a reference to which category it came from if needed
                                it._category = category.name || key;
                                self.allProjects.push(it);
                            });
                        }
                    });
                }

                self.loadingData = false;
                self.automaticSlide();
            }).fail(function(){
                self.error = 'Failed to load site data';
                self.loadingData = false;
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
