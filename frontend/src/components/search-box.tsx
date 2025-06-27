'use client'
import React from 'react'
import { Input } from './ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from './ui/button';
import { Search, X } from 'lucide-react';

function SearchBox({ search, setSearch }: { search: string, setSearch: (search: string) => void }) {
    const [value, setValue] = React.useState(search);
    const searchValue = useDebounce(value, 500);

    React.useEffect(() => {
        setSearch(searchValue);
    }, [searchValue, setSearch]);

    return (
        <div className='max-w-md mx-auto mb-2 relative'>
            <Button className='absolute right-0 hover:!bg-transparent !bg-transparent text-muted-foreground' variant='ghost' onClick={() => {
                setValue("")
            }}>
                {search.length > 0 ?
                    <X />
                    : <Search />}
            </Button>
            <Input className='' placeholder='Search...' value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
    )
}

export default SearchBox