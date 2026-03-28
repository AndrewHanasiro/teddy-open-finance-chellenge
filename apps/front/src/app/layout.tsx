import { AuthProvider } from './context/auth.context';
import './global.css';

export const metadata = {
  title: 'Teddy Open Finance Challenge',
  description: 'Challenged by Me',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
