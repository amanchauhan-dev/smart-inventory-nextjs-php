import React from 'react'
import Table from './table'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Product Categories",
    description: "Welcome to the product categories page",
};

function page() {
    return (
        <main className='px-4 md:px-6 my-4 space-y-4'>

            <section>
                <Table />
            </section>
        </main>
    )
}

export default page