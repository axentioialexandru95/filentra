import { type User } from '@/core/types';
import { Button } from '@/shared/components/ui/button';
import { Link, router } from '@inertiajs/react';
import { UserCheck } from 'lucide-react';

interface UserActionsCellProps {
    user: User;
    currentUser?: User;
}

export default function UserActionsCell({ user, currentUser }: UserActionsCellProps) {
    const handleImpersonate = (userId: number) => {
        router.post(
            `/impersonate/${userId}`,
            {},
            {
                onSuccess: () => {
                    // Page will redirect on success
                },
                onError: (errors) => {
                    console.error('Impersonation failed:', errors);
                },
            },
        );
    };

    const canImpersonateUser = (user: User) => {
        // Check if current user is superadmin
        if (!currentUser?.is_superadmin) {
            return false;
        }

        // Cannot impersonate yourself
        if (user.id === currentUser.id) {
            return false;
        }

        // Cannot impersonate other superadmins
        if (user.role?.slug === 'superadmin') {
            return false;
        }

        return true;
    };

    const getUserShowRoute = (userId: number) => {
        return route('users.show', { user: userId });
    };

    const getUserEditRoute = (userId: number) => {
        return route('users.edit', { user: userId });
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={getUserShowRoute(user.id)}>View</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
                <Link href={getUserEditRoute(user.id)}>Edit</Link>
            </Button>
            {canImpersonateUser(user) && (
                <Button variant="outline" size="sm" onClick={() => handleImpersonate(user.id)} title={`Impersonate ${user.name}`}>
                    <UserCheck className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
