import { articles } from '@/data/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Generate static params for the articles
export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)
  if (!article) return { title: 'Makale Bulunamadı' }
  
  return {
    title: `${article.title} | PN Parfüm`,
    description: article.excerpt,
  }
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const article = articles.find((a) => a.slug === resolvedParams.slug)

  if (!article) {
    notFound()
  }

  // Simple markdown-like to HTML conversion for the content
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-medium mt-8 mb-4">{line.replace('### ', '')}</h3>
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-light mt-10 mb-6 text-accent-gold">{line.replace('## ', '')}</h2>
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-2 list-disc">{line.replace('- ', '')}</li>
      }
      if (line.startsWith('**') && line.includes(':**')) {
        const parts = line.split(':**');
        return <p key={i} className="mb-4"><strong className="font-medium text-foreground">{parts[0].replace('**', '')}:</strong>{parts[1]}</p>
      }
      if (line.trim() === '') {
        return <br key={i} />
      }
      return <p key={i} className="mb-4 text-foreground/80 leading-relaxed">{line}</p>
    })
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-foreground/5 flex items-center justify-center">
        <img 
          src={article.coverImage} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl w-full px-6 text-center mt-20">
          <div className="flex items-center justify-center space-x-3 text-xs text-foreground/70 mb-6 tracking-widest uppercase">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-light leading-tight">{article.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 mt-12 md:mt-20">
        <Link href="/kesfet" className="inline-flex items-center text-sm font-medium text-accent-gold hover:text-accent-rose transition-colors mb-10">
          <ArrowLeft size={16} className="mr-2" /> Rehbere Dön
        </Link>
        
        <div className="mb-10 w-full aspect-video md:h-[450px] relative rounded-2xl overflow-hidden shadow-2xl border border-foreground/10">
          <img 
            src={article.coverImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          {formatContent(article.content)}
        </div>
        
        {/* Author Bio / CTA */}
        <div className="mt-20 pt-10 border-t border-foreground/10 text-center">
          <h4 className="text-lg font-medium mb-3">PN Koku Uzmanları Ekibi</h4>
          <p className="text-foreground/60 text-sm mb-6 max-w-lg mx-auto">
            İnsan psikolojisi ve koku kimyasını birleştirerek sizin için en doğru algıyı yaratacak formülleri geliştiriyoruz.
          </p>
          <Link href="/katalog" className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background hover:bg-accent-gold transition-colors">
            Koleksiyonumuzu Keşfedin
          </Link>
        </div>
      </div>
    </div>
  )
}
