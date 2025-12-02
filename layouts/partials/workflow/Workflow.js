import { markdownify } from "@lib/utils/textConverter";
import Image from "next/image";

const Workflow = ({ workflow }) => {
  if (!workflow || !workflow.steps) {
    return null;
  }

  return (
    <section id="workflow" className="relative py-20 md:py-28 bg-orange-50/30 dark:bg-gray-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            <span className="bg-gradient-to-r from-gray-900 via-primary to-gray-900 dark:from-white dark:via-orange-400 dark:to-white bg-clip-text text-transparent">
              {workflow.title}
            </span>
          </h2>
          {workflow.description && (
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {workflow.description}
            </p>
          )}
        </div>

        {/* Steps Flow */}
        <div className="relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 dark:from-primary/30 dark:via-primary/50 dark:to-primary/30 -z-0"></div>

          {/* Steps Grid */}
          <div className="grid gap-8 md:gap-12 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {workflow.steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* Step Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 h-full">
                  {/* Step Number Badge */}
                  <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-primary to-amber-400 text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="relative z-10">{step.number}</span>
                    <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  </div>

                  {/* Icon Container */}
                  {step.icon && (
                    <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20">
                      <Image
                        src={step.icon}
                        width={24}
                        height={24}
                        alt=""
                        className="w-6 h-6"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-orange-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/20 dark:group-hover:border-primary/30 transition-all duration-300 pointer-events-none"></div>
                </div>

                {/* Arrow Connector (Desktop, between steps) */}
                {index < workflow.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-6 w-12 h-12 z-20">
                    <svg
                      className="w-full h-full text-primary/40 dark:text-primary/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;

