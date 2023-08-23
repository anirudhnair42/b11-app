export type Company = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  industryId: string;
  website: string;
  description: string | null;
  logo: string | null;
  locationId: string;
};

export type LocationDto = {
  id: string;
  name: string;
  state: string;
  country: string;
  pincode: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IndustryDto = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MetricSnapshotDto = {
  id: string;
  value: number;
  stringValue: string | null;
  dateTimeValue: Date | null;
  createdAt: Date;
  updatedAt: Date;
  capturedAt: Date;
  metricId: string;
  companyId: string;
};
