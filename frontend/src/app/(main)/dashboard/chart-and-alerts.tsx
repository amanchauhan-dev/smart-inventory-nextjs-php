'use client'
import { useEffect, useState } from "react";
import ExpenseIncomeChart from "../analytics/expense-income-chart";
import LowBudget, { BudgetWarning } from "./low-budget";
import LowStock, { StockWarning } from "./low-stock";
import { toast } from "sonner";
import api from "@/lib/axios";
import Alerts, { AlertsProps } from "./alert";
import QuickCards from "./quick-cards";
import { useAuth } from "@/hooks/use-auth";




function ChartAndAlerts() {
    const { user } = useAuth()
    const [alerts, setAlerts] = useState<AlertsProps[]>([])
    const [budgetWarnings, setBudgetWarnings] = useState<BudgetWarning[]>([])
    const [stockWarnings, setStockWarnings] = useState<StockWarning[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                setAlerts([])
                const { data, status } = await api.get('/alerts')
                if (status == 200) {
                    setBudgetWarnings(data.data.budget_warnings)
                    setStockWarnings(data.data.low_stock_products)
                    if (data.data.budget_warnings?.length > 0) {
                        setAlerts([{
                            title: "Budget Exceeded",
                            description: `${data.data.budget_warnings.length} expense category(s) budget exceeded.`,
                        }])
                    }
                    if (data.data.low_stock_products?.length > 0) {
                        setAlerts(prev => [...prev, {
                            title: "Low Stock",
                            description: `${data.data.low_stock_products.length} product(s) are low on stock.`,
                        }])
                    }
                } else {
                    throw new Error('"Failed to fetch alerts"')
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to fetch alerts")
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    return (
        <>
            <Alerts data={alerts} />
            {
                user && (user.role == "admin" || user.role == "superadmin") &&
                <QuickCards />
            }
            <section className="flex flex-col xl:grid grid-cols-2 my-4 gap-4">
                <div className="col-span-1 px-4 border-2 h-80 rounded-lg overflow-hidden space-y-2 py-2">
                    <h1 className=" font-semibold text-xl text-destructive">Low Budget</h1>
                    <LowBudget data={budgetWarnings} loading={loading} />
                </div>
                <div className="col-span-1 px-4 border-2 h-80 rounded-lg overflow-hidden space-y-2 py-2">
                    <h1 className=" font-semibold text-xl text-destructive">Low Stock</h1>
                    <LowStock data={stockWarnings} loading={loading} />
                </div>
                {
                    user && (user.role == "admin" || user.role == "superadmin") && <div className="col-span-2">
                        <ExpenseIncomeChart />
                    </div>
                }
            </section>
        </>
    )
}

export default ChartAndAlerts