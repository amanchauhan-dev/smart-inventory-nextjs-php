import React from 'react'
import ExpenseChart from './income-chart'
import BudgetExpense from './budget-expense'
import ExpenseIncomeChart from './expense-income-chart'

function page() {
    return (
        <main className="px-4 md:px-6 py-4 space-y-4">
            <section className='grid grid-cols-1 lg:grid-cols-2 gap-4 '>
                <ExpenseChart />
                <BudgetExpense />
            </section>
            <section>
                <ExpenseIncomeChart />
            </section>
        </main>
    )
}

export default page