"use client"

import * as React from "react"
import {
    IconCategory,
    IconCircleMinus,
    IconCirclePlus,
    IconDashboard,
    IconListDetails,
    IconRobot,
    IconSettings,
    IconTrendingUp,
    IconUser,
} from "@tabler/icons-react"

import { NavMain } from "./nav-main"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { ProgressBarLink } from "@/contexts/progress-bar-provider"
import { CalendarDays, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
            auth: "all"
        },
        {
            title: "Users",
            url: "/users",
            icon: IconUser,
            auth: "admin"
        },
        {
            title: "Products",
            url: "/products",
            icon: IconListDetails,
            auth: "all"
        },
        {
            title: "Product Categories",
            url: "/product-categories",
            icon: IconCategory,
            auth: "all"
        },
        {
            title: "Incomes",
            url: "/incomes",
            icon: IconCirclePlus,
            auth: "admin"
        },
        {
            title: "Income Category",
            url: "/income-category",
            icon: IconCategory,
            auth: "all"
        },
        {
            title: "Expanses",
            url: "/expenses",
            icon: IconCircleMinus,
            auth: "all"
        },
        {
            title: "Expense Category",
            url: "/expense-category",
            icon: IconCategory,
            auth: "all"
        },
        {
            title: "Analytics",
            url: "/analytics",
            icon: IconTrendingUp,
            auth: "admin"
        },
        {
            title: "AI Bot",
            url: "/ai-bot",
            icon: IconRobot,
            auth: "all"
        },
        {
            title: "Settings",
            url: "/settings",
            icon: IconSettings,
            auth: "admin"
        },


    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile, setOpenMobile } = useSidebar()
    const { user } = useAuth()
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <div>
                                {isMobile && <X onClick={() => setOpenMobile(false)} className="absolute right-0 top-0 cursor-pointer" size={20} />}
                                <ProgressBarLink showActive={false} href="/dashboard" className="!text-primary flex gap-2 items-center">
                                    <CalendarDays className="!size-5" />
                                    <span className="text-base font-semibold ">{user?.org_name}</span>
                                </ProgressBarLink>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
