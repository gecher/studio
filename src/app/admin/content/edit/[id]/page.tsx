
'use client';

import *ాలు
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Save, X, Type, Languages, CalendarPlus, UserCircle, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHeader from '@/app/admin/_components/admin-header';
import { useToast } from '@/hooks/use-toast';
import { mockContentItems } from '@/app/admin/_lib/mock-data';
import type { ContentItem } from '@/app/admin/_types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const contentEditSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  type: z.enum(['article', 'video', 'faq']),
  category: z.string().min(2, { message: "Category is required." }),
  language: z.enum(['english', 'amharic', 'both']),
  status: z.enum(['published', 'draft', 'archived']),
  publishDate: z.string().refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid publish date"}),
  author: z.string().optional(),
  summary: z.string().max(300, "Summary should be max 300 characters.").optional(),
  contentBody: z.string().min(50, { message: "Content body must be at least 50 characters." }).optional(), // Optional if type is video
  videoUrl: z.string().url({ message: "Invalid URL for video." }).optional(),
});

type ContentEditFormData = z.infer<typeof contentEditSchema>;

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const contentId = params.id as string;

  const [contentItem, setContentItem] = React.useState<ContentItem | null>(null);
  
  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<ContentEditFormData>({
    resolver: zodResolver(contentEditSchema),
  });
  
  const selectedType = watch('type');

  React.useEffect(() => {
    const foundItem = mockContentItems.find(item => item.id === contentId);
    if (foundItem) {
      setContentItem(foundItem);
      reset({
        title: foundItem.title,
        type: foundItem.type,
        category: foundItem.category,
        language: foundItem.language,
        status: foundItem.status,
        publishDate: foundItem.publishDate,
        author: foundItem.author || '',
        summary: `Summary for ${foundItem.title}`, // Mock summary
        contentBody: `This is the main content for ${foundItem.title}. It should be long enough.`, // Mock content
        videoUrl: foundItem.type === 'video' ? 'https://www.youtube.com/example' : '', // Mock video URL
      });
    } else {
      toast({ variant: "destructive", title: "Content not found" });
      router.push('/admin/content');
    }
  }, [contentId, reset, router, toast]);

  const onSubmit: SubmitHandler<ContentEditFormData> = async (data) => {
    if (data.type === 'video' && !data.videoUrl) {
        toast({ variant: "destructive", title: "Validation Error", description: "Video URL is required for video content."});
        return;
    }
    if (data.type !== 'video' && !data.contentBody) {
         toast({ variant: "destructive", title: "Validation Error", description: "Content body is required for articles/FAQs."});
        return;
    }
    console.log('Updated content data:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Content Updated",
      description: `Content "${data.title}" has been updated.`,
    });
    router.push('/admin/content');
  };

  const handleDeleteContent = async () => {
    console.log("Deleting content:", contentId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Content Deleted",
      description: `Content "${contentItem?.title}" has been deleted.`,
      variant: "destructive"
    });
    router.push('/admin/content');
  };

  if (!contentItem) {
    return <div>Loading content...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title={`Edit Content: ${contentItem.title.substring(0,30)}...`}
        breadcrumbs={[{ label: 'Content Management', href: '/admin/content' }, { label: 'Edit Content' }]}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
            <CardDescription>Content ID: {contentItem.id}</CardDescription>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="type"><Type className="mr-2 h-4 w-4 text-muted-foreground" /><SelectValue /></SelectTrigger>
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
                <Input id="category" {...register('category')} />
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                 <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="language"><Languages className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="amharic">Amharic</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
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
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" type="url" {...register('videoUrl')} />
                {errors.videoUrl && <p className="text-sm text-destructive mt-1">{errors.videoUrl.message}</p>}
              </div>
            ) : (
              <div>
                <Label htmlFor="contentBody">{selectedType === 'faq' ? 'Answer' : 'Main Content'}</Label>
                <Textarea id="contentBody" {...register('contentBody')} rows={10} />
                {errors.contentBody && <p className="text-sm text-destructive mt-1">{errors.contentBody.message}</p>}
              </div>
            )}

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Publishing Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Controller name="status" control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="status"><SelectValue /></SelectTrigger>
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
                    <Label htmlFor="author">Author</Label>
                     <div className="relative">
                        <UserCircle className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input id="author" {...register('author')} className="pl-7"/>
                    </div>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" type="button"><Trash2 className="mr-2 h-4 w-4" /> Delete Content</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete this content item.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteContent}>Continue</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex gap-2">
              <Link href="/admin/content" passHref><Button variant="outline" type="button"><X className="mr-2 h-4 w-4" /> Cancel</Button></Link>
              <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <hr className={`border-border ${className}`} />;
}
