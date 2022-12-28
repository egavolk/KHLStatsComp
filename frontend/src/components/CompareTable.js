import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';


class CompareTable extends React.Component {
  getColor = (stats_0, stats_1) => {
    let v1 = parseFloat(stats_0['value']);
    let v2 = parseFloat(stats_1['value']);
    let better = stats_0['better'];
    if ((v1 < v2 && better === 'less') || (v1 > v2 && better === 'more')) {
      return '#B5B8B1'
    }
    return '#FFFFFF';
  }

  render = () => {
    return (
      <List>
          {this.props.stats['left_team']
            .map((stat, i) => [stat, this.props.stats['right_team'][i]])
            .map((stats, i) =>
              <Box key={'box_' + i}>
                <Divider/>
                <ListItem
                  style={{
                    height: '100%',
                    WebkitJustifyContent: 'center',
                    fontsize: 12,
                    padding: 0
                  }}
                >
                  <Stack direction="row" 
                    style={{
                      width: "100%"
                    }}
                    justifyContent="space-evenly" 
                    sx={{ m: 1 }}
                    spacing={0.5}
                  >
                    <Box
                      style={{
                        width: '30%',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        backgroundColor: this.getColor(stats[0], stats[1])
                      }}
                      justifyContent='center'
                    >
                      {stats[0]['value']}
                    </Box>
                    <Box style={{
                        width: '40%',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        fontSize: 12,
                        textAlign: 'center'
                      }}
                      justifyContent='center'
                    >
                      {stats[0]['name']}
                    </Box>
                    <Box
                      style={{
                        width: '30%',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        backgroundColor: this.getColor(stats[1], stats[0])
                      }}
                      justifyContent='center'
                    >
                      {stats[1]['value']}
                    </Box>
                  </Stack>
                </ListItem>
              </Box>
          )}
        </List>
    )
  }
}


export default CompareTable;