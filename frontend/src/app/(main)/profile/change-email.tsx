'use client'
import React from 'react'
import { Mail } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'

const Schema = z.object({
    email: z.string().email('Invalid email address'),
})


type FormValues = z.infer<typeof Schema>

function ChangePassword() {
    const { user } = useAuth()
    const form = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            email: '',
        },
    })


    const onSubmit = (data: FormValues) => {
        console.log("Form submitted with data:", data);
        // Here you would typically send the data to your backend API to update the user profile
    }

    return (
        <Form {...form}>
            <form className=' flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
                <h1 className='text-2xl font-bold flex items-center gap-2'>Change Email <Mail className='text-primary' size={20} /></h1>
                <div className=' flex items-center gap-3'>
                    <div className='flex flex-col gap-2 w-full'>
                        <div className='space-y-2'>
                            <Label>Active Email</Label>
                            <Input
                                type="text"
                                defaultValue={user?.email || ''}
                                disabled
                                className="input input-bordered w-full"
                                autoComplete='off'
                            />
                            <p className='text-sm text-muted-foreground'>An otp is sent to your old email.</p>
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Enter your new email"
                                            className="input input-bordered w-full"
                                            autoComplete='off'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>This is to make sure your enter correct email</FormDescription>
                                </FormItem>
                            )}
                        />
                        <div className='space-y-2'>
                            <Label>OTP 1</Label>
                            <Input
                                type="number"
                                placeholder="Enter OTP 1"
                                className="input input-bordered w-full"
                                autoComplete='off'
                            />
                            <p className='text-sm text-muted-foreground'>An otp is sent to your old email.</p>
                        </div>
                        <div className='space-y-2'>
                            <Label>OTP 2</Label>
                            <Input
                                type="number"
                                placeholder="Enter OTP 1"
                                className="input input-bordered w-full"
                                autoComplete='off'
                            />
                            <p className='text-sm text-muted-foreground'>An otp is sent to your new email.</p>
                        </div>
                        <Button>SUBMIT</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default ChangePassword
