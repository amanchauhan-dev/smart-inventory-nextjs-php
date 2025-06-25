import React from 'react'
import IncomeTable from './table'
import { Metadata } from 'next';


export const metadata: Metadata = {
    title: "Products",
    description: "Welcome to the products page",
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