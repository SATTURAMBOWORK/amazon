import { orders } from "./orders.js";
import { products, loadProductsFetch } from "./products.js";
import { updateCartQuantity } from "../java/amazon.js";

async function loadtrackingPage() {
  await loadProductsFetch();
  updateCartQuantity();
  renderTrackingPage();
}
loadtrackingPage();

function renderTrackingPage() {
  let trackingHtml = ``;
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const order = orders.find((order) => order.id === orderId);
  const orderProduct = order.products.find((p) => p.productId === productId);
  const exactProduct = products.find((p) => p.id === productId);

  // Dates (strip time to compare only dates)
  const orderDate = new Date(order.orderTime);
  orderDate.setHours(0, 0, 0, 0);

  const deliveryDate = new Date(orderProduct.estimatedDeliveryTime);
  deliveryDate.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let status;
  if (now.getTime() === orderDate.getTime()) {
    status = "Preparing";
  } else if (now > orderDate && now < deliveryDate) {
    status = "Shipped";
  } else if (now >= deliveryDate) {
    status = "Delivered";
  }

  // Progress bar width
  let progressWidth;
  if (status === "Preparing") {
    progressWidth = "33%";
  } else if (status === "Shipped") {
    progressWidth = "66%";
  } else {
    progressWidth = "100%";
  }

  trackingHtml += `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${deliveryDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      <div class="product-info">
        ${exactProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${orderProduct.quantity}
      </div>

      <img class="product-image" src="${exactProduct.image}">

      <div class="progress-labels-container">
        <div class="progress-label ${status === "Preparing" ? "current-status" : ""}">
          Preparing
        </div>
        <div class="progress-label ${status === "Shipped" ? "current-status" : ""}">
          Shipped
        </div>
        <div class="progress-label ${status === "Delivered" ? "current-status" : ""}">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressWidth}"></div>
      </div>
    </div>
  `;

  document.querySelector(".main").innerHTML = trackingHtml;
}
