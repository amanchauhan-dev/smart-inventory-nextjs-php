import React from 'react'
import { Metadata } from 'next';
import Forms from './forms';

export const metadata: Metadata = {
    title: "Login",
    description: "Welcome to the login page",
};

function page() {
    return (
        <main>
            <div
                className='mt-20'>
                <h1 className='text-2xl font-bold text-center'>Smart Inventory</h1>
                <p className='text-center text-muted-foreground text-sm'>Welcome user! Please sign up to access your dashboard.
                </p>
            </div>
            <Forms />
        </main>
    )
}

export default page