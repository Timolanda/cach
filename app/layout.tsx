import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from './components/navbar'
import { Footer } from './components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cach - Tokenize Your Digital Assets',
  description: 'Transform your business, ideas, music albums, and social media channels into valuable digital assets through tokenization.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

