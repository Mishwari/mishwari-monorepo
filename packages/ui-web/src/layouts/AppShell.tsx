import { AppShellProps } from './types';

export const AppShell = ({ topBar, sidebar, bottomNav, banner, mobileMenu, children }: AppShellProps) => (
  <div className="min-h-screen bg-gray-50">
    {banner}
    {topBar}
    {mobileMenu}
    {sidebar}
    <main className="flex-1 md:mr-[30%] px-4 py-8" style={{ marginTop: topBar ? '64px' : '0' }}>
      {children}
    </main>
    {bottomNav}
  </div>
);
