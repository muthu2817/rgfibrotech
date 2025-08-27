import { ChevronRight } from 'lucide-react';

const Header = ({title}) => {
    return (
        <>
            <div className="w-full bg-white border-b border-stone-200 py-4">
                    <p className="ml-6 text-stone-400 font-[500] inline-flex text-[14px] items-center tracking-tight" >
                        <span>
                            Dashboard
                        </span>
                        <span className='px-1'>
                            <ChevronRight className="w-3 h-3" />
                        </span>
                        <span>
                            {title}
                        </span>
                    </p>
                </div>
        </>
    )
}

export default Header;