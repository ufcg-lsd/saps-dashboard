import { Password } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { addJob } from "@src/services/job";


interface PropsTypes {
  open: boolean;
  onClose: () => void;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const NewProcessingModal = (props: PropsTypes) => {
  const { open, onClose } = props;

  const [label, setLabel] = useState("");
  const [latitudeUpperRight, setLatitudeUpperRight] = useState(0);
  const [longitudeUpperRight, setLongitudeUpperRight] = useState(0);
  const [latitudeLowerLeft, setLatitudeLowerLeft] = useState(0);
  const [longitudeLowerLeft, setLongitudeLowerLeft] = useState(0);
  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [inputDownloadingPhase, setInputDownloadingPhase] = useState("");
  const [preprocessingPhase, setPreprocessingPhase] = useState("");
  const [processingPhase, setProcessingPhase] = useState("");
  const [priority, setPriority] = useState("");

  const handleInitialDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialDate(e.target.value);
  };

  const handleFinalDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalDate(e.target.value);
  };

  const handleProcessClick = async (
    email: string,
    passwd: string
  ) => {
    const jobData = {
      label: label,
      initialDate: initialDate,
      finalDate: finalDate,
      priority: parseInt(priority),
      inputGatheringTag: inputDownloadingPhase,
      inputPreprocessingTag: preprocessingPhase,
      algorithmExecutionTag: processingPhase,
      userEmail: localStorage.getItem('email') || '', 
      userPass: localStorage.getItem('password') || '',
      email: localStorage.getItem('email') || '',
      coordinates: {
        lowerLeft: [
          latitudeLowerLeft, longitudeLowerLeft],
        upperRight: [
          latitudeUpperRight, longitudeUpperRight],
    },
    };

    try {
      const response = await addJob(jobData); 
      console.log(response);
    } catch (error) {
      console.error("Failed to add job: ", error);
    }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={style}>
        <Card
          sx={{
            overflow: "auto",
          }}
        >
          <CardContent>
            <Box
              sx={{
                marginBottom: "24px",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Label"
                size="small"
                variant="standard"
                type="text"
                value={label}
                onChange={(e) => {setLabel(e.target.value)}}
              />
            </Box>
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
                value={latitudeUpperRight}
                onChange={(e) => {setLatitudeUpperRight(parseFloat(e.target.value))}}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="number"
                onChange={(e) => {setLongitudeUpperRight(parseFloat(e.target.value))}}
                value={longitudeUpperRight}
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
                value={latitudeLowerLeft}
                onChange={(e) => setLatitudeLowerLeft(parseFloat(e.target.value))}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="number"
                value={longitudeLowerLeft}
                onChange={(e) => {setLongitudeLowerLeft(parseFloat(e.target.value))}}
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
                  onChange={(e) => {handleInitialDateChange}}
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
                  disabled={false}
                  shouldDisableDate={(day) => {
                    return false;
                  }}
                  onChange={(e) => {handleFinalDateChange}}
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
                onChange={(e) => {setInputDownloadingPhase(e.target.value)}}
                label="Age"
                variant="standard"
              >
                <MenuItem value={1}>googleapis</MenuItem>
                <MenuItem value={1}>usgapis</MenuItem>
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
                value={preprocessingPhase}
                onChange={(e) => {setPreprocessingPhase(e.target.value)}}
                label="Age"
                variant="standard"
              >
                <MenuItem value={1}>default</MenuItem>
                <MenuItem value={1}>legacy</MenuItem>
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
                onChange={(e) => {setProcessingPhase(e.target.value)}}
                label="Age"
                variant="standard"
              >
                <MenuItem value={1}>ufcg-sebal</MenuItem>
                <MenuItem value={1}>sebkc-sebal</MenuItem>
                <MenuItem value={1}>sebkc-tseb</MenuItem>
              </Select>
            </Box>
            <Box
              sx={{
                mt: "24px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <Button variant="contained" onClick={() => 
              {handleProcessClick(localStorage.getItem('email') || '', localStorage.getItem('password') || '')}}>Process</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
}};

export default NewProcessingModal;
