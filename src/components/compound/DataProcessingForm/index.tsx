import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import useHandler, {
  InputDownloadingPhase,
  PreProcessingPhase,
  ProcessingPhase,
} from "./useHandler";

interface PropsTypes {
  area: {
    upperRight: {
      latitude: number;
      longitude: number;
    };
    lowerLeft: {
      latitude: number;
      longitude: number;
    };
  };
}

const DataProcessingForm = (props: PropsTypes) => {
  const { area } = props;

  const [showForm, setShowForm] = useState(true);
  const [maxCardHeight, setMaxCardHeight] = useState(0);
  const [maxCardWidth, setMaxCardWidth] = useState(0);
  const [cardTranslate, setCardTranslate] = useState(-150);
  const transitionTimeout = useRef<NodeJS.Timeout>(null);

  const {
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
  } = useHandler();

  useEffect(() => {
    setUpperRight(area.upperRight);
    setLowerLeft(area.lowerLeft);
  }, [area, setUpperRight, setLowerLeft]);

  useEffect(() => {
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);

    if (showForm) {
      setMaxCardHeight(600);
      setMaxCardWidth(600);
      setCardTranslate(2);
    } else {
      // @ts-ignore
      transitionTimeout.current = setTimeout(() => {
        setMaxCardHeight(0);
        setMaxCardWidth(0);
      }, 500);
      setCardTranslate(-150);
    }
  }, [showForm]);

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          top: "5vh",
          minHeight: "80px",
        }}
      >
        <Button
          sx={{
            padding: "0",
            maxHeight: "80px",
            minWidth: "30px",
          }}
          variant="contained"
          size="small"
          onClick={() => setShowForm(!showForm)}
        >
          <ArrowForwardIos
            sx={{
              transform: `rotate(${showForm ? 180 : 0}deg)`,
              transition: "transform 0.5s ease-in-out",
            }}
          />
        </Button>
        <Card
          sx={{
            overflow: "auto",
            transform: `translateX(${cardTranslate}%)`,
            maxHeight: ` ${maxCardHeight}px`,
            maxWidth: `${maxCardWidth}px`,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <CardContent>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: "primary.main",
              }}
            >
              Upper Right
            </Typography>
            <Box
              sx={{
                padding: "6px 0 12px 0",
                display: "flex",
                gap: "12px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Latitude"
                size="small"
                variant="standard"
                type="number"
                value={upperRight.latitude}
                onChange={(e) => {
                  setUpperRight((prev) => ({
                    ...prev,
                    latitude: Number(e.target.value),
                  }));
                }}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="number"
                onChange={(e) => {
                  setUpperRight((prev) => ({
                    ...prev,
                    longitude: Number(e.target.value),
                  }));
                }}
                value={upperRight.longitude}
              />
            </Box>
            <Typography
              variant="body2"
              component="span"
              sx={{
                color: "primary.main",
                mt: "12px",
              }}
            >
              Lower Left
            </Typography>
            <Box
              sx={{
                padding: "6px 0 12px 0",
                display: "flex",
                gap: "12px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Latitude"
                size="small"
                variant="standard"
                type="number"
                sx={{
                  mr: "12px",
                }}
                value={lowerLeft.latitude}
                onChange={(e) => {
                  setLowerLeft((prev) => ({
                    ...prev,
                    latitude: Number(e.target.value),
                  }));
                }}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="number"
                value={lowerLeft.longitude}
                onChange={(e) => {
                  setLowerLeft((prev) => ({
                    ...prev,
                    longitude: Number(e.target.value),
                  }));
                }}
              />
            </Box>
            <Box
              sx={{
                padding: "6px 0 12px 0",
                display: "flex",
                gap: "12px",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "180px",
                }}
              >
                <DatePicker
                  label="Initial Date"
                  shouldDisableDate={disableFutureDates}
                  onChange={setInitialDate}
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "180px",
                }}
              >
                <DatePicker
                  label="Final Date"
                  disabled={!period.initialDate}
                  shouldDisableDate={disableBeforeInitialDateAndFutureDates}
                  onChange={setFinalDate}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: "primary.main",
                  mt: "12px",
                }}
              >
                Inputdownloading phase
              </Typography>
              <Select
                id="demo-simple-select-standard"
                value={inputDownloadingPhase}
                onChange={(event) => {
                  setInputDownloadingPhase(
                    event.target.value as InputDownloadingPhase
                  );
                }}
                label="Age"
                variant="standard"
              >
                <MenuItem value={InputDownloadingPhase.GOOGLEAPIS}>
                  googleapis
                </MenuItem>
                <MenuItem value={InputDownloadingPhase.USGSAPIS}>
                  usgapis
                </MenuItem>
              </Select>
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: "primary.main",
                  mt: "12px",
                }}
              >
                Preprocessing phase
              </Typography>
              <Select
                id="demo-simple-select-standard"
                value={preProcessingPhase}
                onChange={(event) => {
                  setPreProcessingPhase(
                    event.target.value as PreProcessingPhase
                  );
                }}
                label="Age"
                variant="standard"
              >
                <MenuItem value={PreProcessingPhase.DEFAULT}>default</MenuItem>
                <MenuItem value={PreProcessingPhase.LEGACY}>legacy</MenuItem>
              </Select>
              <Typography
                variant="body2"
                component="span"
                sx={{
                  color: "primary.main",
                  mt: "12px",
                }}
              >
                Processing phase
              </Typography>
              <Select
                id="demo-simple-select-standard"
                value={processingPhase}
                onChange={(event) => {
                  setProcessingPhase(event.target.value as ProcessingPhase);
                }}
                label="Age"
                variant="standard"
              >
                <MenuItem value={ProcessingPhase.UFCG_SEBAL}>
                  ufcg-sebal
                </MenuItem>
                <MenuItem value={ProcessingPhase.SECKC_SEBAL}>
                  sebkc-sebal
                </MenuItem>
                <MenuItem value={ProcessingPhase.SEBKC_TSEB}>
                  sebkc-tseb
                </MenuItem>
              </Select>
            </Box>
            <Box
              sx={{
                mt: "24px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button variant="contained">Search</Button>
              <Button
                variant="contained"
                disabled={
                  !upperRight.latitude &&
                  !upperRight.longitude &&
                  !lowerLeft.latitude &&
                  !lowerLeft.longitude
                }
                onClick={clearArea}
              >
                Clear Search
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DataProcessingForm;
