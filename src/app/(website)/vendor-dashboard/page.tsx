import AnalyticsChart from "./_components/analytics-chart";
import DashboardOverview from "./_components/dashBoardOverview";
import MostSoldItems from "./_components/MostSoldItems";
import ProfileCompletion from "./_components/ProfileCompletion";
import GeoChart from "./_components/TopUserCountries";

const Page = () => {
  return (
    <div className="w-full px-5 ">
      {/* Profile Completion Section */}
      <ProfileCompletion />

      {/* Dashboard Overview Section */}
      <section>
        <h1 className=" text-gradient text-[22px] font-bold mb-[20px]">
           Overview
        </h1>
        <DashboardOverview />
      </section>

      {/* Main Content Grid */}
      <div className="w-full mx-auto grid grid-cols-6 gap-8 my-[30px]">
        {/* Geo Chart Component */}
        <GeoChart />

        {/* Right Column for Most Sold Items and Analytics */}
        <div className="w-full col-span-2">
          <MostSoldItems />
          <AnalyticsChart />
        </div>
      </div>
    </div>
  );
};

export default Page;
