import { Button } from '@/shared/components/ui/button';
import { router } from '@inertiajs/react';

interface UserPaginationData {
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
}

interface UserPaginationProps {
    paginationData: UserPaginationData;
    usersIndexRoute: string;
    search: string;
    status: string;
}

export default function UserPagination({ paginationData, usersIndexRoute, search, status }: UserPaginationProps) {
    if (paginationData.last_page <= 1) {
        return null;
    }

    return (
        <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {paginationData.from} to {paginationData.to} of {paginationData.total} results
            </div>
            <div className="flex items-center gap-2">
                {paginationData.current_page > 1 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.get(`${usersIndexRoute}?page=${paginationData.current_page - 1}`, { search, status })}
                    >
                        Previous
                    </Button>
                )}
                <span className="text-sm">
                    Page {paginationData.current_page} of {paginationData.last_page}
                </span>
                {paginationData.current_page < paginationData.last_page && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.get(`${usersIndexRoute}?page=${paginationData.current_page + 1}`, { search, status })}
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );
}
