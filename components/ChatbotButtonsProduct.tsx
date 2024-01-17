'use client';

import { useState } from 'react';

import { BuyIcon, MinusIcon, PlusIcon } from '@/components/icons';

const ChatbotButtonsProduct = () => {
  const [amount, setAmount] = useState<number>(1);

  const onPlus = () => {
    setAmount(amount + 1);
  };

  const onMinus = () => {
    if (amount > 1) {
      setAmount(amount - 1);
    }
  };

  return (
    <div className='chatbot-buy-amount flex items-center gap-4'>
      <button onClick={onMinus}>
        <MinusIcon />
      </button>
      <div className='w-[40px] h-[40px] rounded-md border border-borderPrimary'>
        <div className='chatbot-input !p-1'>
          <input
            className='w-full h-full text-center'
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>
      <button onClick={onPlus}>
        <PlusIcon />
      </button>
      <button className='chatbot-button flex rounded-md items-center justify-center px-2.5'>
        <BuyIcon />
        <span
          className='font-semibold text-sm ml-2'
          onClick={() => console.log('amount', amount)}
        >
          Add to Cart
        </span>
      </button>
    </div>
  );
};

export default ChatbotButtonsProduct;
