import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { VendorFormFields } from './vendor-form-fields';

interface CreateVendorDialogProps {
    children?: React.ReactNode;
}

export function CreateVendorDialog({ children }: CreateVendorDialogProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        company_email: '',
        phone: '',
        address: '',
        contact_person: '',
        registration_number: '',
        status: 'active',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('vendors.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
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
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vendor
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent
                className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Add New Vendor</DialogTitle>
                    <DialogDescription>Create a new vendor business profile. Fill in the required information below.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-6">
                    <VendorFormFields data={data} setData={setData} errors={errors} />
                    <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={processing} className="w-full sm:w-auto">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Creating...' : 'Create Vendor'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
