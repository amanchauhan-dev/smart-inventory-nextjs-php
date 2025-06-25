'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Category = {
    id: number
    name: string
}

interface CategorySelectorProps {
    value?: Category | null
    onChange: (category: Category) => void
    fetchCategories: () => Promise<Category[]>
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    value,
    onChange,
    fetchCategories,
}) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const data = await fetchCategories()
                setCategories(data)
            } catch (err) {
                console.error('Failed to load categories', err)
            } finally {
                setLoading(false)
            }
        }

        if (open) fetchData()
    }, [open, fetchCategories])

    const filtered = categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left"
                >
                    {value ? value.name : 'Select category'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-2"
                />
                <ScrollArea className="max-h-60">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : filtered.length > 0 ? (
                        filtered.map((category) => (
                            <div
                                key={category.id}
                                onClick={() => {
                                    onChange(category)
                                    setOpen(false)
                                }}
                                className={cn(
                                    'flex items-center px-2 py-1.5 cursor-pointer rounded hover:bg-muted',
                                    value?.id === category.id && 'bg-muted'
                                )}
                            >
                                <span className="flex-1">{category.name}</span>
                                {value?.id === category.id && (
                                    <Check className="w-4 h-4 text-primary" />
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm p-2">No results</p>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
