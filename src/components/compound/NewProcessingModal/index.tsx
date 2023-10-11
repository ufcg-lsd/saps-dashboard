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
import { ModeComment } from "@mui/icons-material";



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
  const [latitudeUpperRight, setLatitudeUpperRight] = useState("");
  const [longitudeUpperRight, setLongitudeUpperRight] = useState("");
  const [latitudeLowerLeft, setLatitudeLowerLeft] = useState("");
  const [longitudeLowerLeft, setLongitudeLowerLeft] = useState("");
  const [initialDate, setInitialDate] = useState<Date | Null>(null);
  const [finalDate, setFinalDate] = useState<Date | Null>(null);
  const [inputGatheringTag, setInputGatheringTag] = useState("");
  const [inputPreprocessingTag, setInputPreprocessingTag] = useState("");
  const [inputProcessingTag, setInputProcessingTag] = useState("");

  const handleInitialDateChange = (date: Date) => {
    setInitialDate(date.toISOString().slice(0, 11)); 
  };
  
  const handleFinalDateChange = (date: Date) => {
    setFinalDate(date.toISOString().slice(0, 11)); 
  };

  async function handleProcessClick() {
    try {
      const response = await addJob(jobData);
    } catch (error) {
      console.error("Failed to add job: ", error);
    }
  }

  const jobData = {
    label: label,
    initialDate: initialDate,
    finalDate: finalDate,
    priority: 0,
    inputGatheringTag: inputGatheringTag,
    inputPreprocessingTag: inputPreprocessingTag,
    inputProcessingTag: inputProcessingTag,
    userEmail:  'admin_email', 
    userPass: 'admin_password',
    email: 'admin_email',
    coordinates: {
      lowerLeft: [latitudeLowerLeft, longitudeLowerLeft],
      upperRight: [latitudeUpperRight, longitudeUpperRight],
    }
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
                type="text"
                value={latitudeUpperRight}
                onChange={(e) => {setLatitudeUpperRight(e.target.value)}}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="text"
                value={longitudeUpperRight}
                onChange={(e) => {setLongitudeUpperRight(e.target.value)}}
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
                type="text"
                sx={{
                  mr: "12px",
                }}
                value={latitudeLowerLeft}
                onChange={(e) => setLatitudeLowerLeft(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="text"
                value={longitudeLowerLeft}
                onChange={(e) => {setLongitudeLowerLeft(e.target.value)}}
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
                      handleInitialDateChange(date)}}
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
                  disabled={false}
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
                value={inputGatheringTag}
                onChange={(e) => {setInputGatheringTag(e.target.value)}}
                label="Age"
                variant="standard"
              >
                <MenuItem value={"googleapis"}>googleapis</MenuItem>
                <MenuItem value={"usgapis"}>usgapis</MenuItem>
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
                value={inputPreprocessingTag}
                onChange={(e) => {setInputPreprocessingTag(e.target.value)}}
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
                value={inputProcessingTag}
                onChange={(e) => {setInputProcessingTag(e.target.value)}}
                label="Age"
                variant="standard"
              >
                <MenuItem value={"ufcg-sebal"}>ufcg-sebal</MenuItem>
                <MenuItem value={"sebkc-sebal"}>sebkc-sebal</MenuItem>
                <MenuItem value={"sebkc-tseb"}>sebkc-tseb</MenuItem>
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
              {handleProcessClick();
              onClose();}}>Process</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default NewProcessingModal;