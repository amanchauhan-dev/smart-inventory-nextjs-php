import React from 'react'
import IncomeTable from './table'
import { CreateDialogForm } from './create-dialog'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Product Categories",
    description: "Welcome to the product categories page",
};

function page() {
    return (
        <main className='px-4 md:px-6 my-4 space-y-4'>
            <section className='flex justify-start items-center'>
                <div>
                    <CreateDialogForm />
                </div>
            </section>
            <section>
                <IncomeTable />
            </section>
        </main>
    )
}

export default page