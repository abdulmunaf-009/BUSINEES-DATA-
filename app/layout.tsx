import type {Metadata} from 'next';
import { Cinzel_Decorative, Montserrat } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import VirtualConcierge from '@/components/VirtualConcierge';

const cinzel = Cinzel_Decorative({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-cinzel',
});

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Al-Moiz Dental Clinic | Cinematic Dental Experience',
  description: 'Premium Dental Care in Dubai',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${montserrat.variable} dark`}>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <VirtualConcierge />
        <Footer />
      </body>
    </html>
  );
}
