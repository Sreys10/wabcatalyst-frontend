"use client";

import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";
import Link from "next/link";

const HomeBanner = ({ banner }) => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/15 to-orange-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        <div className="row text-center">
          <div className="mx-auto lg:col-10 xl:col-9">
            {/* Badge/Announcement */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 dark:bg-primary/20 backdrop-blur-sm rounded-full border border-primary/20 dark:border-primary/30">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-primary dark:text-orange-400">
                Career Growth Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-white dark:via-orange-400 dark:to-white bg-clip-text text-transparent">
                {banner.title}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {markdownify(banner.content)}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {banner.buttons && banner.buttons.length > 0 ? (
                banner.buttons.map((button, index) => (
                  button.enable && (
                    <Link
                      key={index}
                      className={`btn ${index === 0
                        ? "btn-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
                        : "btn-outline-primary border-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                        }`}
                      href={button.link}
                      rel={button.rel}
                    >
                      {button.label}
                    </Link>
                  )
                ))
              ) : (
                banner.button && banner.button.enable && (
                  <Link
                    className="btn btn-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300"
                    href={banner.button.link}
                    rel={banner.button.rel}
                  >
                    {banner.button.label}
                  </Link>
                )
              )}
            </div>

            {/* Stats or Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12 text-sm md:text-base">
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary mb-1">1000+</span>
                <span className="text-gray-600 dark:text-gray-400">Jobs Matched</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary mb-1">500+</span>
                <span className="text-gray-600 dark:text-gray-400">Success Stories</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold text-primary mb-1">98%</span>
                <span className="text-gray-600 dark:text-gray-400">Satisfaction Rate</span>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative mt-12">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-amber-300/20 dark:from-primary/30 dark:to-amber-300/30 rounded-3xl blur-2xl -z-10 transform scale-105"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
                <Image
                  className="w-full h-auto"
                  src={banner.image}
                  width={750}
                  height={390}
                  alt="banner image"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-20 fill-white dark:fill-gray-900"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C150,80 350,80 600,40 C850,0 1050,80 1200,40 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HomeBanner;
