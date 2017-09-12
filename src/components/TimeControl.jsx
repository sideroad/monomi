import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { objectize, parse } from '../helpers/time';

const styles = require('../css/time-control.less');

class TimeControl extends Component {
  constructor(props) {
    super(props);
    const { hours, minutes } = objectize(props.min);
    this.state = {
      hours,
      minutes,
    };
    autoBind(this);
  }

  componentDidMount() {
    this.wrappedHandleClickOutside = evt =>
      this.handleClickOutside(evt, this.formDOM);
    document.addEventListener('click', this.wrappedHandleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.wrappedHandleClickOutside, true);
  }

  onChangeHours(e) {
    this.setState({
      hours: Number(e.target.value)
    });
  }

  onChangeMinutes(e) {
    this.setState({
      minutes: Number(e.target.value)
    });
  }

  onKeyDown(evt) {
    switch (evt.key) {
      case 'Enter':
        this.props.onSubmit(parse(this.state));
        break;
      default:
    }
  }

  handleClickOutside(evt, formDOM) {
    if (!formDOM || !formDOM.contains(evt.target)) {
      this.props.onSubmit(parse(this.state));
    }
  }

  render() {
    return (
      <form
        ref={(elem) => { this.formDOM = elem; }}
        className={styles.control}
        onSubmit={this.props.onSubmit}
      >
        <input
          className={styles.hrs}
          type="number"
          value={this.state.hours}
          onChange={this.onChangeHours}
          onKeyDown={this.onKeyDown}
          min={0}
          max={24}
        /> hrs
        <input
          className={styles.min}
          type="number"
          value={this.state.minutes}
          onChange={this.onChangeMinutes}
          onKeyDown={this.onKeyDown}
          step={5}
          min={0}
          max={55}
        /> min
      </form>
    );
  }
}

TimeControl.propTypes = {
  min: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default TimeControl;
