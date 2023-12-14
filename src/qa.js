// QA.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import { Snackbar, Button, Select, MenuItem, TextField, Typography, Box, Divider, LinearProgress } from '@mui/material';

const QA = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [question, setQuestion] = useState('');
  const [commonAnswers, setCommonAnswers] = useState('');
  const [answer, setAnswer] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loadingCommonQuestions, setLoadingCommonQuestions] = useState(false);
  const [loadingSubmitQuestion, setLoadingSubmitQuestion] = useState(false);


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

  const handleCommonQuestions = async () => {
    if (!selectedCompany) {
      alert('請先選擇一家公司！');
      return;
    }
  
    try {
      setLoadingCommonQuestions(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/ask/esg/${encodeURIComponent(selectedCompany)}`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const processedContent = response.data.content.replace(/\(ref:([^\)]+)\)/g, (match, url) => `[🔗](${url})`);
      const htmlContent = marked(processedContent);
      setCommonAnswers(htmlContent);
    } catch (error) {
      console.error("Error fetching common questions:", error);
      setUploadMessage('無法獲取常見問題回答');
      setOpenSnackbar(true);
    } finally {
      setLoadingCommonQuestions(false); 
    }
  };
  
  

  const handleSubmit = async () => {
    if (!selectedCompany || !question) {
      alert('請先選擇一間公司並輸入問題！');
      return;
    }
  
    try {
      setLoadingSubmitQuestion(true);
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/ask/any/${encodeURIComponent(selectedCompany)}?question=${encodeURIComponent(question)}`, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const processedContent = response.data.content.replace(/\(ref:([^\)]+)\)/g, (match, url) => `[🔗](${url})`);
      const htmlContent = marked(processedContent);
      setAnswer(htmlContent);
    } catch (error) {
      console.error("Error submitting question:", error);
      setUploadMessage('無法獲取回答');
      setOpenSnackbar(true);
    } finally {
      setLoadingSubmitQuestion(false);
    }
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        請先選擇企業，並輸入ESG相關問題
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'gray' }}>
        若沒有找到企業名稱，請先點選上方 " 生成ESG摘要 "，並輸入想查詢的企業名稱，將即時為您查找資訊。
      </Typography>
      <Select
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
        displayEmpty
        fullWidth
        sx={{ mb: 2 }}
        >
        <MenuItem value="" disabled>請選擇企業</MenuItem>
        {Array.isArray(companies) && companies.map((company, index) => (
            <MenuItem key={index} value={company.company_name}>
            {company.company_name}
            </MenuItem>
        ))}
        </Select>
       
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold', textAlign: 'left' }}>
        常見問題與回答:
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'gray', textAlign: 'left'  }}>
        常見問題彙整出ESG徵信檢核表中42題常見問題，如:是否為近二年發生環保違規情節重大或導致停工/停業者，以供快速查詢。
      </Typography>
      {loadingCommonQuestions && <LinearProgress />}
      <Button variant="contained" onClick={handleCommonQuestions} fullWidth sx={{ mb: 2 }}>
        獲取常見問題回答
      </Button>
      <div dangerouslySetInnerHTML={{ __html: commonAnswers }} style={{ textAlign: 'left' }} />
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold', textAlign: 'left' }}>
        請輸入問題:
      </Typography>
      <TextField
        label="請輸入問題，如: 企業是否揭露董監事、經理人以及大股東與公司進行利害關係人交易情形？"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
      />
      {loadingSubmitQuestion && <LinearProgress />}
      <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ mb: 2 }}>
        提交
      </Button>
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold', textAlign: 'left' }}>
        回答:
      </Typography>
      <div dangerouslySetInnerHTML={{ __html: answer }} style={{ textAlign: 'left' }} />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={uploadMessage}
        />
    </Box>
  );
};

export default QA;