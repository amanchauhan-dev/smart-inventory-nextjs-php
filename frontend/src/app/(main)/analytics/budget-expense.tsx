"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/axios"
import { useRefresh } from "../_components/use-refresh"
import { formatCurrency } from "@/lib/utils"


const chartConfig = {
    budget: {
        label: "Budget",
        color: "var(--chart-2)",
    },
    spent: {
        label: "Spent",
        color: "red",
    },
} satisfies ChartConfig



type DataType = {
    id: number
    name: string
    budget: string
    spent: string
}


export default function BudgetExpense() {
    const [year, setYear] = useState<number>((new Date).getFullYear())
    const [chartData, setChartData] = useState<DataType[]>([])
    const [loading, setLoading] = useState(true)
    const currentYear = new Date().getFullYear();
    const length = currentYear - 2020 + 1;
    const years = Array.from({ length: length }, (_, i) => currentYear - i);
    const [month, setMonth] = useState<number>((new Date).getMonth() + 1);

    const { refreshDashboard } = useRefresh()
    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const { data, status } = await api.get(`/dashboard/budget-expense?year=${year}&month=${month}`)
                if (status === 200) {
                    setChartData(data.data.data)
                } else {
                    throw new Error("Failed to load graph")
                }
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to load graph")
            } finally {
                setLoading(false)
            }
        })()
    }, [month, year, refreshDashboard])


    const onReset = () => {
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
    }
    return (
        <Card>
            <CardHeader className="flex flex-wrap justify-between items-center">
                <div >
                    <CardTitle>Expense & Budget</CardTitle>
                    <CardDescription>Record of this month: {new Date(0, month - 1).toLocaleString("default", { month: "long" })} - {year}</CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" onClick={onReset}>RESET</Button>
                    <Select
                        onValueChange={(value) => setMonth(Number(value))}
                        defaultValue={month.toString()}
                    >
                        <SelectTrigger className="min-w-40">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 12 }).map((_, i) => {
                                return (
                                    <SelectItem
                                        key={i}
                                        value={(i + 1).toString()}
                                    >
                                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    <Select
                        onValueChange={(value) => setYear(Number(value))}
                        defaultValue={year.toString()}
                    >
                        <SelectTrigger className="min-w-40">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((y) => (
                                <SelectItem
                                    key={y}
                                    value={y.toString()}
                                >
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="w-full h-80" />
                ) : (
                    <ChartContainer config={chartConfig}>
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 10)}
                            />
                            <YAxis
                                domain={[0, 100000]}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => formatCurrency(v)}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
                            <Bar dataKey="budget" fill="var(--color-budget)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="text-muted-foreground leading-none">
                    Showing total Expenditures and Budgets in different categories of {new Date(0, month - 1).toLocaleString("default", { month: "long" })} months
                </div>
            </CardFooter>
        </Card>
    )
}
