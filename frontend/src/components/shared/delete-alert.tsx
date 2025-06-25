
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Dispatch, SetStateAction } from "react"


export const DeleteAlert = ({ open, setOpen, onAgree }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, onAgree: () => void }) => {


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant={"outline"} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant={"destructive"} onClick={onAgree}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}