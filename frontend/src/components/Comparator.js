import React from 'react';
import Stack from '@mui/material/Stack';
import { ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import { connect } from 'react-redux';
import {ToggleButton} from '@mui/material';
import {makeRequest} from '../utils';
import CompareTable from './CompareTable';
import TeamsPreview from './TeamsPreview';

class Comparator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs_compare: null,
      tab: 'standings'
    };
  }

  componentDidMount = () => {
    let promise = makeRequest('khl/clubs_compare/?left_team=' + this.props.left_team['team_id'] + '&right_team=' + this.props.right_team['team_id']);
    promise.then((data) => {this.setState({...this.state, clubs_compare: data})})
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.props.left_team === prevProps.left_team || this.props.right_team === prevProps.right_team) {
      return;
    }
    let promise = makeRequest('khl/clubs_compare/?left_team=' + this.props.left_team['team_id'] + '&right_team=' + this.props.right_team['team_id']);
    promise.then((data) => {this.setState({...this.state, clubs_compare: data})})
  }

  onChange = (event, value) => {
    if (value !== null) {
      this.setState({...this.state, tab: value})
    }
  }

  render = () => {
    return (
      <Stack
        direction='column'
      >
        <Box
          style={{
            width: '100%',
            height: '30vh'
          }}
        >
          { this.state.clubs_compare === null ? 
            "loading" : 
            <TeamsPreview 
              left_team={this.props.left_team}
              right_team={this.props.right_team}
            />
          }
        </Box>
        <Box
          style={{
            width: '100%',
            height: '10vh'
          }}
        >
          <ToggleButtonGroup
            value={this.state.tab}
            exclusive
            size='small'
            onChange={this.onChange}
          >
            <ToggleButton value="standings">Общая таблица</ToggleButton>
            <ToggleButton value="standings_home">Игра дома</ToggleButton>
            <ToggleButton value="standings_road">Игра на выезде</ToggleButton>

            <ToggleButton value="period_1">Игра в 1ом периоде</ToggleButton>
            <ToggleButton value="period_2">Игра в 2ом периоде</ToggleButton>
            <ToggleButton value="period_3">Игра в 3ем периоде</ToggleButton>

            <ToggleButton value="powerplay">Игра в неравных составах</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box
          style={{
            width: '100%',
            height: '60vh',
            overflow: 'auto'
          }}
        >
          {this.state.clubs_compare === null ? "loading" : 
          <CompareTable stats={this.state.clubs_compare[this.state.tab]}/>}
        </Box>
      </Stack>
    )
  }
}


export default connect(
  store => ({
      left_team : store.left_team,
      right_team : store.right_team,
  })
)(Comparator);