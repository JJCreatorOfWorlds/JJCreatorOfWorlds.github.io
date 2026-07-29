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

        // sidebar state
        sidebarOpen: false,
        activeProject: null,
    },
    created: function () {
        // use `this` directly and arrow functions in callbacks so `this` stays bound to the Vue instance
        this.getSiteData();
        // bind escape key to close sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarOpen) {
                this.closeSidebar();
            }
        });
    },
    methods: {
        getSiteData() {
            $.get('https://api.npoint.io/978b41969ecee7834702', (info) => {
                this.siteData = info;

                // build a single flat array of all projects from the category references
                this.allProjects = [];
                if (this.siteData && Array.isArray(this.siteData.categories)) {
                    this.siteData.categories.forEach((category) => {
                        var key = category.categoryObject;
                        var items = this.siteData[key];
                        if (Array.isArray(items)) {
                            items.forEach((it) => {
                                // keep a reference to which category it came from if needed
                                it._category = category.name || key;
                                this.allProjects.push(it);
                            });
                        }
                    });
                }

                this.loadingData = false;
                this.automaticSlide();
            }).fail(() => {
                this.error = 'Failed to load site data';
                this.loadingData = false;
            });
        },
        automaticSlide() {
            // schedule next run with arrow function so `this` is preserved
            setTimeout(() => this.automaticSlide(), 5000);
            this.slideIndex++;
            if (this.slideIndex == this.slideImages.length) {
                this.slideIndex = 0;
            }
            this.currentSlideImage = this.slideImages[this.slideIndex];
        },

        openSidebar(project) {
            this.activeProject = project || null;
            this.sidebarOpen = true;
            // prevent body scrolling when sidebar open
            document.body.style.overflow = 'hidden';
        },
        closeSidebar() {
            this.sidebarOpen = false;
            this.activeProject = null;
            document.body.style.overflow = '';
        }
    }
});
