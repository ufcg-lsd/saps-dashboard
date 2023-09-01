import { getAllJobs, getJobTask } from "../../src/services/job";
import Fetcher from "../../src/services/fetcher";

beforeAll(() => {
  process.env.API_URL = "http://localhost:8081";
});

jest.mock("../../src/services/fetcher", () => {
  return {
    fetch: jest.fn().mockReturnValue(
      Promise.resolve({
        json: () =>
          Promise.resolve({
            jobsCount: 3,
            jobs: [
              {
                jobLabel: "Teste 1",
                jobId: "fb6c89c7-ce98-4174-950f-6606eab8211c",
                tasksIds: [
                  "goo_default_ufcgsebal_landsat_5_20121231_215066",
                  "goo_default_ufcgsebal_landsat_7_20121231_215066",
                ],
                endDate: "2013-01-01",
                lowerLeftLatitude: "-8.176947",
                userEmail: "felipe.amorim.ferreira@ccc.ufcg.edu.br",
                state: "FAILED",
                upperRightLatitude: "-9.176947",
                priority: 1,
                lowerLeftLongitude: "-36.595067",
                upperRightLongitude: "-37.595067",
                startDate: "2012-12-30",
              },
              {
                jobLabel: "Teste 1",
                jobId: "e5be79ba-f3bc-4016-b3e0-1e1d45497d42",
                tasksIds: [
                  "goo_default_ufcgsebal_landsat_5_20121231_215066",
                  "goo_default_ufcgsebal_landsat_7_20121231_215066",
                ],
                endDate: "2013-01-01",
                lowerLeftLatitude: "-8.176947",
                userEmail: "felipe.amorim.ferreira@ccc.ufcg.edu.br",
                state: "FAILED",
                upperRightLatitude: "-9.176947",
                priority: 1,
                lowerLeftLongitude: "-36.595067",
                upperRightLongitude: "-37.595067",
                startDate: "2012-12-30",
              },
              {
                jobLabel: "Teste 2",
                jobId: "59518f02-b658-4375-b970-4e60cde4088e",
                tasksIds: [
                  "goo_default_ufcgsebal_landsat_5_20120114_215066",
                  "goo_default_ufcgsebal_landsat_7_20120114_215066",
                  "goo_default_ufcgsebal_landsat_5_20120130_215066",
                  "goo_default_ufcgsebal_landsat_7_20120130_215066",
                  "goo_default_ufcgsebal_landsat_5_20120215_215066",
                  "goo_default_ufcgsebal_landsat_7_20120215_215066",
                  "goo_default_ufcgsebal_landsat_5_20120302_215066",
                  "goo_default_ufcgsebal_landsat_7_20120302_215066",
                  "goo_default_ufcgsebal_landsat_5_20120318_215066",
                  "goo_default_ufcgsebal_landsat_7_20120318_215066",
                  "goo_default_ufcgsebal_landsat_5_20120403_215066",
                  "goo_default_ufcgsebal_landsat_7_20120403_215066",
                  "goo_default_ufcgsebal_landsat_5_20120419_215066",
                  "goo_default_ufcgsebal_landsat_7_20120419_215066",
                  "goo_default_ufcgsebal_landsat_5_20120505_215066",
                  "goo_default_ufcgsebal_landsat_7_20120505_215066",
                  "goo_default_ufcgsebal_landsat_5_20120521_215066",
                  "goo_default_ufcgsebal_landsat_7_20120521_215066",
                  "goo_default_ufcgsebal_landsat_5_20120606_215066",
                  "goo_default_ufcgsebal_landsat_7_20120606_215066",
                  "goo_default_ufcgsebal_landsat_5_20120622_215066",
                  "goo_default_ufcgsebal_landsat_7_20120622_215066",
                  "goo_default_ufcgsebal_landsat_5_20120708_215066",
                  "goo_default_ufcgsebal_landsat_7_20120708_215066",
                  "goo_default_ufcgsebal_landsat_5_20120724_215066",
                  "goo_default_ufcgsebal_landsat_7_20120724_215066",
                  "goo_default_ufcgsebal_landsat_5_20120809_215066",
                  "goo_default_ufcgsebal_landsat_7_20120809_215066",
                  "goo_default_ufcgsebal_landsat_5_20120825_215066",
                  "goo_default_ufcgsebal_landsat_7_20120825_215066",
                  "goo_default_ufcgsebal_landsat_5_20120910_215066",
                  "goo_default_ufcgsebal_landsat_7_20120910_215066",
                  "goo_default_ufcgsebal_landsat_5_20121028_215066",
                  "goo_default_ufcgsebal_landsat_7_20121028_215066",
                  "goo_default_ufcgsebal_landsat_5_20121113_215066",
                  "goo_default_ufcgsebal_landsat_7_20121113_215066",
                  "goo_default_ufcgsebal_landsat_5_20121129_215066",
                  "goo_default_ufcgsebal_landsat_7_20121129_215066",
                  "goo_default_ufcgsebal_landsat_5_20121215_215066",
                  "goo_default_ufcgsebal_landsat_7_20121215_215066",
                  "goo_default_ufcgsebal_landsat_5_20121231_215066",
                  "goo_default_ufcgsebal_landsat_7_20121231_215066",
                ],
                endDate: "2013-01-01",
                lowerLeftLatitude: "-8.176947",
                userEmail: "felipe.amorim.ferreira@ccc.ufcg.edu.br",
                state: "FAILED",
                upperRightLatitude: "-9.176947",
                priority: 1,
                lowerLeftLongitude: "-36.595067",
                upperRightLongitude: "-37.595067",
                startDate: "2011-12-30",
              },
            ],
          }),
      })
    ),
  };
});

