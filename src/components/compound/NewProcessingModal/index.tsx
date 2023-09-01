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
                value={null}
                onChange={() => {}}
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
                value={null}
                onChange={() => {}}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="number"
                onChange={() => {}}
                value={null}
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
                value={null}
                onChange={() => {}}
              />
              <TextField
                id="outlined-basic"
                label="Longitude"
                size="small"
                variant="standard"
                type="number"
                value={null}
                onChange={() => {}}
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
                  onChange={() => {}}
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
                  onChange={() => {}}
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
                value={null}
                onChange={() => {}}
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
                value={null}
                onChange={() => {}}
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
                value={null}
                onChange={() => {}}
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
              <Button variant="contained">Process</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

export default NewProcessingModal;
