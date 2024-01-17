import { Sora } from 'next/font/google';
import Image from 'next/image';
import axios from 'axios';

import ProductCard from '@/components/ProductCard';
import ProductStarRatings from '@/components/ProductStarRatings';
import ChatbotButtonsProduct from '@/components/ChatbotButtonsProduct';

import { ProductItem } from '@/utils/product';

const sora = Sora({ subsets: ['latin'] });

export default async function Page({
  params,
}: {
  params: { productId: string };
}) {
  const { productId } = params;

  const productResponse = await axios
    .get<ProductItem>(`${process.env.API_BASE_URL}/api/product/${productId}`)
    .catch((err) => {
      console.log('err', err);
    });

  const recommendProductsResponse = await axios
    .get<ProductItem[]>(
      `${process.env.API_BASE_URL}/api/product/${productId}/recommended`
    )
    .catch((err) => {
      console.log('err', err);
    });

  const product = productResponse?.data;

  const recommendProducts = recommendProductsResponse?.data;

  const productDetails = product?.product_specification
    ?.split('|')
    .map((spec) => {
      const pair = spec.split(':');
      return {
        key: pair[0],
        value: pair[1],
      };
    });

  return (
    <main className='mt-12'>
      <section className='mb-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='col-sapn-1'>
            <div className='relative h-[300px] lg:h-[600px]'>
              {product?.image ? (
                <Image
                  className='rounded-md object-contain'
                  src={product.image}
                  fill
                  sizes='100%'
                  alt={product?.product_name}
                />
              ) : null}
            </div>
          </div>
          <div className='col-sapn-1'>
            <div className='flex-1 flex flex-col'>
              <div className='mt-4'>
                {product && <ProductStarRatings product={product} />}
                <h2 className='text-[34px] font-semibold mt-4'>
                  {product?.product_name || ''}
                </h2>
                <p className='mt-4 text-textSecondaryInverse'>
                  {product?.about_product || ''}
                </p>
                <h3 className='text-2xl font-semibold mt-4'>Product Details</h3>
                <div className='flex flex-col text-textSecondaryInverse'>
                  {productDetails
                    ? productDetails.map((spec, index) => (
                        <span key={`product-specification-${index}`}>
                          <b>{spec.key}:</b> {spec.value}
                        </span>
                      ))
                    : null}
                </div>
              </div>
              <div className='flex flex-col md:flex-row md:items-center justify-between mt-9 gap-4'>
                <span
                  className={`text-[34px] font-semibold text-textPrimaryInverse ${sora.className}`}
                >
                  {product?.selling_price || ''}
                </span>
                <ChatbotButtonsProduct />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className='mb-12'>
        <div className='flex items-center gap-6 mb-6'>
          <h2 className={`${sora.className} text-2xl font-semibold`}>
            Related Products
          </h2>
          <hr className='chatbot-divider flex-1' />
        </div>
        {recommendProducts ? (
          recommendProducts.length ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {recommendProducts.map((product, index) => (
                <div key={`product-card-${index}`} className='col-span-1'>
                  <ProductCard data={product} />
                </div>
              ))}
            </div>
          ) : (
            <h2
              className={`${sora.className} text-center text-2xl font-semibold`}
            >
              No Products
            </h2>
          )
        ) : null}
      </section>
    </main>
  );
}
