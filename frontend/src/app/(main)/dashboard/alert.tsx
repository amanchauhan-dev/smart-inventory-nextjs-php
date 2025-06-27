'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronDown, TriangleAlert } from 'lucide-react'
import React, { useEffect } from 'react'
import { motion } from "framer-motion"
import { toast } from 'sonner'
export type AlertsProps = {
    title: string;
    description: string;
}


function Alerts({ data }: { data: AlertsProps[] }) {
    const [hide, setHide] = React.useState<boolean>(false)

    useEffect(() => {
        data.forEach(item => {
            toast.warning(
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-sm font-semibold'>{item.title}</p>
                        <p className='text-xs'>{item.description}</p>
                    </div>
                </div>
            )
        })
    }, [data])

    if (data.length > 0)
        return (
            <section>
                <div className='text-sm font-semibold text-right flex ml-auto justify-end items-center gap-2 mb-2'>
                    <TriangleAlert className='text-amber-600/80 dark:text-amber-700 ' size={16} />
                    <h1 className='text-amber-600/80 dark:text-amber-700 ' > {data.length} Alerts </h1>
                    <ChevronDown className='text-amber-600/80 dark:text-amber-700 ' onClick={() => setHide(!hide)} size={16} />
                </div>
                <section className={cn(`w-full flex flex-col gap-1 transition-all overflow-hidden`)} style={{
                    height: hide ? '0px' : data.length * 60 + 'px'
                }}>
                    {data.map((alert, index) => (
                        <AlertItem data={alert} index={index} key={index} />
                    ))}
                </section>
            </section>
        )
    else
        return null
}

export default Alerts

export const AlertItem = ({ data, index }: { data: AlertsProps, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 1, y: 0, x: "150%" }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.4, ease: "easeIn", delay: 0.2 * index }}
            className='border-yellow-500 dark:border-yellow-600 border text-yellow-500 dark:text-yellow-600 shadow-xl  rounded last:mb-2'>
            <div className='flex items-center justify-between p-2'>
                <div className='flex items-center gap-1'>
                    <Button size={'icon'} variant={"ghost"} className='hover:!bg-transparent hover:!text-white bg-transparent'><TriangleAlert /></Button>
                    <div>
                        <p className='text-sm font-semibold'>{data.title}</p>
                        <p className='text-xs'>{data.description}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}