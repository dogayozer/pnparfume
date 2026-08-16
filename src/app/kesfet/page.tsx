import Link from 'next/link'
import { articles } from '@/data/articles'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Koku Rehberi & Keşfet | PN Parfüm',
  description: 'yapay zeka analiz, koku psikolojisi ve doğru parfüm seçimi hakkında uzman makaleleri.',
}

export default function KesfetPage() {
  return (
    <div className="min-h-screen px-6 py-12 md:px-12 max-w-7xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-light mb-4">Koku Rehberi</h1>
        <p className="text-foreground/60 max-w-2xl text-lg">
          Koku alma duyusu, beynimizin duygular ve hafıza ile ilgilenen kısmına doğrudan bağlı olan tek duyudur. Parfüm sanatının ardındaki bilimi ve koku bilimi sırlarını keşfedin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {articles.map((article) => (
          <Link href={`/kesfet/${article.slug}`} key={article.slug} className="group flex flex-col">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-6 bg-foreground/5">
              {/* Fallback pattern if image is external and not configured in next.config, or just standard img tag for simplicity */}
              <img 
                src={article.coverImage} 
                alt={article.title} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-foreground/50 mb-3 tracking-widest uppercase">
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            
            <h2 className="text-xl font-medium mb-3 group-hover:text-accent-gold transition-colors">
              {article.title}
            </h2>
            
            <p className="text-foreground/70 text-sm mb-5 line-clamp-3 flex-grow">
              {article.excerpt}
            </p>
            
            <div className="mt-auto flex items-center text-sm font-medium text-accent-rose group-hover:text-accent-gold transition-colors">
              Makaleyi Oku <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
