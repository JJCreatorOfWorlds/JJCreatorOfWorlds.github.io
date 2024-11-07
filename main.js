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
    if (self.contactEmail === "") {
        alert("Please enter an email address before continuing");
        return;
    }
    
    self.submittingOrder = true;
    let itemList = "";
    self.cartItems.forEach(item => {
        itemList += `${item.name}\n`;
    });

    const recipientEmail = "me@jjirons.com";
    const subject = encodeURIComponent("New Order Placed");
    const body = encodeURIComponent(
        `The following items have been ordered by: ${self.contactEmail}\n\n${itemList}`
    );

    // Construct the mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    
    // Open the mailto link to prompt the user's email client
    window.location.href = mailtoLink;

    // Reset the cart and form after opening the email client
    self.cartItems = [];
    self.updateCart();
    self.page = "confirmation";
    self.submittingOrder = false;
    self.showEmailModal = false;
    self.contactEmail = "";
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
