import React from 'react';
import signupImg from '../assets/images/signupBg.png';
import { Link } from 'react-router-dom';

// Reusable Input component
const InputField = ({ type, id, placeholder }) => (
    <input
        type={type}
        id={id}
        placeholder={placeholder}
        className='bg-slate-100 text-green-900 p-3 border border-slate-300 rounded-lg'
        autoComplete={placeholder === 'Username' ? 'username' : placeholder === 'Email' ? 'email' : placeholder === 'Password' ? 'current-password' : ''}
    />
);

const SignUp = () => {
    return (
        <div className="h-screen bg-cover bg-center flex items-center justify-center text-white"
            style={{ backgroundImage: `url(${signupImg})` }}
        >
            <section className='p-7 rounded-lg max-w-lg mx-auto bg-green-950 bg-opacity-60'>

                <h1 className='text-lg text-center font-semibold mb-7'>Welcome to RitzEstate</h1>

                <form className='flex flex-col gap-4'>
                    <InputField type='text' id='username' placeholder='Username' />
                    <InputField type='email' id='email' placeholder='Email' />
                    <InputField type='password' id='password' placeholder='Password' />
                    <button className=' bg-blue-950 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        Sign Up
                    </button>
                </form>

                <div className='flex gap-2 mt-5'>
                    <p>Have an Account?</p>
                    <Link to='/sign-in'>
                        <span className='text-blue-400'>Sign In</span>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default SignUp;