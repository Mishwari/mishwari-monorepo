import React, { useEffect, useState } from 'react';
import Header from '@/components//WalletComponents/Header';
import TransactionList from '@/components/WalletComponents/TransactionList';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import axios from 'axios';
import { decryptToken } from '@/utils/tokenUtils';
import MainLayout from '@/layouts/MainLayout';

import WalletLayout from '@/layouts/WalletLayout';
import TransactionSkeleton from '@/components/WalletComponents/TransactionSkeleton';
import PageHeader from '@/layouts/PageHeader';
import BalanceSkeleton from '@/components/WalletComponents/BalanceSkeleton';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Navbar from '@/components/Navbar';

interface WalletObject {
  id: number;
  balance: number;
}

interface TransactionObject {
  id: number;
  title: string;
  transaction_type: string;
  amount: number;
  timestamp: string;
}

const WalletPage: React.FC = () => {
  const token = useSelector((state: AppState) => state.auth.token);

  const [walletData, setWalletData] = useState<WalletObject | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionObject[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // const token = 'user-token'; // Retrieve this from your store or context

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [walletResponse, transactionResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}wallet/balance/`, {
            headers: {
              Authorization: `Bearer ${decryptToken(token)}`,
            },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}wallet/transactions/`, {
            headers: {
              Authorization: `Bearer ${decryptToken(token)}`,
            },
          }),
        ]);

        setWalletData(walletResponse.data);
        setTransactionData(transactionResponse.data);
      } catch (error: any) {
        console.error('Error fetching wallet data:', error.message);
        if (error.response?.status === 404) {
          setWalletData({ id: 0, balance: 0 });
          setTransactionData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);



  return (
    <main className='hf-screen bg-white'>
      {/* <div className='fixed w-full top-0 z-10'>
        <Navbar />
      </div> */}
      <MainLayout>
        <section className=' flex flex-col gap-0 '>
          <div className='flex sticky top-16 justify-between p-4 bg-gray-100'>
            <div className='flex flex-col gap-2'>
              <h1 className='text-sm'>المبلغ المتوفر</h1>
              <div className='h-[60px]'>
                {loading ? (
                  <BalanceSkeleton />
                ) : Number(walletData?.balance || 0) ? (
                  <div className='flex gap-2 h-full'>
                    <h1 className='font-bold text-6xl'>
                      {Number(walletData?.balance || 0)}
                    </h1>
                    <h1 className='font-bold text-xl self-end'>ريال</h1>
                  </div>
                ) : (
                  <h1 className='h-[64px] w-auto font-bold text-6xl'>0</h1>
                )}
              </div>
            </div>
            <div className='my-auto ml-2'>
              <button>
                <PlusCircleIcon className='w-9 h-9' />
              </button>
            </div>
          </div>
          <div className='  px-4 mt-0'>
            <div className='flex sticky z-10 pt-4 pb-2  bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] top-[184px] justify-between items-center text-center '>
              <h1 className='text-gray-600 text-lg font-bold'>
                الحوالات الحديثة
              </h1>
              <h1 className='text-sm font-semibold text-gray-400 underline'>
                عرض الكل
              </h1>
            </div>
            <div className='flex flex-col gap-3 h-full mt-4  px-4 '>
              {loading ? (
                Array.from({ length: 9 }).map((_, index) => (
                  <TransactionSkeleton key={index} />
                ))
              ) : transactionData.length > 0 ? (
                <TransactionList transactions={transactionData} />
              ) : (
                'No transactions found.'
              )}
            </div>
          </div>
        </section>
      </MainLayout>
      {/* <h1 className="text-gray-600 text-lg font-bold mt-6">الحوالات الحديثة</h1> */}
    </main>
  );
};

export default WalletPage;
