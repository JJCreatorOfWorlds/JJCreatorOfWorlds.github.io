var self;

const app = new Vue({
    el: '#app',
    data: {
        page: "home",
        error: "",
        loadingData: true,
        //data that drives categories and items
        siteData: null,
        cartItems: [],
        slideIndex: 0,
        slideImages: ["img/bag.png", "img/botwSword.jpg", "img/trollskull.png", "img/orrery.png", "img/quilt.png"],
        currentSlideImage: "img/bag.png",

        selectedCategory: null,
        selectedCategoryItems: [],

        cartTax: 0,
        cartTotal: 0,
        showEmailModal: false,
        contactEmail: "",
        submittingOrder: false,
    },
    created: function () {
        self = this;
        self.getSiteData();
    },
    methods: {
        getSiteData(){
            $.get('https://api.npoint.io/adf5cf3c700953afb40e', function (info) {
                self.siteData = info;
                self.loadingData = false;
                self.restoreCartItems();
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
        restoreCartItems(){
            self.cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
            self.getCartTotals();
        },
        addItemToCart(project){
            self.cartItems.push(project);
            self.updateCart();
        },
        removeItemFromCart(project){
            var removeIndex = self.cartItems.map(p => p.id).indexOf(project.id);
            if(removeIndex != -1) {
                self.cartItems.splice(removeIndex, 1);
                self.updateCart();
            }
            else {
                alert("None of this item is in the cart!");
            }
        },
        checkCart(){
            if(self.cartItems.length > 0){
                self.showEmailModal = true;
            }else{
                alert("Please add at least 1 item to your cart before continuing");
            }
        },
        submitOrder() {
            // var apiKey = "";
            // var secretKey = "";
            // var authHash = self.makeBaseAuth(apiKey, secretKey);
            // console.log(authHash);
            // return;

            if(self.contactEmail == ""){
                alert("Please enter an email address before continuing");
                return;
            }
            self.submittingOrder = true;
            var itemList = "";
            self.cartItems.forEach(item => {
                itemList += item.name+"\n";
            });
            var post = {
                Messages:[
                    {
                        From: {
                            "Email": "contact@taverntalesgame.com",
                            "Name": "Tavern Tales"
                        },
                        To: [
                            {
                                "Email": "mitchscobee@gmail.com",
                                "Name": "Mitch"
                            }
                        ],
                        Subject: "New Order Placed",
                        TextPart: "The following items have been ordered by: "+self.contactEmail+" \n\n"+itemList,
                        HTMLPart: ""
                    }
                ]
            };
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "https://api.mailjet.com/v3.1/send",
                dataType: 'json',
                data: JSON.stringify(post),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Basic OTgyOTk0ZjFiZDdlNzQyZDliYmM4YjAyZWQ1NGM2MTA6MzE3ZTM0ODMxNTcyYWEwZGQ3OWNiZGY3NzhhOTFiZTQ=');
                },
                success: function (returnData){
                    console.log(returnData);
                    self.cartItems = [];
                    self.updateCart();
                    self.page = "confirmation";
                    self.submittingOrder = false;
                    self.showEmailModal = false;
                    self.contactEmail = "";
                }
            });
        },
        makeBaseAuth(user, password) {
            var tok = user + ':' + password;
            var hash = btoa(tok);
            return 'Basic ' + hash;
        },
        updateCart() {
            localStorage.setItem("cartItems", JSON.stringify(self.cartItems));
            self.getCartTotals();
        },
        getCartTotals() {
            var itemTotals = 0;
            self.cartItems.forEach(item => {
                itemTotals += item.price;
            });
            
            self.cartTax = (Math.round((itemTotals * 0.06875) * 100) / 100);
            self.cartTotal = (Math.round((itemTotals + self.cartTax) * 100) / 100);
        },
    }
});