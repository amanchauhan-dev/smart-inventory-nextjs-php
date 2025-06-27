'use client'
import api from '@/lib/axios';
import { cn, formatCurrency } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useRefresh } from '../_components/use-refresh';

export type CardType = {
    data: string;
    title: string;
    type: "INCOME" | "EXPENSE" | "BALANCE" | "PRODUCTS",
}


function QuickCards() {
    const [data, setData] = useState<CardType[]>([])
    const { refreshDashboardFlage } = useRefresh()
    useEffect(() => {
        ; (async () => {
            try {
                const { data, status } = await api.get("/dashboard")
                if (status === 200) {
                    setData([
                        {
                            data: data?.data?.total_income || '',
                            type: "INCOME",
                            title: "Total Income",
                        },
                        {
                            data: data?.data?.total_expenses || '',
                            type: "EXPENSE",
                            title: "Total Expenses",
                        },
                        {
                            data: data?.data?.balance || '',
                            type: "BALANCE",
                            title: "Total Balance",
                        },
                        {
                            data: data?.data?.products || '0',
                            type: "PRODUCTS",
                            title: "Total Products",
                        },
                    ])
                } else {
                    toast.error(data?.message || "Failed to load dashboard data")
                }

            } catch (error: any) {
                toast.error(error.response?.data?.message || "Unable to fetch dashboard data")
            }
        })()
    }, [refreshDashboardFlage])
    return (
        <div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-4'>
            {
                data.map((item, i) => {
                    return (
                        <CardItem data={item} key={i} />
                    )
                })
            }
        </div>
    )
}

export default QuickCards

export const CardItem = ({ data }: { data: CardType }) => {
    return (
        <div className='border-2 bg-card rounded-lg relative shadow-lg min-h-40 flex flex-col'>
            {/* numbers */}
            <div className='p-2 pt-6 flex-auto'>
                <h1 className={cn('text-3xl font-semibold text-center', {
                    "text-destructive": data.type === "EXPENSE" || (data.type === "BALANCE" && Number(data.data) < 0),
                    "text-green-600": data.type === "INCOME" || (data.type === "BALANCE" && Number(data.data) >= 0),
                    "text-blue-600": data.type === "PRODUCTS",
                })}>
                    {data.type == 'PRODUCTS' ? data.data : formatCurrency(data.data)}
                </h1>
            </div>
            {/* details */}
            <div className='p-2'>
                <h1 className={cn('font-bold', {
                    "text-destructive": data.type === "EXPENSE",
                    "text-green-600": data.type === "INCOME",
                })}>{data.title}</h1>
                <h1 className='text-sm text-muted-foreground'>This is the monthly analytics of {data.title}</h1>
            </div>
        </div>
    )
}