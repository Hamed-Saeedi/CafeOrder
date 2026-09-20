/* ---------- Menu Data ---------- */

const items = [
  {
    id: 1,
    name: "Cappuccino",
    category: "Coffee",
    price: 120,
    available: true,
  },
  {
    id: 2,
    name: "Latte",
    category: "Coffee",
    price: 130,
    available: true,
  },
  {
    id: 3,
    name: "Americano",
    category: "Coffee",
    price: 100,
    available: true,
  },
  {
    id: 4,
    name: "Espresso",
    category: "Coffee",
    price: 90,
    available: true,
  },
  {
    id: 5,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 180,
    available: true,
  },
  {
    id: 6,
    name: "Cheesecake",
    category: "Dessert",
    price: 200,
    available: true,
  },
  {
    id: 7,
    name: "Croissant",
    category: "Bakery",
    price: 110,
    available: true,
  },
  {
    id: 8,
    name: "Blueberry Muffin",
    category: "Bakery",
    price: 100,
    available: true,
  },
  {
    id: 9,
    name: "Iced Tea",
    category: "Drinks",
    price: 80,
    available: true,
  },
  {
    id: 10,
    name: "Green tea",
    category: "Drink",
    price: 30,
    available: true,
  },
];

/* ---------- Order ---------- */

let order = [];

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");

const menuStatus = document.getElementById("menu-status");
const menuList = document.getElementById("menu-list");
const menuEmpty = document.getElementById("menu-empty");

const customer = document.getElementById("customer-name");
const customerError = document.getElementById("customer-name-error");

const orderStatus = document.getElementById("order-status");
const orderList = document.getElementById("order-list");
const orderEmpty = document.getElementById("order-empty");

const total = document.getElementById("grand-total");

const confirmBtn = document.getElementById("confirm-order");
const newOrderBtn = document.getElementById("new-order");

const confirmation = document.getElementById("confirmation-summary");

// Format Price
function formatPrice(price) {
  return price.toLocaleString() + " AFN";
}

/* ---------- Create Categories ---------- */

function createCategories() {
  const categories = [];

  items.forEach(function (item) {
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
  });

  categories.sort();

  categories.forEach(function (category) {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);
  });
}

/* ---------- Show Menu ---------- */

function showMenu() {
  menuList.replaceChildren();

  const searchText = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredItems = items.filter(function (item) {
    const matchesSearch = item.name.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "" || item.category === selectedCategory;

    return matchesSearch && matchesCategory && item.available;
  });

  menuStatus.textContent = filteredItems.length + " item(s) available";

  menuEmpty.hidden = filteredItems.length > 0;

  filteredItems.forEach(function (item) {
    const card = createMenuCard(item);
    menuList.appendChild(card);
  });
}

/* ---------- Create Menu Card ---------- */

function createMenuCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = item.name;

  const category = document.createElement("p");
  category.textContent = item.category;

  const price = document.createElement("strong");
  price.textContent = formatPrice(item.price);

  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Add to Order";

  const alreadyAdded = order.some(function (orderItem) {
    return orderItem.id === item.id;
  });

  if (alreadyAdded) {
    button.textContent = "Added";
    button.disabled = true;
  }

  button.addEventListener("click", function () {
    addToOrder(item.id);
  });

  card.appendChild(title);
  card.appendChild(category);
  card.appendChild(price);
  card.appendChild(button);

  return card;
}

/* ---------- Add To Order ---------- */

function addToOrder(id) {
  const item = items.find(function (menuItem) {
    return menuItem.id === id;
  });

  if (!item) {
    return;
  }

  const existingItem = order.find(function (orderItem) {
    return orderItem.id === id;
  });

  if (existingItem) {
    return;
  }

  order.push({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: 1,
  });

  showOrder();
  showMenu();
}

/* ---------- Show Order ---------- */

