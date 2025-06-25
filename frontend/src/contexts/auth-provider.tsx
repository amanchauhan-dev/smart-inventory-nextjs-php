"use client"
import { User } from '@/validations/user';
import { useRouter } from 'next/navigation';
import React, { startTransition, useEffect, useState } from 'react'
import { useProgressBar } from './progress-bar-provider';
import api from '@/lib/axios';
import Cookies from "js-cookie"
import { Skeleton } from '@/components/ui/skeleton';
import Loader from '@/components/loader';
import { toast } from 'sonner';



export type AuthContextType = {
    user: User | null;
    login: (user: User) => void,
    logout: () => void,
    refreshUser: () => void
}


export const AuthContext = React.createContext<AuthContextType | null>(null)


function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true);

    const router = useRouter()
    const progress = useProgressBar()
    const login = (user: User) => {
        setUser(user)
    }
    const logout = () => {
        Cookies.set("token", "", { expires: new Date(-1) })
        progress.start();
        startTransition(() => {
            router.push("/login")
            progress.done();
        });
    }

    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const { data, status } = await api.get("/me")
                if (status == 200) {
                    setUser(data.data.user)
                } else {
                    progress.start();
                    startTransition(() => {
                        router.push("/login")
                        progress.done();
                    });
                }
            } catch (error: any) {
                console.log(error.message);
                progress.start();
                startTransition(() => {
                    router.push("/login")
                    progress.done();
                });
            } finally {
                setLoading(false)
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const refreshUser = async () => {
        try {
            const { data, status } = await api.get("/me")
            if (status == 200) {
                setUser(data.data.user)
            } else {
                throw new Error("Failes to refrech profile")
            }
        } catch (error: any) {
            toast.error(error.messgae || "Failes to refrech profile")
        }
    }


    if (loading || !user) {
        return (
            <Skeleton className='h-svh w-svw flex justify-center items-center'>
                <Loader />
            </Skeleton>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                login, user, logout, refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider