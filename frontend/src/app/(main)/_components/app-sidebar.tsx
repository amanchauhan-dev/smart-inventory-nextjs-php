"use client"

import * as React from "react"
import {
    IconCategory,
    IconCircleMinus,
    IconCirclePlus,
    IconDashboard,
    IconListDetails,
    IconTrendingUp,
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
const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
        },
        {
            title: "Products",
            url: "/products",
            icon: IconListDetails,
        },
        {
            title: "Product Categories",
            url: "/product-categories",
            icon: IconCategory,
        },
        {
            title: "Incomes",
            url: "/incomes",
            icon: IconCirclePlus,
        },
        {
            title: "Income Category",
            url: "/income-category",
            icon: IconCategory,
        },
        {
            title: "Expanses",
            url: "/expenses",
            icon: IconCircleMinus,
        },
        {
            title: "Expense Category",
            url: "/expense-category",
            icon: IconCategory,
        },
        {
            title: "Analytics",
            url: "/analytics",
            icon: IconTrendingUp,
        },


    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { isMobile, setOpenMobile } = useSidebar()
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
                                    <span className="text-base font-semibold ">Smart Inventory</span>
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
