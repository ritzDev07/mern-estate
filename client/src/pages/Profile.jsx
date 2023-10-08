import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from '../redux/user/userSlice';

const Profile = () => {
    const { currentUser, loading, error } = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const [updateSuccess, setUpdateSuccess] = useState(false);

    useEffect(() => {
        if (image) {
            handleFileUplaod(image);
        }
    }, [image]);

    useEffect(() => {
        const timers = [
            updateSuccess && setTimeout(() => setUpdateSuccess(false), 3000),
            imageError && setTimeout(() => setImageError(false), 4000),
            error && setTimeout(() => dispatch(updateUserFailure('')), 3000),
            imagePercent === 100 && setTimeout(() => setImagePercent(0), 4000)
        ].filter(Boolean);

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [updateSuccess, imageError, error, imagePercent, dispatch]);


    const handleFileUplaod = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercent(Math.round(progress));
            },
            (error) => {
                setImageError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setFormData({ ...formData, profilePicture: downloadURL })
                    });
            });
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDeleteAccount = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data));
                return;
            }
            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error));
        }
    };

    const handleSignout = async () => {
        try {
            await fetch('/api/auth/signout');
            dispatch(signOut());

        } catch (error) {
            console.log(error);
        }
    };

    const inputStyles = 'bg-slate-200 rounded-lg p-3 text-green-900 ';
    const buttonStyles = 'bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80';

    return (
        <section className='p-3 max-w-lg mx-auto '>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'
                onSubmit={handleSubmit}
            >
                <input type="file" ref={fileRef} hidden accept='images/*'
                    onChange={(e) => setImage(e.target.files[0])} />
                <img
                    src={formData.profilePicture || currentUser.profilePicture}
                    alt='profile'
                    className='h-24 w-24 self-center cursor-pointer rounded-full object-cover'
                    onClick={() => fileRef.current.click()}
                />
                <p className=' text-sm self-center h-3'>
                    {
                        imageError ? (
                            <span className='text-red-700'>
                                Error Uploading ...
                            </span>
                        ) : imagePercent > 0 && imagePercent < 100 ? (
                            <span className='text-slate-700'>
                                {`Uploading: ${imagePercent}%`}
                            </span>
                        ) : imagePercent === 100 ? (
                            <span className='text-green-700 font-semibold'>Image upload successfully 😊</span>
                        ) : null
                    }
                </p>
                <input
                    defaultValue={currentUser.username}
                    type='text'
                    name='username'
                    placeholder='Username'
                    id='username'
                    autoComplete='true'
                    className={inputStyles}
                    onChange={handleChange}
                />
                <input
                    defaultValue={currentUser.email}
                    type='email'
                    name='email'
                    placeholder='Email'
                    id='email'
                    autoComplete='true'
                    className={inputStyles}
                    onChange={handleChange}
                />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    id='password'
                    className={inputStyles}
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className={buttonStyles}>
                    {
                        loading ? 'loading...' : "update"
                    }
                </button>
            </form>

            <div className='flex justify-between mt-5'>

                <span
                    className='text-red-700 cursor-pointer'
                    onClick={handleDeleteAccount}
                >
                    Delete Account
                </span>

                <span
                    className='text-red-700 cursor-pointer'
                    onClick={handleSignout}
                >
                    Sign out
                </span>

            </div>

            <p className=' text-red-600 text-center mt-3'>
                {
                    error ? error || 'Something went wrong!' : ' '
                }
            </p>
            <p className=' text-green-600 text-center mt-3'>
                {
                    updateSuccess && 'Updated Successfully!'
                }
            </p>

        </section>
    );
};

export default Profile;