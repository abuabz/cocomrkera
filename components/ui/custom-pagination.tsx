import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface CustomPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function CustomPagination({
    currentPage,
    totalPages,
    onPageChange,
}: CustomPaginationProps) {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const showMax = 5

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            let start = Math.max(1, currentPage - 2)
            let end = Math.min(totalPages, start + showMax - 1)

            if (end === totalPages) {
                start = Math.max(1, end - showMax + 1)
            }

            if (start > 1) {
                pages.push(1)
                if (start > 2) pages.push("ellipsis-1")
            }

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push("ellipsis-2")
                pages.push(totalPages)
            }
        }
        return pages
    }

    return (
        <div className="py-8 border-t border-border mt-8 flex flex-col items-center gap-4">
            <Pagination>
                <PaginationContent className="flex-wrap justify-center gap-2">
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) onPageChange(currentPage - 1)
                            }}
                            aria-disabled={currentPage === 1}
                            className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {getPageNumbers().map((page, idx) => (
                        <PaginationItem key={typeof page === 'string' ? page : `page-${page}`}>
                            {typeof page === 'string' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href="#"
                                    isActive={currentPage === page}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onPageChange(page)
                                    }}
                                    className="cursor-pointer"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) onPageChange(currentPage + 1)
                            }}
                            aria-disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                Displaying Page {currentPage} of {totalPages}
            </div>
        </div>
    )
}
