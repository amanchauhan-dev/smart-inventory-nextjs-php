'use client';

import React, { createContext, useState, ReactNode } from 'react';

export interface HeaderTitleContextType {
    title: string;
    setTitle: (newTitle: string) => void;
}

export const HeaderTitleContext = createContext<HeaderTitleContextType | undefined>(undefined);

export const HeaderTitleProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState<string>('Dashboard');

    return (
        <HeaderTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </HeaderTitleContext.Provider>
    );
};
