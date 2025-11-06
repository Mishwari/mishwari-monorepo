import { Fragment, useState, useRef, useEffect, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode } from 'react'
import { Transition } from '@headlessui/react'

interface InputFieldProps {
  list: any;
  selected: string;
  setSelected: any;
}

export const InputField = ({ list, selected, setSelected }: InputFieldProps) => {
  const [query, setQuery] = useState<any>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const dropdownRef = useRef<any>(null);

  const containerRef = useRef<any>(null); // Add this ref to the container element in your JSX

  const filteredList = query === ''
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
    setQuery('');  // Clear the query to allow new search


    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center' // You might need to adjust this depending on your layout
        });
      }
    }, 300);

  };



  const handleInputBlur = () => {
    setTimeout(() => {
      if (!dropdownRef.current.contains(document.activeElement)) {
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
      }, 0); // Try increasing this delay
  
      return () => clearTimeout(timer);
  }, []);


  return (
    <div className="container relative w-64 text-lg text-[#676767] md:w-96 h-10" ref={dropdownRef}>
      <input
        ref={loseAutoBlur}
        className="w-full pb-1 bg-transparent border-b-2 border-[#005687] focus:outline-none font-bold "
        value={isFocused ? query : (selected ? selected : 'حدد المدينة')}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={!selected ? 'حدد المدينة' : selected}
      />
      <Transition
        as={Fragment}
        show={showDropdown}
        enter="transition ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {(
          <ul ref={containerRef} className="md:scrollbar-hide absolute w-full pt-2 z-10 text-lg max-h-60 overflow-auto bg-white border border-gray-100  shadow rounded-lg">
            {filteredList.length === 0 && query !== '' ? (
              <li className=" text-gray-700">لا يوجد تطابق!</li>
            ) : (
              filteredList.map((item: { city: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | PromiseLikeOfReactNode | null | undefined; }, index: Key | null | undefined) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer border border-b-gray-300 hover:bg-[#005687] hover:text-white hover:font-bold ${selected && item.city === selected ? 'bg-[#005687] hover:bg-[#00558791] text-white font-bold' : ''
                    }`}
                  onClick={() => handleSelect(item)}
                >
                  {item.city}
                </li>
              ))
            )}
          </ul>
        )}
      </Transition>

    </div>
  );
};

// export default InputField;