'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Sora } from 'next/font/google'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import { ProductItem } from '@/utils/product'
import Spinner from '@/components/Spinner'

const sora = Sora({ subsets: ['latin'] })

export default function Home() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [nextPageState, setNextPageState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getProducts = async () => {
    setLoading(true);

    try {
      let baseUrl = '/api/product';
      if (nextPageState) {
        baseUrl += `?pagingState=${nextPageState}`;
      }
      const response = await axios.get<{ documents: ProductItem[]; nextPageState: string }>(baseUrl);
      setProducts([...products, ...response.data.documents]);
      setNextPageState(response.data.nextPageState);
    } catch (err) {

    }

    setLoading(false);
  }

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen mt-12">
      <section className='chatbot-landing-header mb-12'>
        <h1 className={sora.className}>Your Ultimate Shopping Destination!</h1>
        <p className='mt-4'>We&apos;re your go-to online shopping hub, offering a handpicked selection of products that cater to your lifestyle. From fashion and electronics to home decor and more, we bring you the latest trends and essentials. Explore our virtual aisles, find what you need, and enjoy a seamless shopping experience with us.</p>
      </section>
      <section className='mb-12'>
        <div className='flex items-center gap-6 mb-6'>
          <h2 className={`${sora.className} text-2xl font-semibold`}>Categories</h2>
          <hr className='chatbot-divider flex-1' />
        </div>
        <div className='grid grid-cols-2 xl:grid-cols-4 gap-6'>
          <div className='col-span-2'>
            <CategoryCard type='electronic' />
          </div>
          <div className='col-span-2'>
            <CategoryCard type='personal-care' />
          </div>
          <div className='col-span-2'>
            <CategoryCard type='sport-outdoor' />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <CategoryCard type='book-media' />
          </div>
          <div className='col-span-2 md:col-span-1'>
            <CategoryCard type='toy-game' />
          </div>
        </div>
      </section>
      <section className='mb-12'>
        <div className='flex items-center gap-6 mb-6'>
          <h2 className={`${sora.className} text-2xl font-semibold`}>Products</h2>
          <hr className='chatbot-divider flex-1' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.map((product, index) =>
            <div key={`product-card-${index}`} className='col-span-1'>
              <ProductCard data={product} />
            </div>
          )}
        </div>
        {loading ?
          <div className='flex justify-center w-full mt-8'>
            <Spinner />
          </div>
          :
          nextPageState ?
            <div className='flex justify-center w-full gap-4 mt-8'>
              {/* <hr className='chatbot-divider flex-1' /> */}
              <button className='chatbot-button flex rounded-md items-center justify-center px-2.5' onClick={getProducts}>
                <span className='font-semibold text-sm'>Load more</span>
              </button>
              {/* <hr className='chatbot-divider flex-1' /> */}
            </div>
            :
            null
        }
      </section>
    </main>
  )
}
