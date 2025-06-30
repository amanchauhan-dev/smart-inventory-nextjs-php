"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import api from "@/lib/axios"
import Loader from "@/components/loader"
import { useAuth } from "@/hooks/use-auth"
import { Textarea } from "@/components/ui/textarea"
const FormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    address: z.string().min(10, {
        message: "Address must be at least 10 characters.",
    }),
})
function UpdateORG() {
    const { user, refreshUser } = useAuth()
    const [loading, setLaoding] = useState<boolean>(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: user?.org_name || '',
            address: user?.org_address || '',
        },
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setLaoding(true)
        try {
            const { status, data } = await api.put("/organisation", { ...values })

            if (status === 200) {
                toast.success(data.message || "Data updated!")
                refreshUser()
            } else {
                throw new Error("Something went wrong please try again later")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update please try again later")
        } finally {
            setLaoding(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bussiness Name</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>
                                This will be shown on the dashboard.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bussiness Address</FormLabel>
                            <FormControl>
                                <Textarea placeholder="" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading}>
                    {
                        loading ? <Loader /> : "UPDATE"
                    }
                </Button>
            </form>
        </Form>
    )
}

export default UpdateORG