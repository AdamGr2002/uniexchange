import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import NotificationList from '../components/notification-list'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UniExchange',
  description: 'Exchange university materials with students across Tunisia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="flex">
            <div className="flex-grow">{children}</div>
            <div className="w-64 p-4 border-l">
              <NotificationList />
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}