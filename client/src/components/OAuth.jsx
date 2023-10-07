import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Function to handle Google authentication
    const handleGoogleClick = async () => {
        try {
            // Create a GoogleAuthProvider instance
            const provider = new GoogleAuthProvider();

            // Get the Firebase authentication instance
            const auth = getAuth(app);

            // Sign in with Google using a popup window
            const result = await signInWithPopup(auth, provider);

            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');

            // Log the authentication result
            // console.log(result);

        } catch (error) {
            // Handle authentication errors
            console.log("Couldn't login to Google:", error);
        }
    };

    return (
        <button
            type='button'
            onClick={handleGoogleClick}
            className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
        >
            Continue with Google
        </button>
    );
}

export default OAuth;