import {
  Fragment,
  useState,
  useRef,
  useEffect,
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
} from 'react';
import { Transition } from '@headlessui/react';

// const list = [
//   { id: 1, name: 'Wade Cooper' },
//   { id: 2, name: 'Arlene Mccoy' },
//   { id: 3, name: 'Devon Webb' },
//   { id: 4, name: 'Tom Cook' },
//   { id: 5, name: 'Tanya Fox' },
//   { id: 6, name: 'Hellen Schmidt' },
//   { id: 7, name: 'Wade Cooper' },
//   { id: 8, name: 'Arlene Mccoy' },
//   { id: 9, name: 'Bevon Webb' },
//   { id: 10, name: 'Com Cook' },
//   { id: 11, name: 'Danya Fox' },
//   { id: 12, name: 'Eellen Schmidt' },
//   { id: 13, name: 'Fade Cooper' },
//   { id: 14, name: 'Grlene Mccoy' },
//   { id: 15, name: 'Hevon Webb' },
//   { id: 16, name: 'Iom Cook' },
//   { id: 17, name: 'Janya Fox' },
//   { id: 18, name: 'Kellen Schmidt' },

// ]

interface InputFieldProps {
  list: any;
  selected: string;
  setSelected: any;
}

const InputField = ({ list, selected, setSelected }: InputFieldProps) => {
  // const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState<any>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const dropdownRef = useRef<any>(null);

  const containerRef = useRef<any>(null);

  const filteredList =
    query === ''
      ? list
      : list.filter((item: any) =>
          item.city.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (item: any) => {
    setSelected(item.city);
    setQuery(item.city);
    setShowDropdown(false);
    setIsFocused(false);
  };

  const handleInputChange = (event: any) => {
    setQuery(event.target.value);
    setShowDropdown(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
    setQuery(''); // Clear the query to allow new search

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // You might need to adjust this depending on your layout
        });
      }
    }, 400);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!dropdownRef?.current?.contains(document.activeElement)) {
        setShowDropdown(false);
        setIsFocused(false);
        if (!selected) {
          setQuery('');
        }
      }
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setIsFocused(false);
        if (!selected) {
          setQuery('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selected, dropdownRef]);

  const loseAutoBlur = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Increase the delay to ensure the component is fully rendered
    const timer = setTimeout(() => {
      // Check if the element is actually focused before blurring
      if (document.activeElement === loseAutoBlur.current) {
        loseAutoBlur.current?.blur();
      }
    }, 100); // Try increasing this delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className='container relative wf-64 sfm:w-80 mdf:w-96 w-full mdax-w-full  text-lg text-[#676767] h-max'
      ref={dropdownRef}>
      <input
        ref={loseAutoBlur}
        className='w-full pcb-1 pr-2 bg-inherit bdorder-b-2 border-[#005687] focus:outline-none font-semibold '
        value={isFocused ? query : selected ? selected : 'اختر المدينة . . .'}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={!selected ? 'اختر المدينة . . .' : selected}
        required={true}
      />
      <Transition
        as={Fragment}
        show={showDropdown}
        enter='transition ease-out duration-300'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transition ease-in duration-300'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        {
          <ul
            ref={containerRef}
            className='md:scrollbar-hide scrollbar-default absolute w-full pt-2 z-20 text-lg max-h-60 overflow-auto bg-white border border-gray-100  shadow rounded-lg'>
            {filteredList.length === 0 && query !== '' ? (
              <li className=' text-gray-700'>لاتوجد مدينة بهذا الاسم !</li>
            ) : (
              filteredList.map(
                (
                  item: {
                    city:
                      | string
                      | number
                      | boolean
                      | ReactElement<any, string | JSXElementConstructor<any>>
                      | Iterable<ReactNode>
                      | PromiseLikeOfReactNode
                      | null
                      | undefined;
                  },
                  index: Key | null | undefined
                ) => (
                  <li
                    key={index}
                    className={`p-2 cursor-pointer  hover:bg-[#005687] hover:text-white hover:font-bold ${
                      selected && item.city === selected
                        ? 'bg-[#005687] hover:bg-[#00558791] text-white font-bold'
                        : ''
                    }`}
                    onClick={() => handleSelect(item)}>
                    {item.city}
                  </li>
                )
              )
            )}
          </ul>
        }
      </Transition>
      <div></div>
    </div>
  );
};

export default InputField;
