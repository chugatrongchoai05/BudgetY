import { type Transaction, type InputData, type BudgetData } from "./types";
import { nanoid } from "nanoid";

const dataStorage = localStorage.getItem("budgety-transactions");
let transactions: Transaction[] = dataStorage ? JSON.parse(dataStorage) : [];
const dataUpdate = () => {
    localStorage.setItem("budgety-transactions", JSON.stringify(transactions));
};

export function getTransactions(): Transaction[] {
    return [...transactions];
};

export function addTransaction(data: InputData): Transaction {
    const tran: Transaction = {
        id: nanoid(10),
        type: data.type,
        description: data.description,
        value: data.value,
    };
    transactions.push(tran);
    dataUpdate();
    return tran;
};

export function deleteTransaction(id: string): void {
    transactions = transactions.filter(tran => tran.id !== id);
    dataUpdate();
};

export function calculateBudget(): BudgetData {
    const income = transactions.filter(tran => tran.type === "income").reduce((sum, tran) => sum + tran.value, 0);
    const expense = transactions.filter(tran => tran.type === "expense").reduce((sum, tran) => sum + tran.value, 0);
    const balance = income - expense;
    const percentage = income > 0 ? Math.round((expense / income) * 100) : 0;
    return {
        balance,
        income,
        expense,
        percentage,
    };
};

export function updateTransaction(id: string, data: InputData): void {
    const transaction = transactions.find(tran => tran.id === id);
    if (!transaction) return;
    transaction.type = data.type;
    transaction.description = data.description;
    transaction.value = data.value;
    dataUpdate();
};

export function getTransactionById(id: string): Transaction | undefined {
    return transactions.find(tran => tran.id === id);
};