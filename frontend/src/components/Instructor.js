import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

const Instructor = (props) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: "column",
        justifyContent: "center",
        height: '100%'
      }}
    >
      <Paper
        style={{
          height: '20vh',
          width: '30vh'
        }}
      >
        <Box
          style={{
            textAlign: 'center',
            marginLeft: '10%',
            marginRight: '10%',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            fontSize: 12,
            flexDirection: "column",
            justifyContent: "center",
            height: '100%',
            width: '80%'
          }}
        >
          Выберите команды для сравнения или выберите одну из предстоящих игр.
        </Box>
      </Paper>
    </Box>
    
  )
}

export default Instructor;