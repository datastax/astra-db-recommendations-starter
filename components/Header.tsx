'use client'
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { BuyIcon, LoginIcon, LogoIcon, MenuIcon, SearchIcon, ThemeModeIcon } from "./icons";
import { useDebounce } from "@/hooks/useDebounce";
import { useThemeDetector } from "@/hooks/useThemeDetector";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');

  const [searchKey, setSearchKey] = useState<string>('');

  const { toggleTheme } = useThemeDetector();
  const debouncedValue = useDebounce<string>(searchKey, 500);

  useEffect(() => {
    if(keyword) {
      setSearchKey(keyword);
    }
  }, [keyword]);

  useEffect(() => {
    if (debouncedValue) {
      const searchParams = new URLSearchParams({ 'keyword': debouncedValue });
      router.push(`/search?${searchParams.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() =>{
    if(!searchKey && pathname.includes('/search')) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, pathname]);

  const onSearchKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  }

  return (
    <div>
      <div className="flex items-center justify-between py-2 mt-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="chatbot-shop-logo">
            <Link href={"/"} prefetch><LogoIcon /></Link>
          </div>
          <button className='chatbot-button hidden md:flex rounded-md items-center justify-center px-2.5'>
            <MenuIcon />
            <span className='hidden lg:block font-semibold text-sm ml-2'>Categories</span>
          </button>
          <div className="hidden md:flex chatbot-input">
            <SearchIcon />
            <input
              placeholder="Search"
              value={searchKey}
              onChange={onSearchKeyChange}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className='chatbot-button flex rounded-md items-center justify-center px-2.5'>
            <LoginIcon />
            <span className='hidden lg:block font-semibold text-sm ml-2'>Login</span>
          </button>
          <div className="chatbot-icon">
            <BuyIcon />
          </div>
          <div className="chatbot-icon" onClick={toggleTheme}>
            <ThemeModeIcon />
          </div>
        </div>
      </div>
      <div className="flex md:hidden items-center gap-3 mt-3">
        <button className='chatbot-button flex rounded-md items-center justify-center px-2.5'>
          <MenuIcon />
          <span className='hidden lg:block font-semibold text-sm ml-2'>Categories</span>
        </button>
        <div className="chatbot-input flex w-full">
          <SearchIcon />
          <input
            placeholder="Search"
            value={searchKey}
            onChange={onSearchKeyChange}
          />
        </div>
      </div>
    </div>
  )
}