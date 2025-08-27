import Link from "next/link";
import { usePathname } from "next/navigation";


const ListItem = ({ OptionArr }) => {
    const pathName = usePathname();
    return (
        <>
            <ul className="text-black my-6">
                {
                    OptionArr.map((data, idx) => {
                        const isActive = pathName == data.route;
                        return (
                            <Link key={idx} href={data.route}>
                            <li className={`text-sm my-3 hover:text-blue-700 ${isActive ? 'text-blue-700' :''}`}>{data.option}</li>
                            </Link>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default ListItem;