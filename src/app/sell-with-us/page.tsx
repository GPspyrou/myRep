import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sell with Us | Real Estate Experts',
  description:
    'Everything you need to know to sell your property — expenses, documents, legal steps, and expert tips.',
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="mb-16 border-b border-gray-200 pb-10 animate-fadeIn">
    <h2 className="text-3xl font-serif font-bold text-[#361e1a] mb-6">{title}</h2>
    <div className="space-y-6 text-black leading-relaxed [&_strong]:text-[#361e1a] [&_h3]:text-[#361e1a]">
      {children}
    </div>
  </section>
);

const SellWithUsPage = () => {
  return (
    <main className="min-h-screen w-full px-0 md:px-0 py-0" style={{ backgroundColor: '#D6D2C4' }}>
      <div className="relative w-full h-[60vh]">
        <Image
          src="/sell-with-us-hero.jpg" // Replace with your actual image path
          alt="Sell your property"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white text-center px-4">
            Sell Your Property with Confidence
          </h1>
        </div>
      </div>
      <div className="px-6 md:px-12 py-16 max-w-full">
        <Section title="1. Seller Costs & Taxes in Greece">
          <p>
            When selling a property in Greece, the transaction is subject to a series of fiscal
            obligations and professional fees that should be anticipated well in advance.
            Although the Greek government has currently suspended the Capital Gains Tax on
            property sales by individuals until the end of 2026, sellers should remain informed
            of any updates to this policy. In cases where it is applicable, this tax amounts to
            15% on the net profit realized from the sale—calculated as the difference between the
            selling and original purchase price, after deducting documented expenses such as
            renovations and maintenance.
          </p>

          <p>
            Typically, the real estate transfer tax is borne by the buyer and is fixed at 3.09%
            of the property’s taxable value. However, sellers should be aware of this obligation
            in case it is contractually negotiated otherwise. In addition, Value Added Tax (VAT)
            may apply to new properties sold by developers, although its application is currently
            suspended until the end of 2025.
          </p>

          <p>
            Other expenses involved in the sale include notary fees, legal representation, real
            estate agent commission, and land registry charges. The notary and legal fees
            generally range between 1% and 2% of the sale price each, depending on the complexity
            of the transaction. If a property has an active mortgage, the seller is also
            responsible for the mortgage cancellation costs, and must obtain and present an
            Energy Performance Certificate, which is a legal requirement for any property
            transfer.
          </p>

          <p>
            For sellers who are non-residents, special rules may apply, such as withholding tax
            on the purchase price, which is submitted to the Greek tax authority as an advance on
            behalf of the seller, and may be reclaimed via tax return.
          </p>

          <h3 className="font-semibold text-xl mt-8">Summary of Seller-Related Costs:</h3>
          <ul className="list-disc pl-6">
            <li>
              <strong>Capital Gains Tax</strong> (15% on net profit) – <em>currently suspended through 2026</em>
            </li>
            <li>
              <strong>Notary Fees</strong> – approx. 1%–2% of the sale price
            </li>
            <li>
              <strong>Legal Fees</strong> – approx. 1% of the sale price
            </li>
            <li>
              <strong>Real Estate Agent Commission</strong> – 2%–5% of the final sale price
            </li>
            <li>
              <strong>Land Registry Fees</strong> – approx. 0.5% of the property value
            </li>
            <li>
              <strong>Mortgage Cancellation Costs</strong> – approx. €200–€500 (if applicable)
            </li>
            <li>
              <strong>Energy Performance Certificate</strong> – approx. €100–€300
            </li>
          </ul>

          <p>
            These costs may vary depending on the location, nature of the property, and the
            professionals involved. For precise calculation and compliance, consultation with a
            qualified Greek real estate lawyer or notary is strongly recommended.
          </p>
        </Section>

        <Section title="2. Documents Required Before Signing">
          <div>
            <h3 className="font-semibold text-xl">Mandatory</h3>
            <ul className="list-disc pl-6">
              <li>Identity Card or Passport</li>
              <li>Tax Identification Number (AFM)</li>
              <li>Original Title Deed</li>
              <li>Energy Performance Certificate (KENAK)</li>
              <li>Certificate of Encumbrances (if mortgage exists)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl">Optional (Recommended)</h3>
            <ul className="list-disc pl-6">
              <li>Building Permit or Completion Certificate</li>
              <li>ENFIA Tax Certificate</li>
              <li>Latest utility bills</li>
            </ul>
          </div>
        </Section>

        <Section title="3. Selling Process">
          <div>
            <h3 className="font-semibold text-xl">A. Preparation</h3>
            <ul className="list-disc pl-6">
              <li>Professional property valuation</li>
              <li>Gather all necessary documentation</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl">B. Negotiation & Deposit</h3>
            <ul className="list-disc pl-6">
              <li>Sign private preliminary agreement (5%–10% deposit)</li>
              <li>Ensure legal supervision of all terms</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl">C. Notarial Deed</h3>
            <ul className="list-disc pl-6">
              <li>Sign in front of a notary with legal representatives</li>
              <li>Final payment & deed registration at the Land Registry</li>
            </ul>
          </div>
        </Section>

        <Section title="4. Sales Procedure & Helpful Tips">
          <p>
            Selling a property involves several key steps. First, it's necessary to obtain a
            valuation of the property by a professional real estate agent and gather all the
            required documents and certificates.
          </p>
          <p>
            Next comes the negotiation phase, during which the price and terms of the sale are
            agreed upon. Typically, a private agreement (pre-contract) is signed, at which point
            the buyer pays a deposit ranging from 5% to 10% of the final price. It’s important to
            have legal supervision to ensure the interests of both parties are protected.
          </p>
          <p>
            The process is completed with the signing of the notarial deed, in the presence of a
            notary, the seller, the buyer, and their legal representatives. The remaining sale
            amount is paid at this stage, and the deed is officially registered with the Land
            Registry or Cadastre.
          </p>

          <h3 className="font-semibold text-xl mt-8">Helpful Tips</h3>
          <ul className="list-disc pl-6">
            <li>
              Being well-informed about the local real estate market is crucial, as prices can
              vary significantly depending on demand, infrastructure, and tourism in the area.
            </li>
            <li>
              Choosing between an exclusive or multi-channel agency listing can greatly affect
              the effectiveness of your sale. Exclusive listings typically offer better
              management and more targeted promotion.
            </li>
            <li>
              Improving your property's energy efficiency rating can help you secure a higher
              selling price.
            </li>
            <li>
              Working with an experienced lawyer can prevent delays and unforeseen issues
              related to legal, tax, or urban planning matters.
            </li>
          </ul>
        </Section>

        <Section title="5. Frequently Asked Questions (FAQs)">
          <div>
            <h3 className="font-semibold">Q1: Do I need a real estate agent?</h3>
            <p>
              Many sellers wonder if they truly need an agent. The truth is, while you can manage
              the sale process independently, an experienced real estate agent usually speeds up
              the transaction and helps secure a better selling price.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Q2: How long does the selling process take?</h3>
            <p>
              The average time to complete a sale ranges from 2 to 6 months, depending on the
              completeness of your documents and how quickly the buyer agrees to the terms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Q3: Can I conduct property viewings myself?</h3>
            <p>
              Yes, but working with an agency offers a more structured, professional, and secure
              experience for both you and potential buyers.
            </p>
          </div>
        </Section>
      </div>
    </main>
  );
};

export default SellWithUsPage;
