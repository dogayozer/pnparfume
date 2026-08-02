import './globals.css';

export const metadata = {
  title: 'Pien Olfactory Works | Kendi Markanı ve Kokunu Yarat',
  description: 'Pien Olfactory Works, nöro-parfümeri ilkeleriyle çalışan yeni nesil lüks koku stüdyosudur.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
