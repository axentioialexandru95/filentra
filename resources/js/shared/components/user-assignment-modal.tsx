import { useForm } from '@inertiajs/react';
import { Loader2, Search, UserMinus, UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface User {
    id: number;
    name: string;
    email: string;
    role?: {
        id: number;
        name: string;
    };
    email_verified_at?: string;
}

interface Tenant {
    id: number;
    name: string;
    subdomain: string;
}

interface UserAssignmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tenant: Tenant;
    assignedUsers: User[];
    mode: 'assign' | 'remove';
}

export default function UserAssignmentModal({ open, onOpenChange, tenant, assignedUsers, mode }: UserAssignmentModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const {
        setData,
        post,
        delete: destroy,
        processing,
    } = useForm({
        user_ids: [] as number[],
    });

    // Fetch unassigned users for assignment or assigned users for removal
    useEffect(() => {
        if (open) {
            setLoading(true);
            if (mode === 'assign') {
                // Fetch unassigned users
                fetch('/tenants/unassigned-users')
                    .then((response) => response.json())
                    .then((data) => {
                        setUsers(data);
                        setFilteredUsers(data);
                    })
                    .catch((error) => {
                        console.error('Error fetching unassigned users:', error);
                        alert('Failed to load users');
                    })
                    .finally(() => setLoading(false));
            } else {
                // Use assigned users for removal
                setUsers(assignedUsers);
                setFilteredUsers(assignedUsers);
                setLoading(false);
            }
        }
    }, [open, mode, assignedUsers]);

    // Filter users based on search query
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(
                (user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase()),
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const handleUserToggle = (userId: number) => {
        setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
    };

    const handleSelectAll = () => {
        if (selectedUserIds.length === filteredUsers.length) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(filteredUsers.map((user) => user.id));
        }
    };

    const handleSubmit = () => {
        if (selectedUserIds.length === 0) {
            alert('Please select at least one user');
            return;
        }

        const url = mode === 'assign' ? `/tenants/${tenant.id}/assign-users` : `/tenants/${tenant.id}/remove-users`;

        // Update form data with selected user IDs
        setData('user_ids', selectedUserIds);

        if (mode === 'assign') {
            post(url, {
                onSuccess: () => {
                    onOpenChange(false);
                    setSelectedUserIds([]);
                    setSearchQuery('');
                    setData('user_ids', []);
                },
                onError: (errors) => {
                    console.error('Assignment error:', errors);
                    alert('Failed to update user assignments');
                },
            });
        } else {
            destroy(url, {
                onSuccess: () => {
                    onOpenChange(false);
                    setSelectedUserIds([]);
                    setSearchQuery('');
                    setData('user_ids', []);
                },
                onError: (errors) => {
                    console.error('Assignment error:', errors);
                    alert('Failed to update user assignments');
                },
            });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {mode === 'assign' ? (
                            <>
                                <UserPlus className="h-5 w-5" />
                                Assign Users to {tenant.name}
                            </>
                        ) : (
                            <>
                                <UserMinus className="h-5 w-5" />
                                Remove Users from {tenant.name}
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'assign'
                            ? 'Select users to assign to this tenant. Only unassigned users are shown.'
                            : 'Select users to remove from this tenant. This will unassign them from the tenant.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 flex-col gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Select All */}
                    {!loading && filteredUsers.length > 0 && (
                        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                            <Checkbox
                                checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                                onCheckedChange={handleSelectAll}
                            />
                            <Label className="text-sm font-medium">Select All ({filteredUsers.length} users)</Label>
                            {selectedUserIds.length > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                    {selectedUserIds.length} selected
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Users List */}
                    <div className="flex-1 overflow-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="ml-2">Loading users...</span>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">
                                <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p>{mode === 'assign' ? 'No unassigned users found' : 'No users assigned to this tenant'}</p>
                                {searchQuery && <p className="mt-1 text-sm">Try adjusting your search query</p>}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                                            selectedUserIds.includes(user.id) ? 'border-primary bg-muted' : 'bg-background'
                                        }`}
                                        onClick={() => handleUserToggle(user.id)}
                                    >
                                        <Checkbox checked={selectedUserIds.includes(user.id)} onChange={() => handleUserToggle(user.id)} />
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{user.name}</p>
                                            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {user.role && (
                                                <Badge variant="outline" className="text-xs">
                                                    {user.role.name}
                                                </Badge>
                                            )}
                                            {user.email_verified_at && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={processing || selectedUserIds.length === 0}
                        className={mode === 'assign' ? '' : 'bg-destructive hover:bg-destructive/90'}
                    >
                        {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {mode === 'assign' ? 'Assign Users' : 'Remove Users'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
