import React from 'react'
import SearchBer from '../searchBer/searchBer';
import Categories from '../categories/categories';



function SearchBerCategories() {
    return (
        <div className='bg-primary-light pt-[9px] lg:py-[10px]'>
            <div className='container lg:flex flex-1 items-center justify-center gap-8'>
                <div>
                    <Categories />
                </div>
                <div className='hidden lg:block'>
                    <SearchBer />
                </div>
            </div>
        </div>
    )
}

export default SearchBerCategories