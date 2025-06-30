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
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import api from "@/lib/axios"
import Loader from "@/components/loader"
import { IncomeCategory } from "@/validations/income-category"

// Define the form schema using Zod
const Schema = z.object({
    id: z.number(),
    name: z.string().min(3),
})

export function UpdateDialogForm({ data, open, setOpen, updateData }: { data: IncomeCategory | null, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, updateData: (x: IncomeCategory) => void }) {
    const id = useCallback(() => data?.id, [data])()
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        defaultValues: {
            id: data?.id,
            name: data ? data.name : '',
        },
    })
    useEffect(() => {
        if (data) {
            form.reset({
                id: data?.id,
                name: data.name,
            })
        }
    }, [data, form])

    async function onSubmit(values: z.infer<typeof Schema>) {
        setLoading(true)
        try {
            const { data, status } = await api.put('/income-categories/' + id, { ...values })
            if (status == 200) {
                toast.success(data?.message || 'Updated')
                updateData(data.data.category)
            } else {
                toast.success(data?.message || 'Failed to update')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Income Category</DialogTitle>
                    <DialogDescription>
                        Change your category details. Click update when you&apos;re done.
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
                                {loading ? <Loader /> : "UPDATE"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}