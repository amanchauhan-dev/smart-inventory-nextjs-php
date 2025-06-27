import React from 'react'
import { Input } from './ui/input'
import { Eye, EyeClosed } from 'lucide-react'
import { Button } from './ui/button'

function PasswordInput({ ...rest }: React.ComponentProps<'input'>) {
    const [view, setView] = React.useState<boolean>(false)
    return (
        <div className='flex items-center w-full relative'>
            <Input {...rest} type={view ? "text" : "password"} />
            <Button type='button' size={'icon'} onClick={() => setView(!view)} variant={'ghost'} className='absolute right-0 hover:!bg-transparent'>
                {view ? <Eye /> : <EyeClosed />}
            </Button>
        </div>
    )
}

export default PasswordInput