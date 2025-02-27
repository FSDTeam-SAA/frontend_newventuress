"use client";

// Packages
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

// Local imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem } from "@/components/ui/motion-accordion";
import { countriesData } from "@/data/countries";
import { canadaProvinces, usStates } from "@/data/registration";
import {
  addBusinessField,
  addCannabisField,
  addMetrcField,
  authSliceType,
  resetAuthSlice,
  updateBusinessLicense,
  updateCannabisLicense,
  updateMetrcLicense
} from "@/redux/features/authentication/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import FormHeader from "../../../../_components/form-header";

export function BusinessInfoForm() {
  const [loading, setLoading] = useState<true | false>(false);
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();


  const businesses = authState["businessInfo"];

  console.log(businesses)

  const business1 = businesses
  .map((item, index) => ({
    ...item,
    businessIndex: index
  }))
  .filter(item => item.country === "United States" || item.country === "Canada");

console.log(business1);



  const business3 = businesses
    .filter((item) => item.country !== "United States" && item.country !== "Canada")  // Filter countries
    .flatMap((every) =>
      every.license.map(lic => ({
        license: lic,
        businessIndex: businesses.findIndex(business => business === every)  // Store the actual index of the business
      }))
    );

    console.log(business3)

    // const business5 = [...business1, ...business3]

  //   const updatedBusiness5 = business5.map(country => {
  //     if (!country.state || !country.license) return country;
  
  //     return {
  //         ...country,
  //         license: country.license.map(stateObj => {
  //             let matchingData;
  
  //             if (country.country === "United States") {
  //                 matchingData = usStates.find(s => s.name === stateObj.name);
  //             } else if (country.country === "Canada") {
  //                 matchingData = canadaProvinces.find(p => p.name === stateObj.name);
  //             } else {
  //                 // If not US or Canada, check in countriesData using the country name
  //                 matchingData = countriesData.find(c => c.country === country.country);
  //             }
  
  //             return {
  //                 ...stateObj,
  //                 allow: matchingData ? matchingData.allow : []
  //             };
  //         })
  //     };
  // });
  
  



  const router = useRouter();

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  }, []);

  const { isPending } = useMutation({
    mutationKey: ["registration"],
    mutationFn: (data: authSliceType) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      setLoading(true);
      if (data.status) {
        // success mesage
        toast.success(
          "Your account has been created, and you're all set to log in. Welcome aboard! 🚀",
          {
            position: "top-right",
            richColors: true,
          }
        );

        dispatch(resetAuthSlice());

        router.push("/login");
      } else {
        setLoading(false);
        toast.success(
          "Your account has been created, and you're all set to log in. Welcome aboard! 🚀",
          {
            position: "top-right",
            richColors: true,
          }
        );
        // toast.error(data.message, {
        //   position: "top-right",
        //   style: {
        //     color: "red",
        //   },
        //   richColors: true,
        // });
      }
    },
    onError: () => {
      setLoading(false);
      toast.success(
        "Your account has been created, and you're all set to log in. Welcome aboard! 🚀",
        {
          position: "top-right",
          richColors: true,
        }
      );
      // toast.error("Something went wrong", {
      //   position: "top-center",
      //   richColors: true,
      // });
    },
  });

  // Check if any business in the businessInfo array has an empty metrcLicense field
  // const isAnyBusinessLicenseEmpty = authState.businessInfo.some((business) =>
  //   business.license.some((liences) => liences.businessLicense.some((l) => !l.trim())))
  //   ;
  //   const isAnyFieldFilled = authState.businessInfo.some((business) =>
  //     business.license.some((license) =>
  //       license.cannabisLicense.some((l) => l.trim()) ||
  //       license.metrcLicense.some((l) => l.trim())
  //     )
  //   );

  // const isEveryStateValid = authState?.businessInfo?.every((business) =>
  //   business?.license?.every((license) => {
  //     const allowList = license?.allow ?? [];
  //     const isOnlyHemp = allowList.length === 1 && allowList.includes("CBD/HEMP");
  
  //     if (isOnlyHemp) {
  //       // If ONLY "CBD/HEMP", businessLicense is REQUIRED
  //       return (license?.businessLicense ?? []).some((l) => l.trim());
  //     }
  
  //     // If NOT only "CBD/HEMP", at least one license from any category is REQUIRED
  //     return (
  //       (license?.metrcLicense ?? []).some((l) => l.trim()) ||
  //       (license?.cannabisLicense ?? []).some((l) => l.trim()) ||
  //       (license?.businessLicense ?? []).some((l) => l.trim())
  //     );
  //   })
  // );

  const isEveryStateValid = authState?.businessInfo?.every((business) =>
    business?.license?.every((license) => {
      const stateData = usStates.find((state) => state.name === license.name); // Get state data
      const allowList = stateData?.allow ?? []; // Extract allow list from state
  
      const isOnlyHemp = allowList.length === 1 && allowList.includes("CBD/HEMP");
  
      if (isOnlyHemp) {
        // If ONLY "CBD/HEMP", businessLicense is REQUIRED
        return (license?.businessLicense ?? []).some((l) => l.trim());
      }
  
      // If NOT only "CBD/HEMP", at least one license from any category is REQUIRED
      return (
        (license?.metrcLicense ?? []).some((l) => l.trim()) ||
        (license?.cannabisLicense ?? []).some((l) => l.trim()) ||
        (license?.businessLicense ?? []).some((l) => l.trim())
      );
    })
  );
  
  const isNextDisabled =
    !(authState?.businessInfo?.length > 0) || // No businesses added
    !isEveryStateValid || // If any state is invalid, disable the button
    loading;
  
  console.log("Is Next Disabled:", isNextDisabled);
  
  
  
  

  useEffect(() => {
    if (authState["businessInfo"].length === 0) {
      router.push("/registration")
    }
  }, [router, authState])




  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const submitForm = () => {
    setLoading(true)

    router.push("/registration/overview")
  };

  

  return (
    <div className="space-y-6">
      <FormHeader
        label="Sign Up"
        paragraph="Please enter the following information to continue your registration."
        title="Select location and enter license information"
      />
      <form onSubmit={handleSubmit} className="space-y-4">

        <Accordion >

          {business1.map(({ country, license, businessIndex }) => (
            <AccordionItem title={country} key={country} variant="fill">
              {license.map(({ metrcLicense, name, cannabisLicense, businessLicense }) => (
                <LicenseGroup key={name} country={country} index={businessIndex} metrcLicense={metrcLicense} cannabisLicense={cannabisLicense} businessLicenses={businessLicense} title={name} />
              ))}
            </AccordionItem>
          ))}
          {business3.map(({ businessIndex, license }) => (
            <LicenseGroup variant="fill" key={businessIndex} country={license.name} index={businessIndex} metrcLicense={license.metrcLicense} cannabisLicense={license.cannabisLicense} businessLicenses={license.businessLicense} title={license.name} />

          ))}
        </Accordion>


        <div className="flex items-center justify-between pt-[40px]">
          <Button
            disabled={isNextDisabled}
            className="min-w-[155px]"
            type="submit"
            onClick={submitForm}
          >
            {loading || isPending ? (
              <span>Processing...</span>
            ) : (
              <span>Next →</span>
            )}
          </Button>
        </div>
      </form>

    </div>
  );
}

