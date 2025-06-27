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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useState, useEffect, Dispatch, SetStateAction, useCallback } from "react"
import api from "@/lib/axios"
import Loader from "@/components/loader"
import { useRefresh } from "../_components/use-refresh"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Product } from "@/validations/product"

// Define the form schema using Zod
const ProductSchema = z.object({
    name: z.string().min(3, "Product name must contain at least 3 character(s)"),
    category_id: z.string().min(1, "Category is required"),
    quantity: z.string().min(1, "Quantity is equired").refine((val) => !isNaN(Number(val)), {
        message: "Quantity must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Quantity must be a positive number",
    }),
    threshold: z.string().min(1, "Threshold is required").refine((val) => !isNaN(Number(val)), {
        message: "Threshold must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Threshold must be a positive number",
    }),
    price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)), {
        message: "Price must be a number",
    }).refine((val) => Number(val) >= 0, {
        message: "Price must be a positive number",
    }),
    supplier: z.string().optional(),
    notes: z.string().optional(),
})

interface ProductCategory {
    id: number
    name: string
}

export function UpdateProductDialogForm({ data, open, setOpen }: { data: Product | null, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<ProductCategory[]>([])
    const { refreshProducts } = useRefresh()
    const id = useCallback(() => data?.id, [data])()
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            name: '',
            category_id: '',
            quantity: '',
            threshold: '',
            price: '',
            supplier: '',
            notes: '',
        },
    })

    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                category_id: data.category_id?.toString(),
                quantity: data.quantity.toString(),
                threshold: data.threshold.toString(),
                price: Number(data.price).toString(),
                supplier: data.supplier ?? '',
                notes: data.notes ?? '',
            })
        }
    }, [data, form])

    // Fetch categories when dialog opens
    useEffect(() => {
        if (open) {
            const fetchCategories = async () => {
                try {
                    const { data } = await api.get('/product-categories')
                    setCategories(data.data.categories)
                } catch (error: any) {
                    toast.error(error.response?.data?.message || 'Failed to load categories')
                }
            }
            fetchCategories()
        }
    }, [open])

    async function onSubmit(values: z.infer<typeof ProductSchema>) {
        setLoading(true)
        try {
            const { data, status } = await api.put('/products/' + id, values)
            if (status === 200) {
                toast.success(data?.message || 'Product updated successfully')
                refreshProducts()
                form.reset()
                setOpen(false)
            } else {
                toast.error(data?.message || 'Failed to updated product')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update Product</DialogTitle>
                    <DialogDescription>
                        Enter product details. Click update when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Product name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Category*</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a category" className="w-full" />
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
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity*</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter quantity"
                                                min="0"
                                                {...field}
                                                value={field.value.toString()}
                                                onChange={(e) => field.onChange(e.target.value.toString())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="threshold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Low Stock Threshold</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter threshold quantity"
                                                min="0"
                                                {...field}
                                                value={field.value.toString()}
                                                onChange={(e) => field.onChange(e.target.value.toString())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price*</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Enter price (Rupees)"
                                                min="0"
                                                {...field}
                                                value={field.value.toString()}
                                                onChange={(e) => field.onChange(e.target.value.toString())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="supplier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Supplier</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Supplier name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
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