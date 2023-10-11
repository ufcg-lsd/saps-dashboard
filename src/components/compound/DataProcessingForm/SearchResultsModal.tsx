import React, { useState } from 'react';
import { Modal, Box, Typography, Accordion, AccordionSummary, AccordionDetails, Checkbox, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Button } from "@mui/material";
import { styled } from '@mui/system';

const InfoContainer = styled('div')({
  marginBottom: '8px', // Adiciona um espaço entre cada linha
});

const Label = styled(Typography)({
  fontWeight: 'bold', // Destaca o nome da categoria
  marginRight: '5px',  // Adiciona um pequeno espaço entre o nome da categoria e seu valor
  display: 'inline',  // Permite que o nome da categoria e seu valor fiquem na mesma linha
});

const Value = styled(Typography)({
  display: 'inline',  // Mantém o valor na mesma linha do nome da categoria
});

interface Props {
  openModal: boolean;
  onClose: () => void;
  responseData: any; 
}

const SearchResultsModal: React.FC<Props> = ({ openModal, onClose, responseData }) => {
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
    console.log(selectedRegions);

    const requestData = {
      userEmail: "admin_email",
      userPass: "admin_password",
      userEGI: "",
      "tasks_id[]": selectedRegions.map(region => region.taskId)};

    try {
      const response = await fetch("http://10.11.19.229:8091/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        
        body: new URLSearchParams(requestData).toString()
      });

      console.log(requestData)
      const result = await response.text();
      console.log(result);

      // Handle successful response or show error messages based on your logic
      if (response.ok) {
        alert("Email will be sent soon.");
      } else {
        alert("An error occurred while sending the email, please try again later.");
      }

    } catch (error) {
      console.error("Error sending data:", error);
      alert("An error occurred. Please try again.");
    }
};


  
  return (
    <Modal
      open={openModal}
      onClose={onClose}
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
          <Typography variant="h4">Resultados</Typography>
        </div>

        <IconButton 
          aria-label="close" 
          onClick={onClose}
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
          <Button variant="contained" onClick={handleSend}>ENVIAR</Button>
      </Box>

    </Box>
  </Modal>
  );
}

export default SearchResultsModal;
