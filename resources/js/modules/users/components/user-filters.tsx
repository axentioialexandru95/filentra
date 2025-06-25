import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { router } from '@inertiajs/react';
import { useState } from 'react';

interface UserFiltersProps {
    initialSearch?: string;
    initialStatus?: string;
    usersIndexRoute: string;
}

export default function UserFilters({ initialSearch = '', initialStatus = 'all', usersIndexRoute }: UserFiltersProps) {
    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState(initialStatus);

    const handleSearch = () => {
        const searchParams: { search?: string; status?: string } = {};
        if (search) searchParams.search = search;
        if (status && status !== 'all') searchParams.status = status;
        router.get(usersIndexRoute, searchParams, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setSearch('');
        setStatus('all');
        router.get(usersIndexRoute, {}, { preserveState: true, replace: true });
    };

    return (
        <div className="mb-6 flex items-center gap-4">
            <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="max-w-sm"
            />
            <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Search</Button>
            <Button variant="outline" onClick={handleReset}>
                Reset
            </Button>
        </div>
    );
}
