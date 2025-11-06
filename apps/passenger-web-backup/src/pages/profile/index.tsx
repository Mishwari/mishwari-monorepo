import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import {
  PencilSquareIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { resetAuthState } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useAuth from '@/hooks/useAuth';
import BackButton from '@/components/BackButton';
import HeaderLayout from '@/layouts/HeaderLayout';
import SideNav from '@/layouts/SideNav';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';
import Navbar from '@/components/Navbar';
import SortDropdown from '@/components/filters_bar/SortDropdown';
import ProfileForm from '@/components/ProfileForm';

import { performRegister } from '@/store/actions/mobileAuthActions';

import { Profile } from '@/types/profileDetails';

interface SortItem {
  code: string | null;
  id: number;
  name: string;
}

function index() {
  useAuth(true);
  const [windowDimensions, setWindowDimensions] = useState<number>(
    window.innerWidth
  );

  console.log(windowDimensions);

  const profile = useSelector((state: AppState) => state.profile);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isProfileEditDisabled, setIsProfileEditDisabled] =
    useState<boolean>(true);
  const [profileData, setProfileData] = useState<Profile>({
    user: {
      id: null,
      email: '',
      username: '',
      first_name: '',
      last_name: '',
    },
    gender: 'male',
    full_name: '',
    birth_date: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        user: {
          id: profile.user.id,
          email: profile.user.email || '',
          username: profile.user.username,
          first_name: profile.user.first_name,
          last_name: profile.user.last_name,
        },
        gender: profile.gender,
        full_name: profile.full_name,
        birth_date: profile.birth_date || ' ',
        address: profile.address,
      });
    }
  }, [isProfileEditDisabled, profile, dispatch]);
  const updateProfileData = (path: string, value: any) => {
    setProfileData((prev) => {
      const keys = path.split('.');
      let updatedData = { ...prev } as any; // Allow dynamic indexing

      let current = updatedData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      });

      return updatedData;
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if(mobileNumber && otpCode) {

    await dispatch(performRegister(profileData, router) as any);
    setTimeout(() => {
      setIsProfileEditDisabled(true);
    }, 100);

    // }
  };

  const sortList = [
    { id: 1, name: ' ريال سعودي', code: ' ريال سعودي SAR' },
    { id: 2, name: 'دولار', code: 'دولار USD ' },
    { id: 3, name: ' ريال يمني', code: '  ريال يمني YER' },
    { id: 4, name: ' ريال عماني', code: ' ريال عماني OMR' },
    { id: 5, name: '  جنية مصري', code: ' جنية مصري EGP' },
  ];
  const [selectedSort, setSelectedSort] = useState<SortItem>(sortList[0]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWindowDimensions(window.innerWidth);
  //   };
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);
  // if (windowDimensions > 768) {
  //   router.push('/');
  // }

  return (
    <main className='h-full bsg-scroll flex flex-col'>
      <SideNav>
        <section className=''>
          <div className='flex flex-col md:flex-row justify-between items-center mt-10'>
            <div className='flex gap-2 sjustify-center self-start items-center '>
              <span>
                <UserIcon className='w-7 h-7 ' />
              </span>
              <h1 className='text-lg font-semibold'>المعلومات الشخصية</h1>
              <span
                onClick={() => setIsProfileEditDisabled(!isProfileEditDisabled)}
                className='cursor-pointer'>
                {isProfileEditDisabled ? (
                  <PencilSquareIcon className='w-5 h-5 ' />
                ) : null}
              </span>
            </div>
          </div>
          <ProfileForm
            profileData={profileData}
            updateProfileData={updateProfileData}
            handleSubmit={handleSubmit}
            isDisabled={isProfileEditDisabled}
          />
          {!isProfileEditDisabled && (
            <div className='flex justify-center items-center my-4'>
              <button
                onClick={() => setIsProfileEditDisabled(true)}
                type='button'
                className=' py-1.5 px-8 hover:text-red-500 border-slate-900 rounded-xl'>
                الغاء
              </button>
            </div>
          )}

          <div className='flex flex-col md:flex-row justify-between items-center mt-10'>
            <div className='flex gap-2 sjustify-center self-start items-center '>
              <span>
                <MapPinIcon className='w-7 h-7 ' />
              </span>
              <h1 className='text-lg font-semibold'>العنوان</h1>
              <span>
                <PlusIcon className='w-5 h-5' />
              </span>
            </div>
          </div>
          <div className='flex mt-8 justify-center item`s-center'>
            <button className='cursor- flex gap-4 items-center justify-center py-1 w-1/3 min-w-[100px] bf-slate-100 border text-[#005678] border-[#00567873] rounded-full'>
              <span>اضف عنوان</span>
              {/* <span>
                <PlusCircleIcon className='w-6 h-6' />
              </span> */}
            </button>
          </div>
          <div className='flex flex-col md:flex-row justify-between items-center mt-10'>
            <div className='flex gap-2 sjustify-center self-start items-center '>
              <span>
                <CurrencyDollarIcon className='w-7 h-7 ' />
              </span>
              <h1 className='text-lg font-semibold '>العملة</h1>
            </div>
            <div className='w-1/2 md:block items-end'>
              <SortDropdown
                selectedSort={selectedSort}
                setSelectedSort={setSelectedSort}
                sortList={sortList}
              />
            </div>
          </div>
        </section>
      </SideNav>

      <div className='bsg-white h-full'></div>
    </main>
  );
}

export default index;
