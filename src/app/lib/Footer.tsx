import ContactForm from '@/app/lib/ContactForm';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-black to-[#576767] text-white py-16 mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Contact Us
        </h2>

        {/* add a wrapper here */}
        <div
          className="
            w-full                   /* full width on really small screens */
            sm:w-80                  /* 20rem (~320px) on ≥640px */
            md:w-96                  /* 24rem (~384px) on ≥768px */
            lg:w-[28rem]             /* 28rem (~448px) on ≥1024px */
            xl:w-[32rem]             /* 32rem (~512px) on ≥1280px */
            mx-auto                  /* center it horizontally */
          "
        >
          <ContactForm />
        </div>

        <p className="text-center text-gray-400 mt-12 text-sm">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-4 text-right px-6">
        Icon by{' '}
        <a
          className="underline"
          href="https://freeicons.io/city-elements-icon-set-14/bed-city-elements-bedroom-hotel-sleep-icon-769408"
        >
          ColourByteDesigns
        </a>{' '}
        on{' '}
        <a className="underline" href="https://freeicons.io">
          freeicons.io
        </a>
      </p>
    </footer>
  );
}
