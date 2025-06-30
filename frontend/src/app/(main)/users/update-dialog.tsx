'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import api from "@/lib/axios"
import Loader from "@/components/loader"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { ImagePlus, Trash } from "lucide-react"
import { uploadeProfileImage } from "../profile/action"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User } from "@/validations/user"

// Define the form schema using Zod
const Schema = z.object({
    profile: z.string().optional(),
    name: z.string().min(3, "Category name must contain at least 3 character(s)"),
    role: z.enum(["staff", 'admin']),
    designation: z.string(),
    email: z.string().email().max(100),
})

type SchemaType = z.infer<typeof Schema>

export function UpdateDialogForm({ data, open, setOpen, updateData }: { data: User | null, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, updateData: (x: User) => void }) {
    const [loading, setLoading] = useState<boolean>(false)
    const [newProfileURL, setNewProfileURL] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const form = useForm<SchemaType>({
        resolver: zodResolver(Schema),
        defaultValues: {
            name: '',
            profile: "",
            role: "staff",
            designation: "",
            email: "",
        },
    })
    useEffect(() => {
        if (data) {
            form.reset({
                name: data.name,
                profile: data?.profile || '',
                role: data.role == "admin" ? "admin" : "staff",
                designation: data.designation || '',
                email: data.email || ''
            })
            setNewProfileURL(data.profile ?? null)
        }
    }, [data, form])

    const onProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setNewProfileURL(URL.createObjectURL(file))
        }
    }
    const onProfileCancel = () => {
        setNewProfileURL(data?.profile || null)
        if (inputRef.current) {
            inputRef.current.files = null
            inputRef.current.value = ''
        }
    }

    const onSubmit = async (values: SchemaType) => {
        if (!data) {
            return
        }
        const user = data;
        setLoading(true)
        try {
            let url: string | null = null;
            if (inputRef.current && inputRef.current.files && inputRef.current.files.length > 0) {
                const res = await uploadeProfileImage(inputRef.current.files[0], user.profile ?? undefined);
                if (res.error || !res.url) {
                    throw new Error("Failed to upload")
                } else {
                    url = res.url
                }
            }
            const { data, status } = await api.put("/users/" + user.id, {
                ...values,
                profile: url || ''
            })
            if (status == 201) {
                toast.success(data.message || "Success")
                form.reset()
                updateData(data.data.user)
                setOpen(false)
            } else {
                toast.error('Failed to update')
            }
        } catch (error: any) {
            console.log(error);

            toast.error(error.response?.data?.message || 'Failed to update user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Update User</DialogTitle>
                    <DialogDescription>
                        Change user details. Click update when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4 overflow-auto max-h-[80svh]">
                        <div className="space-y-5">
                            <div className='flex items-center gap-4 max-sm:flex-col justify-center w-full'>
                                {newProfileURL ?
                                    <Image
                                        src={newProfileURL}
                                        alt='Selected profile image'
                                        height={100}
                                        width={100}
                                        className='border object-contain rounded-full overflow-hidden h-40 w-40 flex justify-center items-center'
                                    /> :
                                    <Label htmlFor='changeProfile' className={`border-2 rounded-full overflow-hidden h-40 w-40  flex justify-center items-center`}>
                                        <ImagePlus className='text-muted-foreground size-32' />
                                    </Label>}
                                <input ref={inputRef} onChange={onProfileChange} id='changeProfile' type='file' accept='image/*' className='hidden' />
                                {
                                    newProfileURL && <div className='flex flex-col max-sm:flex-row gap-4'>
                                        <Button type='button' title='Cancel' onClick={onProfileCancel} variant={'destructive'} size={'icon'} >
                                            <Trash />
                                        </Button>
                                    </div>
                                }
                            </div>

                        </div >
                        <div className="space-y-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="you@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="staff">Staff</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="designation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Designation</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Assistent" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button disabled={loading} type="submit">
                                    {loading ? <Loader /> : "UPDATE"}
                                </Button>
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}