"use client"

import { type Icon } from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ProgressSideBarLink } from "@/contexts/progress-bar-provider"
import { useHeaderTitle } from "@/hooks/use-header-title"
import { AddIncomeDialogForm } from "./add-income-dialog-form"
import { AddExpenseDialogForm } from "./add-expense-dialog-form"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: Icon
    }[]
}) {
    const { setTitle } = useHeaderTitle()
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    <SidebarMenuItem className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground font-semibold">Quick Actions</span>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="grid grid-cols-2 gap-2">
                        <AddIncomeDialogForm />
                        <AddExpenseDialogForm />
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <ProgressSideBarLink callBack={() => setTitle(item.title)} href={item.url}>
                                <SidebarMenuButton tooltip={item.title}>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </ProgressSideBarLink>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
