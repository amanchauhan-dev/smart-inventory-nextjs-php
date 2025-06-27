'use client'

import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProgressBarLink } from '@/contexts/progress-bar-provider'
import Loader from '@/components/loader'
import { Textarea } from '@/components/ui/textarea'
import { SignupSchema } from './forms'
import PasswordInput from '@/components/password-input'


function SignupForm({ form, sendMail }: { form: UseFormReturn<SignupSchema>, sendMail: () => Promise<any> }) {
    const [loading, setLoading] = useState<boolean>(false)

    const onSubmit = async () => {
        setLoading(true)
        await sendMail()
        setLoading(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto my-10 p-6 border rounded-lg shadow-sm"
        >
            <h2 className="text-2xl font-semibold mb-6 text-primary">Register A New Organisation</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4  max-h-[80svh]">
                    <div className="space-y-5">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organisation Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your bussiness name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bussiness Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Organisation Address</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="ywrite address here..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>Minimum 10 characters long.</FormDescription>
                                </FormItem>
                            )}
                        />

                    </div >
                    <div className="space-y-5">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Owner Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput type="password" placeholder="••••••••" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>Minimum 8 char(s), include uppercase, lowercase and number</FormDescription>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput type="password" placeholder="••••••••" {...field} autoComplete='off' />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>This is to make sure your enter correct password</FormDescription>
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? <Loader /> : "REGISTER"}
                        </Button>
                    </div>
                    <div className='flex items-center'>
                        <p>Already have an account? </p>
                        <ProgressBarLink href={'/login'} className="underline ml-2">login</ProgressBarLink>
                    </div>
                </form>
            </Form>
        </motion.div>
    )
}

export default SignupForm
