'use client'

import { startTransition, useState } from "react"
import OTPForm from "./otp-form"
import SignupForm from "./signup-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useProgressBar } from "@/contexts/progress-bar-provider"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { emailSendOTP } from "@/lib/emailjs"

export const signupSchema = z
    .object({
        name: z.string().min(2, 'Organisation name is too short'),
        address: z.string().min(10, 'Organisation address is too short'),
        username: z.string().min(2, 'Name is too short'),
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

export type SignupSchema = z.infer<typeof signupSchema>

function Forms() {
    const [formState, setFormState] = useState<"otp" | "signup">('signup')
    const [loading, setLoading] = useState<boolean>(false)
    const [OTP, setOTP] = useState<string | null>()
    const router = useRouter()
    const progress = useProgressBar()
    const form = useForm<SignupSchema>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            name: "",
            address: ""
        },
    })


    // register user

    const onRegister = async () => {
        try {
            setLoading(true)
            const { data, status } = await api.post("/auth/register", {
                ...form.getValues()
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
            toast.error(error.response?.data?.message || "Unable to sign up")
        } finally {
            setLoading(true)
        }
    }

    // send otp

    const sendEmail = async () => {
        try {
            const values = form.getValues()

            const { status, data } = await api.post("/check-email", { email: values.email });

            if (status == 200 && data.data.success === false) {
                form.setError("email", { message: "Email is already in use" })
                return
            }

            const otp = (Math.floor(Math.random() * 1000000)).toString().padStart(6, '0');
            setOTP(otp)
            const res = await emailSendOTP({ to: values.email, otp })
            if (res.success) {
                toast.success("OTP sent")
                setFormState('otp')
            }
            else {
                toast.error("Failed to send OTP")
            }
            setLoading(false)
        } catch (error: any) {
            if (error.message) {
                toast.error(error.message || "Failed to send OTP")

            } else {
                toast.error(error.response?.data?.message || "Failed to send OTP")
            }
        }
    }


    const verifyOTP = async (otp: string) => {
        try {
            if (!OTP) {
                return toast.error("OTP not found please try again")
            }
            if (OTP === otp) {
                await onRegister()
            } else {
                toast.error("Invalid OTP")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create account please try again later")
        }
    }

    // forms

    if (formState === 'otp') {
        return <OTPForm back={() => { setFormState("signup") }} onSubmit={verifyOTP} loading={loading} />
    }
    else {
        return <SignupForm form={form} sendMail={sendEmail} />
    }
}

export default Forms