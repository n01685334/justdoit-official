"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes} from "react-icons/fa";
export default function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    return(
        <header className="p-8 text-center w-5/6 border-b-1 border-solid border-gray-600 mb-20">
            <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800">
                    JustDoIT
                </Link>
                <nav className="hidden md:flex justify-center space-x-4 mt-4">
                    <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                    <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
                    <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
                </nav>
                <button className="md:hidden  mt-4 px-4 py-2 bg-blue-600 text-gray-700 focus:outline-none rounded hover:bg-blue-800 transition-colors" 
                onClick={toggleMenu} >
                    {menuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
                </button>
            </div>
            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 px-4 mt-4 flex flex-col items-center space-y-2">
                    <Link href="/" className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text:white">Home</Link>
                    <Link href="/" className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text:white">Project</Link>
                    <Link href="/" className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text:white">Employee</Link>
                    <Link href="/" className="block text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text:white">Settings</Link>
                        
             
                </div>
            )}
            
            {/* <h1 className="text-3xl font-bold">Just Do IT</h1>
            <p className="text-lg">Your go-to source for state-level data and insights</p> */}
        </header>        
    
    )
}

