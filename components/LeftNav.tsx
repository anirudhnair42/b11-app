import React from "react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Building2, Map, User2, Factory } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LocationForm from "./LocationForm";
import IndustryForm from "./IndustryForm";
import CompanyForm from "./CompanyForm";

const LeftNav = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const handleLogout = () => {
    // Remove the token
    localStorage.removeItem("token");
    queryClient.invalidateQueries();
    queryClient.removeQueries();
    router.push("/");
  };
  return (
    <nav className="w-1/6 bg-gray-800 text-white p-2 justify-between flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="text-2xl font-bold rounded-xl">
            Base<span className="text-blue-400">11</span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-xs font-semibold text-center text-gray-400 uppercase px-4">
          Add Entities
        </div>
        <Sheet>
          <SheetTrigger className="w-full">
            {" "}
            <Button variant="ghost" className="w-full font-semibold text-lg">
              <Building2 className="mr-2 h-4 w-4" /> Company
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Add a new Company</SheetTitle>
              <SheetDescription>
                Enter all the necessary information about the company.
              </SheetDescription>
              <CompanyForm />
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger className="w-full">
            {" "}
            <Button variant="ghost" className="w-full font-semibold text-lg">
              <Map className="mr-2 h-4 w-4" />
              Location
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Add a new Location</SheetTitle>
              <SheetDescription>
                Location&apos;s for Company HQs{" "}
              </SheetDescription>
              <LocationForm />
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger className="w-full">
            {" "}
            <Button variant="ghost" className="w-full font-semibold text-lg">
              <User2 className="mr-2 h-4 w-4" />
              Founder
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Add a new Founder Profile</SheetTitle>
              <SheetDescription>
                Company Founders and their profiles{" "}
              </SheetDescription>
              <LocationForm />
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger className="w-full">
            {" "}
            <Button variant="ghost" className="w-full font-semibold text-lg">
              <Factory className="mr-2 h-4 w-4" />
              Industry
            </Button>
          </SheetTrigger>
          <SheetContent side={"left"}>
            <SheetHeader>
              <SheetTitle>Add a new Industry</SheetTitle>
              <SheetDescription>Industries for Companies </SheetDescription>
              <IndustryForm />
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <Button variant="destructive" className="m-4" onClick={handleLogout}>
        Log Out
      </Button>
    </nav>
  );
};

export default LeftNav;
