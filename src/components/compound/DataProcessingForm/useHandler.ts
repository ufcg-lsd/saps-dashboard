import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export enum InputDownloadingPhase {
  GOOGLEAPIS,
  USGSAPIS,
}

export enum PreProcessingPhase {
  DEFAULT,
  LEGACY,
}

export enum ProcessingPhase {
  UFCG_SEBAL,
  SECKC_SEBAL,
  SEBKC_TSEB,
}

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
    initialDate: Dayjs | null;
    finalDate: Dayjs | null;
  }>({
    initialDate: null,
    finalDate: null,
  });

  const [inputDownloadingPhase, setInputDownloadingPhase] =
    useState<InputDownloadingPhase>(InputDownloadingPhase.GOOGLEAPIS);

  const [preProcessingPhase, setPreProcessingPhase] =
    useState<PreProcessingPhase>(PreProcessingPhase.DEFAULT);

  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>(
    ProcessingPhase.UFCG_SEBAL
  );

  const setInitialDate = (date: Dayjs | null) => {
    if (!date || (period.finalDate && date > period.finalDate)) return;

    setPeriod((prev) => ({
      ...prev,
      initialDate: date,
    }));
  };

  const setFinalDate = (date: Dayjs | null) => {
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

  const disableBeforeInitialDateAndFutureDates = (date: Dayjs) => {
    if (!period.initialDate) return false;

    const now = dayjs();
    return date > now || date < period.initialDate;
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
