import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils';
import React from 'react'

const colSpan = 5;

export type BudgetWarning = {
    id: number,
    name: string,
    monthly_limit: string,
    spent: string,
}


function LowBudget({ data, loading }: { data: BudgetWarning[], loading: boolean }) {
    return (
        <Table className=''>
            <TableCaption>List of Low Budget.</TableCaption>
            <TableHeader className='bg-muted'>
                <TableRow className='text-muted-foreground'>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Spent</TableHead>
                    <TableHead className="text-right">Limit</TableHead>
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
                                    <TableCell className="text-right">{formatCurrency(item.spent)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.monthly_limit)}</TableCell>
                                    <TableCell className='text-right'>
                                        <Badge variant={item.monthly_limit <= item.spent ? 'destructive' : 'default'}>
                                            {item.monthly_limit <= item.spent ? 'Over Spent' : 'In Budget'}
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

export default LowBudget