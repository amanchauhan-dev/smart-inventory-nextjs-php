'use client'

import React, { useState } from 'react'
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
import { toast } from 'sonner'
import Loader from '@/components/loader'
import { ChevronLeft } from 'lucide-react'

const Schema = z.object({
    otp: z.string().min(6, 'OTP is too short').refine((val) => {
        return /^\d{6}$/.test(val);
    }, {
        message: 'OTP must be a 6-digit number',
    }),
})

type SchemaType = z.infer<typeof Schema>

function OTPForm({ back }: { back: () => void }) {
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues: {
            otp: '',
        },
    })

    const onSubmit = async (values: SchemaType) => {
        try {
            setLoading(true)
            console.log(values);

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
            <Button type='button' size="sm" className='mb-4' onClick={back}><ChevronLeft /> Back</Button>
            <h2 className="text-2xl font-semibold mb-6">Email Verification</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                    <Input type='number' placeholder="234243" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader /> : "VERIFY OTP"}
                    </Button>
                    <div className='flex items-center'>
                        <p>Didn&apos;t received otp? </p>
                        <p className='text-primary hover:underline ml-2 cursor-pointer'>Resent</p>
                    </div>
                </form>
            </Form>
        </motion.div>
    )
}

export default OTPForm
