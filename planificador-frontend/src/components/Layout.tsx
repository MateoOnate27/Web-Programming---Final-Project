import { type ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <div
        className="bg-light min-vh-100 d-flex justify-content-center align-items-start py-5"
        style={{ paddingTop: '80px' }}
      >
        <div
          className="bg-white shadow rounded p-4"
          style={{ width: '100%', maxWidth: '1200px', minHeight: '80vh' }}
        >
          {children}
        </div>
      </div>
    </>
  );
}


