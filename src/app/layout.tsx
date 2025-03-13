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
    <html lang="en" className={firaGO.variable}>
      <body className="font-sans min-h-screen bg-gray-50">
        <header className="bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/tasks">
                <Image src="/momentum.png" alt="Momentum" width={210} height={38} />
              </Link>

            <nav>
              <ul className="flex space-x-10">
                <li>
                  <Link 
                    href="/employees/create" 
                    className="text-[#212529] text-base font-normal border border-[#8338EC] px-5 py-2.5 rounded"
                  >
                    თანამშრომლის შექმნა
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/tasks/create" 
                    className="text-white text-base font-normal bg-[#8338EC] px-5 py-2.5 rounded "
                  >
                    + შექმენი ახალი დავალება
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
