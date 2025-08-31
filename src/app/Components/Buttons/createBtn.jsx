
import { CirclePlus } from 'lucide-react';
import { usePathname } from 'next/navigation';


const CreateBtn = ({onClick}) => {
    let routeName = usePathname();
    let buttonLbl = "create";
  
 
        if (routeName == '/pages/consumables') {
            buttonLbl = 'Create Consumables';
        }
        else if (routeName == '/pages/bom') {
            buttonLbl = 'Create Bom';
        }
        else if (routeName == '/pages/products') {
            buttonLbl = 'Create Products';
        }
        else if (routeName == '/pages/warehouse') {
            buttonLbl = 'Create Warehouse';
        }
        else if (routeName == '/pages/clients') {
            buttonLbl = 'Create Client';
        }
        else if (routeName == '/pages/users') {
            buttonLbl = 'Create User';
        }
        else if (routeName == '/pages/suppliers') {
            buttonLbl = 'Create Suppliers';
        }
        else if (routeName == '/pages/settings') {
            buttonLbl = 'Create Settings';
        }
        else if (routeName == '/pages/workflow-templates') {
            buttonLbl = 'Create Workflow';
        }
   
    return (
        <>
            <button onClick={onClick} className="cursor-pointer bg-[#005ACF] rounded-full py-3 px-3 pr-4 w-fit  text-white hover:bg-blue-800 transition-colors">
                <p className="items-center text-xs flex items-center">
                    <CirclePlus className="w-4 h-4" />
                    <span className="ml-2">{buttonLbl}</span>
                </p>
            </button>

        </>
    )
}

export default CreateBtn;