'use client';

import { unparse } from "papaparse";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import Loader from "./loader";
import { toast } from "sonner";


export default function DownloadCSVButton({ fetch, dataKey, fileName }: { fetch: () => Promise<any>, dataKey: string, fileName: string }) {
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            let csvData: unknown[] = [];
            const { data, status } = await fetch()
            if (status == 200) {
                csvData = data.data[dataKey]
            } else {
                throw new Error("Failed to export csv")
            }
            const csv = unparse(csvData);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName + ".csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.error("CSV exported")
        } catch (err: any) {
            toast.error(err.message || "Failed to export csv")
        } finally {
            setLoading(false)
        }
    };

    return (
        <Button onClick={handleDownload}>
            {
                loading ? <Loader /> : <>
                    Export CSV <Download className="ml-2" /></>
            }
        </Button>
    );
}
