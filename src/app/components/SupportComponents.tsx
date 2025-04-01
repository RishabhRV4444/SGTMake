"use client";

import Image from "next/image";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

// Define types for FAQ
interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { question: "What is SGTMake?", answer: "SGTMake is a leading provider of custom cable solutions..." },
  { question: "What industries do you serve?", answer: "We serve industries such as automotive, aerospace, and telecommunications..." },
  { question: "How can I contact your customer support?", answer: "You can contact us via email at support@sgtmake.com or call us at +1234567890..." },
  { question: "What are your business hours?", answer: "Our business hours are Monday to Friday, 9 AM - 5 PM..." },
  { question: "How can I track my orders?", answer: "You can track your orders using the tracking ID sent to your email..." },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <p className="text-gray-600 mb-6">Please fill in the part number according to your cable requirements.</p>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-2">
            <button
              className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-100"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? <FaMinus className="text-gray-500" /> : <FaPlus className="text-gray-500" />}
            </button>
            {openIndex === index && <p className="p-4 text-gray-600">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Define types for Card
interface CardProps {
  img: string;
  title: string;
}

function Card({ img, title }: CardProps) {
  return (
    <div className="rounded-lg border p-3 flex flex-col items-center w-40 text-center h-40">
      <Image width={70} height={70} src={img} alt={title} className="mb-2" />
      <span className="font-bold text-sm">{title}</span>
    </div>
  );
}

export function HowToOrder() {
  const processSteps: CardProps[] = [
    { img: "/confirmplan.png", title: "Confirm Plan" },
    { img: "/production.png", title: "In Production" },
    { img: "/transpot.png", title: "Transportation" },
    { img: "/delivered.png", title: "Delivered" },
  ];

  return (
    <>
      <h2 className="text-2xl my-6">Our Process</h2>
      <div className="flex flex-wrap gap-4">
        {processSteps.map((step, index) => (
          <Card key={index} img={step.img} title={step.title} />
        ))}
      </div>
    </>
  );
}

// Define types for GetQuoteCard
interface GetQuoteCardProps {
  text: string;
}

export function GetQuote() {
  return (
    <div className="flex flex-wrap">
      <GetQuoteCard text="Contact Us" />
      <GetQuoteCard text="Share Details" />
      <GetQuoteCard text="Add Attachments" />
      <GetQuoteCard text="Set Timeline" />
    </div>
  );
}

function GetQuoteCard({ text }: GetQuoteCardProps) {
  return (
    <div className="p-7 rounded-lg border border-[#807B7B3D] bg-[#FAFAFA] shadow-md flex flex-col items-center justify-center text-center m-3 h-40 w-44">
      <div className="text-xl font-semibold">{text}</div>
    </div>
  );
}

// Define types for ServicesWarrantyCard
interface ServicesWarrantyCardProps {
  Question: string;
  Answer: string;
}

export function ServicesWarranty() {
  return (
    <div>
      <ServicesWarrantyCard
        Question="01. Warranty Period"
        Answer="SGTMake is committed to the quality and durability of our products. We offer a standard warranty period of 2 years from the date of purchase. This warranty covers defects in materials and workmanship under normal use. During this period, we will repair or replace, at our discretion, any product that proves to be defective, free of charge."
      />
      <ServicesWarrantyCard
        Question="02. Coverage Details"
        Answer="Our warranty covers defects in materials and workmanship that arise during normal use. This includes failures due to faulty components or manufacturing errors. We will repair or replace the defective part or product, ensuring it functions according to its intended specifications. If a direct replacement is not available, we will provide a comparable product or component. This warranty is limited to the original purchaser and is non-transferable."
      />
      <ServicesWarrantyCard
        Question="03. Exclusion"
        Answer="While we stand behind the quality of our products, certain exclusions apply to our warranty. Damage caused by misuse, abuse, neglect, accidents, unauthorized repairs, or modifications is not covered. Normal wear and tear, cosmetic damage, and damage resulting from improper installation or environmental factors are also excluded. Additionally, consumable items and accessories are not covered under this warranty. Please refer to the product manual for detailed information on proper usage and maintenance."
      />
      <ServicesWarrantyCard
        Question="04. Warranty Registration Information"
        Answer="To ensure prompt service and to activate your warranty, we encourage you to register your product within [Number] days of purchase. Warranty registration can be completed online through our website at [Website Address] or by submitting the enclosed registration card. Registering your product allows us to keep you informed about product updates, recalls, and special offers. It also streamlines the warranty claim process, ensuring faster and more efficient service."
      />
    </div>
  );
}

function ServicesWarrantyCard({ Question, Answer }: ServicesWarrantyCardProps) {
  return (
    <div className="p-2">
      <div className="text-xl font-semibold">{Question}</div>
      <div className="text-sm font-normal mt-1">{Answer}</div>
    </div>
  );
}