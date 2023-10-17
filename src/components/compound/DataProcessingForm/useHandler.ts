import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

const useHandler = () => {
  const [upperRight, setUpperRight] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  const [lowerLeft, setLowerLeft] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });

  const [period, setPeriod] = useState<{
    initialDate: Date | null;
    finalDate: Date | null;
  }>({
    initialDate: null,
    finalDate: null,
  });

  const [inputDownloadingPhase, setInputDownloadingPhase] = useState("");

  const [preProcessingPhase, setPreProcessingPhase] = useState("");

  const [processingPhase, setProcessingPhase] = useState("");

  const setInitialDate = (date: any) => {
    if (!date || (period.finalDate && date > period.finalDate)) return;

    setPeriod((prev) => ({
      ...prev,
      initialDate: date,
    }));
  };

  const setFinalDate = (date: any) => {
    if (!date || !period.initialDate || date < period.initialDate) return;

    setPeriod((prev) => ({
      ...prev,
      finalDate: date,
    }));
  };

  const disableFutureDates = (date: Dayjs) => {
    const now = dayjs();
    return date > now;
  };

  const disableBeforeInitialDateAndFutureDates = (date: Date) => {
    if (!period.initialDate) return false;

    const now = dayjs();
    return date > now.toDate() || date < period.initialDate;
  };

  const clearArea = () => {
    setUpperRight({
      latitude: 0,
      longitude: 0,
    });

    setLowerLeft({
      latitude: 0,
      longitude: 0,
    });
  };

  return {
    upperRight,
    setUpperRight,
    lowerLeft,
    setLowerLeft,
    period,
    setInitialDate,
    setFinalDate,
    inputDownloadingPhase,
    setInputDownloadingPhase,
    preProcessingPhase,
    setPreProcessingPhase,
    processingPhase,
    setProcessingPhase,
    disableFutureDates,
    disableBeforeInitialDateAndFutureDates,
    clearArea,
  };
};

export default useHandler;
