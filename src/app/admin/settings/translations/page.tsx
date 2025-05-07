
'use client';

import *ాలు
import { useForm, SubmitHandler, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, Languages, PlusCircle, Trash2, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';

// Mock data structure for translation strings
interface TranslationString {
  id: string; // Unique key for the string, e.g., "homepage.welcome_message"
  english: string;
  amharic: string;
  notes?: string; // Context or notes for translators
}

const mockTranslations: TranslationString[] = [
  { id: 'common.submit', english: 'Submit', amharic: 'አስገባ', notes: 'Generic submit button text' },
  { id: 'homepage.hero_title', english: 'Welcome to EasyMeds Ethiopia', amharic: 'ወደ ኢዚሜድስ ኢትዮጵያ እንኳን በደህና መጡ', notes: 'Main title on homepage' },
  { id: 'product.add_to_cart', english: 'Add to Cart', amharic: 'ወደ ጋሪ አክል', notes: 'Button on product pages' },
];

const translationStringSchema = z.object({
  id: z.string().min(1, "Key is required."),
  english: z.string().min(1, "English translation is required."),
  amharic: z.string().min(1, "Amharic translation is required."),
  notes: z.string().optional(),
});

const translationsSchema = z.object({
  translations: z.array(translationStringSchema),
});

type TranslationsFormData = z.infer<typeof translationsSchema>;

export default function TranslationsPage() {
  const { toast } = useToast();
  
  const { control, handleSubmit, register, formState: { errors, isDirty } } = useForm<TranslationsFormData>({
    resolver: zodResolver(translationsSchema),
    defaultValues: {
      translations: mockTranslations,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "translations",
  });

  const onSubmit: SubmitHandler<TranslationsFormData> = async (data) => {
    console.log('Updated translations:', data.translations);
    // Simulate API call to save translations (e.g., to a JSON file or database)
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Translations Saved",
      description: "Language strings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Translations Management (i18n)"
        breadcrumbs={[{ label: 'System Configuration', href: '/admin/settings/general' }, { label: 'Translations' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Manage Language Strings</CardTitle>
            <CardDescription>Add, edit, or remove translation strings for English and Amharic.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="p-4 bg-secondary/30">
                <CardHeader className="p-0 pb-3 mb-3 border-b flex flex-row justify-between items-center">
                    <div>
                        <Label htmlFor={`translations.${index}.id`} className="text-base font-semibold">Translation Key</Label>
                        <Controller
                            name={`translations.${index}.id`}
                            control={control}
                            render={({ field: inputField }) => <Input {...inputField} id={`translations.${index}.id`} placeholder="e.g., common.button.save" className="mt-1"/>}
                        />
                         {errors.translations?.[index]?.id && <p className="text-sm text-destructive mt-1">{errors.translations[index]?.id?.message}</p>}
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:text-destructive/80 mt-5">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`translations.${index}.english`}>English (EN)</Label>
                    <Controller
                        name={`translations.${index}.english`}
                        control={control}
                        render={({ field: inputField }) => <Textarea {...inputField} id={`translations.${index}.english`} rows={2} />}
                    />
                     {errors.translations?.[index]?.english && <p className="text-sm text-destructive mt-1">{errors.translations[index]?.english?.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor={`translations.${index}.amharic`}>Amharic (AM)</Label>
                    <Controller
                        name={`translations.${index}.amharic`}
                        control={control}
                        render={({ field: inputField }) => <Textarea {...inputField} id={`translations.${index}.amharic`} rows={2} />}
                    />
                    {errors.translations?.[index]?.amharic && <p className="text-sm text-destructive mt-1">{errors.translations[index]?.amharic?.message}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`translations.${index}.notes`}>Notes for Translators (Optional)</Label>
                     <Controller
                        name={`translations.${index}.notes`}
                        control={control}
                        render={({ field: inputField }) => <Input {...inputField} id={`translations.${index}.notes`} placeholder="Context or special instructions"/>}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button 
                type="button" 
                variant="outline" 
                onClick={() => append({ id: `new_key_${fields.length}`, english: '', amharic: '', notes: '' })}
                className="mt-4"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Translation String
            </Button>
            <div className="flex gap-2 mt-4">
                <Button type="button" variant="outline"><Globe className="mr-2 h-4 w-4"/> Import Translations (JSON/CSV)</Button>
                <Button type="button" variant="outline"><Languages className="mr-2 h-4 w-4"/> Export Translations (JSON)</Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!isDirty}>
              <Save className="mr-2 h-4 w-4" /> Save All Translations
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
