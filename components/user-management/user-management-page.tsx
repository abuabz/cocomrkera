"use client"

import { useState, useEffect } from "react"
import { 
    Users, 
    Plus, 
    Shield, 
    Trash2, 
    Edit2, 
    Key,
    ShieldAlert
} from "lucide-react"
import { userApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "customers", label: "Customers" },
    { id: "employees", label: "Employees" },
    { id: "sales", label: "Sales" },
    { id: "orders", label: "Orders" },
    { id: "followup", label: "Followup" },
    { id: "salary", label: "Salary" },
    { id: "reports", label: "Reports" },
    { id: "employee-reports", label: "Work Reports" },
    { id: "savings", label: "Savings" },
    { id: "expenses", label: "Expenses" },
    { id: "backup", label: "Data Management" }
]

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const { toast } = useToast()
    
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "basic",
        permissions: ["dashboard", "customers", "sales", "orders"] as string[]
    })
    
    const [editingUserId, setEditingUserId] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setIsLoading(true)
        try {
            const response = await userApi.getAll()
            setUsers(response.data || [])
        } catch (error: any) {
             toast({
                title: "Error Loading Users",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            username: "",
            password: "",
            role: "basic",
            permissions: ["dashboard", "customers", "sales", "orders"]
        })
        setEditingUserId(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (editingUserId) {
                const updateData = { ...formData }
                if (!updateData.password) delete (updateData as any).password
                
                await userApi.update(editingUserId, updateData)
                toast({
                    title: "Success",
                    description: "User updated successfully",
                })
            } else {
                if (!formData.password) throw new Error("Password is required for new users")
                await userApi.create(formData)
                toast({
                    title: "Success",
                    description: "User created successfully",
                })
            }
            resetForm()
            fetchUsers()
        } catch (error: any) {
            toast({
                title: "Operation Failed",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setIsSaving(false)
        }
    }

    const handleEdit = (user: any) => {
        setEditingUserId(user._id)
        setFormData({
            username: user.username,
            password: "",
            role: user.role,
            permissions: user.permissions || []
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            await userApi.delete(id)
             toast({
                title: "User Deleted",
                description: "The account has been removed successfully"
            })
            fetchUsers()
        } catch (error: any) {
             toast({
                title: "Delete Failed",
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const togglePermission = (tabId: string) => {
        setFormData(prev => {
            const perms = [...prev.permissions]
            if (perms.includes(tabId)) {
                return { ...prev, permissions: perms.filter(p => p !== tabId) }
            } else {
                return { ...prev, permissions: [...perms, tabId] }
            }
        })
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-primary uppercase italic">User Management</h1>
                    <p className="text-muted-foreground font-medium">Create and manage system user accounts and permissions.</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-2xl">
                    <ShieldAlert className="w-8 h-8 text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* User Form */}
                <Card className="xl:col-span-1 border-2 border-primary/5 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           {editingUserId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                           {editingUserId ? "Edit User" : "Create New User"}
                        </CardTitle>
                        <CardDescription>Enter user details and assign permissions.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-xs font-black uppercase">Username</Label>
                                <Input 
                                    id="username" 
                                    value={formData.username} 
                                    onChange={e => setFormData({...formData, username: e.target.value})}
                                    placeholder="Enter username" 
                                    required 
                                    className="rounded-xl border-2 focus:border-primary/50 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-black uppercase">
                                    Password {editingUserId && "(Leave blank to keep current)"}
                                </Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                    <Input 
                                        id="password" 
                                        type="password"
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})}
                                        placeholder="••••••••" 
                                        required={!editingUserId}
                                        className="pl-10 rounded-xl border-2 focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase">Role</Label>
                                    <Select 
                                        value={formData.role} 
                                        onValueChange={v => setFormData({...formData, role: v as any})}
                                    >
                                        <SelectTrigger className="rounded-xl border-2 font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="basic">Basic User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase">Allowed Dashboard Tabs</Label>
                                <div className="grid grid-cols-2 gap-3 p-4 bg-muted/30 rounded-2xl border-2 border-dashed border-primary/10">
                                    {TABS.map(tab => (
                                        <div key={tab.id} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`tab-${tab.id}`} 
                                                checked={formData.permissions.includes(tab.id)}
                                                onCheckedChange={() => togglePermission(tab.id)}
                                                className="border-2 data-[state=checked]:bg-primary"
                                            />
                                            <label 
                                                htmlFor={`tab-${tab.id}`}
                                                className="text-xs font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                            >
                                                {tab.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <div className="p-6 border-t flex gap-3">
                            <Button type="submit" disabled={isSaving} className="flex-1 font-black uppercase">
                                {isSaving ? "Saving..." : editingUserId ? "Update User" : "Create User"}
                            </Button>
                            {editingUserId && (
                                <Button type="button" variant="outline" onClick={resetForm} className="font-black uppercase">
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>

                {/* Users List */}
                <Card className="xl:col-span-2 border-2 border-primary/5 shadow-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            System Users
                        </CardTitle>
                        <CardDescription>View and manage all active system users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : users.length === 0 ? (
                                <p className="text-center p-12 text-muted-foreground font-bold">No users found.</p>
                            ) : (
                                users.map(user => (
                                    <div 
                                        key={user._id} 
                                        className="flex items-center justify-between p-4 bg-muted/20 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                                <Shield className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-lg uppercase tracking-tight">{user.username}</h3>
                                                <div className="flex gap-2 mt-1">
                                                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="rounded-full hover:bg-primary/10 hover:text-primary">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(user._id)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
