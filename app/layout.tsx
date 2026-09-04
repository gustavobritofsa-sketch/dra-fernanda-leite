import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ variable: '--font-serif', subsets: ['latin'], weight: ['400','500','600'] });
const sans = Manrope({ variable: '--font-sans', subsets: ['latin'], weight: ['400','500','600','700'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dra-fernanda-leite-direito-aereo.pedrinhomurutuba.chatgpt.site'),
  title: 'Dra. Fernanda Leite | Direito do Passageiro Aéreo',
  description: 'Atuação jurídica voltada a passageiros em situações de atraso, cancelamento, overbooking e problemas com bagagem.',
  openGraph: { title: 'Dra. Fernanda Leite | Direito do Passageiro Aéreo', description: 'Atuação jurídica responsável para passageiros que enfrentaram problemas com voos.', type: 'website', locale: 'pt_BR', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'Dra. Fernanda Leite | Direito do Passageiro Aéreo', description: 'Atuação jurídica responsável para passageiros que enfrentaram problemas com voos.', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
