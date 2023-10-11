import React, { useState, useEffect } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const menuItems = [
        { path: '/', label: 'Home', hidden: true },
        { path: '/about', label: 'About', hidden: true },
        {
            path: '/profile',
            label: currentUser ? (
                <img
                    src={currentUser.profilePicture}
                    alt='profile'
                    className=' inline-block h-9 w-9 rounded-full object-cover mr-2 hover:'
                />
            ) : (
                'Sign in'
            ),
            hidden: false,
        },

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
                <form
                    className='bg-slate-100 p-3 rounded-lg flex items-center'
                    onSubmit={handleSubmit}
                >
                    <input
                        type='text'
                        name='search'
                        id='search'
                        placeholder='search ...'
                        className='bg-transparent focus:outline-none w-36 sm:w-96'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button>
                        <IoSearch size={20} className=' text-slate-500' />
                    </button>
                </form>
                <ul className='flex items-center'>

                    {menuItems.map((item, index) => (
                        <Link to={item.path} key={index}>
                            <li
                                className={`${item.hidden
                                    ? 'hidden sm:inline'
                                    : 'sm:inline'
                                    } text-slate-700 hover:border-b-4 hover:text-green-500 hover:font-medium pb-1 mr-3`}
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