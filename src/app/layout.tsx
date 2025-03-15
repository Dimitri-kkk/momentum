import { firaGO } from './fonts'
import './globals.css'
import Link from 'next/link'
import Image from 'next/image'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ka" className={firaGO.variable}>
      <body className="font-sans min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href="/tasks">
              <Image src="/momentum.png" alt="Momentum" width={210} height={38} priority />
            </Link>

            <nav className="w-full md:w-auto">
              <ul className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-10 w-full">
                <li className="w-full sm:w-auto">
                  <Link 
                    href="/employees/create" 
                    className="text-[#212529] text-base font-normal border border-[#8338EC] px-5 py-2.5 rounded block text-center"
                  >
                    თანამშრომლის შექმნა
                  </Link>
                </li>
                <li className="w-full sm:w-auto">
                  <Link 
                    href="/tasks/create" 
                    className="text-white text-base font-normal bg-[#8338EC] px-5 py-2.5 rounded block text-center"
                  >
                    + შექმენი ახალი დავალება
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="min-h-[calc(100vh-80px)]">{children}</main>
      </body>
    </html>
  )
}
