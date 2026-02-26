"use client"

import { Edit, Trash2 } from "lucide-react"

interface SalaryTableProps {
    salaries: any[]
    onEdit: (salary: any) => void
    onDelete: (id: string) => void
}

export default function SalaryTable({ salaries, onEdit, onDelete }: SalaryTableProps) {
    if (salaries.length === 0) {
        return (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
                No salary records found.
            </div>
        )
    }

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-muted/50 border-b border-border">
                            <th className="px-6 py-4 font-semibold text-sm w-12">No.</th>
                            <th className="px-6 py-4 font-semibold text-sm">Employee</th>
                            <th className="px-6 py-4 font-semibold text-sm">Amount</th>
                            <th className="px-6 py-4 font-semibold text-sm">Method</th>
                            <th className="px-6 py-4 font-semibold text-sm">Date</th>
                            <th className="px-6 py-4 font-semibold text-sm">Remarks</th>
                            <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {salaries.map((salary, index) => (
                            <tr key={salary.id || salary._id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-4 text-xs font-bold text-muted-foreground">{index + 1}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-foreground">{salary.employeeName || "Unknown"}</div>
                                    <div className="text-xs text-muted-foreground">{salary.employeeCode}</div>
                                </td>
                                <td className="px-6 py-4 font-bold text-secondary">
                                    ₹{salary.amount?.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                        {salary.paymentMethod}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {new Date(salary.paymentDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground italic truncate max-w-[200px]">
                                    {salary.remarks || "-"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(salary)}
                                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(salary.id || salary._id)}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-secondary/5 font-black border-t-2 border-secondary/10">
                            <td colSpan={2} className="px-6 py-6 text-sm uppercase tracking-widest text-primary/50">Total Disbursed</td>
                            <td className="px-6 py-6 text-lg text-secondary">
                                ₹{salaries.reduce((acc, sale) => acc + (Number(sale.amount) || 0), 0).toLocaleString()}
                            </td>
                            <td colSpan={4}></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}
