import { getTransactions, addTransaction, deleteTransaction, calculateBudget, updateTransaction, getTransactionById } from "./budget";
import { renderMonth, readInput, clearInput, addtoList, deleteList, renderTransactions, updateBudget, fillInput, setEditingMode, setAddMode, clearTransactionList, getDescriptions, renderDropdown, applyFilter } from "./render";

let editingId: string | null = null;

// click "Add" -> read input -> validate
function ctrlSaveTransaction(): void {
    const input = readInput();
    if (!input.description || input.value <= 0 || isNaN (input.value)) return;
// editingId === null -> add transaction
// editingId !== null -> edit transaction
    if (editingId === null) {
        const newTransaction = addTransaction(input);
        addtoList(newTransaction);
    } else {
        updateTransaction(editingId, input);
        clearTransactionList();
        renderTransactions(getTransactions());
    };
// calculate budget -> update budget -> clear input
    const budget = calculateBudget();
    updateBudget(budget);
    refreshFilters();
    editingId = null; // reset back to null
    setAddMode(); // change button from "Save" to "Add"
    clearInput();
};

// click "Delete"
function ctrlDeleteTransaction(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains("delete-btn")) return;
    const id = target.dataset.id;
    if (!id) return;
    deleteTransaction(id);
    deleteList(id);
    const budget = calculateBudget();
    updateBudget(budget);
    refreshFilters();
};

// click "Edit"
function ctrlEditTransaction(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains("edit-btn")) return;
    const id = target.dataset.id;
    if (!id) return;
    editingId = id;
    const transaction = getTransactionById(id);
    if (!transaction) return;
    fillInput(transaction);
    setEditingMode(); // change button from "Add" to "Save"
};

function refreshFilters(): void {
    const transactions = getTransactions();
    renderDropdown("income-filter", getDescriptions(transactions, "income"));
    renderDropdown("expense-filter", getDescriptions(transactions, "expense"));
};

function ctrlFilterIncome(): void {
    const select = document.getElementById("income-filter") as HTMLSelectElement;
    applyFilter("income-list", select.value);
};

function ctrlFilterExpense(): void {
    const select = document.getElementById("expense-filter") as HTMLSelectElement;
    applyFilter("expense-list", select.value);
};

// start
function init(): void {
    renderMonth();
    const transactions = getTransactions();
    renderTransactions(transactions);
    const budget = calculateBudget();
    updateBudget(budget);
    refreshFilters();

    const addbtn = document.getElementById("add-btn");
    addbtn?.addEventListener("click", ctrlSaveTransaction);

    const main = document.querySelector("main");
    main?.addEventListener("click", ctrlDeleteTransaction);
    main?.addEventListener("click", ctrlEditTransaction);

    const incomeFilter = document.getElementById("income-filter");
    incomeFilter?.addEventListener("change", ctrlFilterIncome);

    const expenseFilter = document.getElementById("expense-filter");
    expenseFilter?.addEventListener("change", ctrlFilterExpense);
};
init();