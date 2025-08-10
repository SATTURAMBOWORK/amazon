import {orders} from './orders.js';
import { loadProductsFetch ,products} from './products.js';
import { addtocart, cart } from './cart.js';
import { updateCartQuantity } from '../java/amazon.js';


 cart.length = 0; 
localStorage.removeItem('cart');
updateCartQuantity();


async function loadOrderPage(){
    await loadProductsFetch(); 
   

    //await lets us write asynchronous code like a normal code
    renderOrders();
}

loadOrderPage();


function renderOrders() {
 
  
  let ordersHTML = '';

  orders.forEach(order => {
    let productsHTML = '';
    
    
    order.products.forEach(productItem => {
      const matchingProduct = products.find(p => p.id === productItem.productId);
      
      productsHTML += `
        <div class="product-image-container">
          <img src="${matchingProduct.image}">
        </div>

        <div class="product-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${new Date(productItem.estimatedDeliveryTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </div>
          <div class="product-quantity">
            Quantity: ${productItem.quantity}
          </div>
          <button class="buy-again-button button-primary buy-button" data-product-id=${matchingProduct.id}>
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${productItem.productId}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${new Date(order.orderTime).toLocaleDateString()}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${(order.totalCostCents / 100).toFixed(2)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  });

  document.querySelector('.orders-grid').innerHTML = ordersHTML;

  document.querySelectorAll('.buy-again-button').forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId; // get the product ID from HTML attribute
    addtocart(productId,1); // call your existing cart logic
    updateCartQuantity();
  });
});
  
}