describe("Job Service", () => {
  describe("getAllJobs", () => {
    it("should return a list of jobs", async () => {
      const allJobs: {
        jobs: any[];
        jobsCount: number;
      } = await getAllJobs(1, 5, { state: "asc" });
      expect(Fetcher.fetch).toHaveBeenCalled();
      expect(allJobs).toHaveProperty("jobs");
      expect(allJobs).toHaveProperty("jobsCount");
      expect(allJobs.jobs).toBeInstanceOf(Array);
    });
  });

  describe("getJobTasks", () => {
    it("should return a list of tasks", async () => {
      (Fetcher.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              tasksFailed: 2,
              tasksArchived: 0,
              tasksAmount: 2,
              tasksOngoing: 0,
              tasks: [
                {
                  inputGatheringTag: "googleapis",
                  algorithmExecutionTag: "ufcg-sebal",
                  creationTime: "2023-04-18 12:47:04.851",
                  imageDate: "2012-12-31",
                  federationMember: "None",
                  updateTime: "2023-04-18 14:36:53.462177",
                  priority: 1,
                  error: "error while execute preprocessing phase",
                  collectionTierName: "landsat_7_366_2012",
                  inputPreprocessingTag: "default",
                  name: "landsat_73662012",
                  state: "failed",
                  region: "215066",
                  dataset: "landsat_7",
                  user: "felipe.amorim.ferreira@ccc.ufcg.edu.br",
                  taskId: "goo_default_ufcgsebal_landsat_7_20121231_215066",
                  status: "available",
                },
              ],
            }),
        })
      );

      const jobTasks = await getJobTask("fdsfsd345-ffdsf5423-fds543", 1, 5, {
        state: "asc",
      });

      expect(Fetcher.fetch).toHaveBeenCalled();
      expect(jobTasks).toHaveProperty("tasks");
      expect(jobTasks).toHaveProperty("tasksFailed");
      expect(jobTasks).toHaveProperty("tasksArchived");
      expect(jobTasks).toHaveProperty("tasksAmount");
      expect(jobTasks).toHaveProperty("tasksOngoing");
    });
  });
});

afterAll(() => {
  jest.unmock("../../src/services/fetcher");
});
