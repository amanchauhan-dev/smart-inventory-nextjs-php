'use client'
import emailjs from '@emailjs/browser'

export const emailSendOTP = async ({ otp, to }: { otp: string, to: string }): Promise<{ success: boolean; message: string }> => {
    try {
        const res = await emailjs.send(
            process.env.NEXT_PUBLIC_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAIL_VERIFY_TEMPLATE_ID!,
            {
                brandName: process.env.NEXT_PUBLIC_APP_NAME,
                otp: otp.toString(),
                to: to.toString()
            },
            process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY!
        )
        if (res.status === 200) {
            return { success: true, message: 'Email sent successfully' }
        } else {
            return { success: false, message: 'Failed to send email' }
        }
    } catch (error) {
        console.error('EmailJS error:', error)
        return { success: false, message: 'Something went wrong' }
    }
}