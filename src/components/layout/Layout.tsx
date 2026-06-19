import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Header />
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
}
