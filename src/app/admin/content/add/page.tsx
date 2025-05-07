
'use client';

import *ాలు
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, X, Type, Languages, CalendarPlus, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
// Assuming a rich text editor component might be used
// import { RichTextEditor } from '@/components/ui/rich-text-editor'; 

const contentSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  type: z.enum(['article', 'video', 'faq']),
  category: z.string().min(2, { message: "Category is required." }),
  language: z.enum(['english', 'amharic', 'both']),
  status: z.enum(['published', 'draft', 'archived']).default('draft'),
  publishDate: z.string().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid publish date"}),
  author: z.string().optional(),
  summary: z.string().max(300, "Summary should be max 300 characters.").optional(),
  contentBody: z.string().min(50, { message: "Content body must be at least 50 characters." }), // For article/FAQ
  videoUrl: z.string().url({ message: "Invalid URL for video." }).optional(), // For video type
  // Potentially: tags, featuredImage (URL or upload later)
});

type ContentFormData = z.infer<typeof contentSchema>;

export default function AddContentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      type: 'article',
      language: 'english',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0], // Default to today
    }
  });

  const selectedType = watch('type');

  const onSubmit: SubmitHandler<ContentFormData> = async (data) => {
    if (data.type === 'video' && !data.videoUrl) {
        toast({ variant: "destructive", title: "Validation Error", description: "Video URL is required for video content."});
        return;
    }
    console.log('New content data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Content Created",
      description: `Content "${data.title}" has been successfully created.`,
    });
    router.push('/admin/content'); 
  };

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Add New Content"
        breadcrumbs={[{ label: 'Content Management', href: '/admin/content' }, { label: 'Add New' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Content Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="type"><Type className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                {/* TODO: Fetch categories or use a predefined list/tag input */}
                <Input id="category" {...register('category')} placeholder="e.g., Diabetes, Nutrition" />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                 <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="language"><Languages className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue placeholder="Select language" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="amharic">Amharic</SelectItem>
                        <SelectItem value="both">Both (English & Amharic)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="summary">Summary / Short Description (Optional)</Label>
              <Textarea id="summary" {...register('summary')} rows={3} />
              {errors.summary && <p className="text-sm text-destructive mt-1">{errors.summary.message}</p>}
            </div>

            {selectedType === 'video' ? (
              <div>
                <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, etc.)</Label>
                <Input id="videoUrl" type="url" {...register('videoUrl')} placeholder="https://www.youtube.com/watch?v=..." />
                {errors.videoUrl && <p className="text-sm text-destructive mt-1">{errors.videoUrl.message}</p>}
              </div>
            ) : (
              <div>
                <Label htmlFor="contentBody">{selectedType === 'faq' ? 'Answer' : 'Main Content / Article Body'}</Label>
                {/* Replace with RichTextEditor if available */}
                <Textarea id="contentBody" {...register('contentBody')} rows={10} placeholder="Write your content here..."/>
                {errors.contentBody && <p className="text-sm text-destructive mt-1">{errors.contentBody.message}</p>}
              </div>
            )}

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Publishing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                            </Select>
                        )}
                    />
                </div>
                <div>
                    <Label htmlFor="publishDate">Publish Date</Label>
                    <div className="relative">
                        <CalendarPlus className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="publishDate" type="date" {...register('publishDate')} className="pl-7" />
                    </div>
                     {errors.publishDate && <p className="text-sm text-destructive mt-1">{errors.publishDate.message}</p>}
                </div>
                <div>
                    <Label htmlFor="author">Author (Optional)</Label>
                    <div className="relative">
                        <UserCircle className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="author" {...register('author')} placeholder="e.g., Dr. John Doe" className="pl-7"/>
                    </div>
                </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/admin/content" passHref>
              <Button variant="outline" type="button"><X className="mr-2 h-4 w-4" /> Cancel</Button>
            </Link>
            <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Content</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <hr className={`border-border ${className}`} />;
}
