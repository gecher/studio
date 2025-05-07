
'use client';

import *ాలు
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Settings, CreditCard, KeyRound, PlusCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockPaymentGatewaySettings } from '@/app/admin/_lib/mock-data';
import type { PaymentGatewaySetting } from '@/app/admin/_types';

const paymentGatewaySettingSchema = z.object({
  id: z.string(),
  name: z.enum(['Stripe', 'Chapa', 'Telebirr']),
  apiKey: z.string().min(1, "API Key is required."),
  secretKey: z.string().min(1, "Secret Key is required."),
  isEnabled: z.boolean(),
  environment: z.enum(['sandbox', 'production']),
});

const paymentSettingsSchema = z.object({
  gateways: z.array(paymentGatewaySettingSchema),
});

type PaymentSettingsFormData = z.infer<typeof paymentSettingsSchema>;

export default function PaymentSettingsPage() {
  const { toast } = useToast();
  
  const { control, handleSubmit, formState: { errors, isDirty } } = useForm<PaymentSettingsFormData>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      gateways: mockPaymentGatewaySettings,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gateways",
  });

  const onSubmit: SubmitHandler<PaymentSettingsFormData> = async (data) => {
    console.log('Updated payment gateway settings:', data.gateways);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Payment Settings Updated",
      description: "Payment gateway configurations have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Payment Gateway Configuration"
        breadcrumbs={[{ label: 'System Configuration', href: '/admin/settings/general' }, { label: 'Payment Gateways' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Manage Payment Integrations</CardTitle>
            <CardDescription>Configure API keys and settings for supported payment gateways.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <CardHeader className="p-2 mb-2 flex flex-row justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard /> {field.name}
                    </CardTitle>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name is part of the field, not directly editable in this setup usually, but shown */}
                  <input type="hidden" {...control.register(`gateways.${index}.id` as const)} />
                  <input type="hidden" {...control.register(`gateways.${index}.name` as const)} />
                  
                  <div>
                    <Label htmlFor={`gateways.${index}.apiKey`}>API Key</Label>
                    <Controller
                        name={`gateways.${index}.apiKey`}
                        control={control}
                        render={({ field: inputField }) => <Input {...inputField} id={`gateways.${index}.apiKey`} placeholder="Enter API Key"/>}
                    />
                    {errors.gateways?.[index]?.apiKey && <p className="text-sm text-destructive mt-1">{errors.gateways[index]?.apiKey?.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor={`gateways.${index}.secretKey`}>Secret Key</Label>
                     <Controller
                        name={`gateways.${index}.secretKey`}
                        control={control}
                        render={({ field: inputField }) => <Input {...inputField} id={`gateways.${index}.secretKey`} type="password" placeholder="Enter Secret Key"/>}
                    />
                    {errors.gateways?.[index]?.secretKey && <p className="text-sm text-destructive mt-1">{errors.gateways[index]?.secretKey?.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                        <Label htmlFor={`gateways.${index}.environment`}>Environment</Label>
                         <Controller
                            name={`gateways.${index}.environment`}
                            control={control}
                            render={({ field: selectField }) => (
                                <Select onValueChange={selectField.onChange} value={selectField.value}>
                                <SelectTrigger id={`gateways.${index}.environment`}><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sandbox">Sandbox (Test)</SelectItem>
                                    <SelectItem value="production">Production (Live)</SelectItem>
                                </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="pt-5"> {/* Align with label */}
                        <Controller
                            name={`gateways.${index}.isEnabled`}
                            control={control}
                            render={({ field: switchField }) => (
                                <div className="flex items-center space-x-2">
                                <Switch
                                    id={`gateways.${index}.isEnabled`}
                                    checked={switchField.value}
                                    onCheckedChange={switchField.onChange}
                                />
                                <Label htmlFor={`gateways.${index}.isEnabled`} className="font-normal">
                                    {switchField.value ? "Enabled" : "Disabled"}
                                </Label>
                                </div>
                            )}
                        />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
             <Button 
                type="button" 
                variant="outline" 
                onClick={() => append({ id: `new_${Date.now()}`, name: 'Chapa', apiKey: '', secretKey: '', isEnabled: false, environment: 'sandbox' })}
                className="mt-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Gateway Configuration
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!isDirty}>
              <Save className="mr-2 h-4 w-4" /> Save Payment Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
