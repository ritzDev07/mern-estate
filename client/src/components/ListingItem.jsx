import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaParking } from 'react-icons/fa';
import { MdBathroom, MdChair } from 'react-icons/md'

const ListingItem = ({ listing }) => {
    return (
        <div className=' w-full bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg sm:w-[275px]'>
            <Link to={`/listing/${listing._id}`}>
                <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-[220px] sm:h-[160px] w-full object-cover hover:scale-105 transition-scale duration-300'
                />
                <div className='p-3 flex flex-col gap-2 w-full'>
                    <p className='truncate text-lg font-semibold text-slate-700'>
                        {listing.name}
                    </p>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='h-4 w-4 text-green-700' />
                        <p className='text-sm text-gray-600 truncate w-full'>
                            {listing.address}
                        </p>
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                        {listing.description}
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold '>
                        $
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <div className=' text-xs flex gap-4 text-green-800'>
                        <div className=' font-bold flex items-center gap-1'>
                            <FaBed />
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} beds `
                                : `${listing.bedrooms} bed `}

                        </div>
                        <div className='font-bold flex items-center gap-1'>
                            <MdBathroom />
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} baths `
                                : `${listing.bathrooms} bath `}

                        </div>
                        <div className={`font-bold flex items-center gap-1 ${!listing.parking ? 'text-red-900' : ''}`}>
                            <FaParking />
                            {listing.parking ? 'Yes' : 'No'}

                        </div>
                        <div className={`font-bold flex items-center gap-1 ${!listing.furnished ? 'text-red-900' : ''}`}>
                            <MdChair />
                            {listing.furnished ? 'Yes' : 'No'}

                        </div>
                    </div>

                </div>
            </Link>
        </div>
    )
}

export default ListingItem