class Cart{
    cartItems;  //public property
    #localStorageKey; //private property(only accesed within the class)

    constructor(localStorageKey){
       this.#localStorageKey=localStorageKey;
       this.#loadFromStorage();
    }


    #loadFromStorage(){ 
this.cartItems=
 JSON.parse(localStorage.getItem(`cart-${this.#localStorageKey}`));

 if(!this.cartItems){
  this.cartItems= [{
  productid:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  quantity:2,
  deliveryOptionId:'1'
 },
{
   productid:"15b6fc6f-327a-4ec4-896f-486349e85a3d",
  quantity:1,
  deliveryOptionId:'2'
}];
 }
 }
 saveToStorage(){
  localStorage.setItem(`cart-${this.#localStorageKey}`,JSON.stringify(this.cartItems)) ;          // function for saving cart in local storage
}
addtocart(productid) {
  let matchingItem;

  this.cartItems.forEach((item) => {
    if (productid === item.productid) {
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    this.cartItems.push({
      productid: productid,
      quantity: 1,
      deliveryOptionId:'1'
    });
  }
  this.saveToStorage();                                              //whenever we are adding or removing an item from cart,we are saving it in local storage
}
 removeFromCart(productid){
  const newCart=[];
 this.cartItems.forEach((item)=>{
    if(item.productid !== productid){
      newCart.push(item);
    }
  });
  this.cartItemsart=newCart;
  this.saveToStorage();                                            //whenever we are adding or removing an item from the cart,we are saving it in local storage
}
updateDeliveryOption(productId, deliveryOptionId) {      // we are updating the delivery option id of the matching product in the cart
  const matchingItem = this.cartItems.find(item => item.productid === productId);   
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}

 }

const cart=new Cart('cart-oop');
const businessCart= new Cart('cart-buisness');

console.log(cart);
console.log(businessCart);



 

 


