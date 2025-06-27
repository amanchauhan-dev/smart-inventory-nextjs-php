'use client'
import { useAuth } from '@/hooks/use-auth'
import React, { ChangeEvent, useRef, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ImagePlus, Save, Trash, User } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import Loader from '@/components/loader'
import api from '@/lib/axios'
import { uploadeProfileImage } from './action'

const Schema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
})


type FormValues = z.infer<typeof Schema>

function ChangeBasics() {
    const { user, refreshUser } = useAuth()
    const [loading, setLoading] = useState(false);
    const [profileLoader, setProfileLoader] = useState(false);
    const [newProfileURL, setNewProfileURL] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: user?.name || '',
        },
    })

    const onProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setNewProfileURL(URL.createObjectURL(file))
        }
    }
    const onProfileCancel = () => {
        setNewProfileURL(null)
        if (inputRef.current) {
            inputRef.current.files = null
            inputRef.current.value = ''
        }
    }

    const onProfileSave = async () => {
        if (!inputRef.current || !inputRef.current.files || inputRef.current.files.length <= 0) {
            return
        }
        setProfileLoader(true)
        try {
            console.log(user?.profile);

            const upload = await uploadeProfileImage(inputRef.current.files[0], user?.profile || undefined);
            if (upload.error || !upload.url) {
                throw new Error(upload.error ?? "Error")
            }
            const { data, status } = await api.post("/update-profile", {
                profileURL: upload.url
            })
            if (status == 200) {
                toast.success(data.message || "Success")
                refreshUser()
                onProfileCancel()

            } else {
                toast.error('Failed to update profile')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setProfileLoader(false)
        }
    }

    const onSubmit = async (values: FormValues) => {
        setLoading(true)
        try {
            const { data, status } = await api.post("/update-username", {
                name: values.name
            })
            if (status == 200) {
                toast.success(data.message || "Success")
                refreshUser()

            } else {
                toast.error('Failed to update name')
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form className=' flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
                <h1 className='text-2xl font-bold flex items-center gap-2'>Edit <User className='text-primary' size={20} /></h1>
                <div className=' flex items-center gap-3'>
                    <div className='flex-col gap-1 w-full grid lg:grid-cols-2'>
                        <div className='flex items-center gap-4 max-sm:flex-col justify-center w-full'>
                            {newProfileURL ?
                                <Image
                                    src={newProfileURL}
                                    alt='Selected profile image'
                                    height={100}
                                    width={100}
                                    className='border object-contain rounded-full overflow-hidden h-40 w-40 flex justify-center items-center'
                                /> :
                                <Label htmlFor='changeProfile' className='border rounded-full overflow-hidden h-40 w-40  flex justify-center items-center'>
                                    <ImagePlus className='text-muted-foreground size-32' />
                                </Label>}
                            <input ref={inputRef} onChange={onProfileChange} id='changeProfile' type='file' accept='image/*' className='hidden' />
                            {
                                newProfileURL && <div className='flex flex-col max-sm:flex-row gap-4'>
                                    <Button type='button' title='Cancel' onClick={onProfileCancel} variant={'destructive'} size={'icon'} >
                                        <Trash />
                                    </Button>
                                    <Button onClick={onProfileSave} disabled={profileLoader} type='button' title='Save' size={'icon'} >
                                        {profileLoader ? <Loader /> : <Save />}
                                    </Button>
                                </div>
                            }
                        </div>
                        <div className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                placeholder="Enter your full name"
                                                className="input input-bordered w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription>Enter your name and click on save button</FormDescription>
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-end'>
                                <Button className='w-fit' disabled={loading}>
                                    {loading ? <Loader /> : "SAVE"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export default ChangeBasics
