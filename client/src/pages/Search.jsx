import React from 'react'

const Search = () => {
    return (
        <div className='flex flex-col md:flex-row'>
            <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
                <form className='flex flex-col gap-8'>
                    <div className='flex items-center gap-2'>
                        <label className='whitespace-nowrap font-semibold' htmlFor='searchTerm'>
                            Search Term:
                        </label>
                        <input
                            type='text'
                            id='searchTerm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                        />
                    </div>
                    <fieldset className='flex gap-2 flex-wrap items-center'>
                        <legend className='font-semibold'>Type:</legend>
                        {[
                            { id: 'all', label: 'Rent & Sale' },
                            { id: 'rent', label: 'Rent' },
                            { id: 'sale', label: 'Sale' },
                            { id: 'offer', label: 'Offer' },
                        ].map((option) => (
                            <div key={option.id} className='flex gap-2'>
                                <input type='checkbox' id={option.id} className='w-5' />
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </fieldset>
                    <fieldset className='flex gap-2 flex-wrap items-center'>
                        <legend className='font-semibold'>Amenities:</legend>
                        {[
                            { id: 'parking', label: 'Parking' },
                            { id: 'furnished', label: 'Furnished' },
                        ].map((option) => (
                            <div key={option.id} className='flex gap-2'>
                                <input type='checkbox' id={option.id} className='w-5' />
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </fieldset>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold' htmlFor='sort_order'>
                            Sort:
                        </label>
                        <select id='sort_order' className='border rounded-lg p-3'>
                            {[
                                'Price high to low',
                                'Price low to high',
                                'Latest',
                                'Oldest',
                            ].map((option) => (
                                <option key={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                        Search
                    </button>
                </form>
            </div>
            <div>
                <h1 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>
                    Listing results:
                </h1>
            </div>
        </div>

    )
}

export default Search