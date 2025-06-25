import { getInitials } from '@/core/lib/utils';
import { type User } from '@/core/types';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import UserActionsCell from './user-actions-cell';

interface UserTableProps {
    users: User[];
    currentUser?: User;
}

export default function UserTable({ users, currentUser }: UserTableProps) {
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getRoleBadgeVariant = (roleSlug: string) => {
        switch (roleSlug) {
            case 'superadmin':
                return 'destructive';
            case 'admin':
                return 'default';
            case 'vendor':
                return 'secondary';
            case 'warehouse_manager':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    return (
        <div className="rounded-md border">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Joined</th>
                            <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-muted/50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        {user.role && <Badge variant={getRoleBadgeVariant(user.role.slug)}>{user.role.name}</Badge>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                            {user.email_verified_at ? 'Verified' : 'Unverified'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(user.created_at)}</td>
                                    <td className="px-4 py-3">
                                        <UserActionsCell user={user} currentUser={currentUser} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
