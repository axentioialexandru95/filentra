import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Download, Mail, TrendingUp, Users } from 'lucide-react';

interface WaitlistEntry {
    id: number;
    email: string;
    interests: string;
    joined_at: string;
}

interface WaitlistStats {
    total_count: number;
    today_count: number;
    this_week_count: number;
}

interface Props {
    waitlist: {
        data: WaitlistEntry[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: WaitlistStats;
}

export default function WaitlistIndex({ waitlist, stats }: Props) {
    return (
        <>
            <Head title="Waitlist Management" />

            <div className="container mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Waitlist Management</h1>
                    <p className="text-muted-foreground">Manage and track your Filentra waitlist signups</p>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_count}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Today</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.today_count}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">This Week</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.this_week_count}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Waitlist Entries</h2>
                    <Link href={route('waitlist.export')}>
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </Link>
                </div>

                {/* Waitlist Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Signups</CardTitle>
                        <CardDescription>{waitlist.total} total entries</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {waitlist.data.map((entry) => (
                                <div key={entry.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Mail className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{entry.email}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(entry.joined_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{entry.interests}</Badge>
                                </div>
                            ))}
                        </div>

                        {/* Pagination would go here if needed */}
                        {waitlist.last_page > 1 && (
                            <div className="mt-6 flex justify-center">
                                <p className="text-sm text-muted-foreground">
                                    Page {waitlist.current_page} of {waitlist.last_page}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
