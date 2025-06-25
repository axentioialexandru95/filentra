import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function VendorCreate() {
    useEffect(() => {
        // Redirect to vendors index page
        // The dialog will be opened programmatically
        router.visit(route('vendors.index'));
    }, []);

    return (
        <>
            <Head title="Add Vendor" />
            <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Redirecting to vendor list...</p>
                </div>
            </div>
        </>
    );
}
