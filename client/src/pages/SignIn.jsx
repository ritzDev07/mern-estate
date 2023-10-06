import React, { useState } from 'react';
import signupImg from '../assets/images/signupBg.png';
import { Link, useNavigate } from 'react-router-dom';

// Reusable Input component
const InputField = ({ type, id, placeholder, onChange }) => (
    <input
        type={type}
        id={id}
        placeholder={placeholder}
        className='bg-slate-200 text-green-900 p-3 border border-slate-300 rounded-lg'
        autoComplete={placeholder === 'Username' ? 'username' : placeholder === 'Email' ? 'email' : placeholder === 'Password' ? 'current-password' : ''}
        onChange={onChange}
    />
);

const SignIn = () => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any of the form fields are blank
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields. 😭');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Parse the response JSON data
            const data = await res.json();

            if (res.status !== 200) {
                // Handle login failure here
                setLoading(false);
                setError('Invalid email or password. 😬');
            } else {
                // Login successful
                setLoading(false);
                setError(null);
                navigate('/');
            }
        } catch (error) {
            setLoading(false);
            setError('Something went wrong. 🤔');
        }
    };

    return (
        <div className=" h-screen bg-cover bg-center flex items-center text-green-950"
            style={{ backgroundImage: `url(${signupImg})` }}
        >
            <section className='p-7 rounded-lg max-w-lg mx-auto bg-slate-100 '>
                <h1 className='text-lg text-center font-semibold mb-7'>
                    Welcome to RitzEstate
                </h1>
                {error && (
                    <p className='p-3 rounded-lg bg-opacity-70 text-red-600 text-center mb-7'>
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}
                    className='flex flex-col gap-4'>

                    <InputField
                        type='email'
                        id='email'
                        placeholder='Email'
                        onChange={handleChange}
                    />

                    <InputField
                        type='password'
                        id='password'
                        placeholder='Password'
                        onChange={handleChange}
                    />

                    <button
                        disabled={loading}
                        className=' bg-blue-950 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {
                            loading ? 'Loading...' : 'Sign in'
                        }
                    </button>

                </form>

                <div className='flex gap-2 mt-5'>
                    <p>Dont have an Account?</p>
                    <Link to='/sign-up'>
                        <span className='text-blue-400'>Sign up</span>
                    </Link>
                </div>

            </section>

        </div>
    )
}

export default SignIn;