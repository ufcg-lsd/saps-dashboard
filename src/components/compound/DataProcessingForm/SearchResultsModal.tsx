import React, { useState } from 'react';
import { Modal, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Button } from "@mui/material";
import { styled } from '@mui/system';
import { createFinalUrl } from '@src/services/utils';

const InfoContainer = styled('div')({
  marginBottom: '8px', 
});

const Label = styled(Typography)({
  fontWeight: 'bold', 
  marginRight: '5px', 
  display: 'inline',  
});

const Value = styled(Typography)({
  display: 'inline',
});

interface Props {
  openModal: boolean;
  tittle: "teste",
  onClose: () => void;
  responseData: any; 
}

const SearchResultsModal: React.FC<Props> = ({ openModal, onClose, responseData }) => {

  const handleClose = () => {
    setIsFeedbackVisible(false); 
    onClose();  
  }

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isFeedbackVisible, setIsFeedbackVisible] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    if (isChecked) {
        setSelectedItems((prev) => [...prev, index]);
    } else {
        setSelectedItems((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleSend = async () => {

    const selectedRegions = selectedItems.map((index) => responseData.result[index]);
    const apiUrl = process.env["NEXT_PUBLIC_API_URL"] || "";
    const url = createFinalUrl(apiUrl, "/email");
    const requestData = {
      userEmail: localStorage.getItem('email'),
      userPass: localStorage.getItem('passwd'),
      userEGI: "",
      "tasks_id[]": selectedRegions.map(region => region.taskId)};

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        
        body: new URLSearchParams(requestData).toString()
      });

      console.log(requestData)
      const result = await response.text();
      console.log(result);

      if (response.ok) {
        setFeedbackMessage("Email will be sent soon.");
        setIsFeedbackVisible(true);
      } else {
        setFeedbackMessage("Email will be sent soon.");
        setIsFeedbackVisible(true);
      }

    } catch (error) {
      console.error("Error sending data:", error);
      setFeedbackMessage("Email will be sent soon.");
      setIsFeedbackVisible(true);
    }
};

  return (
    
    <Modal
      open={openModal}
      onClose={handleClose} 
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableEscapeKeyDown={true} 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box 
        sx={{
          position: 'relative',  
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          width: '80%',
          height: '80%',
          overflow: 'auto' 
        }}
      >
        <div style={{ textAlign: 'center' , paddingBottom: '20px', color: '#2f9688'}}>
          <Typography variant="h4">Results</Typography>
        </div>

        <IconButton 
            aria-label="close" 
            onClick={handleClose}  // Aqui
            sx={{ position: 'absolute', right: '10px', top: '10px', zIndex: 1000 }}>
            <CloseIcon />
        </IconButton>

        {responseData && responseData.result && responseData.result.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <FormControlLabel
                aria-label="Acknowledge"
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.stopPropagation()}
                control={
                  <Checkbox 
                    onChange={(event) => handleCheckboxChange(index, event.target.checked)}
                  />
                }
                label={`Region ${item.region} (${responseData.result.length})`}
              />

          </AccordionSummary>
          <AccordionDetails>
              <InfoContainer>
                <Label>Date:</Label>
                <Value>{item.imageDate}</Value>
              </InfoContainer>
              <InfoContainer>
                <Label>Input Gathering:</Label>
                <Value>{item.inputGatheringTag}</Value>
              </InfoContainer>
              <InfoContainer>
                <Label>Preprocessing:</Label>
                <Value>{item.inputPreprocessingTag}</Value>
              </InfoContainer>
              <InfoContainer>
                <Label>Algorithm Execution:</Label>
                <Value>{item.algorithmExecutionTag}</Value>
              </InfoContainer>
            </AccordionDetails>
        </Accordion>
      ))}

      <Box 
          sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px' 
          }}
      >
          {isFeedbackVisible ? (
              <Typography variant="body1" color="#2f9688">
                  {feedbackMessage}
              </Typography>
          ) : (
              <Button variant="contained" onClick={handleSend}>SEND</Button>
          )}
      </Box>

    </Box>
  </Modal>
  );
}

export default SearchResultsModal;
