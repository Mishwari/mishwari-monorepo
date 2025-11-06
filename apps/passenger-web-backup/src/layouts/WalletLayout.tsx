import React, { ReactNode } from 'react';
import Header from '@/components/WalletComponents/Header';

interface WalletLayoutProps {
  balance: number | undefined;
  children: ReactNode;
  loading: boolean; // Loading state for wallet balance
}

const WalletLayout: React.FC<WalletLayoutProps> = ({ balance, children,loading }) => {
  return (
    <main className="h-screen bg-[#eaf6fe]">
      <Header balance={balance} loading={loading} />
      <section className="">{children}</section>
    </main>
  );
};

export default WalletLayout;
