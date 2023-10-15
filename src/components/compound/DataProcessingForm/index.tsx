
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import useHandler, {
  InputDownloadingPhase,
  PreProcessingPhase,
  ProcessingPhase,
} from "./useHandler";
import React from 'react';
import SearchResultsModal from './SearchResultsModal';
import CircularProgress from '@mui/material/CircularProgress';
import { createFinalUrl } from '@src/services/utils';


import { 
  Typography
} from '@mui/material';



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

  function TableToolbar(props: any, ref: any) {
    const { setOpenPopover, setShowNewProcessingModal } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...{
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          },
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Jobs
        </Typography>
        <Tooltip title="New Processing">
          <IconButton onClick={() => setShowNewProcessingModal(true)}>
            <AddCircleOutline />
            <div
              ref={ref}
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Filter list">
          <IconButton onClick={() => setOpenPopover(true)}>
            <FilterListIcon />
            <div
              ref={ref}
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
              }}
            />
          </IconButton>
        </Tooltip>
      </Toolbar>
    );
  }

const DataProcessingForm = (props: PropsTypes) => {
  const { area } = props;

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const [showForm, setShowForm] = useState(true);
  const [maxCardHeight, setMaxCardHeight] = useState(0);
  const [maxCardWidth, setMaxCardWidth] = useState(0);
  const [cardTranslate, setCardTranslate] = useState(-150);
  const transitionTimeout = useRef<NodeJS.Timeout>(null);
  
  const handleInitalDateChange = (date: Date) => {
    setInitialDate(date.toISOString().slice(0, 11)); 
  };

  const handleFinalDateChange = (date: Date) => {
    setFinalDate(date.toISOString().slice(0, 11)); 
  };

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

  console.log(period.initialDate);
  console.log(period.finalDate);
  
  const getRequestBody = () => {
    return (
        `userEmail=admin_email&` +
        `userPass=admin_password&` +
        `upperRight=${encodeURIComponent(upperRight.latitude + ',' + upperRight.longitude)}&` +  // Alterado aqui
        `lowerLeft=${encodeURIComponent(lowerLeft.latitude + ',' + lowerLeft.longitude)}&` +      // Alterado aqui
        `initialDate=${encodeURIComponent(period.initialDate)}&` +
        `finalDate=${encodeURIComponent(period.finalDate)}&` +
        `inputGatheringTag=${encodeURIComponent(inputDownloadingPhase)}&` + 
        `inputPreprocessingTag=${encodeURIComponent(preProcessingPhase)}&` + 
        `algorithmExecutionTag=${encodeURIComponent(processingPhase)}`
    );
};

const headers = {
  "Content-Type": "application/x-www-form-urlencoded"
};


async function handleSearch() {
    setLoading(true);

    const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || "";
    const url = createFinalUrl(apiUrl, "/regions/search");

    console.log("Enviando requisição para:", url);
    console.log("Headers:", headers);
    console.log("Body:", getRequestBody());


    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: getRequestBody()
        });

        if (response.ok) {
            const responseData = await response.json();
            setLoading(false);
            console.log("Search response: ", responseData);
            setResponseData(responseData);
            setOpenModal(true);

        } else {
            setLoading(false);
            console.error("Error searching: ", response.statusText);
        }
    } catch (error) {
        setLoading(false);
        console.error("Error searching: ", error);
    }

   
}

  
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
                  shouldDisableDate={(day) => {
                    return false;
                  }}
                  onChange={(date: Date | null) => {
                    if (date !== null) {
                      handleInitalDateChange(date)}}
                    }
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
                  shouldDisableDate={(day) => {
                    return false;
                  }}
                  onChange={(date: Date | null) => {
                    if (date !== null) {
                      handleFinalDateChange(date)}}
                    }
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
                  setInputDownloadingPhase(event.target.value);
                }}
                label="Age"
                variant="standard"
              >
                <MenuItem value={"googleapis"}>
                  googleapis
                </MenuItem>
                <MenuItem value={"usgapis"}>
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
                  setPreProcessingPhase(event.target.value);
                }}
                label="Age"
                variant="standard"
              >
                <MenuItem value={"default"}>default</MenuItem>
                <MenuItem value={"legacy"}>legacy</MenuItem>
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
                  setProcessingPhase(event.target.value);
                }}
                label="Age"
                variant="standard"
              >
                <MenuItem value={"ufcg-sebal"}>
                  ufcg-sebal
                </MenuItem>
                <MenuItem value={"sebkc-sebal"}>
                  sebkc-sebal
                </MenuItem>
                <MenuItem value={"sebkc-tseb"}>
                  sebkc-tseb
                </MenuItem>
              </Select>
            </Box>
            <Box
              sx={{
                  mt: "24px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",  
              }}
          >
              {loading ? <CircularProgress size={30} sx={{ marginRight: "16px" }} /> : null} 
              <Button variant="contained" onClick={() => { handleSearch(); }}>Search</Button>
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

      <SearchResultsModal openModal={openModal} onClose={() => setOpenModal(false)}responseData={responseData}/>

    </Box>
  );
};

export default DataProcessingForm;