function showOrder() {
  orderList.replaceChildren();

  if (order.length === 0) {
    orderEmpty.hidden = false;
    orderStatus.textContent = "Your order is empty.";
    total.textContent = "0 AFN";

    confirmBtn.disabled = true;
    newOrderBtn.disabled = true;

    return;
  }

  orderEmpty.hidden = true;
  orderStatus.textContent = order.length + " item(s) in your order";

  order.forEach(function (item) {
    const orderItem = createOrderItem(item);
    orderList.appendChild(orderItem);
  });

  updateTotal();

  confirmBtn.disabled = false;
  newOrderBtn.disabled = false;
}

/* ---------- Create Order Item ---------- */

function createOrderItem(item) {
  const container = document.createElement("div");
  container.className = "order-item";

  const name = document.createElement("strong");
  name.textContent = item.name;

  const price = document.createElement("span");
  price.textContent = formatPrice(item.price);

  const quantity = document.createElement("span");
  quantity.textContent = "Quantity: " + item.quantity;

  const decreaseBtn = document.createElement("button");
  decreaseBtn.type = "button";
  decreaseBtn.textContent = "-";

  const increaseBtn = document.createElement("button");
  increaseBtn.type = "button";
  increaseBtn.textContent = "+";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "Remove";

  decreaseBtn.addEventListener("click", function () {
    decreaseQuantity(item.id);
  });

  increaseBtn.addEventListener("click", function () {
    increaseQuantity(item.id);
  });

  removeBtn.addEventListener("click", function () {
    removeItem(item.id);
  });

  container.appendChild(name);
  container.appendChild(price);
  container.appendChild(quantity);
  container.appendChild(decreaseBtn);
  container.appendChild(increaseBtn);
  container.appendChild(removeBtn);

  return container;
}

/* ---------- Increase Quantity ---------- */

function increaseQuantity(id) {
  const item = order.find(function (orderItem) {
    return orderItem.id === id;
  });

  if (!item) {
    return;
  }

  item.quantity += 1;

  showOrder();
}

/* ---------- Decrease Quantity ---------- */

function decreaseQuantity(id) {
  const item = order.find(function (orderItem) {
    return orderItem.id === id;
  });

  if (!item) {
    return;
  }

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    removeItem(id);
    return;
  }

  showOrder();
}

/* ---------- Remove Item ---------- */

function removeItem(id) {
  order = order.filter(function (item) {
    return item.id !== id;
  });

  showOrder();
  showMenu();
}

/* ---------- Update Total ---------- */

function updateTotal() {
  let grandTotal = 0;

  order.forEach(function (item) {
    grandTotal += item.price * item.quantity;
  });

  total.textContent = formatPrice(grandTotal);
}

/* ---------- Confirm Order ---------- */

confirmBtn.addEventListener("click", function () {
  const customerName = customer.value.trim();

  if (customerName === "") {
    customerError.textContent = "Please enter customer name.";

    customer.focus();

    return;
  }
  if (order.length === 0) {
    customerError.textContent = "Please add at least one item to your order.";

    return;
  }

  customerError.textContent = "";

  confirmation.hidden = false;

  confirmation.textContent =
    "Order confirmed for " + customerName + ". Total: " + total.textContent;

  confirmBtn.disabled = true;
  newOrderBtn.disabled = false;
});

/* ---------- New Order ---------- */

newOrderBtn.addEventListener("click", function () {
  order = [];

  customer.value = "";
  customerError.textContent = "";

  confirmation.hidden = true;
  confirmation.textContent = "";

  showOrder();
  showMenu();
});

/* ---------- Search ---------- */

searchInput.addEventListener("input", function () {
  showMenu();
});

/* ---------- Category Filter ---------- */

categoryFilter.addEventListener("change", function () {
  showMenu();
});

/* ---------- Customer Validation ---------- */

customer.addEventListener("input", function () {
  if (customer.value.trim() !== "") {
    customerError.textContent = "";
  }
});

/* ---------- Start Application ---------- */

createCategories();
showMenu();
showOrder();
