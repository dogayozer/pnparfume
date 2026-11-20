import LocaleSidebarLayout from '@/components/b2b/LocaleSidebarLayout'

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <LocaleSidebarLayout locale="en">{children}</LocaleSidebarLayout>
}
