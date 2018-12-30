import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'koiki-ui';
import autoBind from 'react-autobind';
import moment from 'moment';
import ModalDatePicker from '../components/ModalDatePicker';

const styles = require('../css/itineraries.less');

const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
  // eslint-disable-next-line global-require
  input: require('../css/koiki-ui/input.less')
};

class Itineraries extends Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      name: '',
      openCalendar: false
    };
    autoBind(this);
  }

  onBlurAddButton() {
    this.setState({
      focused: false
    });
  }

  onClickAddButton() {
    this.setState({
      focused: true
    });
  }

  onChangeAddButton(e) {
    this.setState({
      name: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({
      openCalendar: true
    });
  }

  onSelectItineraryDate(start) {
    this.props.onAddItinerary({
      name: this.state.name,
      start: moment(start).format('YYYY-MM-DDT00:00:00')
    });
    this.setState({
      openCalendar: false
    });
  }

  closeCalendar() {
    this.setState({
      openCalendar: false
    });
  }

  render() {
    return (
      <div>
        <ul className={styles.list}>
          {this.props.itineraries.map(itinerary => (
            <li key={itinerary.id} className={styles.item}>
              <button
                className={styles.itinerary}
                onClick={() => this.props.onClickItinerary(itinerary)}
              >
                {itinerary.name}
              </button>
            </li>
          ))}
          <li className={styles.item}>
            {this.state.focused ? (
              <form className={styles.form} onSubmit={this.onSubmit}>
                <Input
                  focused
                  icon="fa-plus"
                  styles={ui}
                  value={this.state.name}
                  onBlur={this.onBlurAddButton}
                  onChange={this.onChangeAddButton}
                />
              </form>
            ) : (
              <button className={styles.add} onClick={this.onClickAddButton}>
                <i className={`${ui.fa.fa} ${ui.fa['fa-plus']}`} />
              </button>
            )}
          </li>
        </ul>
        <ModalDatePicker
          opened={this.state.openCalendar}
          onSelect={this.onSelectItineraryDate}
          onClose={this.closeCalendar}
        />
      </div>
    );
  }
}

Itineraries.propTypes = {
  itineraries: PropTypes.array,
  onAddItinerary: PropTypes.func.isRequired,
  onClickItinerary: PropTypes.func.isRequired
};

Itineraries.defaultProps = {
  itineraries: []
};

export default Itineraries;
