
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { GOOGLE_MAPS_API_KEY } from "@/utils/constants";

interface LocationDetectorProps {
  userLocation: string | null;
  setUserLocation: (location: string | null) => void;
}

export default function LocationDetector({ userLocation, setUserLocation }: LocationDetectorProps) {
  const { toast } = useToast();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Detect user's state based on coordinates
  const detectUserLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            
            const data = await response.json();
            
            if (data.status === "REQUEST_DENIED") {
              throw new Error("API access denied: " + (data.error_message || "No details provided"));
            }
            
            if (data.results && data.results.length > 0) {
              // Find the state from the address components
              const addressComponents = data.results[0].address_components;
              const stateComponent = addressComponents.find(
                (component: any) => component.types.includes("administrative_area_level_1")
              );
              
              if (stateComponent) {
                const state = stateComponent.long_name;
                setUserLocation(state);
                
                toast({
                  title: "Location Detected",
                  description: `Your location: ${state}`,
                  duration: 3000,
                });
              }
            }
          } catch (error) {
            console.error("Error getting location:", error);
            toast({
              title: "Location Detection Failed",
              description: "Could not determine your location. Using default tax calculations.",
              duration: 3000,
            });
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsDetectingLocation(false);
          toast({
            title: "Location Access Denied",
            description: "Please enable location access for state-specific tax information.",
            duration: 3000,
          });
        }
      );
    } else {
      setIsDetectingLocation(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        duration: 3000,
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1 text-xs"
      onClick={detectUserLocation}
      disabled={isDetectingLocation}
    >
      <MapPin className="h-3 w-3" />
      {isDetectingLocation ? "Detecting..." : userLocation ? "Location: " + userLocation : "Detect Location"}
    </Button>
  );
}
