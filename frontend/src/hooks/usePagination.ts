'use client'

import { useEffect, useState } from "react"

export const usePagination = ({ Limit = 1 }: { Limit?: number }) => {
    const [page, setPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(Limit)
    const [offset, setOffset] = useState<number>(0)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [totalRecords, setTotalRecords] = useState<number>(1)


    useEffect(() => {
        setOffset((page - 1) * limit)
    }, [limit, page])


    useEffect(() => {
        setTotalPages(Math.ceil(totalRecords / limit))
    }, [totalRecords, limit])



    return {
        page, setPage,
        limit, setLimit,
        totalPages, setTotalPages,
        offset, setOffset,
        totalRecords, setTotalRecords
    }
}