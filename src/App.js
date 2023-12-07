import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Container, TextField, Button, Box, LinearProgress, Select, MenuItem } from '@mui/material';
import { MdOutlineChat } from "react-icons/md";
import { marked } from 'marked';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';


function App() {

  const theme = createTheme({
    palette: {
      primary: {
        main: '#556cd6', 
      },
      secondary: {
        main: '#19857b', 
      },
      error: {
        main: '#ff0000', 
      },
      
    },
  });


  const [inputCompanyName, setInputCompanyName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [question, setQuestion] = useState('');
  const [summary, setSummary] = useState('');
  const [answer, setAnswer] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loadingCompanyInfo, setLoadingCompanyInfo] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  const fetchCompanyInfo = async (name) => {
    setLoadingCompanyInfo(true);
    try {
      const url = `${process.env.REACT_APP_API_BASE_URL}/company?company_name=${encodeURIComponent(name)}`;
      const response = await axios.get(url, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const data = await response.json();
      const processedContent = data.content.replace(/\(ref:([^\)]+)\)/g, (match, url) => `[🔗](${url})`);
      const htmlContent = marked(processedContent);
      setSummary(htmlContent);
    } catch (error) {
      console.error("Error fetching company info:", error);
      setSummary("無法獲取資訊");
    }finally {
      setLoadingCompanyInfo(false);
    }
  };

  const fetchAllCompanies = async () => {
    try {
      const url = `${process.env.REACT_APP_API_BASE_URL}/all_companies`;
      const response = await axios.get(url, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      console.log(response.data); 
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      if (error.response) {
        console.log("Response status:", error.response.status);
        console.log("Response data:", error.response.data);
      }
    }
  };

  const submitQuestion = async () => {
    setLoadingQuestion(true);
    try {
      const url = `${process.env.REACT_APP_API_BASE_URL}/ask/${encodeURIComponent(companyName)}?question=${encodeURIComponent(question)}`;
      const response = await axios.get(url, {
        headers: {
          'ngrok-skip-browser-warning': '69420'
        }
      });
      const data = await response.json();
      const processedContent = data.content.replace(/\(ref:([^\)]+)\)/g, (match, url) => `[🔗](${url})`);
      const htmlContent = marked(processedContent);
      setAnswer(htmlContent);
    } catch (error) {
      console.error("Error submitting question:", error);
      setAnswer("無法獲取答案");
    } finally {
      setLoadingQuestion(false);
    }
  };

  useEffect(() => {
    fetchAllCompanies();
  }, []);

  return (
    
    <div className="App">
      <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MdOutlineChat />
          </IconButton>
          <Typography variant="h6">
            CHAT_ESG
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6" component="h2" sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          請輸入您想取得ESG新聞的企業名稱:
        </Typography>

        <TextField
          fullWidth
          label="企業名稱"
          value={inputCompanyName}
          onChange={(e) => setInputCompanyName(e.target.value)}
          sx={{ mb: 4 }}
        />
        {loadingCompanyInfo && <LinearProgress />} 
        
        <Button variant="contained" fullWidth onClick={() => fetchCompanyInfo(inputCompanyName)}>
          查詢
        </Button>


        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontSize: '20px', fontWeight:'bold' }}>摘要：</Typography>
          <div dangerouslySetInnerHTML={{ __html: summary }} />
        </Box>

        <Typography variant="h6" component="h2" sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          請選擇企業名稱，並輸入問題以獲取更多ESG資訊:
        </Typography>


        <Select
          fullWidth
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          displayEmpty
          sx={{ mb: 4 }}
        >
          <MenuItem value="" disabled>
            請選擇您想詢問的企業名稱
          </MenuItem>
          {companies.map((company, index) => (
            <MenuItem key={index} value={company.company_name}>
              {company.company_name}
            </MenuItem>
          ))}
        </Select>
          
        <TextField
          fullWidth
          label="問題"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          rows={4}
          sx={{ mb: 4 }}
        />
        {loadingQuestion && <LinearProgress />} 

        <Button variant="contained" fullWidth onClick={submitQuestion}>
          提交
        </Button>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" sx={{ fontSize: '20px', fontWeight:'bold' }}>回答：</Typography>
          <div dangerouslySetInnerHTML={{ __html: answer }} />
        </Box>
      </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;