export let cart = [];

loadFromStorage();

export function loadFromStorage() {
  cart =
    JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [];
    //   {
    //   productid:"e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    //   quantity:2,
    //   deliveryOptionId:'1'
    //  },
    // {
    //    productid:"15b6fc6f-327a-4ec4-896f-486349e85a3d",
    //   quantity:1,
    //   deliveryOptionId:'2'
    // }
  }

  // ✅ Normalize any old `productid` keys from storage to `productId`
  cart = cart.map(item => {
    if (item.productid && !item.productId) {
      return {
        ...item,
        productId: item.productid,
        productid: undefined
      };
    }
    return item;
  });

  saveToStorage(); // save normalized data back to storage
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));          // function for saving cart in local storage
}

export function addtocart(productId,quantity) {
  let matchingItem;

  cart.forEach((item) => {
    if (productId === item.productId) { // ✅ changed to productId
      matchingItem = item;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId, // ✅ correct key from start
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();                                              //whenever we are adding or removing an item from cart,we are saving it in local storage
}

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((item) => {
    if (item.productId !== productId) { // ✅ changed to productId
      newCart.push(item);
    }
  });
  cart = newCart;

  saveToStorage();                                            //whenever we are adding or removing an item from the cart,we are saving it in local storage
}

export function updateDeliveryOption(productId, deliveryOptionId) {      // we are updating the delivery option id of the matching product in the cart
  const matchingItem = cart.find(item => item.productId === productId);   // ✅ changed to productId
  if (matchingItem) {
    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
  }
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}
