"use client"

import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    variant?: "destructive" | "default"
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    variant = "destructive",
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4 animate-in fade-in duration-200">
            <div className="bg-card rounded-lg shadow-2xl border border-border w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                    <div className="flex items-center gap-2">
                        {variant === "destructive" && <AlertTriangle className="text-destructive" size={20} />}
                        <h2 className="text-lg font-bold text-card-foreground">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 bg-card">
                    <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
                </div>

                <div className="flex gap-3 justify-end p-4 bg-muted/50 border-t border-border">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="min-w-[100px] border-border hover:bg-muted"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === "destructive" ? "destructive" : "default"}
                        className={`min-w-[100px] font-bold ${variant === "destructive" ? "text-white bg-destructive hover:bg-destructive/90" : ""}`}
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}
