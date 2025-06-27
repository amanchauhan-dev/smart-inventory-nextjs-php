'use client'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Mail } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { emailSendOTP } from '@/lib/emailjs'
import Loader from '@/components/loader'
import api from '@/lib/axios'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Cookies from "js-cookie"

const Schema = z.object({
    email: z.string().email('Invalid email address'),
})


type FormValues = z.infer<typeof Schema>

function ChangePassword() {
    const { user } = useAuth()
    const [GenOTP1, setGenOTP1] = useState<string>('')
    const [GenOTP2, setGenOTP2] = useState<string>('')
    const [OTP1, setOTP1] = useState<string>('')
    const [OTP2, setOTP2] = useState<string>('')
    const [OTP1Error, setOTP1Error] = useState<string | null>(null)
    const [OTP2Error, setOTP2Error] = useState<string | null>(null)

    const [otpSent, setOtpSent] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [openAlert, setOpenAlert] = useState<boolean>(false)



    const form = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            email: '',
        },
    })

    const checkOTP = async () => {
        setLoading(true)
        try {
            let error = 0;
            if (OTP1 !== GenOTP1) {
                setOTP1Error("Incorrect OTP")
                error++
            }
            if (OTP2 !== GenOTP2) {
                setOTP2Error("Incorrect OTP")
                error++
            }
            if (error > 0) {
                return
            }
            const { status } = await api.post('/update-email', { email: form.getValues("email") })
            if (status === 200) {
                toast.success("Email changed succeessfully");
                Cookies.set("token", "", { expires: new Date(-1) })
                setOpenAlert(true)

            } else {
                toast.error("failed to change email please try again later");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to change email')
        } finally {
            setLoading(false)
        }
    }



    const onSubmit = async (values: FormValues) => {
        if (!user?.email) {
            return
        }
        if (user.email === values.email) {
            form.setError("email", { message: "Please enter new email" })
            return
        }
        setLoading(true)
        try {
            const { status, data } = await api.post("/check-email", { email: values.email });
            if (status == 200 && data.data.success === false) {
                form.setError("email", { message: "Email is already in use" })
                return
            }

            const otp1 = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0');
            const otp2 = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0');
            setGenOTP1(otp1)
            setGenOTP2(otp2)
            const res1 = await emailSendOTP({ to: user.email, otp: otp1 })
            const res2 = await emailSendOTP({ to: values.email, otp: otp2 })

            if (res1.success && res2.success) {
                toast.success("OTP sent")
                setOtpSent(true)
            }
            else {
                toast.error("Failed to send OTP")
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to send OTP")
        } finally {
            setLoading(false)
        }

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
                                            type="email"
                                            disabled={otpSent}
                                            placeholder="Enter your new email"
                                            className="input input-bordered w-full"
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
                                disabled={!otpSent}
                                type="number"
                                value={OTP1}
                                onChange={e => setOTP1(e.target.value)}
                                placeholder="Enter OTP 1"
                                className="input input-bordered w-full"
                                autoComplete='off'
                            />
                            <p className='text-sm text-muted-foreground'>An otp is sent to {user?.email}.</p>
                            {OTP1Error && <p className='text-destructive text-sm'>{OTP1Error}</p>}
                        </div>
                        <div className='space-y-2'>
                            <Label>OTP 2</Label>
                            <Input
                                disabled={!otpSent}
                                type="number"
                                placeholder="Enter OTP 1"
                                value={OTP2}
                                onChange={e => setOTP2(e.target.value)}
                                className="input input-bordered w-full"
                                autoComplete='off'
                            />
                            <p className='text-sm text-muted-foreground'>An otp is sent to {form.getValues("email")}</p>
                            {OTP2Error && <p className='text-destructive text-sm'>{OTP2Error}</p>}
                        </div>
                        {
                            otpSent ?
                                <Button onClick={checkOTP} type='button' disabled={loading}>
                                    {loading ? <Loader /> : "VERIFY OTP"}
                                </Button>
                                : <Button type="submit" disabled={loading}>
                                    {loading ? <Loader /> : "CHANGE EMAIL"}
                                </Button>
                        }
                    </div>
                </div>
            </form>
            <AlertLogin open={openAlert} setOpen={setOpenAlert} />
        </Form>
    )
}

export default ChangePassword






export function AlertLogin({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const { logout } = useAuth()

    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger asChild>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Email Changed Successfully!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Please login again with the new email. This is to ensure that your data stays consistent and secure.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={logout}>Login</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}