const form = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const totalDisplay = document.getElementById('total');
const creditDisplay = document.getElementById('totalCredit');
const debitDisplay = document.getElementById('totalDebit');

let total = 0;
let totalCredit = 0;
let totalDebit = 0;
// Fetch all transactions from backend
async function fetchTransactions() {
  try {
    const res = await fetch('http://localhost:5000/api/');
    const transactions = await res.json()

    // Reset totals and UI
    transactionList.innerHTML = '';s
    total = totalCredit = totalDebit = 0;

    transactions.forEach(t => {
      renderTransaction(t);

      if (t.type === 'credit') {
        totalCredit += t.amount;
        total += t.amount;
      } else if (t.type === 'debit') {
        totalDebit += t.amount;
        total -= t.amount;
      }
    });

    updateSummary();
  } catch (err) {
    console.error('Error fetching transactions:', err);
    alert('Could not load transactions');
  }
}

// Render a single transaction to the list
function renderTransaction(t) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${t.description} (${t.type})</span>
    <span class="${t.type}">$${t.amount.toFixed(2)}</span>
  `;
  transactionList.appendChild(li);
}

// Update summary fields
function updateSummary() {
  totalDisplay.textContent = total.toFixed(2);
  creditDisplay.textContent = totalCredit.toFixed(2);
  debitDisplay.textContent = totalDebit.toFixed(2);
}

// Handle form submission
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const desc = document.getElementById('desc').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  const newTransaction = {
    description: desc,
    amount,
    type
  };

  try {
    const res = await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTransaction)
    });

    if (!res.ok) throw new Error('Failed to add transaction');

    // Refresh the transaction list
    await fetchTransactions();
    form.reset();
  } catch (err) {
    console.error('Error adding transaction:', err);
    alert('Failed to add transaction');
  }
});

// Initial fetch on page load
fetchTransactions();
