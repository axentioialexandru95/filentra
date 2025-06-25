import InputError from '@/shared/components/input-error';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

interface VendorFormFieldsProps {
    data: {
        name: string;
        company_email: string;
        phone: string;
        address: string;
        contact_person: string;
        registration_number: string;
        status: string;
        description: string;
    };
    setData: (key: string, value: string) => void;
    errors: Record<string, string>;
}

export function VendorFormFields({ data, setData, errors }: VendorFormFieldsProps) {
    return (
        <div className="grid gap-4">
            {/* Business Name and Status Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Business Name</Label>
                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Enter business name" required />
                    <InputError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.status} />
                </div>
            </div>

            {/* Email and Phone Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="company_email">Company Email</Label>
                    <Input
                        id="company_email"
                        type="email"
                        value={data.company_email}
                        onChange={(e) => setData('company_email', e.target.value)}
                        placeholder="company@example.com"
                        required
                    />
                    <InputError message={errors.company_email} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={data.phone || ''} onChange={(e) => setData('phone', e.target.value)} placeholder="+1-555-0123" />
                    <InputError message={errors.phone} />
                </div>
            </div>

            {/* Contact Person and Registration Number Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="contact_person">Contact Person</Label>
                    <Input
                        id="contact_person"
                        value={data.contact_person}
                        onChange={(e) => setData('contact_person', e.target.value)}
                        placeholder="Primary contact name"
                    />
                    <InputError message={errors.contact_person} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                        id="registration_number"
                        value={data.registration_number}
                        onChange={(e) => setData('registration_number', e.target.value)}
                        placeholder="Business registration number"
                    />
                    <InputError message={errors.registration_number} />
                </div>
            </div>

            {/* Address - Full Width */}
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                    id="address"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    placeholder="Business address"
                />
                <InputError message={errors.address} />
            </div>

            {/* Description - Full Width */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Business description and services"
                />
                <InputError message={errors.description} />
            </div>
        </div>
    );
}
