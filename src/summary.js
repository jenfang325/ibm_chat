// Summary.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, TextField, Typography, Box, Snackbar, LinearProgress } from '@mui/material';

const Summary = ({ onSubmit }) => {
    const [companyName, setCompanyName] = useState('');
    const [companies, setCompanies] = React.useState([]);
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null); 
    const [inputValue, setInputValue] = useState(''); 


    useEffect(() => {
        const fetchCompanies = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/all_companies`, {
              headers: {
                'ngrok-skip-browser-warning': '69420'
              }
            });
            console.log(response.data); 
            setCompanies(response.data); 
          } catch (error) {
            console.error('Error fetching companies:', error);
          }
        };
    
        fetchCompanies(); 
      }, []);


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          setFile(selectedFile);
          setUploadMessage(`文件 "${selectedFile.name}" 已上傳`);
          setOpenSnackbar(true);
          setUploadedFileName(selectedFile.name); 
        }
      };
    
      const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
      };
    
      const handleSubmit = async () => {
        
        if (!inputValue) {
          setUploadMessage('請輸入企業名稱！');
          setOpenSnackbar(true);
          return;
        }
      
        const url = `${process.env.REACT_APP_API_BASE_URL}/company?company_name=${encodeURIComponent(inputValue)}`;
        const formData = new FormData();
        formData.append('file', file);
      
        try {
          setLoading(true);
          const response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'ngrok-skip-browser-warning': '69420'
            }
          });
          const processedContent = response.data.content.replace(/\(ref:([^\)]+)\)/g, (match, url) => `[🔗](${url})`);
          const htmlContent = marked(processedContent);
          setSummary(htmlContent);
        } catch (error) {
          console.error("Error fetching company info:", error);
          setUploadMessage('無法獲取訊息');
          setOpenSnackbar(true);
        } finally {
          setLoading(false);
        }
      };
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        請輸入企業名稱及上傳永續報告書
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
        將為您蒐集輸入之企業的ESG資訊，並讀取永續報告書後，生成 ESG 摘要。
        </Typography>
        <Autocomplete
        freeSolo
        value={selectedCompany}
        onChange={(event, newValue) => {
            if (typeof newValue === 'object' && newValue !== null) {
            setSelectedCompany(newValue);
            setCompanyName(newValue.company_name);
            } else {
            setSelectedCompany(null);
            setCompanyName(newValue);
            }
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
        }}
        options={companies}
        getOptionLabel={(option) => option ? option.company_name : ''}
        isOptionEqualToValue={(option, value) => option.company_name === value}
        renderInput={(params) => (
            <TextField {...params} label="請輸入企業名稱" fullWidth sx={{ mb: 2 }} />
        )}
        />
      <Button
        variant="outlined"
        component="label"
        sx={{ mb: 2, display: 'block', width: 'auto' }}
      >
        上傳企業永續報告書
        <input
          type="file"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {uploadedFileName && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
                <span role="img" aria-label="check">✔️</span> {uploadedFileName}
            </Typography>
            </Box>
        )}
      {loading && <LinearProgress />}
      
      <Button 
        variant="contained" 
        onClick={handleSubmit}
        fullWidth
        sx={{ mb: 2 }}
      >
        生成摘要
      </Button>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'left' }}>
        摘要 :
      </Typography>
      <div dangerouslySetInnerHTML={{ __html: summary }} style={{ textAlign: 'left' }}/> 
        
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={uploadMessage}
      />
    </Box>
  );
};

export default Summary;