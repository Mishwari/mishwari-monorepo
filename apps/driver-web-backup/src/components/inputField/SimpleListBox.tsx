import { Transition } from '@headlessui/react';
import React, {useRef,useEffect,useState, Fragment} from 'react';



interface SimpleListBoxProps {
    options: any;
    setSelectedRoute:any;
}

const SimpleListBox: React.FC<SimpleListBoxProps> = ({options,setSelectedRoute}:SimpleListBoxProps) => {
    // const options = ['مسار 1', 'مسار 2', 'مسار 3'];
    // // const options = ['مسار 1', 'مسار 2', 'مسار 3', 'مسار 4','مسار 5','مسار 6'];


    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedOption,setSelectedOption] = useState<string>('حدد وجهتك اولا')
    useEffect(() => {
        if (options.length!== 0){

            setSelectedOption('حدد مسار الرحلة')
        }
    },[options])

    const listboxRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ( listboxRef.current && !listboxRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    },[])

    const handleOptionClick = (option: string) => {
        setSelectedOption(option)
        setIsOpen(false)
    }


    return (
        <div ref={listboxRef} className='relative w-64 md:w-96 text-lg h-10'>
            <div
            className='w-full bg-transparent font-bold border-b-2 border-[#005687] pb-1 cursor-pointer'
             onClick={() => setIsOpen(!isOpen)} >
                {options.length !==0 ? selectedOption : 'لا يوجد مسار'}
            </div>
            
            <Transition
                 as={Fragment}
                 show={isOpen}
                 enter="transition ease-out duration-300"
                 enterFrom="opacity-0"
                 enterTo="opacity-100"
                 leave="transition ease-in duration-300"
                 leaveFrom="opacity-100"
                 leaveTo="opacity-0"
               >
                
                <div className="absolute w-full max-h-[146px] bg-white border border-gray-100 shadow rounded-lg z-20 overflow-auto ">

                <ul className=' w-full pt-2 rounded-lg  bg-white z-20 '>
                    {options?.length == 0 ? (
                        <li className=" bg-slate-100 p-2">لم يتم العثور على مسار</li>
                    )
                    :
                    (
                    options?.map((option:any, index:number) => (
                        <li 
                        key={index}
                        className={`${option?.summary === selectedOption ? 'bg-[#005687] hover:bg-[#00558791] text-white font-bold' : 'bg-white'} border border-b-gray-300 p-2 cursor-pointer hover:bg-[#005687]  hover:text-white hover:font-bold`}
                        onClick={() => {

                            handleOptionClick(option?.summary)
                            setSelectedRoute(option?.route)
                        }
                        }
                        >
                            {option.summary} 
                        </li>
                        ))
                    )}
                </ul>
                </div>
            </Transition>
           
        </div>
    )
}

export default SimpleListBox