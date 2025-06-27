'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/use-auth'
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
                        <AvatarImage src={user?.profile || ""} alt={user?.name} />
                        <AvatarFallback className="text-7xl text-muted-foreground">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className='flex flex-col gap-1 w-full'>
                    <h1 className='text-3xl font-bold max-sm:text-center items-center gap-3'>{user?.name} </h1>
                    <h1 className=' max-sm:text-center flex items-center gap-1'>
                        {
                            user.designation && <Badge
                                variant={"outline"}
                            >
                                {user.designation}
                            </Badge>
                        }
                        <Badge
                            className={
                                user?.role === 'admin' ? "bg-red-800" :
                                    user?.role === 'superadmin' ? "bg-green-800" : "bg-primary"
                            }
                        >
                            {user?.role}
                        </Badge>


                    </h1>
                    <h1 className='italic text-muted-foreground font-semibold max-sm:text-center'>{user?.email}</h1>
                    <h1 className='max-sm:text-center'>
                        <Badge variant={"outline"}>
                            {user?.org_name}
                        </Badge>
                    </h1>
                    <h1 className='italic text-muted-foreground text-sm max-sm:text-center'>Address: {user?.org_address}</h1>
                </div>
            </div>
        </section>
    )
}

export default Show
