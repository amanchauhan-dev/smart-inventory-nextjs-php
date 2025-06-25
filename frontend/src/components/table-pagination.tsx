import React, { Dispatch, SetStateAction } from 'react'
import { TableCell, TableFooter, TableRow } from './ui/table'
import { Button } from './ui/button';

function TablePagination({ colSpan = 1, page, totalPages, setPage }: { colSpan?: number, setPage: Dispatch<SetStateAction<number>>; page: number; totalPages: number }) {
    return (
        <TableFooter>
            <TableRow>
                <TableCell colSpan={colSpan}>
                    <div className='flex justify-between gap-2'>
                        <div>
                            {page} Page of {totalPages} Page(s)
                        </div>
                        <div className='flex items-center gap-2'>
                            <Button size={"sm"} type='button' disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                            <Button size={"sm"} type='button' disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        </TableFooter>
    )
}

export default TablePagination