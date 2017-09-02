import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { Chips } from 'koiki-ui';

const styles = require('../css/find-place.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
  // eslint-disable-next-line global-require
  chips: require('../css/koiki-ui/chips.less'),
  // eslint-disable-next-line global-require
  input: require('../css/koiki-ui/input.less'),
  // eslint-disable-next-line global-require
  iconButton: require('../css/koiki-ui/icon-button.less'),
};

class FindPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
    autoBind(this);
  }

  onFocus() {
    this.setState({ focused: true });
    this.props.onFocus();
  }

  onBlur() {
    this.setState({ focused: false });
    this.props.onBlur();
  }

  onChange(evt) {
    this.props.onChange(evt.target.value);
  }

  onSelect(item) {
    this.chips.input.inputDOM.blur();
    this.props.onSelect(item);
  }

  onClickCurrentPlace() {
    this.props.onClickCurrentPlace();
    this.chips.input.inputDOM.blur();
  }

  render() {
    return (
      <div className={`${styles.chips} ${this.state.focused ? styles.focused : ''}`}>
        <Chips
          ref={(elem) => { this.chips = elem; }}
          styles={ui}
          suggests={this.props.suggests}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onSelect={this.onSelect}
        />
        <button
          className={`${styles.current} ${this.props.trace || !this.state.focused ? styles.hide : ''}`}
          onClick={this.onClickCurrentPlace}
        >
          <i className={`${ui.fa.fa} ${ui.fa['fa-crosshairs']}`} />
        </button>
      </div>
    );
  }
}

FindPlace.propTypes = {
  suggests: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onClickCurrentPlace: PropTypes.func.isRequired,
  trace: PropTypes.bool.isRequired,
};

export default FindPlace;
