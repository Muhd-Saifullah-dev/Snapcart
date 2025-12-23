import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import './globals.css';
import Provider from './Provider';
import StoreProvider from '@/redux/StoreProvider';
import InitUser from '@/InitUser';

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
            <body className="w-full min-h-[200vh] bg-linear-to-b from-green-50 to-white">
                <Provider>
                    <StoreProvider>
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
                        <InitUser />
                        {children}
                    </StoreProvider>
                </Provider>
            </body>
        </html>
    );
}
