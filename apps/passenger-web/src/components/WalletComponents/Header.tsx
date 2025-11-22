import Link from 'next/link';
import Image from 'next/image';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import BalanceSkeleton from './BalanceSkeleton';

interface HeaderProps {
  balance: number | undefined;
  loading: boolean; // for loading balance skeleton
}

const Header: React.FC<HeaderProps> = ({ balance, loading }) => {
  const router = useRouter();

  return (
    <header className="sticky top-0 py-4 px-2 bg-[#005687] z-20 text-white">
      <div className="flex gap-2 text-xl">
        <button
          onClick={() => router.back()}
          className='text-white hover:bg-white/10 rounded-full p-2 transition-colors'>
          <ChevronRightIcon className='w-6 h-6' />
        </button>
        <h1>محفظتي</h1>
      </div>
      <div className="flex justify-between p-4 mt-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm">المبلغ المتوفر</h1>
          <div className='h-[60px]'>

            {loading? <BalanceSkeleton /> :
            Number(balance) ? 
            (<div className="flex gap-2 h-full">
              <h1 className="font-bold text-6xl">{Number(balance)}</h1>
              <h1 className="font-bold text-xl self-end">ريال</h1>
            </div>)
            :
            (<h1 className='h-[64px] w-auto font-bold text-6xl'>0</h1>)
            }
          </div>
        </div>
        <div className="my-auto ml-2">
          <button>
            <PlusCircleIcon className="w-9 h-9" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
