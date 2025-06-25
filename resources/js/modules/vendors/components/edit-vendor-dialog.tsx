import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Edit2 } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Vendor } from '../types';
import { VendorFormFields } from './vendor-form-fields';

interface EditVendorDialogProps {
    vendor: Vendor;
    children?: React.ReactNode;
}

export function EditVendorDialog({ vendor, children }: EditVendorDialogProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: vendor.name,
        company_email: vendor.company_email,
        phone: vendor.phone || '',
        address: vendor.address || '',
        contact_person: vendor.contact_person || '',
        registration_number: vendor.registration_number || '',
        status: vendor.status,
        description: vendor.description || '',
    });

    // Reset form when vendor changes
    useEffect(() => {
        setData({
            name: vendor.name,
            company_email: vendor.company_email,
            phone: vendor.phone || '',
            address: vendor.address || '',
            contact_person: vendor.contact_person || '',
            registration_number: vendor.registration_number || '',
            status: vendor.status,
            description: vendor.description || '',
        });
    }, [vendor, setData]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('vendors.update', { vendor: vendor.id }), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="outline" size="sm">
                        <Edit2 className="mr-1 h-3 w-3" />
                        Edit
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Edit Vendor</DialogTitle>
                    <DialogDescription>Update vendor business profile information.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-6">
                    <VendorFormFields data={data} setData={setData} errors={errors} />
                    <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Updating...' : 'Update Vendor'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
