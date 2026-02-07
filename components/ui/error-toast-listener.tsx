"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ErrorToastListener() {
    const { toast } = useToast()

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            toast({
                title: "Runtime Error",
                description: event.message || "An unexpected error occurred in the browser.",
                variant: "destructive",
            })
        }

        const handleRejection = (event: PromiseRejectionEvent) => {
            const message = typeof event.reason === "string"
                ? event.reason
                : (event.reason?.message || "An unhandled async operation failed.")

            toast({
                title: "System Promise Error",
                description: message,
                variant: "destructive",
            })
        }

        window.addEventListener("error", handleError)
        window.addEventListener("unhandledrejection", handleRejection)

        return () => {
            window.removeEventListener("error", handleError)
            window.removeEventListener("unhandledrejection", handleRejection)
        }
    }, [toast])

    return null
}
