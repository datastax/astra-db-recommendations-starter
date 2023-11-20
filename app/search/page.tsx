'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Sora } from 'next/font/google'
import ProductCard from '@/components/ProductCard'
import { ProductItem } from '@/utils/product'
import { useSearchParams } from 'next/navigation'
import Spinner from '@/components/Spinner'

const sora = Sora({ subsets: ['latin'] })

export default function Search() {
  const query = useSearchParams();
  const searchKey = query.get('keyword');

  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductItem[]>();

  const getSearchResults = async (keyword: string) => {
    setLoading(true);
    try {
      const response = await axios.post<ProductItem[]>('/api/search', { query: keyword });
      setProducts(response.data);
    } catch {

    }
    setLoading(false);
  }

  useEffect(() => {
    if (searchKey) {
      getSearchResults(searchKey);
    } else {
      setProducts(undefined);
    }
  }, [searchKey]);

  return (
    <main className="min-h-screen mt-12">
      <section className='mb-12'>
        <div className='flex items-center gap-6 mb-6'>
          <h2 className={`${sora.className} text-2xl font-semibold`}>Results</h2>
          <hr className='chatbot-divider flex-1' />
        </div>
        {loading ?
          <div className='flex justify-center w-full mt-8'>
            <Spinner />
          </div>
          :
          products ?
            products.length ?
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {products.map((product, index) =>
                  <div key={`product-card-${index}`} className='col-span-1'>
                    <ProductCard data={product} />
                  </div>
                )}
              </div>
              :
              <h2 className={`${sora.className} text-center text-2xl font-semibold`}>No Product</h2>
            :
            null
        }
      </section>
    </main>
  )
}
