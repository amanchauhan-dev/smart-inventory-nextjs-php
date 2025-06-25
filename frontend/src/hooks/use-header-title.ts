'use client'
import { HeaderTitleContext } from "@/contexts/header-title-provider";
import { useContext } from "react";

export const useHeaderTitle = () => {
    const context = useContext(HeaderTitleContext);
    if (!context) {
        throw new Error('useHeaderTitle must be used within a HeaderTitleProvider');
    }
    return context;
};
