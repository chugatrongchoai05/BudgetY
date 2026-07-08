import { type TransactionType, type Transaction, type InputData, type BudgetData } from "./types";

const DOMstrings = {
    balance: "balance",
    income: "income",
    expense:"expense",
    expensePercent: "expense-percent",
    transactionType: "transaction-type",
    transactionDesc: "transaction-description",
    transactionValue:"transaction-value",
    incomeList: "income-list",
    expenseList: "expense-list",
    incomeFilter: "income-filter",
    expenseFilter: "expense-filter",
};

// real-time month and year update
export const renderMonth = () => {
    const date = new Date();
    const month = date.toLocaleString("en", {month: "long", year: "numeric"});
    const budgetMonth = document.getElementById("budget-month");
    if (budgetMonth) budgetMonth.textContent = month;
};

// read data from user's input
export function readInput(): InputData {
    const type = document.getElementById(DOMstrings.transactionType) as HTMLSelectElement;
    const desc = document.getElementById(DOMstrings.transactionDesc) as HTMLInputElement;
    const val = document.getElementById(DOMstrings.transactionValue) as HTMLInputElement;
    return {
        type: type.value as TransactionType,
        description: desc.value.trim(),
        value: parseFloat(val.value),
    };
};

export function clearInput(): void {
    const desc = document.getElementById(DOMstrings.transactionDesc) as HTMLInputElement;
    const val = document.getElementById(DOMstrings.transactionValue) as HTMLInputElement;
    desc.value = '';
    val.value = '';
    desc.focus();
};

// add new transactions to the list
export function addtoList (item: Transaction): void {
    const type = item.type;
    const sign = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-cyan-500' : 'text-red-500';
    const list = type === 'income' ? DOMstrings.incomeList : DOMstrings.expenseList;
    const html = `
    <li id="${item.id}" class="flex items-center justify-between px-4 py-3">
      <span>${escapeHtml(item.description)}</span>
      <div class="flex items-center gap-3">
        <span class="${color}"> ${sign} ${item.value.toFixed(2)} </span>
        <button data-id="${item.id}" class="edit-btn text-black hover:text-cyan-500">Edit</button>
        <button data-id="${item.id}" data-type="${type}" class="delete-btn text-black hover:text-red-500">Delete</button>
      </div>
    </li>
    `
    const exactlist = document.getElementById(list)
    if (exactlist) {
        exactlist.insertAdjacentHTML('beforeend', html)
    };
};

// delete transactions from the list
export function deleteList (id: string): void {
    const element = document.getElementById(id);
    element?.parentNode?.removeChild(element);
};

export function renderTransactions(transactions: Transaction[]): void {
    transactions.forEach(transaction => {
        addtoList(transaction);
    });
};

// update budget balance
export function updateBudget(budget: BudgetData): void {
    const sign = budget.balance >=0 ? '+' : '-';
    const balance = document.getElementById(DOMstrings.balance);
    const income = document.getElementById(DOMstrings.income);
    const expense = document.getElementById(DOMstrings.expense);
    const expensePercent = document.getElementById(DOMstrings.expensePercent);
    if (balance) balance.textContent = `${sign} ${Math.abs(budget.balance).toFixed(2)}`;
    if (income) income.textContent = `+ ${budget.income.toFixed(2)}`;
    if (expense) expense.textContent = `- ${budget.expense.toFixed(2)}`;
    if (expensePercent) expensePercent.textContent = budget.percentage > 0 ? `${budget.percentage}%` : `--`;
};

// update transactions
export function fillInput(transaction: Transaction): void {
    const type = document.getElementById(DOMstrings.transactionType) as HTMLSelectElement;
    const desc = document.getElementById(DOMstrings.transactionDesc) as HTMLInputElement;
    const val = document.getElementById(DOMstrings.transactionValue) as HTMLInputElement;
    type.value = transaction.type;
    desc.value = transaction.description;
    val.value = transaction.value.toString();
    desc.focus();
};

// change button from "Add" to "Save"
export function setEditingMode(): void {
    const button = document.getElementById("add-btn") as HTMLButtonElement;
    button.textContent = "Save";
};

// change button from "Save" to "Add"
export function setAddMode(): void {
    const button = document.getElementById("add-btn") as HTMLButtonElement;
    button.textContent = "Add";
};

// clear current list and re-render after update
export function clearTransactionList(): void {
    const incomeList = document.getElementById(DOMstrings.incomeList);
    const expenseList = document.getElementById(DOMstrings.expenseList);
    if (incomeList) incomeList.innerHTML = "";
    if (expenseList) expenseList.innerHTML = "";
};

function escapeHtml(str: string): string {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
};

// category management
// get a list of descriptions by transaction types
export function getDescriptions (transactions: Transaction[], type: TransactionType): string[] {
    const filtered = transactions.filter(tran => tran.type === type);
    return [...new Set(filtered.map(tran => tran.description))];
};

// render dropdown filter
export function renderDropdown (id: string, descriptions: string[]): void {
    const select = document.getElementById(id) as HTMLSelectElement | null;
    if (!select) return;
    const current = select.value;
    const options = descriptions.map(desc => `<option value="${escapeHtml(desc)}">${escapeHtml(desc)}</option>`).join("");
    select.innerHTML = `<option value=""> All </option>${options}`;
    if (descriptions.includes(current)) select.value = current;
};

// show - hide transactions by keyword filter
export function applyFilter(listId: string, keyword: string): void {
    const list = document.getElementById(listId);
    if (!list) return;
    list.querySelectorAll("li").forEach(item => {
        const desc = item.querySelector("span")?.textContent?.trim() ?? "";
        (item as HTMLElement).style.display = !keyword || desc === keyword ? "" : "none";
    });
};