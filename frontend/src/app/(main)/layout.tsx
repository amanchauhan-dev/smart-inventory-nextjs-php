import { AppSidebar } from "@/app/(main)/_components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

import { SiteHeader } from "./_components/sidebar-header"
import { HeaderTitleProvider } from "@/contexts/header-title-provider"
import AuthProvider from "@/contexts/auth-provider"
import RefresherProvider from "./_components/refresher-provider"

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <RefresherProvider>
                <HeaderTitleProvider>
                    <SidebarProvider
                        style={
                            {
                                "--sidebar-width": "calc(var(--spacing) * 72)",
                                "--header-height": "calc(var(--spacing) * 12)",
                            } as React.CSSProperties
                        }
                    >
                        <AppSidebar variant="inset" />
                        <SidebarInset>
                            <SiteHeader />
                            <div className="flex flex-1 flex-col ">
                                {children}
                            </div>
                        </SidebarInset>
                    </SidebarProvider>
                </HeaderTitleProvider>
            </RefresherProvider>
        </AuthProvider>
    )
}
