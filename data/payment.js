import {cart} from './cart.js'
import { products } from './products.js';
import { deliveryOptions } from './deliveryOptions.js';
import { formatCurrency } from '../util/utils.js';
import { addOrder } from './orders.js';

export function renderPaymentSummary(){
  let productPriceCents=0;
  let shippingPriceCents=0;
  let totalQuantity=0;
  
  
 cart.forEach((cartItem)=> { 
   totalQuantity+=cartItem.quantity;
   let matchingProduct;
    const productId=cartItem.productId;
   
     let deliveryOptionId=cartItem.deliveryOptionId;
       let deliveryOption;
       deliveryOptions.forEach((option)=>{ 
        if(option.id===deliveryOptionId){
          deliveryOption=option;
        }
       }); 
       shippingPriceCents+=deliveryOption.price;


    products.forEach((product)=>{
     if(productId===product.id){
       matchingProduct=product;
     }
    });
   productPriceCents+= matchingProduct.priceCents * cartItem.quantity; 
 });
  const totalBeforeTax=productPriceCents+shippingPriceCents;
  const tax= totalBeforeTax * 0.1;
  const totalCents=totalBeforeTax+tax;

  let paymentSummaryHtml=` <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${totalQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(tax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary  order-button">
            Place your order
          </button>`;


          document.querySelector('.js-payment').innerHTML=paymentSummaryHtml;
          
          document.querySelector('.order-button').addEventListener('click', async ()=>{
              if (cart.length === 0) {
    alert("Your cart is empty. Add something before placing an order!");
    return; // stop here
  }
            try{
               const response=  await  fetch('https://supersimplebackend.dev/orders',{
                method:'POST',
                headers:{
                  'Content-Type':'application/json'
                },
                body: JSON.stringify({
                  cart:cart
                })
              });

             const order=await  response.json();

             addOrder(order);
            }
            catch(error){
                   console.log('Unexpected error.Try again later.');
            }
          
            window.location.href='orders.html'; 
          });
}

