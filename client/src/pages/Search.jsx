import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';


const typeOptions = [
    { id: 'all', label: 'Rent & sell' },
    { id: 'rent', label: 'Rent' },
    { id: 'sell', label: 'sell' },
];

const amenityOptions = [
    { id: 'parking', label: 'Parking' },
    { id: 'furnished', label: 'Furnished' },
];

const sortOptions = [
    { value: 'regularPrice_desc', label: 'Price high to low' },
    { value: 'regularPrice_asc', label: 'Price low to high' },
    { value: 'createdAt_desc', label: 'Latest' },
    { value: 'createdAt_asc', label: 'Oldest' },
];

const Search = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const [sidebardata, setSidebardata] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    });



    useEffect(() => {
        window.scrollTo(0, 0);

        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebardata({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true',
                furnished: furnishedFromUrl === 'true',
                offer: offerFromUrl === 'true',
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);

            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();

            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }

            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [location.search]);

    const handleChange = (e) => {
        if (
            e.target.id === 'all' ||
            e.target.id === 'rent' ||
            e.target.id === 'sell'
        ) {
            setSidebardata({ ...sidebardata, type: e.target.id });
        }

        if (e.target.id === 'searchTerm') {
            setSidebardata({ ...sidebardata, searchTerm: e.target.value });
        }

        if (
            e.target.id === 'parking' ||
            e.target.id === 'furnished' ||
            e.target.id === 'offer'
        ) {
            setSidebardata({
                ...sidebardata,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';

            const order = e.target.value.split('_')[1] || 'desc';

            setSidebardata({ ...sidebardata, sort, order });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    return (
        <div className='max-w-6xl flex flex-col md:flex-row justify-center mx-auto'>
            <div className='w-full sm:w-[400px] p-3 border-b-2 md:border-r-2 '>
                <div className='pt-5 sticky top-0 z-10'>
                    <form
                        className='flex flex-col gap-8'
                        onSubmit={handleSubmit}
                    >
                        <div className='flex items-center gap-2'>
                            <label htmlFor='searchTerm' className='whitespace-nowrap font-semibold'>
                                Search Term:
                            </label>
                            <input
                                type='text'
                                id='searchTerm'
                                placeholder='Search...'
                                className='border rounded-lg p-3 w-full'
                                value={sidebardata.searchTerm}
                                onChange={handleChange}
                            />
                        </div>
                        <fieldset className='flex gap-2 flex-wrap items-center'>
                            <legend className='font-semibold'>Type:</legend>
                            {typeOptions.map((option) => (
                                <div key={option.id} className='flex gap-2'>
                                    <input
                                        type='checkbox'
                                        id={option.id}
                                        className='w-5'
                                        onChange={handleChange}
                                        checked={
                                            option.id === 'all'
                                                ? sidebardata.type === 'all'
                                                : sidebardata.type === option.id
                                        }
                                    />
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </fieldset>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                                checked={sidebardata.offer}
                            />
                            <span>Offer</span>
                        </div>
                        <fieldset className='flex gap-2 flex-wrap items-center'>
                            <legend className='font-semibold'>Amenities:</legend>
                            {amenityOptions.map((option) => (
                                <div key={option.id} className='flex gap-2'>
                                    <input
                                        type='checkbox'
                                        id={option.id}
                                        className='w-5'
                                        onChange={handleChange}
                                        checked={sidebardata[option.id]}
                                    />
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </fieldset>
                        <fieldset className='flex items-center gap-2'>
                            <label className='font-semibold'>Sort:</label>
                            <select
                                onChange={handleChange}
                                defaultValue={'created_at_desc'}
                                id='sort_order'
                                className='border rounded-lg p-3'
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                            Search
                        </button>
                    </form>
                </div>
            </div>
            <div className='w-full'>
                <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>
                    Listing results:
                </h1>
                <div className='p-1 flex flex-wrap gap-2'>
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No listing found!</p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    )}

                    {!loading &&
                        listings &&
                        listings.map((listing) => (
                            <ListingItem key={listing._id} listing={listing} />
                        ))}
                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-green-700 border rounded-lg uppercase  border-green-700 font-semibold hover:bg-green-700 hover:text-white p-3 text-center w-full'
                        >
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;