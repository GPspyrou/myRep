'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { House } from '@/app/types/house';

interface Props {
  houses: House[];
}

export default function Filters({ houses }: Props) {
  const router = useRouter();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const locations = useMemo(
    () => Array.from(new Set(houses.map(h => h.location))).sort(),
    [houses]
  );
  const categories = useMemo(
    () => Array.from(new Set(houses.map(h => h.category))).sort(),
    [houses]
  );
  const bedrooms = useMemo(
    () => Array.from(new Set(houses.map(h => h.bedrooms))).sort((a, b) => +a - +b),
    [houses]
  );
  const prices = useMemo(() => {
    const nums = houses
      .map(h => parseInt(h.price, 10))
      .filter(n => !isNaN(n));
    return Array.from(new Set(nums)).sort((a, b) => a - b);
  }, [houses]);

  const [mode, setMode] = useState<'sale' | 'rental'>('sale');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [refName, setRefName] = useState('');
  const [bedroom, setBedroom] = useState('');

  const handleApply = () => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    if (category)  params.set('category', category);
    if (bedroom)   params.set('bedrooms', bedroom);
    if (minPrice)  params.set('minPrice', minPrice);
    if (maxPrice)  params.set('maxPrice', maxPrice);
    if (refName)   params.set('ref', refName);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out transform
      ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
    `}>
      {/* ——— 1) DARK OVERLAY HEADER ——— */}
      <div className="mx-auto w-full max-w-lg
                      bg-black/70 backdrop-blur-sm
                      border-2 border-white
                      py-3 px-6
                      text-white">
        <h2 className="text-3xl md:text-4xl font-serif text-center">
          Search Property
        </h2>
      </div>

      {/* ——— 2) TABS BAR ——— */}
      <div className="mx-auto w-full max-w-lg
                      flex justify-center
                      border-b-2 border-pink-200
                      mt-2">
        {['sale','rental'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`
              px-6 py-2 font-medium tracking-widest uppercase
              ${mode === m
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-400 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-300'
              }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ——— 3) WHITE FORM BOX ——— */}
      <div className="mx-auto w-full max-w-lg
                      bg-white px-6 pt-6 pb-8
                      shadow-sm">
        <form
          onSubmit={e => { e.preventDefault(); handleApply() }}
          className="flex flex-wrap justify-center gap-4"
        >
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-40 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Type</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="w-32 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Min Price</option>
            {prices.map(p => (
              <option key={p} value={p}>{p} €</option>
            ))}
          </select>

          <select
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-32 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Max Price</option>
            {prices.map(p => (
              <option key={p} value={p}>{p} €</option>
            ))}
          </select>

          <input
            type="text"
            value={refName}
            onChange={e => setRefName(e.target.value)}
            placeholder="Ref. or Name"
            className="w-48 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          />

          <select
            value={bedroom}
            onChange={e => setBedroom(e.target.value)}
            className="w-32 border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#c7aebe]"
          >
            <option value="">Bedrooms</option>
            {bedrooms.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              className="px-10 py-3 font-medium rounded-md
                         bg-[rgb(184,161,125)] text-white text-lg
                         tracking-wide hover:bg-white hover:text-black
                         hover:border hover:border-black
                         transition-all duration-200"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}