import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// Define reusable CSS classes for common styles
const inputStyles = 'border p-3 rounded-lg';
const numberInputStyles = ' w-[80px] p-1 border border-gray-300 rounded text-center font-bold text-green-900 ';
const buttonStyles = 'p-3 border rounded-lg uppercase hover:opacity-95';
const absolutepStyles = 'top-0 left-0 text-white text-xs w-full absolute text-start p-1 bg-green-600';
const divStyle = 'relative  bg-green-200 p-2';

const checkboxInfoArray = ['parking', 'furnished', 'offer'];

const inputInfoArray = [
    { name: 'bedrooms', label: 'Beds', min: 1, max: 10 },
    { name: 'bathrooms', label: 'Baths', min: 1, max: 10 },
];

const UpdateListing = () => {
    const [files, setFiles] = useState([]);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [imagePercent, setImagePercent] = useState(null);
    const [uploading, setUplaoding] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    const { currentUser } = useSelector(state => state.user);
    const [errorSubmit, setErrorSubmit] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 100,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();


            if (data.succes === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };

        fetchListing();

    }, []);

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
                setFiles([]);

            })
                .catch((error) => {
                    setImageUploadError('Image upload failed. Max 2MB per image.');
                    setUplaoding(false);
                });

        } else if (files.length == 0) {

            setImageUploadError('Please select a photo');

        } else {

            setImageUploadError('You can Only upload 6 images per listing');
            setUplaoding(false);

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) {
                setErrorSubmit('You must Upload at least one image');
                return;
            }
            if (+formData.regularPrice < +formData.discountPrice) {
                setErrorSubmit('Discounted price must be lower than regular price');
                return;
            }

            setLoadingSubmit(true);
            setErrorSubmit(false);

            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoadingSubmit(false);


            if (data.success === false) {
                setErrorSubmit(data.message);
            }

            navigate(`/listing/${data._id}`);

        } catch (error) {
            setErrorSubmit(error.message);
            setLoadingSubmit(false);
        }
    };


    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };


    const handleChange = (e) => {
        if (e.target.id === 'sell' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            });
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            });
        }
        if (e.target.type === 'number') {
            // Ensure the value is converted to a number
            setFormData({
                ...formData,
                [e.target.id]: parseFloat(e.target.value)
            });
        }

        if (e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            });
        }

    };

    useEffect(() => {
        // Clear the error message after 3 seconds when it's present
        if (imageUploadError) {
            const timeoutId = setTimeout(() => {
                setImageUploadError(null);
            }, 3000); // 3000 milliseconds (3 seconds)
            return () => clearTimeout(timeoutId);
        }
    }, [imageUploadError]);


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
                            reject(error);
                        });
                }
            );
        });
    };

    const InputGroup = ({ name, min, max, label, }) => (
        <div className="flex items-center gap-2 pt-3">
            <input
                type="number"
                name={name}
                id={name}
                required
                min={min}
                max={max}
                className={`${numberInputStyles}`}
                onChange={handleChange}
                value={formData[name]}
            />

            <div className="flex gap-3">
                <p>{label}</p>
                {(formData.type === 'rent' && (name === 'regularPrice' || name === 'discountPrice')) && (
                    <span className="text-sm text-green-800"> ($/month)</span>
                )}
            </div>

        </div>
    );

    return (
        <main className='p-3 max-w-4xl mx-auto'>

            <h1 className='text-slate-800 text-3xl font-semibold text-left my-7 p-3 '>
                Update Listing
            </h1>

            <form
                className='flex flex-col sm:flex-row gap-6'
                onSubmit={handleSubmit}
            >

                <div className='flex flex-col gap-4 w-full sm:w-96 p-3'>
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
                        onChange={handleChange}
                        value={formData.name}
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
                        onChange={handleChange}
                        value={formData.description}
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
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <div className='flex flex-row text-sm gap-2'>
                        <div className={`${divStyle} w-[100px]`}>
                            <p className={`${absolutepStyles}`}>
                                Sell or Rent
                            </p>
                            <div className=' flex items-center flex-wrap text-slate-800 mt-5'>
                                <div key="sell" className='flex gap-2 my-1'>
                                    <input
                                        type="checkbox"
                                        name="sell"
                                        id="sell"
                                        className='w-5'
                                        onChange={handleChange}
                                        checked={formData.type === 'sell'}
                                    />
                                    <span>Sell</span>
                                </div>
                                <div key="rent" className='flex gap-2 my-1'>
                                    <input
                                        type="checkbox"
                                        name="rent"
                                        id="rent"
                                        className='w-5'
                                        onChange={handleChange}
                                        checked={formData.type === 'rent'}
                                    />
                                    <span>Rent</span>
                                </div>
                            </div>
                        </div>

                        <div className={`${divStyle} w-[200px]`}>
                            <div className='mt-3'>
                                <p className={`${absolutepStyles}`}>
                                    Bed & Bath
                                </p>
                                {inputInfoArray.slice(0, 2).map(inputInfo => (
                                    <InputGroup key={inputInfo.name} {...inputInfo} />
                                ))}
                            </div>
                        </div>

                        <div className={`${divStyle} w-[200px]`}>
                            <div className='mt-5'>
                                <p className={`${absolutepStyles}`}>
                                    Others
                                </p>
                                {checkboxInfoArray.map(option => (
                                    <div key={option} className='flex gap-2 py-1'>
                                        <input
                                            type="checkbox"
                                            name={option}
                                            id={option}
                                            className='w-5'
                                            onChange={handleChange}
                                            checked={formData[option]}
                                        />
                                        <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className='relative bg-green-200 rounded'>

                        <div className='mt-3 p-3 pl-8'>
                            <p className={`${absolutepStyles}`}>
                                Regular Price{formData.offer && ' and Discounted Price'}
                            </p>
                            <InputGroup
                                name="regularPrice"
                                label="Regular Price"
                                min={100}
                                max={2000}
                            />
                            {formData.offer && (
                                <InputGroup
                                    name="discountPrice"
                                    label="Discounted Price"
                                    min={0}
                                    max={2000}
                                />
                            )}
                        </div>
                    </div>

                </div>

                <div className='flex flex-col flex-1 p-3 gap-4 text-slate-800'>

                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-xs text-green-600 ml-2'>
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
                                <span className='text-green-700 font-semibold'> {`Image upload successfully 😊 (${formData.imageUrls.length} images)`}</span>
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
                    {
                        errorSubmit && <p className='text-red-700 text-sm'>{errorSubmit}</p>
                    }

                    <button
                        disabled={loadingSubmit}
                        className={`${buttonStyles} bg-green-700 text-white disabled:opacity-50`}
                    >
                        {
                            loadingSubmit ? 'Updating...' : 'update'
                        }
                    </button>

                </div>
            </form>
        </main >
    )
}

export default UpdateListing;