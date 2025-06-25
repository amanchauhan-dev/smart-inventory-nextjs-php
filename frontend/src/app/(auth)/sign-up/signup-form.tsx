'use client'

import React, { startTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProgressBarLink, useProgressBar } from '@/contexts/progress-bar-provider'
import api from '@/lib/axios'
import { toast } from 'sonner'
import Loader from '@/components/loader'
import { useRouter } from 'next/navigation'

const signupSchema = z
    .object({
        name: z.string().min(2, 'Name is too short'),
        email: z.string().email('Invalid email'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(/[a-z]/, 'Must include a lowercase letter')
            .regex(/[A-Z]/, 'Must include an uppercase letter')
            .regex(/[0-9]/, 'Must include a number'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

type SignupSchema = z.infer<typeof signupSchema>

function SignupForm() {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const progress = useProgressBar()
    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: SignupSchema) => {
        try {
            setLoading(true)
            const { data, status } = await api.post("/register", {
                ...values
            })
            if (status == 201) {
                progress.start();
                startTransition(() => {
                    router.push("/login")
                    progress.done();
                });
                toast.success("Account created successfully")
            } else {
                toast.error(data?.message || "Wrong credentials")
            }
        } catch (error: any) {
            toast.error(error?.message || "Unable to sign up")
        } finally {
            setLoading(true)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto my-10 p-6 border rounded-lg shadow-sm"
        >
            <h2 className="text-2xl font-semibold mb-6">Sign up</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
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
                                    <Input type="password" placeholder="••••••••" {...field} autoComplete='off' />
                                </FormControl>
                                <FormMessage />
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
                                    <Input type="password" placeholder="••••••••" {...field} autoComplete='off' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader /> : "CREATE ACCOUNT"}
                    </Button>
                    <div className='flex items-center'>
                        <p>Already have an account? </p>
                        <ProgressBarLink href={'/login'} className="underline ml-2">Login</ProgressBarLink>
                    </div>
                </form>
            </Form>
        </motion.div>
    )
}

export default SignupForm
