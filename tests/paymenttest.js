import { render } from "../data/checkout.js";
import { addtocart, cart, loadFromStorage } from "../data/cart.js";
import { renderPaymentSummary } from "../data/payment.js";
import { loadProductsFetch } from "../data/products.js";

describe("test suite:renderpaymentSummary", () => {

beforeAll((done)=>{    // function provided by jasmine
  loadProductsFetch().then(()=>{
    done();
  });          
});  
beforeEach(()=>{
        document.querySelector(
      ".js-test-container"
    ).innerHTML = `<div class="jssummary"></div>
    <div class="js-payment"></div>`;

    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productid: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1",
        },
        {
          productid: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 1,
          deliveryOptionId: "2",
        },
      ]);
    });
    loadFromStorage();
    render();
});

  it("displays the cart", () => {
    expect(document.querySelectorAll('.bobo').length).toEqual(2);
     document.querySelector(
      ".js-test-container"
    ).innerHTML = ``;
  });

  it('removes a product from the page', () => {
  
    
    document.querySelector(`.js-delete-link-e43638ce-6aa0-4b85-b27f-e1d07eb678c6`).click();
    expect(document.querySelectorAll('.bobo').length).toEqual(1);
    expect(document.querySelector('.js-e43638ce-6aa0-4b85-b27f-e1d07eb678c6')).toEqual(null);
    expect(cart.length).toEqual(1);
    expect(cart[0].productid).toEqual('15b6fc6f-327a-4ec4-896f-486349e85a3d');
     document.querySelector(
      ".js-test-container"
    ).innerHTML = ``;
  });
});
