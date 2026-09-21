import React from "react";
import { Menu, Bell, ChevronDown } from 'lucide-react'
import { FaUserCircle } from "react-icons/fa";

function Header(){
    return(
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden md:block">
                        <h2 className="text-2xl font-black text-slate-800">Dashboard</h2>
                        <p>Welcome back, Shubham! here's what's happening today</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className='relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-200'>
                        <Bell className="w-5 h-5 cursor-pointer" />
                    </button>

                    <div className="flex items-center gap-3 cursor-pointer bg-white hover:bg-indigo-50 border border-slate-200 px-3 py-2 rounded-xl shadow-sm transition-all duration-200">
                        <FaUserCircle className='w-8 h-8 text-indigo-400 ring-2 rounded-full ring-blue-600' />
                        <div className="hidden md:block leading-tight">
                            <p className="text-sm font-medium text-gray-800">
                                Shubham Kumar
                            </p>
                            <p className="text-xs text-gray-500">
                                IT Security Analyst
                            </p>
                        </div>
                        <ChevronDown className='w-4 h-4 text-slate-400' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header;