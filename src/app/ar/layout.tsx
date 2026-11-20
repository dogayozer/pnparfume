import LocaleSidebarLayout from '@/components/b2b/LocaleSidebarLayout'

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return <LocaleSidebarLayout locale="ar">{children}</LocaleSidebarLayout>
}
