export type TransactionType = "income" | "expense";

export interface Transaction {
    id: string,
    type: TransactionType,
    description: string,
    value: number,
};

export interface InputData {
    type: TransactionType,
    description: string,
    value: number,
};

export interface BudgetData {
    balance: number,
    income: number,
    expense: number,
    percentage: number,
};