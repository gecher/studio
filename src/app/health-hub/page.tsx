'use client';

import { useState, useEffect } from 'react';
import ArticleCard from '@/components/article-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpenText, Video, MessageSquare, Filter, ListOrdered } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Mock data - replace with API calls
const articles = [
  { id: 'article1', title: 'Understanding Diabetes: Causes, Symptoms, and Management', summary: 'A comprehensive guide to living with diabetes, including diet tips and treatment options.', image: 'https://picsum.photos/seed/diabetesinfo/400/250', category: 'Diabetes Care', type: 'article', publishDate: '2024-07-15', dataAiHint: 'health book' },
  { id: 'article2', title: 'Malaria Prevention: Protecting Yourself and Your Family', summary: 'Learn effective strategies to prevent malaria, especially in high-risk areas.', image: 'https://picsum.photos/seed/malariaprevent/400/250', category: 'Infectious Diseases', type: 'article', publishDate: '2024-07-10', dataAiHint: 'mosquito net' },
  { id: 'article3', title: 'Hypertension: The Silent Killer and How to Control It', summary: 'Understand blood pressure, its risks, and lifestyle changes for better management.', image: 'https://picsum.photos/seed/hypertension/400/250', category: 'Heart Health', type: 'article', publishDate: '2024-07-05', dataAiHint: 'blood pressure' },
  { id: 'video1', title: 'Amharic Guide to Healthy Eating for Diabetics', summary: 'Watch this informative video in Amharic on meal planning for diabetes.', image: 'https://picsum.photos/seed/diabetesvideo/400/250', category: 'Diabetes Care', type: 'video', duration: '15:30', dataAiHint: 'video play button' },
  { id: 'faq1', title: 'Common Questions About Childhood Vaccinations', summary: 'Answers to frequently asked questions regarding vaccination schedules and safety.', image: 'https://picsum.photos/seed/vaccinefaq/400/250', category: 'Child Health', type: 'faq', dataAiHint: 'vaccine vial' },
  { id: 'article4', title: 'Mental Wellness: Tips for a Healthy Mind', summary: 'Explore strategies for managing stress and improving overall mental well-being.', image: 'https://picsum.photos/seed/mentalwellness/400/250', category: 'Mental Health', type: 'article', publishDate: '2024-06-28', dataAiHint: 'calm person' },
];

const categories = ['All', 'Diabetes Care', 'Infectious Diseases', 'Heart Health', 'Child Health', 'Mental Health', 'General Wellness'];

const faqs = [
    {
        question: "How do I know if I have diabetes?",
        answer: "Common symptoms of diabetes include frequent urination, excessive thirst, unexplained weight loss, extreme hunger, fatigue, and blurred vision. If you experience these symptoms, it's important to consult a doctor for proper diagnosis through blood tests."
    },
    {
        question: "What are the best ways to prevent malaria?",
        answer: "Malaria prevention involves several strategies: using insecticide-treated mosquito nets (ITNs), applying insect repellent containing DEET, wearing long-sleeved clothing and pants, especially during dusk and dawn, and taking antimalarial drugs if prescribed by a doctor when traveling to high-risk areas. Eliminating mosquito breeding sites around your home is also crucial."
    },
    {
        question: "What is hypertension and how can I manage it?",
        answer: "Hypertension, or high blood pressure, is a condition where the force of blood against your artery walls is consistently too high. It often has no symptoms but can lead to serious health problems. Management includes a healthy diet (low sodium, rich in fruits and vegetables), regular physical activity, maintaining a healthy weight, limiting alcohol, not smoking, and taking prescribed medications."
    }
];


export default function HealthHubPage() {
  const [content, setContent] = useState(articles);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); // latest, relevance (search-based)

  useEffect(() => {
    let filtered = articles;

    if (searchQuery) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime());
    }
    // 'relevance' would be backend driven

    setContent(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2"><BookOpenText /> Health Information Hub</h1>
        <p className="text-muted-foreground">Access verified health articles, videos, and FAQs in Amharic and English.</p>
      </header>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center p-4 bg-card rounded-lg shadow-sm">
        <div className="relative flex-grow w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search articles, videos, FAQs..."
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px] h-11">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}><Filter className="inline h-4 w-4 mr-2 text-muted-foreground"/>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] h-11">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest"><ListOrdered className="inline h-4 w-4 mr-2 text-muted-foreground"/>Latest</SelectItem>
            <SelectItem value="relevance"><Search className="inline h-4 w-4 mr-2 text-muted-foreground"/>Relevance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles"><BookOpenText className="mr-2 h-4 w-4" />Articles</TabsTrigger>
          <TabsTrigger value="videos"><Video className="mr-2 h-4 w-4" />Videos</TabsTrigger>
          <TabsTrigger value="faqs"><MessageSquare className="mr-2 h-4 w-4" />FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          {content.filter(c => c.type === 'article').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.filter(c => c.type === 'article').map(item => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No articles found matching your criteria.</p>
          )}
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          {/* Placeholder for video content */}
          {content.filter(c => c.type === 'video').length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.filter(c => c.type === 'video').map(item => (
                <ArticleCard key={item.id} article={item} /> // Reusing ArticleCard, can be specialized
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No Videos Available Yet</h3>
              <p className="text-muted-foreground">Check back soon for informative health videos.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="faqs" className="mt-6">
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqs.map((faqItem, index) => (
                 <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left hover:no-underline text-base md:text-lg">
                        {faqItem.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                        {faqItem.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
          {/* Fallback if no dynamic FAQs matching filters, but static FAQs are always shown */}
          {faqs.length === 0 && content.filter(c => c.type === 'faq').length === 0 && (
             <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No FAQs Found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
