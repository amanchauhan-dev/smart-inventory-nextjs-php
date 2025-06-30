import React from 'react'
import UpdateORG from './update-org'

function page() {
    return (
        <main className='px-2 sm:px-4 my-4 flex w-full grow'>
            <section className='p-4 pt-0 bg-muted/20 rounded-lg w-full shadow-md space-y-6'>
                <UpdateORG />
            </section>
        </main>
    )
}

export default page