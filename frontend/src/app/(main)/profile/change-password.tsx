'use client'
import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import api from '@/lib/axios'
import Loader from '@/components/loader'
import PasswordInput from '@/components/password-input'

const Schema = z.object({
    currentPassword: z.string().min(8, 'Current password is required'),
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


type FormValues = z.infer<typeof Schema>

function ChangePassword() {
    const [loading, setLaoding] = useState<boolean>(false)
    const form = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            currentPassword: "",
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: FormValues) => {
        setLaoding(true)
        try {
            const { status, data } = await api.post("/update-password", {
                currentPassword: values.currentPassword,
                newPassword: values.password
            })
            if (status === 200) {
                toast.success(data.message || "Password changed!")
            } else {
                throw new Error("Invalid Password")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to change password please try again later")
        } finally {
            setLaoding(false)
        }
    }

    return (
        <Form {...form}>
            <form className=' flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
                <h1 className='text-2xl font-bold flex items-center gap-2'>Change Password <Lock className='text-primary' size={20} /></h1>
                <div className=' flex items-center gap-3'>
                    <div className='flex flex-col gap-2 w-full'>
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            type="password"
                                            placeholder="Enter your current password"
                                            className="input input-bordered w-full"
                                            autoComplete='off'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>It is to verify it&apos;s you</FormDescription>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            type="password"
                                            placeholder="Enter your password"
                                            className="input input-bordered w-full"
                                            autoComplete='off'
                                        />
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
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            type="password"
                                            placeholder="Reenter your password"
                                            className="input input-bordered w-full"
                                            autoComplete='off'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>This is to make sure your enter correct password</FormDescription>
                                </FormItem>
                            )}
                        />
                        <Button disabled={loading}>
                            {
                                loading ? <Loader /> : "CHANGE PASSWORD"
                            }
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default ChangePassword
