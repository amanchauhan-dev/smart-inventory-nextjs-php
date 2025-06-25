'use client'

import { useState } from "react"
import OTPForm from "./otp-form"
import SignupForm from "./signup-form"


function Forms() {
    const [formState, setFormState] = useState<"otp" | "signup">('otp')

    if (formState === 'otp') {
        return <OTPForm back={() => { setFormState("signup") }} />
    }
    else {
        return <SignupForm />
    }
}

export default Forms