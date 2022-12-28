import React from 'react';
import List from '@mui/material/List';
import SelectTeam from './SelectTeam';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import FutureGame from './FutureGame';
import { makeRequest } from '../utils';
import ListItemButton from '@mui/material/ListItemButton';
import { connect } from 'react-redux';
import { setLeftTeam, setRightTeam } from '../actions';

class GameChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {games: []};
  }

  componentDidMount() {
    let promise = makeRequest('khl/calendar');
    promise.then((data) => {this.setState({...this.state, games: data.calendar})})
  }

  onClick = (left, right) => {
    this.props.setLeftTeam(left);
    this.props.setRightTeam(right);
  }

  render() {  
    return (
      <Box>
        <SelectTeam/>
        <List component="nav" aria-label="mailbox folders">
          {this.state.games.map((game, i) => 
          <Box key={'box_' + game['game_no']}>
            <Divider />
            <ListItemButton 
              disableGutters={true}
              style={{
                height: '100%',
                WebkitJustifyContent: 'center',
                fontsize: 12
              }}
              onClick={() => this.onClick(game['left_team'], game['right_team'])}
            >
              <FutureGame 
                game={game} 
              />
            </ListItemButton>
          </Box>
          )}
        </List>
      </Box>
    )
  }
}


export default connect(
  store => ({
    left_team : store.left_team,
    right_team : store.right_team,
  }),
  dispatch => ({
      setLeftTeam(value) {
        dispatch(setLeftTeam(value))
      },
      setRightTeam(value) {
        dispatch(setRightTeam(value))
      },
  })
)(GameChoose);