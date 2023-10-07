import React, { useState } from 'react';
import signupImg from '../assets/images/signupBg.png';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai'
import OAuth from '../components/OAuth';

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

const SignUp = () => {
    const [formData, setFormData] = useState({ password: '' }); // Initialize with empty values
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any of the form fields are blank
        if (!formData.username || !formData.email || !formData.password) {
            setError(true);
            setError('Please fill in all fields. 😭');
            return;
        }

        const password = formData.password;
        const minLength = 8;
        if (password.length < minLength) {
            setError();
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            // Parse the response JSON data
            const data = await res.json();

            if (data.success === false) {
                setError('User already exists.😬');
                setLoading(false);
            } else {
                setLoading(false);
                navigate('/sign-in');
            }
        } catch (error) {
            setLoading(false);
            setError('Something went wrong.🤔');
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
                        type='text'
                        id='username'
                        placeholder='Username'
                        onChange={handleChange}

                    />

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

                    <span className={`text-[12px] flex gap-1 items-center font-semibold ml-4 ${formData.password.length >= 8 ? 'text-green-500' : ' text-red-500'}`}>
                        {formData.password.length >= 8 ? (
                            <>
                                <AiFillCheckCircle /> At least 8 characters
                            </>
                        ) : (
                            <>
                                <AiFillCloseCircle />At least 8 characters
                            </>
                        )}
                    </span>

                    <button
                        disabled={loading}
                        className=' bg-blue-950 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        {
                            loading ? 'Loading...' : 'Sign up'
                        }
                    </button>

                    <OAuth/>

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