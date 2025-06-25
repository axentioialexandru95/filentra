import { type BreadcrumbItem } from '@/core/types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import AppLayout from '@/shared/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import { VendorFormFields } from '../components/vendor-form-fields';
import { VendorEditProps } from '../types';

export default function VendorEdit({ vendor }: VendorEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Vendors',
            href: '/vendors',
        },
        {
            title: vendor.name,
            href: `/vendors/${vendor.id}`,
        },
        {
            title: 'Edit',
            href: `/vendors/${vendor.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: vendor.name,
        company_email: vendor.company_email,
        phone: vendor.phone || '',
        address: vendor.address || '',
        contact_person: vendor.contact_person || '',
        registration_number: vendor.registration_number || '',
        status: vendor.status,
        description: vendor.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('vendors.update', { vendor: vendor.id }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${vendor.name}`} />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href={route('vendors.show', { vendor: vendor.id })}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Vendor
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Edit Vendor</h2>
                        <p className="text-muted-foreground">Update vendor business information</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Vendor Details</CardTitle>
                        <CardDescription>Update the vendor business profile information below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <VendorFormFields data={data} setData={setData} errors={errors} />
                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Vendor'}
                                </Button>
                                <Link href={route('vendors.show', { vendor: vendor.id })}>
                                    <Button variant="outline" type="button">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
