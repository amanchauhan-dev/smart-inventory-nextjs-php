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
import { usePagination } from '@/hooks/usePagination'
import TablePagination from '@/components/table-pagination'
import { User } from '@/validations/user'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SearchBox from '@/components/search-box'
import { CreateDialogForm } from './create-dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAuth } from '@/hooks/use-auth'
import { addObject, deleteObjectById, updateObjectById } from '@/lib/data-manupulation'


const colSpan = 7

function UserTable() {
    const [data, setData] = useState<User[]>([])
    const { refreshUsersFlag } = useRefresh()
    const [dataToUpdate, setDataToUpdate] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [openUpdate, setOpenUpdate] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [deletLoading, setDeleteLoading] = useState<boolean>(false)
    const [idToDelete, setIdToDelete] = useState<number | null>(null)
    const { page, setPage, totalPages, offset, limit, setTotalRecords } = usePagination({ Limit: 10 })
    const [search, setSearch] = useState<string>('')
    const [role, setRole] = useState<string>('all')
    const { user } = useAuth()


    // fetch datat
    useEffect(() => {
        ; (async () => {
            setLoading(true);
            if (role == 'all') {
                setRole("")
            }
            try {
                const { data, status } = await api.get(`/users?offset=${offset}&limit=${limit}&&search=${search}&role=${role}`)
                if (status == 200) {
                    setData(data?.data?.users)
                    setTotalRecords(data?.data?.count)
                } else {
                    toast.error('Failed to load data')
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to load")
            } finally {
                setLoading(false);
            }
        })()
    }, [refreshUsersFlag, setTotalRecords, limit, offset, search, role])


    const onUpdate = (data: User) => {
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
            const { data, status } = await api.delete(`/users/${idToDelete}`)
            if (status == 200) {
                toast.success(data.message || "Deleted");
                deleteObjectById(setData, idToDelete)
            } else {
                toast.error(data.message || "Failed to delete")
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete ")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <>
            <section className='flex justify-start gap-2 mb-2 items-center'>
                <div>
                    <CreateDialogForm
                        addData={(x: User) =>
                            addObject(setData, x, "start")
                        }
                    />
                </div>
                <div>
                    <Select
                        onValueChange={(value) => setRole(value)}
                        defaultValue={role}
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
                            <SelectItem
                                value={"staff"}
                            >
                                Staff
                            </SelectItem>
                            <SelectItem
                                value={"admin"}
                            >
                                Admin
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>
            <div>
                <SearchBox search={search} setSearch={setSearch} />
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-secondary">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Designation</TableHead>
                            <TableHead>Role</TableHead>
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
                                    <TableCell>
                                        <Avatar className="h-8 w-8 rounded-full">
                                            <AvatarImage src={item?.profile || ""} alt={item?.name} />
                                            <AvatarFallback className="rounded-full">{item?.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.designation && item.designation.length > 0 ? item.designation : <span className='text-muted-foreground'>None</span>}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={item.role == 'admin' ? "default" : "outline"}
                                        >
                                            {item.role.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {
                                            user.role == "admin" && item.role == "admin" ? '' : <div className="flex gap-2 justify-end">
                                                <Button variant="outline" size="icon" type='button' onClick={() => onUpdate(item)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="icon" type='button' onClick={() => handleAlertDelete(item?.id || null)}>
                                                    {deletLoading && idToDelete === item.id ? <Loader /> : <Trash2 className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <TablePagination colSpan={colSpan} totalPages={totalPages} page={page} setPage={setPage} />
                </Table>
                <UpdateDialogForm
                    updateData={(newData: User) => {
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

export default UserTable