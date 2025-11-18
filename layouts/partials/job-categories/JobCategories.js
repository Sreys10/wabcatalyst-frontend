import Image from "next/image";

const JobCategories = ({ jobCategories }) => {
  if (!jobCategories || !jobCategories.categories) {
    return null;
  }

  return (
    <section id="job-categories" className="relative py-20 md:py-28 bg-gradient-to-b from-white via-orange-50/30 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 overflow-hidden">
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

        {/* Job Category Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobCategories.categories.map((category, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              {/* Icon Container */}
              {category.icon && (
                <div className="relative mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-amber-300/10 dark:from-primary/20 dark:to-amber-300/20 group-hover:from-primary/20 group-hover:to-amber-300/20 dark:group-hover:from-primary/30 dark:group-hover:to-amber-300/30 transition-all duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 dark:bg-primary/10 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    className="relative z-10 w-8 h-8"
                    src={category.icon}
                    width={32}
                    height={32}
                    alt=""
                  />
                </div>
              )}

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-orange-400 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/20 dark:group-hover:border-primary/30 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JobCategories;

