
'use client'

import { useContext } from "react";
import { RefresherContext } from "./refresher-provider";

export const useRefresh = () => {
    const context = useContext(RefresherContext);
    if (!context) {
        throw new Error('useRefresh must be used within a RefresherProvider');
    }
    return context;
};
