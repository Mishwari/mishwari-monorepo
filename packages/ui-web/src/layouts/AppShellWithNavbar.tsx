import { ReactNode } from 'react';

interface AppShellWithNavbarProps {
  navbar: ReactNode;
  sidebar: ReactNode;
  mobileMenu?: ReactNode;
  children: ReactNode;
}

export const AppShellWithNavbar = ({ navbar, sidebar, mobileMenu, children }: AppShellWithNavbarProps) => (
  <div className="min-h-screen bg-white w-full">
    {navbar}
    {mobileMenu}
    {sidebar}
    <main className="w-full md:mr-[30%] md:w-[70%]" style={{ marginTop: '64px' }}>
      {children}
    </main>
  </div>
);
