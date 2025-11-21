import React from 'react';
import { ArrowUpRightIcon, ArrowDownLeftIcon } from '@heroicons/react/24/solid';

interface TransactionItemProps {
  transaction: {
    id: number;
    title: string;
    transaction_type: string;
    amount: number;
    timestamp: string;
  };
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <div className='flex justify-between items-center rounded-md bg-white w-full h-16 py-2 px-4'>
      <div className='flex gap-5 justify-between items-center'>
        <div
          className={`flex w-max h-max p-1.5 rounded-xl ${
            transaction.transaction_type === 'debit'
              ? 'bg-red-500'
              : 'bg-[#21C17A]'
          }`}>
          {transaction.transaction_type === 'debit' ? (
            <ArrowUpRightIcon className='text-white h-4 w-4' />
          ) : (
            <ArrowDownLeftIcon className='text-white h-4 w-4' />
          )}
        </div>
        <div className='flex flex-col justify-between'>
          <h1 className='font-bold'>{transaction.title}</h1>
          <h1 className='text-xs text-gray-400'>
            {new Date(transaction.timestamp).toLocaleDateString(
              'ar-EG-u-nu-latn',
              {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }
            )}
          </h1>
        </div>
      </div>
      <span
        className={`text-lg font-bold ${
          transaction.transaction_type === 'debit'
            ? 'text-red-500'
            : 'text-[#21C17A]'
        }`}>
        {transaction.transaction_type === 'debit' ? '-' : '+'}{' '}
        {Number(transaction.amount)} <small>ر.ي</small>
      </span>
    </div>
  );
};

export default TransactionItem;
