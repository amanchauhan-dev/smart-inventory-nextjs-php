import React from 'react'
import IncomeTable from './income-table'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Incomes",
    description: "Welcome to the income page",
};

function page() {
    return (
        <main className='px-4 md:px-6 my-4 space-y-4'>

            <section>
                <IncomeTable />
            </section>
        </main>
    )
}

export default page