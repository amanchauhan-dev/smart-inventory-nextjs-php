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
import { UpdateDialogForm } from './update-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { DeleteAlert } from '@/components/shared/delete-alert'
import Loader from '@/components/loader'
import { ProductCategory } from '@/validations/product-category'
import { usePagination } from '@/hooks/usePagination'
import TablePagination from '@/components/table-pagination'



const colSpan = 3

function ExpenseCategoryTable() {
    const [data, setData] = useState<ProductCategory[]>([])
    const { refreshExpensesCategories, refreshExpensesCategoriesFlag } = useRefresh()
    const [dataToUpdate, setDataToUpdate] = useState<ProductCategory | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [deletLoading, setDeleteLoading] = useState<boolean>(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const { page, setPage, totalPages, offset, limit, setTotalRecords } = usePagination({ Limit: 10 })


    // fetch datat
    useEffect(() => {
        ; (async () => {
            setLoading(true);
            try {
                const { data, status } = await api.get(`/product-categories?offset=${offset}&limit=${limit}`)
                if (status == 200) {
                    setData(data?.data?.categories)
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
    }, [refreshExpensesCategoriesFlag, setTotalRecords, limit, offset])


    const onUpdate = (data: ProductCategory) => {
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
            const { data, status } = await api.delete(`/product-categories/${idToDelete}`)
            if (status == 200) {
                toast.success(data.message || "Deleted");
                refreshExpensesCategories()
            } else {
                toast.error(data.message || "Failed to delete")
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete ")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader className="bg-secondary">
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
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
            <UpdateDialogForm refresh={refreshExpensesCategories} open={openUpdate} setOpen={setOpenUpdate} data={dataToUpdate} />
            <DeleteAlert open={openAlert} setOpen={setOpenAlert} onAgree={handleDelete} />
        </div>
    )
}

export default ExpenseCategoryTable