'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import logo from '../../../public/logo.png';
import { LayoutGrid, ChevronDown, ChevronUp, CircleUserRound, UsersRound, ContactRound, SlidersVertical, LogOut } from 'lucide-react';
import Link from "next/link";
import ListItem from "./dropDownItem";
import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchUserInfo } from '../store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { BsBoxes } from "react-icons/bs";
import { AiOutlineProduct } from "react-icons/ai";
import { LiaWarehouseSolid } from "react-icons/lia";
import { LuBrush } from "react-icons/lu";


// Sidebar options config
const SIDEBAR_OPTIONS = [
    {
        section: "STORE MANAGEMENT",
        key: "store",
        collapsible: true,
        options: [
            {
                id: 1,
                label: "Consumables",
                route: "/pages/consumables",
                icon: LuBrush,
                roles: ["admin", "manager", "store"], // example roles
                departments: ["store", "all"]
            },
            {
                id: 2,
                label: "BOMs",
                route: "/pages/bom",
                icon: BsBoxes,
                roles: ["admin", "manager", "store"],
                departments: ["store", "all"]
            },
            {
                id: 3,
                label: "Products",
                route: "/pages/products",
                icon: AiOutlineProduct,
                roles: ["admin", "manager", "store"],
                departments: ["store", "all"]
            },
            {
                id: 4,
                label: "Warehouse",
                route: "/pages/warehouse",
                icon: LiaWarehouseSolid,
                roles: ["admin", "manager", "store"],
                departments: ["store", "all"]
            },
        ]
    },
    {
        section: "COMPANY",
        key: "company",
        collapsible: true,
        options: [
            {
                id: 5,
                label: "Clients",
                route: "/pages/clients",
                icon: CircleUserRound,
                roles: ["admin"],
                departments: ["company", "all"]
            },
            {
                id: 6,
                label: "Suppliers",
                route: "/pages/suppliers",
                icon: UsersRound,
                roles: ["admin", "manager", "purchase"],
                departments: ["company", "all"]
            },
            {
                id: 7,
                label: "Users",
                route: "/pages/users",
                icon: ContactRound,
                roles: ["admin"],
                departments: ["company", "all"]
            },
            {
                id: 8,
                label: "Settings",
                route: "/pages/settings",
                icon: SlidersVertical,
                roles: ["admin"],
                departments: ["company", "all"]
            }
        ]
    }
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState({ store: true, company: true });
    const [filteredOptions, setFilteredOptions] = useState([]);
    const dispatch = useDispatch();
    const router = useRouter();

    // Get user from redux
    const user = useSelector(state => state.auth.user);

    // Fetch user info on mount if not present
    useEffect(() => {
        if (!user) {
            dispatch(fetchUserInfo());
        }
    }, [user, dispatch]);

    // Filter sidebar options based on user role and department
    useEffect(() => {
        if (!user) {
            setFilteredOptions([]);
            return;
        }
        // Assume user.role and user.department exist
        const role = user.role?.toLowerCase?.() || "";
        const department = user.department?.toLowerCase?.() || "";

        // For each section, filter options by role and department
        const filtered = SIDEBAR_OPTIONS.map(section => {
            const opts = section.options.filter(opt => {
                // If roles or departments is not specified, show to all
                const roleAllowed = !opt.roles || opt.roles.includes(role) || opt.roles.includes("all");
                const deptAllowed = !opt.departments || opt.departments.includes(department) || opt.departments.includes("all");
                return roleAllowed && deptAllowed;
            });
            return { ...section, options: opts };
        }).filter(section => section.options.length > 0);

        setFilteredOptions(filtered);
    }, [user]);

    // Handle section toggle
    const handleToggle = (key) => {
        setIsOpen(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="w-full max-w-[280px] bg-white h-screen w-full bg-gray-50  z-10 p-4 border-r-2 border-stone-200 flex flex-col">
            <Image src={logo} alt="dummy logo" className="w-[200px]" />

            <div className="ml-4 mt-[50px] flex flex-col justify-start w-full font-[500] flex-1">
                <Link href="/">
                    <span className="inline-flex items-center text-[18px] cursor-pointer">
                        <LayoutGrid className="" />
                        <p className="ml-4">Dashboard</p>
                    </span>
                </Link>
                {/* Render sidebar sections */}
                {filteredOptions.map(section => (
                    <div className="cursor-pointer mt-12" key={section.key}>
                        <span
                            className="inline-flex justify-between w-[90%]"
                            onClick={() => handleToggle(section.key)}
                        >
                            <p className={'text-xs text-[#959595] uppercase font-semibold '}>{section.section}</p>
                            {isOpen[section.key] ? <ChevronDown className="text-[#959595]" /> : <ChevronUp className="text-[#959595]" />}
                        </span>
                        {isOpen[section.key] && (
                            // section.key === "store" ? (
                            //     <ListItem OptionArr={section.options.map(opt => ({
                            //         id: opt.id,
                            //         option: opt.label,
                            //         route: opt.route
                            //     }))} />
                            // ) : (
                                <ul className="my-4 text-sm">
                                    {section.options.map(opt => (
                                        <li key={opt.id}>
                                            <span className="inline-flex items-center my-2 hover:text-blue-700">
                                                {opt.icon ? <opt.icon className="h-5 w-5" /> : null}
                                                <Link href={opt.route}>
                                                    <p className="ml-2">{opt.label}</p>
                                                </Link>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            // )
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={() => { dispatch(logout()); router.push('/'); }}
                className="w-[150px] mt-auto inline-flex items-center px-6 font-medium py-2 rounded-full bg-red-700 text-white text-sm shadow hover:bg-red-800 transition gap-2"
            >
                <LogOut className='w-5 h-5 inline-block' />
                <span className='text-sm inline-block'>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;