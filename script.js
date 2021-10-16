"use strict";
const totalBalance = document.querySelector(".total-balance");
const incomeBoxVal = document.querySelector(".inc");
const expenseBoxVal = document.querySelector(".exp");
let listContainer = document.querySelector(".list-items ul");

const showDelBtns = document.getElementById("delete-items-btn");
const sortBtn = document.querySelector(".sort-btn");

const textLabel = document.getElementById("text-label");
const amountLabel = document.getElementById("amount-label");
const textInput = document.getElementById("text-input");
const amountInput = document.getElementById("amount-input");
const warning = document.querySelector(".warning");

const submitBtn = document.querySelector(".btn-add");
const clearAllBtn = document.querySelector(".clear-all");

//Local storage
const setLocalStorage = JSON.parse(localStorage.getItem("items"));

let items = localStorage.getItem("items") !== null ? setLocalStorage : [];

const updateStorage = function () {
  localStorage.setItem("items", JSON.stringify(items));
};

//Function that creates element to insert in list container
const createItem = function (arr = items) {
  arr.forEach(function (item) {
    const sign = item.amount > 0 ? "+" : "-";
    const classType = item.amount > 0 ? "plus" : "minus";

    const newItem = `<li class="list-item ${classType} ">
    <p class="item-desc">${item.text} </p>
    <strong class="amount">${sign}${Math.abs(item.amount)}</strong>
    <button class="del-btn" onclick="removeItem(${
      item.id
    }) "><i class="fas fa-trash-alt"></i></button>
  </li>`;
    listContainer.insertAdjacentHTML("afterbegin", newItem);
  });
  updateStorage();
};

createItem();

//Update values to UI
const updateValues = function () {
  const totals = items
    .map((item) => item.amount)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  const income = items
    .map((item) => item.amount)
    .filter((item) => item > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  const expense = items
    .map((item) => item.amount)
    .filter((item) => item < 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);

  const selectedValue = document.getElementById("currency").value;

  totalBalance.textContent = `${selectedValue} ${totals}`;
  incomeBoxVal.textContent = `${selectedValue} ${income}`;
  expenseBoxVal.textContent = `${selectedValue} ${Math.abs(expense).toFixed(
    2
  )}`;
  if (totals > 0) {
    totalBalance.style.color = "#41bd79";
  } else if (totals < 0) {
    totalBalance.style.color = "#fc766aff";
  } else {
    totalBalance.style.color = "white";
  }
};

//Random ID number for each transaction
const randomID = function () {
  return Math.floor(Math.random() * 1000000);
};

//Retrive values from input and push new transaction into array
const addNewItem = function () {
  if (textInput.value.trim() === "" || amountInput.value.trim() === "") {
    warning.style.opacity = 1;
  } else {
    const newItem = {
      id: randomID(),
      text: textInput.value,
      amount: +amountInput.value,
    };
    items.push(newItem);
    updateValues();

    textInput.value = "";
    amountInput.value = "";
    warning.style.opacity = 0;
  }
};

//Function called on page load to update values
const init = function () {
  listContainer.innerHTML = "";
  createItem(items);
  updateValues();
};
init();

//Remove specific transaction
const removeItem = function (id) {
  items = items.filter((item) => item.id !== id);
  init();
  updateStorage();
};

//Event listeners
//Submit
submitBtn.addEventListener("click", function () {
  addNewItem();
  listContainer.innerHTML = "";
  createItem(items);
  updateStorage();
});

//Sort
sortBtn.addEventListener("click", function () {
  items = items.sort((a, b) => a.amount - b.amount);
  listContainer.innerHTML = "";
  createItem(items);
});

//Clear container with transaction list
clearAllBtn.addEventListener("click", function () {
  items = [];
  listContainer.innerHTML = "";
  updateValues();
  updateStorage();
});
