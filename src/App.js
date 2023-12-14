// App.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Tab, Tabs, Box } from '@mui/material';
import Summary from './summary';
import QA from './qa';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

function App() {
  const [value, setValue] = useState(0);
  const [companies, setCompanies] = useState([]); // 示例数据，您需要根据API获取

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">CHAT_ESG</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="生成ESG摘要" />
            <Tab label="ESG問答" />
          </Tabs>
        </Box>
        <Box sx={{ p: 2 }}>
          {value === 0 && <Summary /* 传递所需的props */ />}
          {value === 1 && <QA companies={companies} /* 传递其他所需的props */ />}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;