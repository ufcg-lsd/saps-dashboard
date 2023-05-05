import { RowData } from "@src/types/pages/processing";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { getAllJobs } from "@src/services/job";

const useHandler = () => {
  const [dataSize, setDataSize] = useState<number>(0);
  const [returnData, setReturnData] = useState<(string | number)[][]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const { status, data } = useQuery(`getJobs|${page}|${rowsPerPage}`, () => {
    return getAllJobs(page + 1, rowsPerPage, { state: "asc" });
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (status !== "success" || !data.jobs || !data.jobsCount) return;

    const propertiesSequence = [
      "id",
      "label",
      "start",
      "end",
      "latitude",
      "longitude",
      "state",
    ];

    const result: (string | number)[][] = [];

    data.jobs.forEach((job: any) => {
      const {
        jobId: id,
        jobLabel: label,
        startDate: start,
        endDate: end,
        state,
        lowerLeftLatitude,
        upperRightLatitude,
        lowerLeftLongitude,
        upperRightLongitude,
      } = job;

      const newObject = {
        id,
        label,
        start,
        end,
        latitude: `${lowerLeftLatitude} | ${upperRightLatitude}`,
        longitude: `${lowerLeftLongitude} | ${upperRightLongitude}`,
        state,
      };

      result.push(
        propertiesSequence.map(
          (property) => newObject[property as keyof RowData]
        )
      );
    });
    setDataSize(data.jobsCount);
    setReturnData(result);
  }, [status, data]);

  const columnTitles = useMemo<string[]>(
    () => ["Id", "Label", "Start", "End", "Latitude", "Longitude", "State"],
    []
  );

  return {
    dataInfo: {
      data: returnData,
      size: dataSize,
      status,
    },
    columnTitles,
    page,
    rowsPerPage,
    handleChangeRowsPerPage,
    handleChangePage,
  };
};

export default useHandler;
