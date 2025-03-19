"use client"
import {
    Button
} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger
} from "@/components/ui/multi-select"
import { setRegistrationValue } from "@/redux/features/authentication/AuthSlice"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    useForm
} from "react-hook-form"
import * as z from "zod"
import { professions } from "../../(a)/experiences/profession/_components/profession-checker"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  businessName: z.string(),
  email: z.string(),
  fullName: z.string(),
  industry: z.array( z.string()),
  profession: z.array(z.string())
});

interface Props {
    toggle: VoidFunction
}

export default function EditRegistrationForm({toggle}: Props) {
    const authState = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

  const form = useForm < z.infer < typeof formSchema >> ({
    resolver: zodResolver(formSchema),
    defaultValues:  {
      businessName: authState.businessName,
      email: authState['email'],
      fullName: authState["fullName"],
      industry: authState["industry"],
      profession: authState["profession"]
    },
  })

    // const handleExperiencChange = (
    //   type: "HEMP/CBD" | "Recreational Cannabis" | "Select All"
    // ) => {
    //   const currentIndustries = Array.isArray(authState.industry) ? authState.industry : [];
    //   let updatedIndustries: ("HEMP/CBD" | "Recreational Cannabis" | "Select All")[];
    
    //   if (type === "Select All") {
    //     // If "Select All" is clicked, toggle between selecting all or clearing the selection
    //     updatedIndustries =
    //       currentIndustries.includes("Select All") // If "Select All" is already selected
    //         ? [] // Clear all selections
    //         : ["HEMP/CBD", "Recreational Cannabis", "Select All"]; // Select all industries
    //   } else {
    //     // Handle individual industry selection
    //     if (currentIndustries.includes(type)) {
    //       // If the industry is already selected, remove it
    //       updatedIndustries = currentIndustries.filter((industry) => industry !== type);
    
    //       // If "Select All" is currently selected, remove it when deselecting an individual industry
    //       if (updatedIndustries.includes("Select All")) {
    //         updatedIndustries = updatedIndustries.filter((industry) => industry !== "Select All");
    //       }
    //     } else {
    //       // If the industry is not selected, add it
    //       updatedIndustries = [...currentIndustries, type];
    
    //       // If both "HEMP/CBD" and "Recreational Cannabis" are now selected, automatically add "Select All"
    //       if (
    //         updatedIndustries.includes("HEMP/CBD") &&
    //         updatedIndustries.includes("Recreational Cannabis")
    //       ) {
    //         updatedIndustries = ["HEMP/CBD", "Recreational Cannabis", "Select All"];
    //       }
    //     }
    //   }
    
    //   // Dispatch the updated industries to the Redux store
    //  form.setValue("industry", updatedIndustries)
    // };

  function onSubmit(values: z.infer < typeof formSchema > ) {
   dispatch(setRegistrationValue(values))

   toggle()
  }
  const router = useRouter()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" mx-auto  grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
        
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem className="col-span-1 lg:col-span-2">
              <FormLabel className="dark:text-black">Business Name</FormLabel>
              <FormControl>
                <Input 
                placeholder=""
                
                type=""
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-black">Email Address</FormLabel>
              <FormControl>
                <Input 
                placeholder=""
                
                type="email"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dark:text-black">Full Name</FormLabel>
              <FormControl>
                <Input 
                placeholder=""
                
                type="text"
                {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <Select onValueChange={(value) => handleExperiencChange(value as  "HEMP/CBD" | "Recreational Cannabis" | "Select All")} >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HEMP/CBD" >HEMP/CBD</SelectItem>
                  <SelectItem value="Recreational Cannabis">Recreational Cannabis</SelectItem>
                  <SelectItem value="Select All">Select All</SelectItem>
                </SelectContent>
              </Select>
                
              <FormMessage />
            </FormItem>
          )}
        /> */}
        
           <FormField
              control={form.control}
              name="profession"
              render={({ field }) => (
                <FormItem className="lg:col-span-2">
                  <FormLabel className="dark:text-black">Roles</FormLabel>
                  <FormControl >
                    <MultiSelector
                      values={field.value}
                      onValuesChange={field.onChange}
                      loop
                      className="max-w-xs  dark:bg-white"
                    >
                      <MultiSelectorTrigger className="dark:bg-white">
                        <MultiSelectorInput placeholder="Select Your Role" className="dark:placeholder:text-black"/>
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                      <MultiSelectorList  className="dark:bg-white dark:border-none">
                       {professions.map(({id, label}) => (
                         <MultiSelectorItem value={id} key={id} className="dark:text-black dark:hover:text-white">{label}</MultiSelectorItem>
                       ))}
                      </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
        <Button type="submit" size="sm">Save</Button>
        <Button type="button" size="sm" onClick={()=>(router.push('/registration/experiences'))}>Edit Industry</Button>
      </form>
    </Form>
  )
}