"use client"


import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ProgressBarLink } from "@/contexts/progress-bar-provider"
import { useAuth } from "@/hooks/use-auth"
import { useHeaderTitle } from "@/hooks/use-header-title"

export function NavUser() {
    const { user } = useAuth()
    const { setTitle } = useHeaderTitle()
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <div
                    className="flex items-center justify-between gap-2 rounded-lg p-2 bg-secondary shadow"
                >
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-full">
                            <AvatarImage src={user?.profile || ""} alt={user?.name} />
                            <AvatarFallback className="rounded-full">{user?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user?.name}</span>
                            <span className="text-muted-foreground truncate text-xs">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <ProgressBarLink href={"/profile"} callBack={() => setTitle("Profile")} >
                        <Button className="cursor-pointer">Profile</Button>
                    </ProgressBarLink>
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
