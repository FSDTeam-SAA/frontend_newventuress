"use client";

// ClientLocationSelector.tsx
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ClientLocationSelector({ locations = [] }: { locations: string[] }) {
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  return (
    <div className="rounded-lg bg-[#E6EEF6] dark:bg-[#482D721A] p-4">
      <h2 className="text-[28px] font-bold text-gradient dark:text-gradient-pink mb-4">My Location</h2>
      <div>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-full text-black">
            <SelectValue className="dark:text-black placeholder:text-black" placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {locations.length > 0 ? (
                locations.map((location: string) => (
                  <SelectItem value={location} key={location}>
                    {location}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-locations" disabled>
                  No locations available
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}