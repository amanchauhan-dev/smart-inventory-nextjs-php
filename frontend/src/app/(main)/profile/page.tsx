import React from 'react'
import Show from './show'
import ChangeBasics from './change-basics'
import { Separator } from '@/components/ui/separator'
import ChangePassword from './change-password'
import ChangeEmail from './change-email'

function page() {
    return (
        <main className='px-2 sm:px-4 my-4 flex w-full grow'>
            <section className='p-4 pt-0 bg-muted/20 rounded-lg w-full shadow-md space-y-6'>
                <Show />
                <Separator />
                <ChangeBasics />
                <Separator />
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 '>
                    <ChangePassword />
                    <ChangeEmail />
                </div>
            </section>
        </main>
    )
}

export default page