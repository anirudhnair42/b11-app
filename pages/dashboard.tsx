import React, { FC } from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import withAuth from "@/src/hocs/withAuth";
import {
  Company,
  IndustryDto,
  LocationDto,
  MetricSnapshotDto,
} from "@/lib/dto";
import api from "../src/lib/api";
import LeftNav from "@/components/LeftNav";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddMetricModal, { MetricDto } from "@/components/AddMetricModal";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Dashboard: FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const {
    data: companies,
    isLoading,
    isError,
  } = useQuery(["companies"], () =>
    api.get("/api/companies").then((res) => res.data)
  );

  const {
    data: industries,
    isLoading: isLoadingIndustries,
    isError: isErrorIndustries,
  } = useQuery(["industries"], () =>
    api.get("/api/industries").then((res) => res.data)
  );

  const {
    data: locations,
    isLoading: isLoadingLocations,
    isError: isErrorLocations,
  } = useQuery(["locations"], () =>
    api.get("/api/locations").then((res) => res.data)
  );

  const {
    data: metricSnapshots,
    isLoading: isLoadingMetricSnapshots,
    isError: isErrorMetricSnapshots,
  } = useQuery(["metricsnapshots"], () =>
    api.get("/api/metricsnapshots").then((res) => res.data)
  );

  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    isError: isErrorMetrics,
  } = useQuery(["metrics"], () =>
    api.get("/api/metrics").then((res) => res.data)
  );

  if (isError) {
    return <div>API Error</div>;
  }

  const activeIndustry: IndustryDto = industries?.find(
    (industry: IndustryDto) => industry.id === selectedCompany?.industryId
  );

  const activeLocation: LocationDto = locations?.find(
    (location: LocationDto) => location.id === selectedCompany?.locationId
  );

  const metricSnapshotsForCompany: MetricSnapshotDto[] =
    metricSnapshots?.filter(
      (metricSnapshot: MetricSnapshotDto) =>
        metricSnapshot.companyId === selectedCompany?.id
    );

  return (
    <div className="flex h-screen bg-gray-100">
      <LeftNav />
      <div className="w-1/3 p-4 overflow-y-auto">
        <div className="p-4 m-2">
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-sm text-gray-500">
            Select a company to view or edit details
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
        ) : (
          companies.map((company: Company) => (
            <div
              key={company.id}
              className="p-4 m-2 bg-white rounded shadow cursor-pointer hover:bg-gray-200"
              onClick={() => setSelectedCompany(company)}
            >
              <h2 className="text-xl font-bold">{company.name}</h2>
            </div>
          ))
        )}
      </div>
      <div className="w-2/3 p-4">
        <div className="p-4 m-2 text-center">
          <h1 className="text-2xl font-bold">Company Details</h1>
          <p className="text-sm text-gray-500">
            Companies can only be edited by admins and moderators
          </p>
        </div>
        {selectedCompany && (
          <Card className="p-4 m-2 bg-white rounded shadow-lg">
            <CardHeader>
              <CardTitle>{selectedCompany.name}</CardTitle>
              <CardDescription>{selectedCompany.description}</CardDescription>
              <CardDescription>
                <a
                  href={selectedCompany.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mb-4"
                >
                  {selectedCompany.website}{" "}
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingIndustries ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <div className="flex flex-col p-4 ">
                  <div className="text-xs font-semibold text-gray-400 uppercase text-left">
                    Location
                  </div>
                  <h2 className="text-xl font-bold">{activeLocation.name}</h2>
                </div>
              )}
              {isLoadingIndustries ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <div className="flex flex-col p-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase text-left">
                    Industry
                  </div>
                  <h2 className="text-xl font-bold">{activeIndustry.name}</h2>
                </div>
              )}
              <div>
                {metricSnapshotsForCompany?.map(
                  (metricSnapshot: MetricSnapshotDto) => (
                    <>
                      <div className="flex flex-col p-4">
                        <div className="text-xs font-semibold text-gray-400 uppercase text-left">
                          {
                            metrics?.find(
                              (metric: MetricDto) =>
                                metric.id === metricSnapshot.metricId
                            )?.name
                          }
                        </div>
                        <h2 className="text-xl font-bold">
                          {metricSnapshot.value}
                        </h2>
                        <h3 className="text-xs">
                          {format(new Date(metricSnapshot.capturedAt), "PPP")}
                        </h3>
                      </div>
                    </>
                  )
                )}
              </div>
            </CardContent>
            <CardFooter>
              <AddMetricModal companyId={selectedCompany.id} />
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
