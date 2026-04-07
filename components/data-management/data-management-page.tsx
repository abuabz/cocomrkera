"use client"

import { useState } from "react"
import { Download, Upload, Database, AlertTriangle, CheckCircle2 } from "lucide-react"
import { backupApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function DataManagementPage() {
    const [isExporting, setIsExporting] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const { toast } = useToast()

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const data = await backupApi.export()
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `mrkera-backup-${new Date().toISOString().split("T")[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
            toast({
                title: "Backup Success",
                description: "Full system backup has been downloaded successfully.",
            })
        } catch (error: any) {
            console.error("Export failed:", error)
            toast({
                variant: "destructive",
                title: "Export Failed",
                description: error.message || "An unexpected error occurred during export.",
            })
        } finally {
            setIsExporting(false)
        }
    }

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!confirm("Warning: This will overwrite all your current data. Are you sure you want to proceed?")) {
            event.target.value = ""
            return
        }

        setIsImporting(true)
        try {
            const reader = new FileReader()
            reader.onload = async (e) => {
                try {
                    const content = e.target?.result
                    if (typeof content !== "string") throw new Error("Invalid file content")
                    
                    const jsonData = JSON.parse(content)
                    await backupApi.import(jsonData)
                    toast({
                        title: "Import Success",
                        description: "All records have been successfully restored from backup.",
                        action: (
                            <ToastAction altText="Refresh" onClick={() => window.location.reload()}>
                                Refresh Now
                            </ToastAction>
                        ),
                    })
                    // Reset input
                    event.target.value = ""
                } catch (err: any) {
                    toast({
                        variant: "destructive",
                        title: "Import Error",
                        description: "The backup file is invalid or corrupted: " + err.message,
                    })
                } finally {
                    setIsImporting(false)
                }
            }
            reader.readAsText(file)
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "File Error",
                description: "Failed to read the backup file: " + error.message,
            })
            setIsImporting(false)
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-primary uppercase italic">Data Management</h1>
                    <p className="text-muted-foreground font-medium">Backup, restore and migrate your system data.</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <Database className="w-8 h-8 text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Backup Section */}
                <Card className="border-2 border-primary/5 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <div className="h-2 bg-primary w-full" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                            <Download className="w-6 h-6 text-primary group-hover:bounce" />
                            Export Data
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                            Download a full backup of all your customers, employees, sales, and records.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-xl border border-dashed border-muted-foreground/20 italic">
                            <p className="text-sm text-muted-foreground">
                                All data will be exported into a single JSON file. We recommend creating a backup at the end of each day.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            onClick={handleExport} 
                            disabled={isExporting}
                            className="w-full h-12 text-lg font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {isExporting ? "Generating Backup..." : "Create Full Backup"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Restore Section */}
                <Card className="border-2 border-destructive/10 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <div className="h-2 bg-destructive w-full" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                            <Upload className="w-6 h-6 text-destructive" />
                            Import Data
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                            Restore your data from a previously exported backup file.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3 bg-destructive/5 p-4 rounded-xl border border-destructive/20">
                            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive font-bold uppercase tracking-tight">
                                Important: Importing data will replace all existing database records with the data from the backup file. This cannot be undone.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full relative">
                            <input
                                type="file"
                                id="restore-upload"
                                className="hidden"
                                accept=".json"
                                onChange={handleImport}
                                disabled={isImporting}
                            />
                            <label htmlFor="restore-upload" className="w-full">
                                <Button 
                                    asChild 
                                    variant="outline" 
                                    disabled={isImporting}
                                    className="w-full h-12 text-lg font-bold border-2 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground cursor-pointer shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <span>{isImporting ? "Restoring..." : "Restore from Backup"}</span>
                                </Button>
                            </label>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Quick Stats/Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 bg-muted/30 p-6 rounded-2xl border border-primary/10">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-primary/70 uppercase">Format</p>
                        <p className="font-bold">Standard JSON</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-muted/30 p-6 rounded-2xl border border-primary/10">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-primary/70 uppercase">Availability</p>
                        <p className="font-bold">Admin Only</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-muted/30 p-6 rounded-2xl border border-primary/10">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-primary/70 uppercase">Security</p>
                        <p className="font-bold">Local Storage</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
