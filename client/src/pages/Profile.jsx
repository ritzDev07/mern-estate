import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
    const { currentUser } = useSelector((state) => state.user);

    const inputStyles = 'bg-slate-200 rounded-lg p-3 text-green-900 ';
    const buttonStyles = 'bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80';

    return (
        <section className='p-3 max-w-lg mx-auto '>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <img
                    src={currentUser.profilePicture}
                    alt='profile'
                    className='h-24 w-24 self-center cursor-pointer rounded-full object-cover'
                />
                <input
                    defaultValue={currentUser.username}
                    type='text'
                    name='username'
                    placeholder='Username'
                    id='username'
                    autoComplete
                    className={inputStyles}
                />
                <input
                    defaultValue={currentUser.email}
                    type='email'
                    name='email'
                    placeholder='Email'
                    id='email'
                    autoComplete
                    className={inputStyles}

                />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    id='password'
                    className={inputStyles}
                />
                <button className={buttonStyles}>Update</button>
            </form>

            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Sign out</span>
            </div>

        </section>
    );
};

export default Profile;
