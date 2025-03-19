// Packages
// Local imports
import AuthUIProvider from "@/app/(website)/(auth)/_components/provider/AuthUIProvider";
import { redirect } from "next/navigation";
import { ProvienceSelector } from "./_components/provience-selector";

const Page = ({ params }: { params: { state: string } }) => {
  const decodeUrl = (() => {
    try {
      return decodeURIComponent(params.state) as "United States" | "Canada";
    } catch {
      redirect(`/registration/country/${params.state}/business_information`);
    }
  })();






  return (
    <AuthUIProvider
      sidebarImage="https://i.postimg.cc/QCCySSfp/image-9.png"
      fullWidth
      // backButton={false}
    >
      <ProvienceSelector
        countries={decodeUrl.split("_").filter((item) => item === "United States" || item === "Canada")}
        currentState={decodeUrl}
      />
    </AuthUIProvider>
  );
};

export default Page;