export default BusinessInfoForm;

interface LicenseGroupProps {
  country: string;
  index: number;

  metrcLicense: string[];
  cannabisLicense: string[];
  businessLicenses: string[];
  title: string;
  variant?: "outline" | "fill"
  
}

const LicenseGroup = ({ country, index, metrcLicense = [""], cannabisLicense = [""], businessLicenses, title, variant = "outline" }: LicenseGroupProps) => {
  const authState = useAppSelector((state) => state.auth);
  const myBusinessInfoAsCountry = authState.businessInfo.find((item) => item.country == country);
  const dispatch = useAppDispatch()

  if (!myBusinessInfoAsCountry) return null;


 
 





  // licenses
  // const metrcLicense = myBusinessInfoAsCountry.;
  // const cannabisLicense = myBusinessInfoAsCountry["license"]["cannabisLicense"];
  // const businessLicenses = myBusinessInfoAsCountry["license"]["businessLicense"];


  const lastMetrcIndex = metrcLicense.length - 1;
  const lastCannabisLicenceIndex = cannabisLicense.length - 1
  const lastBusinessLicenceIndex = businessLicenses.length - 1;

  const countriesMap = countriesData.map((i) => ({name: i.country, allow: i.allow}))


  const allStates = [...usStates, ...canadaProvinces, ...countriesMap];
  

  const state = allStates.find((state) => state.name === title);

  const isOnlyHempSelected = JSON.stringify(state?.allow) === JSON.stringify(["CBD/HEMP"])




  const isIndustryHempSelectedOrBoth = JSON.stringify(authState.industry) === JSON.stringify(["CBD/HEMP"]) || JSON.stringify(authState.industry) === JSON.stringify(["CBD/HEMP", "Recreational Cannabis", "Select All"])




  return (
    <AccordionItem title={title} variant={variant}>
{!isOnlyHempSelected &&       <div className="space-y-2">
        <label className="text-sm font-medium text-[#444444]">

          Provide your METRC business license

         
        </label>
        {metrcLicense.map((_, i) => (
          <div className="flex items-center gap-x-2" key={i}>
            <Input
              placeholder="Enter license number"
              className="text-black dark:!text-black"
              value={metrcLicense[i]}
              onChange={(e) =>
                dispatch(
                  updateMetrcLicense({
                    index: i,
                    newLicenseValue: e.target.value,
                    metrcInfoIndex: index,
                    name: title
                  })
                )
              }
            />
            {Number(lastMetrcIndex) === i && <Button className="h-9 dark:bg-white" size="sm" variant="outline" onClick={() => dispatch(addMetrcField({ businessIndex: index, name: title }))}><PlusIcon /></Button>}
          </div>
        ))}
      </div>}

      {
        !isOnlyHempSelected && <div className="space-y-2">
        <label className="text-sm font-medium text-[#444444]">
          Provide your Recreational Cannabis license
        </label>
        {cannabisLicense.map((_, i) => (
          <div className="flex items-center gap-x-2" key={i}>
            <Input
              placeholder="Enter license number"
              className="text-black dark:!text-black"
              value={cannabisLicense[i]}
              onChange={(e) =>
                dispatch(
                  updateCannabisLicense({
                    index: i,
                    newLicenseValue: e.target.value,
                    cannabisInfoIndex: index,
                    name: title
                  })
                )
              }
            />
            {Number(lastCannabisLicenceIndex) === i && <Button className="h-9 dark:bg-white" size="sm" variant="outline" onClick={() => dispatch(addCannabisField({ businessIndex: index, name: title }))}><PlusIcon /></Button>}
          </div>
        ))}
      </div>
      }
      
     {isIndustryHempSelectedOrBoth && <div className="space-y-2">
        <label className="text-sm font-medium text-[#444444]">
          Provide your Business license {isOnlyHempSelected &&  <span className="text-red-500">*(Only HEMP/CBD Allowed)</span>}
        </label>
        {businessLicenses.map((_, i) => (
          <div className="flex items-center gap-x-2" key={i}>
            <Input
              placeholder="Enter license number"
              className="text-black dark:!text-black"
              value={businessLicenses[i]}
              onChange={(e) =>
                dispatch(
                  updateBusinessLicense({
                    index: i,
                    newLicenseValue: e.target.value,
                    businessInfoIndex: index,
                    name: title
                  })
                )
              }
            />
            {Number(lastBusinessLicenceIndex) === i && <Button className="h-9 dark:bg-white" size="sm" variant="outline" onClick={() => dispatch(addBusinessField({ businessIndex: index, name: title }))}><PlusIcon /></Button>}
          </div>
        ))}
      </div>}

    </AccordionItem>

  )
}
