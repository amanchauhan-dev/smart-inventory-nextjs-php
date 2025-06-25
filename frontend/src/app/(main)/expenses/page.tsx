import React from 'react'
import ExpenseTable from './expense-table'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Expenses",
    description: "Welcome to the expense page",
};

function page() {
    return (
        <main className='px-4 md:px-6 my-4 space-y-4'>
            <section>
                <ExpenseTable />
            </section>
        </main>
    )
}

export default page