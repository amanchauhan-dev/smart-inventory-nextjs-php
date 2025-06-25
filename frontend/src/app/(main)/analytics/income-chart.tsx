"use client"

import { Cell, Pie, PieChart } from "recharts"

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
    ChartLegend,
    ChartLegendContent,
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


type DataType = {
    id: number
    income: number
    category: string,
    fill: string
}


export default function ChartPieLabel() {
    const [year, setYear] = useState<number>((new Date).getFullYear())
    const [chartData, setChartData] = useState<DataType[]>([])
    const [loading, setLoading] = useState(true)
    const currentYear = new Date().getFullYear();
    const length = currentYear - 2020 + 1;
    const years = Array.from({ length: length }, (_, i) => currentYear - i);
    const [month, setMonth] = useState<number>((new Date).getMonth() + 1);


    const [chartConfig, setChartConfig] = useState<ChartConfig>({});
    const { refreshDashboard } = useRefresh()
    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const { data, status } = await api.get(`/income-category?year=${year}&month=${month}`)
                if (status === 200) {
                    setChartData(data.data.data.map((item: any) => ({
                        ...item,
                        income: parseFloat(item.income),
                        fill: `var(--chart-${item.id % 5 + 1})`
                    })))
                } else {
                    throw new Error("Failed to load graph")
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load graph")
            } finally {
                setLoading(false)
            }
        })()
    }, [month, year, refreshDashboard])

    useEffect(() => {

        const config: ChartConfig = {};
        chartData.forEach((item) => {
            config[item.category] = {
                label: item.category,
                color: "var(--chart-1)",
            }
        });
        setChartConfig(config);
    }, [chartData])


    const onReset = () => {
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
    }
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-wrap justify-between items-center">
                <div >
                    <CardTitle>Income & Category</CardTitle>
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
            <CardContent className="flex-1 pb-0">
                {loading ? (
                    <Skeleton className="w-full h-80" />
                ) :
                    chartData.length > 0 ? (
                        <ChartContainer
                            config={chartConfig}
                            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
                        >
                            <PieChart>
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Pie data={chartData} stroke="1" dataKey="income" label nameKey="category">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill || "var(--chart-1)"} />
                                    ))}
                                </Pie>
                                <ChartLegend
                                    content={<ChartLegendContent nameKey="category" />}
                                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                                />
                            </PieChart>
                        </ChartContainer>
                    ) : (
                        <h1>No data found</h1>
                    )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="text-muted-foreground leading-none">
                    Showing total Income in different categories of {new Date(0, month - 1).toLocaleString("default", { month: "long" })} months
                </div>
            </CardFooter>
        </Card>
    )
}

