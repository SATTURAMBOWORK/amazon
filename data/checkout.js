import {cart, removeFromCart,updateDeliveryOption,loadCart} from './cart.js';
import {products,loadProductsFetch} from './products.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';  
import {deliveryOptions} from './deliveryOptions.js';
 import{renderPaymentSummary}from './payment.js';
import {updateCartQuantity} from '../java/amazon.js'
  



 async function loadPage(){    //makes a function return a promise
  
  try{
    // throw 'error1';  // this value will be saved in catch black variable value

  await loadProductsFetch();  //await lets us write asynchronous code like a normal code
  await new Promise((resolve,reject)=>{   // used to create an error in future in promises
       loadCart(()=>{
        resolve();
       });
  });
  } catch(error){
        console.log('unexpected error.please try again');
  }

  
    render();
    renderPaymentSummary(); 
    displayItems();
}
loadPage();



function displayItems(){
  let cartQuantity = 0;
    cart.forEach((item) => {
      cartQuantity += item.quantity;
    });
    document.querySelector('.no-items').innerHTML=`${cartQuantity} items`
}

  
 export function render(){

let cartSummaryHTML='';
cart.forEach((item)=>{ 
  const productId=item.productId;
  let matchingProduct;
  products.forEach((product)=>{
   if(productId===product.id){
     matchingProduct=product;
   }
  });
   const deliveryOptionId=item.deliveryOptionId;
   let deliveryOption;
   deliveryOptions.forEach((option)=>{
    if(option.id===deliveryOptionId){
      deliveryOption=option;
    }
   }); 
    const today=dayjs();
         const deliveryDate=today.add(deliveryOption.deliveryDays, 'days');
         const dateString =deliveryDate.format ('dddd, MMMM D');

 cartSummaryHTML+=   `<div class=" bobo cart-item-container js-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${matchingProduct.getPrice()}
                </div>
                <div class="product-quantity quantity-${matchingProduct.id}">
                  <span>
                    Quantity: <span class="quantity-label">${item.quantity}</span>
                  </span>
                 <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${matchingProduct.id}">
  Update
</span>

                  <span class="delete-quantity-link link-primary js-delete js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                
                 ${deliveryOptionsHtml(matchingProduct,item)}                   
                
              </div>
            </div>
          </div>`; // deliveyoptionshtml is a function which updates the selecting part of the delivery options
}); 

function deliveryOptionsHtml (matchingProduct,item){    //this function generates the html for delivery options part.
   let html=``;
      deliveryOptions.forEach((deliveryOption)=>{       // this for loop will run 3 times,to generate html for three delivery options
         const today=dayjs();
         const deliveryDate=today.add(deliveryOption.deliveryDays, 'days');
         const dateString =deliveryDate.format ('dddd, MMMM D');
         const priceString = deliveryOption.price===0
         ?'FREE'
         :`$${(deliveryOption.price/100).toFixed(2)}-`;
         const isChecked = deliveryOption.id===item.deliveryOptionId;
        html+=`<div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio" ${isChecked?'checked':''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>`;
      });
      return html;
}

document.querySelector('.jssummary').innerHTML=cartSummaryHTML;
document.querySelectorAll('.js-delete').forEach((link)=>{
 link.addEventListener('click',()=>{
     const productid=link.dataset.productId;
     removeFromCart(productid);
      updateCartQuantity();
      displayItems();
     const container=document.querySelector(`.js-${productid}`);
    if (container) {
  container.remove();
  renderPaymentSummary();
} else {
  console.warn(`Could not find element .js-${productid}`);
}
 });
});
  
document.querySelectorAll('.js-delivery-option').forEach((element)=>{   // this we are doing to update the delivery option choice when other choice is selected.
element.addEventListener('click',()=>{
  const {productId,deliveryOptionId}=element.dataset ;
  updateDeliveryOption(productId,deliveryOptionId);
  render();
  renderPaymentSummary();
})
});

// Handle clicking update/save quantity
document.querySelectorAll('.js-update-quantity').forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    const quantitySpan = document.querySelector(`.quantity-${productId} .quantity-label`);
    
    if (button.textContent.trim() === 'Update') {
      // Change quantity text to a <select> dropdown
      const currentQuantity = Number(quantitySpan.textContent);
      let selectHTML = `<select class="quantity-select">`;
      for (let i = 1; i <= 10; i++) {
        selectHTML += `<option value="${i}" ${i === currentQuantity ? 'selected' : ''}>${i}</option>`;
      }
      selectHTML += `</select>`;
      quantitySpan.innerHTML = selectHTML;
      
      // Change button text to Save
      button.textContent = 'Save';
    } else {
      // Save new quantity
      const selectElem = quantitySpan.querySelector('select.quantity-select');
      const newQuantity = Number(selectElem.value);
      
      // Update quantity in cart
      const cartItem = cart.find(item => item.productId === productId);
      if (cartItem) {
        cartItem.quantity = newQuantity;
      }
      
      // Save cart back to storage (assuming you have a function for this)
      // If not, add this:
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Re-render everything
      render();
      renderPaymentSummary();
      displayItems();
    }
  });
});

}

// loadProducts(()=>{     causing a lot of nested 
//   loadCart(()=>{
//     render();
// renderPaymentSummary();
//   });
 
// });


