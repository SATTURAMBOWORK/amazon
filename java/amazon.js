import { cart, addtocart } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";

if (document.querySelector('.js-grid')) {
  loadProductsFetch().then(() => {
    renderProductGrid(products); // Show all initially
    setupSearch(); // Attach search listeners
  });
}

function renderProductGrid(productList) {
  let cartQuantity = Number(localStorage.getItem('cart-quantity')) || 0;
  const x = document.querySelector(".cart-quantity");
  if (x) x.innerHTML = cartQuantity;

  let productHTML = "";

  productList.forEach((product) => {
    productHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars" src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select>
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHtml()}   

        <div class="product-spacer"></div>

        <div class="added-to-cart h-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary addCart"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector(".js-grid").innerHTML = productHTML;

  document.querySelectorAll(".addCart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantitySelector = button.closest('.product-container').querySelector('select');
      const quantity = Number(quantitySelector.value);

      addtocart(productId, quantity);
      updateCartQuantity();

      const addedMsg = document.querySelector(`.h-${productId}`);
      addedMsg.classList.add('active');
      setTimeout(() => {
        addedMsg.classList.remove('active');
      }, 5000);
    });
  });
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  localStorage.setItem('cart-quantity', cartQuantity);

  const cartQuantityElement = document.querySelector(".cart-quantity");
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

// NEW: Search Setup
function setupSearch() {
  const searchInput = document.querySelector(".search-bar");
  const searchButton = document.querySelector(".search-button");

  function doSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
      renderProductGrid(products); // Show all if empty
    } else {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query)
      );
      renderProductGrid(filtered);
    }
  }

  searchButton.addEventListener("click", doSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      doSearch();
    }
  });
}
