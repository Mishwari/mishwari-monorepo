import React from 'react';
import TransactionItem from './TransactionItem';

interface Transaction {
  id: number;
  title: string;
  transaction_type: string;
  amount: number;
  timestamp: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className='flex flex-col gap-3 h-full divide-y-1'>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
        />
      ))}
    </div>
  );
};

export default TransactionList;
