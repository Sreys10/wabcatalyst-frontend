"use client";

import { markdownify } from "@lib/utils/textConverter";
import { useState } from "react";

const HomeFaq = ({ faq }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faq || !faq.faqs) {
    return null;
  }

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 md:py-28 bg-gradient-to-b from-white via-amber-50/20 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-amber-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-white dark:via-orange-400 dark:to-white bg-clip-text text-transparent">
              {faq.title}
            </span>
          </h2>
          {faq.description && (
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {faq.description}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faq.faqs.map((item, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* FAQ Question Button */}
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 md:px-8 py-5 md:py-6 text-left flex items-center justify-between gap-4 hover:bg-orange-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white pr-8 group-hover:text-primary dark:group-hover:text-orange-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  {/* Toggle Icon */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 dark:group-hover:bg-primary/30">
                    <svg
                      className={`w-5 h-5 text-primary dark:text-orange-400 transition-transform duration-300 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* FAQ Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 md:px-8 pb-5 md:pb-6">
                    <div className="pt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {markdownify(item.answer, "p")}
                    </div>
                  </div>
                </div>

                {/* Decorative Line */}
                {openIndex === index && (
                  <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 dark:from-primary/30 dark:via-primary/50 dark:to-primary/30"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFaq;

