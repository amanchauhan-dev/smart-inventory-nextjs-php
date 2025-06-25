"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"
import { TrendingDown, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useRefresh } from "../_components/use-refresh"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"


const chartColors = {
    income: "#10B981",
    expense: "#EF4444",
}

type DataType = {
    day: number
    income: number
    expense: number
}

export default function ExpenseIncomeChart() {
    const [chartData, setChartData] = useState<DataType[]>([])
    const [loading, setLoading] = useState(true)
    const [trend, setTrend] = useState(0)
    const { refreshDashboard } = useRefresh()
    // Year and Month selection state
    const [year, setYear] = useState<number>((new Date).getFullYear())
    const currentYear = new Date().getFullYear();
    const length = currentYear - 2020 + 1;
    const years = Array.from({ length: length }, (_, i) => currentYear - i);
    const [month, setMonth] = useState<number>((new Date).getMonth() + 1);


    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const { data, status } = await api.get(`/trends?year=${year}&month=${month}`)
                if (status === 200) {
                    setChartData(data.data.data)
                    setTrend(data.data.trend)
                } else {
                    throw new Error("Failed to load graph")
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load graph")
            } finally {
                setLoading(false)
            }
        })()
    }, [refreshDashboard, month, year])

    const isPositive = trend >= 0
    const TrendIcon = isPositive ? TrendingUp : TrendingDown

    const chartConfig = {
        desktop: {
            label: "Income",
            color: "var(--chart-1)",
        },
        mobile: {
            label: "Expense",
            color: "var(--chart-2)",
        },
    } satisfies ChartConfig


    const onReset = () => {
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
    }

    return (
        <Card>
            <CardHeader className="flex flex-wrap justify-between items-center">
                <div >
                    <CardTitle>Income V/S Expense</CardTitle>
                    <CardDescription>Record of this month: {new Date(0, month - 1).toLocaleString("default", { month: "long" })} -  {year}</CardDescription>
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

                    <ChartContainer config={chartConfig} className="h-72 w-full">
                        <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} />
                            <YAxis
                                domain={[0, 100000]}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `${formatCurrency(v)}`}
                            />

                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <defs>
                                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColors.income} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartColors.income} stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColors.expense} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartColors.expense} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke={chartColors.income}
                                fillOpacity={1}
                                fill="url(#incomeGradient)"
                            />
                            <Area
                                type="monotone"
                                dataKey="expense"
                                stroke={chartColors.expense}
                                fillOpacity={1}
                                fill="url(#expenseGradient)"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}

            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 leading-none font-medium">
                            Trending <span className={`${isPositive ? "text-green-600" : "text-destructive"}`}>{isPositive ? "up" : "down"} </span> by {trend}%
                            <TrendIcon className="h-4 w-4" />
                        </div>
                        <div className="text-muted-foreground flex items-center gap-2 leading-none">
                            {new Date().toLocaleString("default", { month: "long" })} {new Date().getFullYear()}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}