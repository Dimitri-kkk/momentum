import localFont from 'next/font/local'

export const firaGO = localFont({
  src: [
    {
      path: '../../public/fonts/FiraGO-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/FiraGO-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/FiraGO-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-firago',
}) 