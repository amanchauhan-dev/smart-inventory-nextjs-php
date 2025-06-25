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
import { Income } from '@/validations/income'
import { toast } from 'sonner'
import api from '@/lib/axios'
import { useRefresh } from '../_components/use-refresh'
import { formatCurrency } from '@/lib/utils'
import { UpdateIncomeDialogForm } from './income-update-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteAlert } from '@/components/shared/delete-alert'
import Loader from '@/components/loader'
import TablePagination from '@/components/table-pagination'
import { usePagination } from '@/hooks/usePagination'
import { AddIncomeDialogForm } from '../_components/add-income-dialog-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DownloadCSVButton from '@/components/download-csv'
import { IncomeCategory } from '@/validations/income-category'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const colSpan = 7

function IncomeTable() {
    const [data, setData] = useState<Income[]>([])
    const { refreshIncomesFlag, refreshIncomes } = useRefresh()
    const [dataToUpdate, setDataToUpdate] = useState<Income | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [deletLoading, setDeleteLoading] = useState<boolean>(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const { page, setPage, totalPages, offset, limit, setTotalRecords } = usePagination({ Limit: 10 })
    const [dateFrom, setDateFrom] = useState<Date>(new Date((new Date).getFullYear(), (new Date).getMonth(), 1))
    const [dateTo, setDateTo] = useState<Date>(new Date())
    const [categories, setCategories] = useState<IncomeCategory[]>([])
    const [cat, setCat] = useState<string>('all')

    // Format date
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), 'MMM dd, yyyy')
    }

    // fetch datat
    useEffect(() => {
        ; (async () => {
            setLoading(true);
            try {
                if (cat == 'all') {
                    setCat("")
                }
                const { data, status } = await api.get(`/incomes?date_from=${format(dateFrom, "yyyy-MM-dd")}&date_to=${format(dateTo, "yyyy-MM-dd")}&offset=${offset}&limit=${limit}&category_id=${cat}`)
                if (status == 200) {
                    setData(data?.data?.incomes)
                    setTotalRecords(data?.data?.count)
                } else {
                    toast.error('Failed to load income data')
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load incomes")
            } finally {
                setLoading(false);
            }
        })()
    }, [refreshIncomesFlag, offset, limit, setTotalRecords, dateFrom, dateTo, cat])


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/income-categories')
                setCategories(data.data.categories)
            } catch (error: any) {
                toast.error(error.message || 'Failed to load categories')
            }
        }
        fetchCategories()
    }, [])

    // csv data
    const fetchCSV = async () => {
        return await api.get(`/incomes?date_from=${format(dateFrom, "yyyy-MM-dd")}&date_to=${format(dateTo, "yyyy-MM-dd")}`)
    }

    const onUpdate = (data: Income) => {
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
            const { data, status } = await api.delete(`/incomes/${idToDelete}`)
            if (status == 200) {
                toast.success(data.message || "Deleted");
                refreshIncomes()
            } else {
                toast.error(data.message || "Failed to delete")
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete income")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <>
            <div className='mb-2 gap-2 flex items-center flex-wrap'>
                <div>
                    <AddIncomeDialogForm />
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
                    <Input id='dateFrom' className='border-0 !bg-transparent  focus-visible:ring-0' type='date' value={format(dateFrom, "yyyy-MM-dd")} onChange={(e) => setDateFrom(new Date(e.target.value))} />
                </div>
                <div className='max-w-48 flex items-center border-2 bg-muted/50 rounded-lg px-2'>
                    <Label htmlFor='dateTo'>To</Label>
                    <Input max={format(new Date(), "yyyy-MM-dd")} id='dateTo' className='border-0 !bg-transparent focus-visible:ring-0' type='date' value={format(dateTo, "yyyy-MM-dd")} onChange={(e) => setDateTo(new Date(e.target.value))} />
                </div>
                <div>
                    <DownloadCSVButton fileName={`${format(dateFrom, "yyyy-MM-dd")}-${format(dateFrom, "yyyy-MM-dd")}-incomes`} fetch={fetchCSV} dataKey='incomes' />
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
                            : data && data.map((income) => (
                                <TableRow key={income.id}>
                                    <TableCell className="font-medium">{income.id}</TableCell>
                                    <TableCell>{formatDate(income.date)}</TableCell>
                                    <TableCell>{formatCurrency(income.amount.toString())}</TableCell>
                                    <TableCell>
                                        {income?.category || (
                                            <span className="text-muted-foreground">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {income.notes || (
                                            <span className="text-muted-foreground">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {income.created_at ? format(new Date(income?.created_at), 'MMM dd, yyyy HH:mm') : ""}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="icon" type='button' onClick={() => onUpdate(income)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" type='button' onClick={() => handleAlertDelete(income?.id || null)}>
                                                {deletLoading && idToDelete === income.id ? <Loader /> : <Trash2 className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <TablePagination colSpan={colSpan} totalPages={totalPages} page={page} setPage={setPage} />
                </Table>
                <UpdateIncomeDialogForm refresh={refreshIncomes} open={openUpdate} setOpen={setOpenUpdate} data={dataToUpdate} />
                <DeleteAlert open={openAlert} setOpen={setOpenAlert} onAgree={handleDelete} />
            </div>
        </>
    )
}

export default IncomeTable