'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
import { format } from 'date-fns'
import { FileText } from 'lucide-react'
import React from 'react'

function Show() {
    const { user } = useAuth()
    return (
        <section className=' flex flex-col gap-4'>
            <h1 className='text-2xl font-bold flex items-center gap-2'>Profile Details <FileText className='text-primary' size={20} /></h1>
            <div className=' flex max-sm:flex-col max-sm:justify-center items-center gap-3'>
                <div className='w-fit '>
                    <Avatar className="h-40 w-40 rounded-full">
                        <AvatarImage src={user?.profile} alt={user?.name} />
                        <AvatarFallback className="text-7xl text-muted-foreground">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className='flex flex-col gap-1 w-full'>
                    <h1 className='text-3xl font-bold max-sm:text-center'>{user?.name}</h1>
                    <h1 className='max-sm:text-center'>
                        <Badge>STAFF</Badge>
                    </h1>
                    <h1 className='italic text-muted-foreground font-semibold max-sm:text-center'>{user?.email}</h1>
                    <h1 className='text-muted-foreground text-sm max-sm:text-center'>
                        <span>Account Created On: </span>
                        {user?.created_at && format(new Date(user?.created_at), "dd MMM yyyy")}
                    </h1>
                </div>
            </div>
        </section>
    )
}

export default Show
