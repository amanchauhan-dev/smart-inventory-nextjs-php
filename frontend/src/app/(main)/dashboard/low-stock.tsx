import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import React from 'react'

const colSpan = 5;

export type StockWarning = {
    id: number,
    name: string,
    quantity: number,
    threshold: number,
}

function LowStock({ data, loading }: { data: StockWarning[], loading: boolean }) {
    return (
        <Table className=''>
            <TableCaption>List of Low stock products.</TableCaption>
            <TableHeader className='bg-muted'>
                <TableRow className='text-muted-foreground'>
                    <TableHead className="w-[100px]">Sr. No.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Stock Limit</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {
                    loading ? (
                        <TableRow>
                            <TableCell colSpan={colSpan} className="font-medium">
                                <Skeleton className='w-full h-40' />
                            </TableCell>
                        </TableRow>
                    ) : data.length > 0 ?
                        data.map(item => {
                            return (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{item.threshold}</TableCell>
                                    <TableCell className='text-right'>
                                        <Badge variant={item.quantity <= item.threshold ? 'destructive' : 'default'}>
                                            {item.quantity <= item.threshold ? 'Low Stock' : 'In Stock'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="font-medium">All good 👍</TableCell>
                            </TableRow>
                        )
                }

            </TableBody>
        </Table>
    )
}

export default LowStock