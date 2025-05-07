import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  href: string;
  category?: string;
  author?: string;
  publishDate?: string;
  dataAiHint?: string;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={article.href} className="block group">
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <div className="relative w-full h-48 bg-secondary">
          <Image
            src={article.image}
            alt={article.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint={article.dataAiHint || "health article"}
          />
        </div>
        <CardHeader className="pb-2">
          {article.category && (
            <p className="text-xs text-primary font-medium mb-1">{article.category.toUpperCase()}</p>
          )}
          <CardTitle className="text-lg group-hover:text-primary line-clamp-2">{article.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
          {(article.author || article.publishDate) && (
            <div className="text-xs text-muted-foreground mt-2">
              {article.author && <span>By {article.author}</span>}
              {article.author && article.publishDate && <span> &bull; </span>}
              {article.publishDate && <span>{article.publishDate}</span>}
            </div>
          )}
        </CardContent>
        <CardFooter className="mt-auto">
          <Button variant="link" className="p-0 text-primary group-hover:underline">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
