import React from 'react';
import AutoComplete from '@mui/material/Autocomplete';
import { Stack } from '@mui/system';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { makeRequest } from '../utils';
import { setLeftInput, setRightInput, setLeftTeam, setRightTeam } from '../actions';
import {connect} from "react-redux";

class SelectTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clubs: []};
  }

  componentDidMount = () => {
    let promise = makeRequest('khl/clubs');
    promise.then((data) => {this.setState({...this.state, clubs: data.clubs})})
  }

  onLeftChange = (event, value, reason, details) => {
    console.log(value)

    this.props.setLeftInput({
      'value': value
    })
  }

  onRightChange = (event, value, reason, details) => {
    console.log(value)

    this.props.setRightInput({
      'value': value
    })
  }

  onClick = () => {
    let left_club = this.state.clubs.filter(club => club['team_unique'] === this.props.left_input['value']);
    let right_club = this.state.clubs.filter(club => club['team_unique'] === this.props.right_input['value']);

    this.props.setLeftTeam(left_club[0]);
    this.props.setRightTeam(right_club[0]);
  }

  render = () => {

    return (
      <Stack direction="column">
        <Stack direction="row" 
          justifyContent="space-evenly" 
          sx={{ m: 1 }}
          spacing={0.5}
        >
          <AutoComplete 
            id="left_team"
            options={this.state.clubs.map(club => club['team_unique']).sort()}
            fullWidth
            onChange={this.onLeftChange}
            renderInput={(params) => 
              <TextField 
                {...params}
                inputProps = {{...params.inputProps, style: { fontSize: 12 }}}
                label="Команда" 
              />
            }
          />
          <Box style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              fontSize: 12
            }}
          >
            VS
          </Box>
          <AutoComplete 
            id="right_team"
            options={this.state.clubs.map(club => club['team_unique']).sort()}
            fullWidth
            onChange={this.onRightChange}
            renderInput={(params) => 
              <TextField 
                {...params}
                inputProps = {{...params.inputProps, style: { fontSize: 12 }}}
                label="Команда" 
              />
            }
          />
        </Stack>
        <Button 
          variant="outlined"
          sx={{ m: 1 }}
          disabled={this.props.left_input['value'] === null || this.props.right_input['value'] === null}
          onClick={this.onClick}
          style={{
            fontSize: 10
          }}
        >
          Сравнить
        </Button>
      </Stack>
    )  
  }
}

export default connect(
  store => ({
      left_input : store.left_input,
      right_input : store.right_input
  }),
  dispatch => ({
      setLeftInput(value) {
          dispatch(setLeftInput(value));
      },
      setRightInput(value) {
        dispatch(setRightInput(value));
      },
      setLeftTeam(value) {
        dispatch(setLeftTeam(value))
      },
      setRightTeam(value) {
        dispatch(setRightTeam(value))
      },
  })
)(SelectTeam);