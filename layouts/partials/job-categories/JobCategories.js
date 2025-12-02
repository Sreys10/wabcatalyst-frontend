import Image from "next/image";

const JobCategories = ({ jobCategories }) => {
  if (!jobCategories || !jobCategories.categories) {
    return null;
  }

  return (
    <section id="job-categories" className="relative py-20 md:py-28 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-amber-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-white dark:via-orange-400 dark:to-white bg-clip-text text-transparent">
              {jobCategories.title}
            </span>
          </h2>
          {jobCategories.description && (
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {jobCategories.description}
            </p>
          )}
        </div>

        {/* Job Category Creative Cloud */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-6xl mx-auto">
          {jobCategories.categories.map((category, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-amber-400 rounded-full blur opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-800 rounded-full px-6 py-3 md:px-8 md:py-4 border border-gray-200/50 dark:border-gray-700/50 group-hover:border-primary/50 dark:group-hover:border-orange-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 cursor-default flex items-center gap-3 md:gap-4">

                {/* Icon Container */}
                {category.icon && (
                  <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 group-hover:from-primary/10 group-hover:to-amber-300/10 dark:group-hover:from-primary/20 dark:group-hover:to-amber-300/20 transition-all duration-300">
                    <Image
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      src={category.icon}
                      width={20}
                      height={20}
                      alt=""
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col">
                  <h3 className="text-sm md:text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary dark:group-hover:text-orange-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  {/* Optional: Tiny description on hover or always visible if short */}
                  {/* <span className="text-[10px] text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mt-1">Explore Roles</span> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional: Add a "View All" or similar CTA if needed later */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">And many more roles across various industries...</p>
        </div>
      </div>
    </section>
  );
};

export default JobCategories;

