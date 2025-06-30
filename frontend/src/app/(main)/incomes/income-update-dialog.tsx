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
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import api from "@/lib/axios"
import Loader from "@/components/loader"
import { Income } from "@/validations/income"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IncomeCategory } from "@/validations/income-category"
// Define the form schema using Zod
const incomeFormSchema = z.object({
    amount: z.string().min(1, "Required").refine((val) => !isNaN(Number(val)), {
        message: "Amount must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Amount must be a positive number",
    }),
    date: z.date({
        required_error: "Date is required",
    }),
    category_id: z.string().min(1, {
        message: "Category is required",
    }),
    notes: z.string().optional(),
})

export function UpdateIncomeDialogForm({ data, open, setOpen, updateData }: { data: Income | null, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, updateData: (x: Income) => void }) {
    const id = useCallback(() => data?.id, [data])()
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<IncomeCategory[]>([])
    const form = useForm<z.infer<typeof incomeFormSchema>>({
        resolver: zodResolver(incomeFormSchema),
        defaultValues: {
            amount: data ? data.amount.toString() : "0",
            category_id: '',
            notes: data ? data.notes : '',
            date: data ? new Date(data.date) : new Date(),
        },
    })

    useEffect(() => {
        if (data) {
            form.reset({
                amount: data.amount.toString() || "0",
                category_id: data.category_id ? data.category_id.toString() : "",
                notes: data.notes || '',
                date: new Date(data.date),
            })
        }
    }, [data, form])

    useEffect(() => {
        if (open) {
            const fetchCategories = async () => {
                try {
                    const { data } = await api.get('/income-categories')
                    setCategories(data.data.categories)
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to load categories')
                }
            }
            fetchCategories()
        }
    }, [open])
    async function onSubmit(values: z.infer<typeof incomeFormSchema>) {
        setLoading(true)
        try {
            const { data, status } = await api.put('/incomes/' + id, { ...values, date: format(new Date(values.date), "yyyy-MM-dd") })
            if (status == 200) {

                toast.success(data?.message || 'Income Updated')
                updateData(data.data.income)
            } else {
                toast.success(data?.message || 'Failed to update income')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update income')
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
                    <DialogTitle>Update Income</DialogTitle>
                    <DialogDescription>
                        Change your income details. Click update when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="0.00"
                                            {...field}
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className="pl-3 text-left font-normal"
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value)}
                                        defaultValue={field.value.toString()}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Additional information"
                                            className="resize-none"
                                            {...field}
                                        />
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