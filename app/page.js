import config from "@config/config.json";
import Cta from "@layouts/components/Cta";
import SeoMeta from "@layouts/SeoMeta";

import HomeBanner from "@layouts/partials/home/HomeBanner";
import HomeFeatures from "@layouts/partials/home/HomeFeatures";
import HomeFaq from "@layouts/partials/faq/HomeFaq";
import JobCategories from "@layouts/partials/job-categories/JobCategories";
import Workflow from "@layouts/partials/workflow/Workflow";
import { getListPage } from "../lib/contentParser";

const Home = async () => {
  const homePage = await getListPage("content/_index.md");
  const { frontmatter } = homePage;
  const { banner, feature, job_categories, workflow, faq, call_to_action } = frontmatter;
  const { title } = config.site;

  return (
    <>
      <SeoMeta title={title} />

      {/* Banner */}
      <HomeBanner banner={banner} />

      {/* Features */}
      <HomeFeatures feature={feature} />

      {/* Job Categories */}
      <JobCategories jobCategories={job_categories} />

      {/* workflow */}
      <Workflow workflow={workflow} />

      {/* FAQ */}
      <HomeFaq faq={faq} />

      {/* Cta */}
      <Cta cta={call_to_action} />
    </>
  );
};

export default Home;
