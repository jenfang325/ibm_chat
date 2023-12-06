import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Container, TextField, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const [companyName, setCompanyName] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    // 假設這裡是調用 API 的地方
    setAnswer("這裡是回傳的答案");
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            CHAT_ESG
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 4 }}>
          請輸入公司名稱
        </Typography>

        <TextField
          fullWidth
          label="公司名稱"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          sx={{ mb: 4 }}
        />

        <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 4 }}>
          請輸入問題
        </Typography>

        <TextField
          fullWidth
          label="問題"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          rows={4}
          sx={{ mb: 4 }}
        />

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          提交
        </Button>

        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1">回答：</Typography>
          <Typography variant="body1">{answer}</Typography>
        </Box>
      </Container>
    </div>
  );
}

export default App;

