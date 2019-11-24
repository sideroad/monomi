import React, { PropTypes, Component } from 'react';
import BigCalendar from 'react-big-calendar';
import times from 'lodash/times';
import moment from 'moment';
import Modal from 'react-modal';
import CloseButton from './CloseButton';
import { stringify } from '../helpers/time';

const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
const styles = require('../css/modal-calendar.less');

const planToEvents = (plans) => {
  const events = [];
  plans
    .map(plan => ({
      ...plan,
      title: `${plan.place.name} ( ${stringify(plan.sojourn)} )`,
      start: new Date(plan.start),
      end: plan.end
        ? new Date(plan.end)
        : new Date(plan.sojourn * 60000 + new Date(plan.start).getTime()),
      allDay: false
    }))
    .forEach((plan) => {
      const diff = moment(plan.end)
        .startOf('date')
        .diff(moment(plan.start).startOf('date'), 'days');
      times(diff + 1, (index) => {
        const date = moment(plan.start).add(index, 'days');
        events.push({
          ...plan,
          start: index === 0 ? plan.start : date.startOf('date').toDate(),
          end: index === diff ? plan.end : date.endOf('date').toDate()
        });
      });
    });
  return events;
};

class ModalCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: 'week-calendar'
    };
  }

  render() {
    return (
      <Modal
        isOpen={this.props.opened}
        contentLabel="Calendar"
        onRequestClose={this.props.onClose}
        className={`${styles.modal} ${this.state.className}`}
        overlayClassName={styles.overlay}
      >
        <CloseButton className={styles.close} onClick={this.props.onClose} />
        <BigCalendar
          localizer={localizer}
          getNow={() =>
            moment().isBetween(this.props.date, this.props.plans[this.props.plans.length - 1].start)
              ? new Date()
              : new Date(this.props.date)
          }
          events={planToEvents(this.props.plans)}
          startAccessor="start"
          endAccessor="end"
          step={10}
          timeslots={6}
          defaultView="week"
          views={['week', 'day', 'agenda']}
          formats={{
            eventTimeRangeFormat: ({ start, end }) =>
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
            timeGutterFormat: date => moment(date).format('HH:mm'),
            agendaTimeRangeFormat: ({ start, end }) =>
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
          }}
          onView={view =>
            this.setState({
              className: `${view}-calendar`
            })
          }
        />
      </Modal>
    );
  }
}

ModalCalendar.propTypes = {
  date: PropTypes.string.isRequired,
  plans: PropTypes.array,
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

ModalCalendar.defaultProps = {
  plans: []
};

export default ModalCalendar;
