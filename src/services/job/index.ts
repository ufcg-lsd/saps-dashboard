import { AllJobsArgs, JobBody } from "@src/types/services/job";
import Fetcher from "../fetcher";
import { createFinalUrl } from "../utils";

const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || "150.165.15.82:8091";
console.log(apiUrl);

export const getAllJobs = async (
  page: number,
  size: number,
  sort: Record<string, string>,
  args?: AllJobsArgs
) => {
  const fetcher = Fetcher;
  const url = createFinalUrl(apiUrl, "/processings");

  const headers: Record<string, string> = {
    userEmail: "admin_email",
    userPass: "admin_password",
    page: String(page),
    size: String(size),
    sort: JSON.stringify(sort),
  };

  if (args)
    Object.keys(args).forEach((key) => {
      headers[key] = String(args[key]);
    });

  const response = await fetcher.fetch(url, "GET", undefined, {
    headers,
  });

  const json = await response.json();

  return json;
};

export const getJobTask = async (
  jobId: string,
  page: number,
  size: number,
  sort: Record<string, string>,
  args?: AllJobsArgs
) => {
  const fetcher = Fetcher;
  const url = createFinalUrl(apiUrl, `/processings`);

  const headers: Record<string, string> = {
    userEmail: "admin_email",
    userPass: "admin_password",
    jobId,
    page: String(page),
    size: String(size),
    sort: JSON.stringify(sort),
  };

  if (args)
    Object.keys(args).forEach((key) => {
      headers[key] = String(args[key]);
    });

  const response = await fetcher.fetch(url, "GET", undefined, {
    headers,
  });

  const json = await response.json();

  return json;
};

export const addJob = async (job: JobBody) => {
  const fetcher = Fetcher;
  const url = createFinalUrl(apiUrl, '/processings');

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    userEmail: "admin_email",
    userPass: "admin_password"
  };

  const [lowerLeftLat, lowerLeftLong] = job.coordinates.lowerLeft;
  const [upperRightLat, upperRightLong] = job.coordinates.upperRight;

  const finalBody = 
  `label=${encodeURIComponent(job.label)}&` +
  `initialDate=${encodeURIComponent(job.initialDate)}&` +
  `finalDate=${encodeURIComponent(job.finalDate)}&` +
  `priority=${encodeURIComponent(job.priority)}&` +
  `inputDownloadingTag=${encodeURIComponent(job.inputGatheringTag)}&` +
  `inputPreprocessingTag=${encodeURIComponent(job.inputPreprocessingTag)}&` +
  `inputProcessingTag=${encodeURIComponent(job.inputProcessingTag)}&` +
  `userEmail=${encodeURIComponent(job.userEmail)}&` +
  `userPass=${encodeURIComponent(job.userPass)}&` +
  `email=${encodeURIComponent(job.email)}&` +
  `lowerLeft=${encodeURIComponent(lowerLeftLat + "," + lowerLeftLong)}&` +
  `upperRight=${encodeURIComponent(upperRightLat + "," + upperRightLong)}`;

  const response = await fetcher.fetch(url, "POST", finalBody, {
    headers,
  });

  console.log(response);

  const json = await response.json();

  return json;
};
