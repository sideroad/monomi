import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { padding } from '../helpers/time';

const styles = require('../css/time-control.less');

class TimeControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hours: props.hours,
      minutes: props.minutes,
      changing: false,
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

  onClick() {
    this.setState({
      changing: true,
    });
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
        this.props.onSubmit(this.state);
        this.setState({
          changing: false
        });
        break;
      default:
    }
  }

  handleClickOutside(evt, formDOM) {
    if (formDOM && !formDOM.contains(evt.target)) {
      this.props.onSubmit(this.state);
      this.setState({
        changing: false
      });
    }
  }

  render() {
    return (
      <div>
        {
          this.state.changing ?
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
                max={23}
              /> :
              <input
                className={styles.min}
                type="number"
                value={this.state.minutes}
                onChange={this.onChangeMinutes}
                onKeyDown={this.onKeyDown}
                step={5}
                min={0}
                max={59}
              />
            </form>
          :
            <button
              className={styles.time}
              onClick={this.onClick}
            >
              {padding(this.props.hours)}:{padding(this.props.minutes)}
            </button>
        }
      </div>
    );
  }
}

TimeControl.propTypes = {
  hours: PropTypes.number.isRequired,
  minutes: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default TimeControl;
