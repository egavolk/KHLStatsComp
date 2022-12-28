import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const pairOfValuess = (value1, value2, width) => {
  return (
    <Stack
        direction='column'
        style={{
          width: width
        }}
    >
      <Box 
        style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          flexWrap: 'wrap',
          fontSize: 12
        }} 
        justifyContent='center'
      >
        {value1}
      </Box>
      <Box
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          textAlign: 'center',
          fontSize: 8
        }}
        justifyContent='center'
      >
        {value2}
      </Box>
    </Stack>
  )
};

const FutureGame = (props) => {
  return (
    <Stack direction="row" 
        justifyContent="space-evenly" 
        sx={{ m: 1 }}
        spacing={0.5}
        style={{
          width: "100%"
        }}
      >
      {pairOfValuess(props.game['left_team']['team'], props.game['left_team']['city'], '35%')}
      {pairOfValuess(props.game['time'], props.game['date'], '25%')}
      {pairOfValuess(props.game['right_team']['team'], props.game['right_team']['city'], '35%')}
    </Stack>
  )
}

export default FutureGame;