'use client'

import React, { startTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Cookies from "js-cookie";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion } from "framer-motion"
import { ProgressBarLink, useProgressBar } from '@/contexts/progress-bar-provider'
import api from '@/lib/axios'
import { toast } from 'sonner'
import Loader from '@/components/loader'
import { useRouter } from 'next/navigation'
import PasswordInput from '@/components/password-input'

// Zod schema for login form
const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginSchema = z.infer<typeof loginSchema>

function LoginForm() {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const progress = useProgressBar()
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const onSubmit = async (values: LoginSchema) => {
        setLoading(true)
        try {
            const { data, status } = await api.post("/auth/login",
                {
                    email: values.email,
                    password: values.password
                }
            )
            if (status && status == 200) {
                Cookies.set('token', data.data.token.toString(), { expires: 7, path: '' })
                progress.start();
                startTransition(() => {
                    router.push("/dashboard")
                    progress.done();
                });
                toast.success("Login successful")
            } else {
                toast.error(data?.message || "Wrong credentials")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Login</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

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
                                    <PasswordInput placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader /> : "LOGIN"}
                    </Button>
                    <div className='flex items-center gap-2'>
                        <p>Don&apos;t have an account </p>
                        <ProgressBarLink href={'/register'} className="underline">register</ProgressBarLink>
                    </div>
                </form>
            </Form>
        </motion.div>
    )
}

export default LoginForm
