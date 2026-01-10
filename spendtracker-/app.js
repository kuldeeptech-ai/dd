const permissionKey = "storagePermission";
const dataKey = "expenses";

const permissionBox = document.getElementById("permissionBox");
const app = document.getElementById("app");
const form = document.getElementById("expenseForm");
const list = document.getElementById("expenseList");
const installBtn = document.getElementById("installBtn");
const monthlyTotalEl = document.getElementById("monthlyTotal");

/* Permission */
function grantPermission() {
  localStorage.setItem(permissionKey, "granted");
  permissionBox.classList.add("hidden");
  app.classList.remove("hidden");
  loadExpenses();
}

function checkPermission() {
  if (localStorage.getItem(permissionKey) === "granted") {
    permissionBox.classList.add("hidden");
    app.classList.remove("hidden");
    loadExpenses();
  }
}

/* Add Expense */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const expense = {
    id: Date.now(),
    amount: Number(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    note: document.getElementById("note").value,
    date: new Date().toISOString()
  };

  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);

  form.reset();
  loadExpenses();
});

/* Load + Render */
function loadExpenses() {
  const expenses = getExpenses();
  list.innerHTML = "";

  let monthlyTotal = 0;
  const now = new Date();

  expenses.slice().reverse().forEach(exp => {
    const expDate = new Date(exp.date);

    if (
      expDate.getMonth() === now.getMonth() &&
      expDate.getFullYear() === now.getFullYear()
    ) {
      monthlyTotal += exp.amount;
    }

    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${exp.category}</strong><br>
        <small>${exp.note || "—"}</small>
      </div>
      <div>
        <strong>₹${exp.amount}</strong><br>
        <button class="delete-btn" onclick="deleteExpense(${exp.id})">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  monthlyTotalEl.textContent = `₹${monthlyTotal}`;
}

/* Delete Expense */
function deleteExpense(id) {
  let expenses = getExpenses();
  expenses = expenses.filter(exp => exp.id !== id);
  saveExpenses(expenses);
  loadExpenses();
}

/* Storage Helpers */
function getExpenses() {
  return JSON.parse(localStorage.getItem(dataKey)) || [];
}

function saveExpenses(expenses) {
  localStorage.setItem(dataKey, JSON.stringify(expenses));
}

checkPermission();

/* PWA Install */
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const res = await deferredPrompt.userChoice;
  if (res.outcome === "accepted") installBtn.classList.add("hidden");
  deferredPrompt = null;
});

/* Service Worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}