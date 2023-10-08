import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { app } from '../firebase';

const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({ imageUrls: [], });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [imagePercent, setImagePercent] = useState(null);
    const [uploading, setUplaoding] = useState(false);
    

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUplaoding(true);
            setImageUploadError(false);
            const promises = [];
            for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                promises.push(storeImage(files[fileIndex]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, imageUrls: formData.imageUrls.concat(urls),
                });
                setImageUploadError(false);
                setUplaoding(false);

            })
                .catch((error) => {
                    setImageUploadError('Image upload failed. Max 2MB per image.');
                    setUplaoding(false);
                });

        } else {
            setImageUploadError('You can Only upload 6 images per listing');
            setUplaoding(false);
        }

    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImagePercent(Math.round(progress));
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            reject(error); // Handle any potential errors in getting the download URL
                        });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };


    // Define reusable CSS classes for common styles
    const inputStyles = 'border p-3 rounded-lg';
    const flexGapStyles = 'flex gap-2';
    const numberInputStyles = 'p-3 border border-gray-300 rounded-lg';
    const buttonStyles = 'p-3 border rounded-lg uppercase hover:opacity-95';

    const checkboxInfoArray = ['sell', 'rent', 'parking', 'furnished', 'offer'];

    const inputInfoArray = [
        { name: 'bedroom', label: 'Beds', min: 1, max: 10 },
        { name: 'bathrooms', label: 'Baths', min: 1, max: 10 },
        { name: 'regularPrice', label: 'Regular Price', min: 100 },
        { name: 'discountPrice', label: 'Discounted Price', min: 100 },
    ];


    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-slate-800 text-3xl font-semibold text-left my-7'>
                Create Listing
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    {/* Reuse inputStyles for common input styles */}
                    <input
                        type="text"
                        autoComplete="off"
                        placeholder='Name'
                        maxLength='65'
                        minLength='5'
                        required
                        name="name"
                        id="name"
                        className={inputStyles}
                    />
                    <textarea
                        type="text"
                        autoComplete="off"
                        placeholder='Description'
                        maxLength='250'
                        minLength='10'
                        required
                        name="description"
                        id="description"
                        className={inputStyles}
                    />
                    <input
                        type="text"
                        autoComplete="off"
                        placeholder='Address'
                        maxLength='250'
                        minLength='10'
                        required
                        name="address"
                        id="address"
                        className={inputStyles}
                    />

                    <div className={'flex gap-6 flex-wrap text-slate-800'}>

                        {checkboxInfoArray.map(option => (
                            <div key={option} className='flex gap-2'>
                                <input type="checkbox" name={option} id={option} className='w-5' />
                                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                            </div>
                        ))}

                    </div>
                    <div className={`flex flex-wrap ${flexGapStyles} text-slate-800`}>

                        {inputInfoArray.map(inputInfo => (
                            <div key={inputInfo.name} className='flex items-center gap-2'>
                                <input
                                    type="number"
                                    name={inputInfo.name}
                                    id={inputInfo.name}
                                    required
                                    min={inputInfo.min}
                                    max={inputInfo.max}
                                    className={numberInputStyles}
                                />
                                <p>{inputInfo.label}</p>
                            </div>
                        ))}

                    </div>
                </div>

                <div className='flex flex-col flex-1 gap-4 text-slate-800'>
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'>
                            The first Images will be the cover (max 6)
                        </span>
                    </p>

                    <div className='flex gap-4'>
                        <input
                            className={`p-3 border border-gray-300 rounded w-full text-sm`}
                            type="file"
                            name="images"
                            id="images"
                            accept='image/*'
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                        />

                        <button
                            className={`${buttonStyles} w-28 text-green-800 border-green-700 hover:shadow-lg disabled::opacity-80`}
                            type='button'
                            disabled={uploading}
                            onClick={handleImageSubmit}
                        >
                            {
                                uploading ? `${imagePercent}%` : 'Upload'
                            }
                        </button>
                    </div>

                    <p className='text-center text-sm'>
                        {
                            imageUploadError ? (
                                <span className='text-red-800'>{imageUploadError}</span>
                            ) : formData.imageUrls.length === 0 ? (
                                null
                            ) : imagePercent === 100 ? (
                                <span className='text-green-700 font-semibold'> {`Image(s) upload successfully 😊 (${formData.imageUrls.length} images)`}</span>
                            ) : null
                        }
                    </p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div
                                className='flex justify-between p-3 border items-center hover:bg-green-100'
                                key={url}
                            >
                                <img
                                    className='w-20 h-20 object-contain rounded-lg'
                                    src={url}
                                    alt="listing image"
                                />

                                <button
                                    className='p-3 text-red-700 rounded-lg uppercase hover:bg-red-800 hover:text-white'
                                    type='button'
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    }
                    <button className={`${buttonStyles} bg-green-700 text-white`}>
                        Create List
                    </button>

                </div>
            </form>
        </main >
    )
}

export default CreateListing;