import dynamic from 'next/dynamic';

import Color from '@/utils/color';
import { ProductItem } from '@/utils/product';

const StarRatings = dynamic(() => import('react-star-ratings'), {
  ssr: false,
});

interface Props {
  product: ProductItem;
}

const ProductStarRatings = ({ product }: Props) => (
  <StarRatings
    // ignoreInlineStyles
    rating={Number(product?.rating) || 0}
    starRatedColor={Color['categoryMagenta']}
    starEmptyColor={Color['textSecondary']}
    starDimension='16px'
    numberOfStars={5}
    name='rating'
    starSpacing='1px'
    svgIconPath='M7.00004 10.8466L11.12 13.3333L10.0267 8.64663L13.6667 5.49329L8.87337 5.08663L7.00004 0.666626L5.12671 5.08663L0.333374 5.49329L3.97337 8.64663L2.88004 13.3333L7.00004 10.8466Z'
    svgIconViewBox='0 0 14 14'
  />
);

export default ProductStarRatings;
