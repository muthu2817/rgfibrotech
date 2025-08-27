import { Search } from 'lucide-react';



const SearchBtn = () => {
    return (
        <>
           <input className="bg-blue-100 rounded-full h-10 w-[220px] my-4 text-gray-700 transition-colors ml-[60%] indent-8" placeholder='Search' type="text">
                {/* <span className="inline-flex items-center text-sm px-4">
                    <Search className="w-4 h-4" />
                    <span className="ml-2">Search Consumable</span>
                </span> */}
            </input>
        </>
    )
}

export default SearchBtn;