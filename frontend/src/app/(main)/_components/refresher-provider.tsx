'use client'
import { createContext, ReactNode, useState } from 'react';


export type RefresherContextType = {
    // dashboard
    refreshDashboard: () => void,
    refreshDashboardFlage: number;
    // incomes
    refreshIncomesFlag: number;
    refreshIncomes: () => void,
    // expense
    refreshExpensesFlag: number;
    refreshExpenses: () => void,
    // expense categories
    refreshExpensesCategoriesFlag: number;
    refreshExpensesCategories: () => void,
    // product categories
    refreshProductCategoriesFlag: number;
    refreshProductCategories: () => void,
    // income categories
    refreshIncomeCategoriesFlag: number;
    refreshIncomeCategories: () => void,
    // product
    refreshProductsFlag: number;
    refreshProducts: () => void,
}


export const RefresherContext = createContext<RefresherContextType | null>(null)

function RefresherProvider({ children }: { children: ReactNode }) {
    const [refreshDashboardFlage, setRefreshDashboardFlage] = useState<number>(0)
    const [refreshIncomesFlag, setRefreshIncomesFlag] = useState<number>(0)
    const [refreshExpensesFlag, setRefreshExpensesFlag] = useState<number>(0)
    const [refreshExpensesCategoriesFlag, setRefreshExpensesCategoriesFlag] = useState<number>(0)
    const [refreshIncomeCategoriesFlag, setRefreshIncomeCategoriesFlag] = useState<number>(0)
    const [refreshProductCategoriesFlag, setRefreshProductCategoriesFlag] = useState<number>(0)
    const [refreshProductsFlag, setRefreshProductsFlag] = useState<number>(0)

    const refreshDashboard = () => { setRefreshDashboardFlage(e => e + 1) }
    const refreshIncomes = () => { setRefreshIncomesFlag(e => e + 1) }
    const refreshExpenses = () => { setRefreshExpensesFlag(e => e + 1) }
    const refreshExpensesCategories = () => { setRefreshExpensesCategoriesFlag(e => e + 1) }
    const refreshProductCategories = () => { setRefreshProductCategoriesFlag(e => e + 1) }
    const refreshProducts = () => { setRefreshProductsFlag(e => e + 1) }
    const refreshIncomeCategories = () => { setRefreshIncomeCategoriesFlag(e => e + 1) }

    return (
        <RefresherContext.Provider value={{
            refreshDashboard,
            refreshDashboardFlage,
            refreshIncomesFlag,
            refreshIncomes,
            refreshExpensesFlag,
            refreshExpenses,
            refreshExpensesCategories,
            refreshExpensesCategoriesFlag,
            refreshProductCategories,
            refreshProductCategoriesFlag,
            refreshProducts,
            refreshProductsFlag,
            refreshIncomeCategories,
            refreshIncomeCategoriesFlag
        }}>
            {children}
        </RefresherContext.Provider>
    )
}

export default RefresherProvider