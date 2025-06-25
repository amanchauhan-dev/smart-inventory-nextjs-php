import React from 'react'
import LoginForm from './login-form'
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Welcome to the sign-up page",
};
function page() {
    return (
        <main>
            <div
                className='mt-20'>
                <h1 className='text-2xl font-bold text-center'>Smart Inventory</h1>
                <p className='text-center text-muted-foreground text-sm'>Welcome back! Please sign in to access your dashboard.
                </p>
            </div>
            <LoginForm />
        </main>
    )
}

export default page