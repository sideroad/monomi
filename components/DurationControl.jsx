import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { objectize, parse, stringify } from '../helpers/time';

const styles = require('../css/duration-control.less');

const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

class DurationControl extends Component {
  constructor(props) {
    super(props);
    const { hours, minutes } = objectize(props.min);
    this.state = {
      hours,
      minutes,
      changing: false,
    };
    autoBind(this);
  }

  componentDidMount() {
    this.wrappedHandleClickOutside = evt => this.handleClickOutside(evt, this.formDOM);
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
      hours: Number(e.target.value),
    });
  }

  onChangeMinutes(e) {
    this.setState({
      minutes: Number(e.target.value),
    });
  }

  onKeyDown(evt) {
    switch (evt.key) {
      case 'Enter':
        this.props.onSubmit(parse(this.state));
        this.setState({
          changing: false,
        });
        break;
      default:
    }
  }

  handleClickOutside(evt, formDOM) {
    if (formDOM && !formDOM.contains(evt.target)) {
      this.props.onSubmit(parse(this.state));
      this.setState({
        changing: false,
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.changing ? (
          <form
            ref={(elem) => {
              this.formDOM = elem;
            }}
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
            />{' '}
            hrs
            <input
              className={styles.min}
              type="number"
              value={this.state.minutes}
              onChange={this.onChangeMinutes}
              onKeyDown={this.onKeyDown}
              step={5}
              min={0}
              max={55}
            />{' '}
            min
          </form>
        ) : (
          <button className={styles.duration} onClick={this.onClick}>
            <i className={`${ui.fa.fa} ${ui.fa['fa-clock-o']}`} />
            {stringify(this.props.min)}
          </button>
        )}
      </div>
    );
  }
}

export default DurationControl;
