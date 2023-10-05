import React from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Header = () => {
    const menuItems = [
        { path: '/', label: 'Home', hidden: true },
        { path: '/about', label: 'About', hidden: true },
        { path: '/sign-in', label: 'Sign in', hidden: false },
    ];

    const Logo = () => (
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap ml-2'>
            <Link to='/'>
                <span className='text-green-500 '>Ritz</span>
                <span className='text-green-700 '>Estate</span>
            </Link>
        </h1>
    );

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Logo />
                <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input
                        type='text'
                        name='search'
                        id='search'
                        placeholder='search ...'
                        className='bg-transparent focus:outline-none w-36 sm:w-96'
                    />
                    <IoSearch size={20} className=' text-slate-500' />
                </form>
                <ul className='flex'>
                    {menuItems.map((item, index) => (
                        <Link to={item.path} key={index}>
                            <li
                                className={`${item.hidden
                                    ? 'hidden sm:inline'
                                    : 'sm:inline'
                                    } text-slate-700 hover:border-b-4 hover:border-green-500 pb-1 mr-3`}
                            >
                                {item.label}
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
        </header>
    );
};

export default Header;