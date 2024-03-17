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
            $.get('https://api.npoint.io/978b41969ecee7834702', function (info) {
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
                // to: ["me@jjirons.com"],
                to: [self.siteData.emailTo],
                subject: "New Order Placed",
                body: "The following items have been ordered by: "+self.contactEmail+" \n\n"+itemList
            };
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "https://api.mailslurp.com/emails?inboxId=05b902d6-bc1b-476a-8e6a-eb24d18df6c7",
                dataType: 'json',
                data: JSON.stringify(post),
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('x-api-key', '011bbb21bc2bcd429381b549a8f39fe093ea47a15c46207a0fa843779a3b0783');
                },
                statusCode: {
                  201: function(returnData) {
                    console.log(returnData);
                    self.cartItems = [];
                    self.updateCart();
                    self.page = "confirmation";
                    self.submittingOrder = false;
                    self.showEmailModal = false;
                    self.contactEmail = "";
                  }
                }
            });
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