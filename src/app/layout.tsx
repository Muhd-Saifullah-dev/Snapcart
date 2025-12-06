import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import './globals.css';
import Provider from './Provider';

export const metadata: Metadata = {
  title: 'Snapcart | 10 minutes grocery Delivery app',
  description: '10 minutes grocery Delivery app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
        <Provider>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          {children}
        </Provider>
      </body>
    </html>
  );
}
