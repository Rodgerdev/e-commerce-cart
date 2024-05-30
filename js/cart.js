import { getLocalStorage, setLocalStorage } from './script.js';

// Function to handle saving orders to orders.json using json-server
async function saveOrderToFile(order) {
  try {
    const response = await fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    console.log('Order saved successfully:', data);
  } catch (error) {
    console.error('Error saving order:', error);
  }
}

const currentCartItemsContainer = document.querySelector('.item');
let totalPrice = document.querySelector('.totalPrice');
let currentPrice = [];

function selectElementsForCart(card) {
  const image = card.querySelector('img').src;
  const id = card.id;
  const title = card.querySelector('h3').innerText;

  return [image, id, title];
}

function displayCartItems(currentCart) {
  currentCartItemsContainer.innerHTML = '';

  currentPrice = [];
  currentCart.forEach((item) => {
    console.log(item.qty); //debugging purposes
    console.log(`item.price: ${item.price}, item.qty: ${item.qty}`);
    const currentQtyPrice = Number(item.price) * item.qty;
    console.log(currentQtyPrice);
    currentPrice.push(currentQtyPrice);
    console.log(currentQtyPrice); // for debugging purposes

    currentCartItemsContainer.innerHTML += `
    <div class="cartItem" id=${item.id}>
        <div class="cartInfo">
          <h3 class="product__1--title">${item.title}</h3>
          
        <h5 class="product__1--price"> ${item.price} Kshs</h5>
      </div>
      <div class="buttons-action">
        <form class="form">
          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            class="quantity"
            min="1"
            max="50"
            value="${item.qty}"
            autofocus
          />
        </form>
        <button class="btn add-cart deleteBtn">Delete</button>
      </div>
    </div>
    `;
  });

  totalPrice.innerText = currentPrice
    .reduce((curr, acc) => curr + acc, 0)
    .toFixed(2);

  currentCartItemsContainer.innerHTML += `
    <button class="btn place-order" id="placeOrderBtn">Place Order</button>
  `;

  loadCartListeners();
}

function loadCartListeners() {
  const deleteBtn = document.querySelectorAll('.deleteBtn');
  const qtyInput = document.querySelectorAll('.quantity');
  const form = document.querySelectorAll('.form');
  const placeOrderBtn = document.querySelector('#placeOrderBtn');

  deleteBtn.forEach((btn) => btn.addEventListener('click', handleDelete));
  form.forEach((el) =>
    el.addEventListener('submit', (e) => e.preventDefault())
  );
  qtyInput.forEach((btn) => btn.addEventListener('change', handleChange));
  
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', handlePlaceOrder);
  }
}

function handleDelete(e) {
  const id = e.target.closest('.cartItem').id;
  const qty = e.target.previousElementSibling.querySelector('.quantity').value;

  const currentCart = getLocalStorage('currentCart');
  const currentQty = getLocalStorage('qtyCart');

  const filteredCart = currentCart.filter((product) => product.id !== id);
  const filteredQty = currentQty - qty;

  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);
}

function handleChange(e) {
  const newQty = e.target.closest('.quantity').value;
  const id = e.target.closest('.cartItem').id;

  const currentCart = getLocalStorage('currentCart');

  const filteredCart = currentCart.map((product) =>
    product.id === id ? { ...product, qty: newQty } : { ...product }
  );

  const filteredQty = filteredCart.reduce(
    (acc, curr) => acc + Number(curr.qty),
    0
  );

  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);
}

function handlePlaceOrder() {
  const currentCart = getLocalStorage('currentCart');
  const currentUser = getLocalStorage('currentUser');
  
  if (currentCart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const order = {
    orderId: Date.now(),
    date: new Date().toISOString(),
    items: currentCart,
    total: totalPrice.innerText,
    user: currentUser
  };

  saveOrderToFile(order);
  
  setLocalStorage('currentCart', []);
  setLocalStorage('qtyCart', 0);
  displayCartItems([]);
  alert('Order placed successfully!');
}

export { displayCartItems, selectElementsForCart };
