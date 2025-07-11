'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"
import api from "@/lib/axios"
import Loader from "@/components/loader"
import { IncomeCategory } from "@/validations/income-category"

// Define the form schema using Zod
const Schema = z.object({
    name: z.string().min(3, "Category name must contain at least 3 character(s)"),
})

export function CreateDialogForm({ addData }: { addData: (x: IncomeCategory) => void }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: '',
        },
    })


    async function onSubmit(values: z.infer<typeof Schema>) {
        setLoading(true)
        try {
            const { data, status } = await api.post('/income-categories', { ...values })
            if (status == 201) {
                toast.success(data?.message || 'Created')
                addData(data.data.category)
                form.reset()
            } else {
                toast.success(data?.message || 'Failed to create')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    ADD
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Expense Category</DialogTitle>
                    <DialogDescription>
                        Record your catgory details. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name of category" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button disabled={loading} type="submit">
                                {loading ? <Loader /> : "ADD"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}