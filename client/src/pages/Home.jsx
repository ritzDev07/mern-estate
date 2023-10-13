import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

const Home = () => {

    const [offerListings, setOfferListings] = useState([]);
    const [sellListings, setsellListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);

    SwiperCore.use([Navigation, Autoplay]);
    console.log(offerListings);
    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4');
                const data = await res.json();
                setOfferListings(data);
                fetchRentListings();
            } catch (error) {
                console.log(error);
            }
        };
        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4');
                const data = await res.json();
                setRentListings(data);
                fetchsellListings();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchsellListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sell&limit=4');
                const data = await res.json();
                setsellListings(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOfferListings();

    }, []);
    return (
        <div>
            {/* top */}
            <Swiper navigation autoplay={{ delay: 5000 }}>
                {offerListings &&
                    offerListings.length > 0 &&
                    offerListings.map((listing) => (
                        <SwiperSlide key={listing._id}>
                            <div
                                style={{
                                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                                className='h-[450px]'
                            >
                                {/* header content here */}
                                <header className='absolute top-5 left-0 flex flex-col gap-6 p-28  w-full '>
                                    <h1 className=' text-shadow-lg text-slate-200 font-bold text-3xl lg:text-6xl'>
                                        Discover Your <span className='text-green-800'>Ideal</span>
                                        <br />
                                        Home with Ease
                                    </h1>
                                    <p className='text-shadow-md text-slate-200 text-xs sm:text-sm'>
                                        RitzEstate - Your Perfect Place Awaits, Explore a Wide Range of Properties
                                    </p>
                                    <Link
                                        to={'/search'}
                                        className='text-shadow-lg text-xs sm:text-sm text-green-600 font-bold hover:underline'
                                    >
                                        Lets get started...
                                    </Link>
                                </header>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>

            {/* listing results for offer, sell and rent */}

            <div className='p-3 flex flex-col my-12 w-full'>

                {offerListings && offerListings.length > 0 && (
                    <div className=' mt-10'>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-800'>Recent offers</h2>
                            <Link className='ml-2 text-sm text-green-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {offerListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {rentListings && rentListings.length > 0 && (
                    <div className='mt-10 '>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-800'>Recent places for rent</h2>
                            <Link className='ml-2 text-sm text-green-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {rentListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
                {sellListings && sellListings.length > 0 && (
                    <div className='mt-10'>
                        <div className='my-3'>
                            <h2 className='text-2xl font-semibold text-slate-800'>Recent places for sell</h2>
                            <Link className='ml-2 text-sm text-green-800 hover:underline' to={'/search?type=sell'}>Show more places for sell</Link>
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            {sellListings.map((listing) => (
                                <ListingItem listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );

}

export default Home