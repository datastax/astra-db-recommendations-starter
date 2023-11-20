import { StaticImageData } from "next/image";
import { BookMediaIcon, ElectronicIcon, PersonalCareIcon, SportOutdoorIcon, ToyGameIcon } from "./icons";

import ElectronicImg from '@/assets/electronic.png';
import PersonalCareImg from '@/assets/personal-care.png';
import SportOutdoorImg from '@/assets/sports-outdoors.png';

export type Category = 'electronic' | 'personal-care' | 'sport-outdoor' | 'book-media' | 'toy-game';

const CategoryData: { [key in Category]: { icon: () => JSX.Element, title: string; description: string; img?: StaticImageData; backColor: string; } } = {
  'electronic': {
    icon: () => <ElectronicIcon />,
    title: 'Electronics',
    description: 'Explore the latest gadgets and tech accessories.',
    img: ElectronicImg,
    backColor: 'bg-categoryMagenta',
  },
  'personal-care': {
    icon: () => <PersonalCareIcon />,
    title: 'Personal Care',
    description: 'Enhance your beauty regimen with our skincare and cosmetics',
    img: PersonalCareImg,
    backColor: 'bg-categoryPurple',
  },
  'sport-outdoor': {
    icon: () => <SportOutdoorIcon />,
    title: 'Sports & Outdoors',
    description: 'Gear up for your active lifestyle with our sports equipment.',
    img: SportOutdoorImg,
    backColor: 'bg-categoryTeal',
  },
  'book-media': {
    icon: () => <BookMediaIcon />,
    title: 'Books & Media',
    description: 'Get lost in the world of books, movies, and music.',
    backColor: 'bg-categoryMagenta',
  },
  'toy-game': {
    icon: () => <ToyGameIcon />,
    title: 'Toys & Games',
    description: 'Find fun and educational toys for all ages.',
    backColor: 'bg-categoryCyan',
  },
}

export default function CategoryCard({ type }: { type: Category }) {
  const img = CategoryData[type].img;

  return (
    <div className={`chatbot-category-card flex overflow-hidden ${CategoryData[type].backColor}`}>
      <div className="flex-1 mx-6 my-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-[40px] h-[40px] flex items-center justify-center">
            {CategoryData[type].icon()}
          </div>
          <span className="text-xl font-semibold">{CategoryData[type].title}</span>
        </div>
        <p className="mb-4">{CategoryData[type].description}</p>
        <button className='chatbot-button flex rounded-md items-center justify-center px-2.5'>
          <span className='font-semibold text-sm'>See {CategoryData[type].title}</span>
        </button>
      </div>
      {img ?
        <div className="chatbot-category-card-image flex-1 hidden md:block" style={{ backgroundImage: `url(${img.src})` }}>
          <div className={`w-full h-full ${CategoryData[type].backColor} opacity-60`} />
        </div>
        :
        null}
    </div>
  )
}