
'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Settings, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockGeneralSettings } from '@/app/admin/_lib/mock-data';
import type { GeneralSetting } from '@/app/admin/_types';

// Dynamically create schema based on mockSettings to ensure all keys are present
const settingSchemaDefinition = mockGeneralSettings.reduce((acc, setting) => {
  let fieldSchema;
  switch (setting.type) {
    case 'number':
      fieldSchema = z.coerce.number(); // Coerce string from input to number
      break;
    case 'boolean':
      fieldSchema = z.boolean();
      break;
    case 'select':
      // Ensure options is an array of strings and not empty for enum creation
      if (Array.isArray(setting.options) && setting.options.length > 0 && setting.options.every(opt => typeof opt === 'string')) {
         // Cast to [string, ...string[]] to satisfy z.enum if options is guaranteed non-empty
        fieldSchema = z.enum(setting.options as [string, ...string[]]);
      } else {
        fieldSchema = z.string(); // Fallback if options are invalid
      }
      break;
    default: // string
      fieldSchema = z.string().min(1, `${setting.description} cannot be empty.`);
  }
  acc[setting.key] = fieldSchema;
  return acc;
}, {} as Record<string, z.ZodTypeAny>);

const generalSettingsSchema = z.object(settingSchemaDefinition);

type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  
  // Prepare initial form values from mockGeneralSettings
  const initialFormValues = mockGeneralSettings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, any>);

  const { register, handleSubmit, control, formState: { errors, isDirty } } = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: initialFormValues,
  });

  const onSubmit: SubmitHandler<GeneralSettingsFormData> = async (data) => {
    console.log('Updated general settings:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Settings Updated",
      description: "General platform settings have been successfully saved.",
    });
    // Potentially re-fetch settings or update local state if they affect the UI immediately
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="General Platform Settings"
        breadcrumbs={[{ label: 'System Configuration'}]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Manage core settings for the EasyMeds platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mockGeneralSettings.map((setting) => (
              <div key={setting.key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-3 border-b last:border-b-0">
                <div className="md:col-span-1">
                  <Label htmlFor={setting.key} className="font-semibold">{setting.description}</Label>
                  <p className="text-xs text-muted-foreground">Key: <code>{setting.key}</code></p>
                </div>
                <div className="md:col-span-2">
                  {setting.type === 'string' && (
                    <Input id={setting.key} {...register(setting.key as keyof GeneralSettingsFormData)} />
                  )}
                  {setting.type === 'number' && (
                    <Input id={setting.key} type="number" {...register(setting.key as keyof GeneralSettingsFormData)} />
                  )}
                  {setting.type === 'boolean' && (
                     <Controller
                        name={setting.key as keyof GeneralSettingsFormData}
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={setting.key}
                                    checked={field.value as boolean}
                                    onCheckedChange={field.onChange}
                                />
                                <Label htmlFor={setting.key} className="font-normal">
                                    {field.value ? "Enabled" : "Disabled"}
                                </Label>
                            </div>
                        )}
                    />
                  )}
                  {setting.type === 'select' && setting.options && (
                     <Controller
                        name={setting.key as keyof GeneralSettingsFormData}
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value as string}>
                                <SelectTrigger id={setting.key}><SelectValue placeholder={`Select ${setting.description}`} /></SelectTrigger>
                                <SelectContent>
                                    {setting.options?.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                  )}
                  {errors[setting.key as keyof GeneralSettingsFormData] && (
                    <p className="text-sm text-destructive mt-1">{(errors[setting.key as keyof GeneralSettingsFormData] as any)?.message}</p>
                  )}
                </div>
              </div>
            ))}
             <Alert variant="default" className="mt-6 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-700 font-semibold">Caution</AlertTitle>
                <AlertDescription className="text-amber-600">
                    Changing some of these settings may significantly impact platform behavior. Ensure you understand the implications before saving.
                </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!isDirty}>
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
