import { AllJobsArgs, JobBody } from "@types/services/job";
import { getFetcher } from "../fetcher";
import { createFinalUrl } from "../utils";

export const getAllJobs = async (
  page: number,
  size: number,
  sort: Record<string, string>,
  args?: AllJobsArgs
) => {
  const apiUrl = process.env["API_URL"] || "";
  const fetcher = getFetcher();
  const url = createFinalUrl(apiUrl, "/processings");

  const headers: Record<string, string> = {
    userEmail: "",
    userPass: "",
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
  const apiURL = process.env["API_URL"] || "";
  const fetcher = getFetcher();
  const url = createFinalUrl(apiURL, `/processings`);

  const headers: Record<string, string> = {
    userEmail: "",
    userPass: "",
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
  const apiUrl = process.env["API_URL"] || "";
  const fetcher = getFetcher();
  const url = createFinalUrl(apiUrl, "/processings");

  const headers: Record<string, string> = {
    userEmail: "",
    userPass: "",
  };

  const finalBody = {
    initialDate: job.initialDate,
    finalDate: job.finalDate,
    priority: job.priority,
    inputGatheringTag: job.inputGatheringTag,
    inputPreprocessingTag: job.inputPreprocessingTag,
    algorithmExecutionTag: job.algorithmExecutionTag,
    userEmail: job.userEmail,
    userPass: job.userPass,
    label: job.label,
    email: job.email,
  };

  const response = await fetcher.fetch(url, "POST", finalBody, {
    headers,
  });

  const json = await response.json();

  return json;
};
