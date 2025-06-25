'use client'

import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { useRefresh } from '../_components/use-refresh'
import { formatCurrency } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteAlert } from '@/components/shared/delete-alert'
import Loader from '@/components/loader'
import { Product } from '@/validations/product'
import { UpdateProductDialogForm } from './update-dialog'
import { CreateProductDialogForm } from './create-dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ProductCategory } from '@/validations/product-category'
import { Checkbox } from '@/components/ui/checkbox'
import { usePagination } from '@/hooks/usePagination'
import TablePagination from '@/components/table-pagination'
import { Badge } from '@/components/ui/badge'
import SearchBox from '@/components/search-box'


const colSpan = 8

function ExpenseCategoryTable() {
    const [data, setData] = useState<Product[]>([])
    const { refreshProducts, refreshProductsFlag } = useRefresh()
    const [dataToUpdate, setDataToUpdate] = useState<Product | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [deletLoading, setDeleteLoading] = useState<boolean>(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const [categories, setCategories] = useState<ProductCategory[]>([])
    const [cat, setCat] = useState<string>('all')
    const [lowStock, setLowStock] = useState<boolean>(false)
    const { page, setPage, totalPages, offset, limit, setTotalRecords } = usePagination({ Limit: 10 })
    const [search, setSearch] = useState<string>('')

    // fetch datat
    useEffect(() => {
        ; (async () => {
            setLoading(true);
            if (cat == 'all') {
                setCat("")
            }
            try {
                const { data, status } = await api.get(`/products?category_id=${cat.trim()}&low_stock=${lowStock.toString()}&offset=${offset}&limit=${limit}&search=${search}`)
                if (status == 200) {
                    setData(data?.data?.products)
                    setTotalRecords(data?.data?.count)
                } else {
                    toast.error('Failed to load data')
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load")
            } finally {
                setLoading(false);
            }
        })()
    }, [refreshProductsFlag, cat, lowStock, setTotalRecords, limit, offset, search])


    const onUpdate = (data: Product) => {
        setDataToUpdate(data)
        setOpenUpdate(true)
    }


    const handleAlertDelete = (id: number | null) => {
        setIdToDelete(id);
        setOpenAlert(true);
    }

    const handleDelete = async () => {
        if (!idToDelete) {
            return
        }
        setDeleteLoading(true)
        setOpenAlert(false)
        try {
            const { data, status } = await api.delete(`/products/${idToDelete}`)
            if (status == 200) {
                toast.success(data.message || "Deleted");
                refreshProducts()
            } else {
                toast.error(data.message || "Failed to delete")
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete ")
        } finally {
            setDeleteLoading(false)
        }
    }
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/product-categories')
                setCategories(data.data.categories)
            } catch (error: any) {
                toast.error(error.message || 'Failed to load categories')
            }
        }
        fetchCategories()
    }, [])
    return (
        <>
            <section className='flex justify-start gap-2 mb-2 items-center'>
                <div>
                    <CreateProductDialogForm />
                </div>
                <div>
                    <Select
                        onValueChange={(value) => setCat(value)}
                        defaultValue={cat}
                    >
                        <SelectTrigger className="min-w-40">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                value={'all'}
                            >
                                All
                            </SelectItem>
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
                </div>
                <div className='flex items-center gap-2 border p-2 py-1 rounded-md'>
                    <label htmlFor='low_stock'>Low Stock</label>
                    <Checkbox checked={lowStock} onClick={() => setLowStock(!lowStock)} id='low_stock' />
                </div>
            </section>
            <div>
                <SearchBox search={search} setSearch={setSearch} />
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-secondary">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Threshold</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={colSpan}>
                                    <Skeleton className={`w-full `} style={{ height: limit * 40 }} />
                                </TableCell>
                            </TableRow>
                        )
                            : data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.category}</TableCell>
                                    <TableCell>{formatCurrency(item.price)}</TableCell>
                                    <TableCell>
                                        <Badge variant={"outline"}>
                                            {item.quantity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={"outline"}>
                                            {item.threshold}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.quantity <= item.threshold ? 'destructive' : 'default'}>
                                            {item.quantity <= item.threshold ? 'Low Stock' : 'In Stock'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="icon" type='button' onClick={() => onUpdate(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" type='button' onClick={() => handleAlertDelete(item?.id || null)}>
                                                {deletLoading && idToDelete === item.id ? <Loader /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <TablePagination colSpan={colSpan} totalPages={totalPages} page={page} setPage={setPage} />
                </Table>
                <UpdateProductDialogForm open={openUpdate} setOpen={setOpenUpdate} data={dataToUpdate} />
                <DeleteAlert open={openAlert} setOpen={setOpenAlert} onAgree={handleDelete} />
            </div>
        </>
    )
}

export default ExpenseCategoryTable