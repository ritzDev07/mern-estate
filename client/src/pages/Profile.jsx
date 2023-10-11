import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

const inputStyles = 'bg-slate-200 rounded-lg p-3 text-green-900 ';
const buttonStyles = 'bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80';

const Profile = () => {
    const { currentUser, loading, error } = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState([]);
    const [showListings, setShowListings] = useState(false);

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

    const handleShowListings = async () => {
        try {
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                return;
            }
            // Reverse the order of listings to display the latest first
            setUserListings(data.reverse());
            setShowListings(!showListings);

        } catch (error) {
            setShowListingsError(true);
        }

    }

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));

        } catch (error) {
            console.log(error)

        }
    }


    return (
        <section className='p-3 max-w-4xl mx-auto'>
            <h1 className='p-3 text-3xl font-semibold text-left my-7'>
                Profile
            </h1>
            <div className='flex flex-col sm:flex-row gap-6'>

                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-4 w-full sm:w-96 p-3'>


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

                        <Link to={"/create-listing"}
                            className='rounded-lg bg-green-700 hover:opacity-95 text-white uppercase text-center p-3'>
                            Create Listing
                        </Link>



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
                    </div>
                </form>

                <div className='flex flex-col flex-1 p-3 gap-4 text-slate-800'>

                    <button
                        onClick={handleShowListings}
                        className='w-full rounded-lg text-green-800 border border-green-700 hover:opacity-95 hover:text-white hover:bg-green-700 uppercase text-center p-3'
                    >
                        {showListings ? 'Hide Listings' : 'Show Listings'}

                    </button>

                    <p className='text-red-600 text-center mt-3'>
                        {showListingsError ? 'Error showing listings' : ''}
                    </p>
                    {showListings && (
                        <div className='listings-container max-h-96 overflow-y-auto'>
                            {userListings &&
                                userListings.map((listing) => (
                                    <div
                                        key={listing._id}
                                        className='border rounded-lg p-3 flex justify-between items-center my-3 hover:bg-green-100'
                                    >
                                        <Link to={`/listings/${listing._id}`}>
                                            <img
                                                src={listing.imageUrls[0]}
                                                alt='listing covers'
                                                className='h-20 w-32 object-contain'
                                            />
                                        </Link>
                                        <Link to={`/listings/${listing._id}`}>
                                            <h2 className='w-20 text-slate-800 truncate'>{listing.name}</h2>
                                        </Link>
                                        <div className='flex flex-col items-center'>
                                            <button
                                                onClick={() => handleListingDelete(listing._id)}
                                                className='text-red-700 p-2 rounded-md uppercase hover:bg-red-700 hover:text-white'
                                            >
                                                Delete
                                            </button>
                                            <button className='text-green-700 p-2 my-1 rounded-md uppercase hover:bg-green-700 hover:text-white'>
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
};

export default Profile;