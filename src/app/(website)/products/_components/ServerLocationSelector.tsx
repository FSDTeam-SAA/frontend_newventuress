// ServerLocationSelector.tsx
import { ClientLocationSelector } from "./ClientLocationSelector"; // Ensure the file './ClientLocationSelector.tsx' exists in the same directory

async function fetchLocations(userId: string) {
  try {
    const response = await fetch(`http://localhost:8001/api/store/locations/${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.status}`);
    }

    const data = await response.json();
    return data.locations || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

export default async function ServerLocationSelector({ userId }: { userId: string }) {
  // Fetch locations from API using the userId parameter
  const locations = await fetchLocations(userId);
  
  // Pass locations to client component
  return <ClientLocationSelector locations={locations} />;
}