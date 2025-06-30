'use client'

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
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
import { Expense } from '@/validations/expense'
import { UpdateExpenseDialogForm } from './expense-update-dialog'
import { ExpenseCategory } from '@/validations/expense-category'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddExpenseDialogForm } from '../_components/add-expense-dialog-form'
import { usePagination } from '@/hooks/usePagination'
import TablePagination from '@/components/table-pagination'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DownloadCSVButton from '@/components/download-csv'
import { addObject, deleteObjectById, updateObjectById } from '@/lib/data-manupulation'



const colSpan = 7

function ExpenseTable() {
    const [data, setData] = useState<Expense[]>([])
    const { refreshExpensesFlag } = useRefresh()
    const [dataToUpdate, setDataToUpdate] = useState<Expense | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [deletLoading, setDeleteLoading] = useState<boolean>(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const [categories, setCategories] = useState<ExpenseCategory[]>([])
    const [cat, setCat] = useState<string>('all')
    const [dateFrom, setDateFrom] = useState<Date | null>(null)
    const [dateTo, setDateTo] = useState<Date>(new Date())

    const { page, setPage, totalPages, offset, limit, setTotalRecords } = usePagination({ Limit: 10 })



    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy')
    }

    // fetch data
    useEffect(() => {
        ; (async () => {
            setLoading(true);
            try {
                if (cat == 'all') {
                    setCat("")
                }
                const { data, status } = await api.get(`/expenses?date_from=${dateFrom ? format(dateFrom, "yyyy-MM-dd") : ""}&date_to=${format(dateTo, "yyyy-MM-dd")}&category_id=${cat}&offset=${offset}&limit=${limit}`)
                if (status == 200) {
                    setData(data?.data?.expenses)
                    setTotalRecords(data?.data?.count)
                } else {
                    toast.error('Failed to load Expense data')
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to load Expenses")
            } finally {
                setLoading(false);
            }
        })()
    }, [refreshExpensesFlag, cat, offset, limit, setTotalRecords, dateFrom, dateTo])

    // fetch csv data
    const fetchCSV = async () => {
        return await api.get(`/expenses?date_from=${dateFrom ? format(dateFrom, "yyyy-MM-dd") : ''}&date_to=${format(dateTo, "yyyy-MM-dd")}&category_id=${cat.trim()}`)
    }

    const onUpdate = (data: Expense) => {
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
            const { data, status } = await api.delete(`/expenses/${idToDelete}`)
            if (status == 200) {
                toast.success(data.message || "Deleted");
                deleteObjectById(setData, idToDelete)
            } else {
                toast.error(data.message || "Failed to delete")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete Expense")
        } finally {
            setDeleteLoading(false)
        }
    }


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/expense-categories')
                setCategories(data.data.categories)
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Failed to load categories')
            }
        }
        fetchCategories()
    }, [])

    return (
        <>
            <div className='mb-2 gap-2 flex items-center flex-wrap'>
                <div>
                    <AddExpenseDialogForm addData={(x: Expense) =>
                        addObject(setData, x, "start")
                    } />
                </div>
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
                <div className='max-w-48 flex items-center border-2 bg-muted/50 rounded-lg px-2'>
                    <Label htmlFor='dateFrom'>From:</Label>
                    <Input id='dateFrom' className='border-0 !bg-transparent  focus-visible:ring-0' type='date' value={dateFrom ? format(dateFrom, "yyyy-MM-dd") : ""} onChange={(e) => setDateFrom(new Date(e.target.value))} />
                </div>
                <div className='max-w-48 flex items-center border-2 bg-muted/50 rounded-lg px-2'>
                    <Label htmlFor='dateTo'>To</Label>
                    <Input max={format(new Date(), "yyyy-MM-dd")} id='dateTo' className='border-0 !bg-transparent focus-visible:ring-0' type='date' value={format(dateTo, "yyyy-MM-dd")} onChange={(e) => setDateTo(new Date(e.target.value))} />
                </div>
                <div>
                    <DownloadCSVButton fileName={`${dateFrom ? format(dateFrom, "yyyy-MM-dd") : 'All'}-${format(dateTo, "yyyy-MM-dd")}-expenses`} fetch={fetchCSV} dataKey='expenses' />
                </div>
            </div>
            <div className="border rounded-lg overflow-hidden">

                <Table>
                    <TableHeader className="bg-secondary">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Created At</TableHead>
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
                                    <TableCell>{formatDate(item.date)}</TableCell>
                                    <TableCell>{item.amount && formatCurrency(item.amount.toString())}</TableCell>
                                    <TableCell>
                                        {item.category || (
                                            <span className="text-muted-foreground">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {item.notes || (
                                            <span className="text-muted-foreground">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {item.created_at ? format(new Date(item?.created_at), 'MMM dd, yyyy HH:mm') : ""}
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
                <UpdateExpenseDialogForm
                    updateData={(newData: Expense) => {
                        if (dataToUpdate) {
                            updateObjectById(setData, dataToUpdate.id, item => ({
                                ...item,
                                ...newData,
                            }));
                        }
                    }}
                    open={openUpdate} setOpen={setOpenUpdate} data={dataToUpdate} />
                <DeleteAlert open={openAlert} setOpen={setOpenAlert} onAgree={handleDelete} />
            </div>
        </>
    )
}

export default ExpenseTable