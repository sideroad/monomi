import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import autoBind from 'react-autobind';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { stringify } from '../helpers/time';
import DurationControl from '../components/DurationControl';
import TimeControl from '../components/TimeControl';
import ModalCalendar from '../components/ModalCalendar';

const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less')
};

const styles = require('../css/itinerary.less');

const DragHandle = SortableHandle(({ plan }) => (
  <div
    className={styles.image}
    style={{
      backgroundImage: `url(${plan.place.image})`
    }}
  />
));

const SortableItem = SortableElement(
  ({
    plan,
    onClickPlace,
    onClickRemove,
    onClickCommunication,
    onChangeSojourn,
    start,
    onChangeItineraryTime
  }) => (
    <li key={plan.id} className={styles.item}>
      <div className={styles.place}>
        <div className={styles.time}>
          <div className={styles.start}>
            {moment(plan.start).isSame(moment(start)) ? (
              <TimeControl
                hours={moment(start).hours()}
                minutes={moment(start).minutes()}
                onSubmit={onChangeItineraryTime}
              />
            ) : (
              moment(plan.start).format('HH:mm')
            )}
          </div>
          <div className={styles.end}>{plan.end ? moment(plan.end).format('HH:mm') : ''}</div>
        </div>
        <DragHandle plan={plan} />
        <div className={styles.right}>
          <button className={styles.name} onClick={() => onClickPlace(plan.place)}>
            {plan.place.name}
          </button>
          <div className={styles.control}>
            <DurationControl min={plan.sojourn} onSubmit={min => onChangeSojourn(plan, min)} />
            <button className={styles.remove} onClick={() => onClickRemove(plan.id)}>
              <i className={`${ui.fa.fa} ${ui.fa['fa-trash']}`} />
            </button>
          </div>
        </div>
      </div>
      {plan.transit ? (
        <div className={styles.transit}>
          <button
            className={`${styles.mode} ${
              plan.communication.id === 'walking' ? styles.activate : ''
            }`}
            onClick={() => onClickCommunication(plan.id, 'walking')}
          >
            <i
              className={`${ui.fa.fa} ${ui.fa['fa-male']} ${
                plan.communication.id === 'walking' ? styles.activate : ''
              }`}
            />
          </button>
          <button
            className={`${styles.mode} ${
              plan.communication.id === 'driving' ? styles.activate : ''
            }`}
            onClick={() => onClickCommunication(plan.id, 'driving')}
          >
            <i className={`${ui.fa.fa} ${ui.fa['fa-car']}`} />
          </button>
          <button
            className={`${styles.mode} ${
              plan.communication.id === 'transit' ? styles.activate : ''
            }`}
            onClick={() => onClickCommunication(plan.id, 'transit')}
          >
            <i
              className={`${ui.fa.fa} ${ui.fa['fa-subway']} ${
                plan.communication.id === 'transit' ? styles.activate : ''
              }`}
            />
          </button>
          <a
            className={styles.link}
            href={plan.direction.page}
            target="_blank"
            rel="noopener noreferrer"
          >
            {stringify(plan.transit)}
          </a>
          <div className={styles.dashed} />
        </div>
      ) : (
        ''
      )}
    </li>
  )
);

const SortableList = SortableContainer(
  ({
    plans,
    onClickPlace,
    onClickRemove,
    onClickCommunication,
    onChangeSojourn,
    start,
    onChangeItineraryTime
  }) => (
    <ul className={styles.list}>
      {(plans || []).map((plan, index) => (
        <SortableItem
          key={`plan-${index}-${plan.id}`}
          index={index}
          plan={plan}
          start={start}
          onClickRemove={onClickRemove}
          onClickPlace={onClickPlace}
          onClickCommunication={onClickCommunication}
          onChangeSojourn={onChangeSojourn}
          onChangeItineraryTime={onChangeItineraryTime}
        />
      ))}
    </ul>
  )
);

class Itinerary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: props.plans,
      openCalendar: false
    };
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.state.plans, nextProps.plans)) {
      this.setState({
        plans: nextProps.plans
      });
    }
  }

  onClickCalendar() {
    this.setState({
      openCalendar: true
    });
  }

  onSelectItineraryDate(start) {
    const current = moment(this.props.start);
    this.props.onChangeItineraryDate(
      moment(start)
        .hours(current.hours())
        .minutes(current.minutes())
        .seconds(current.seconds())
        .milliseconds(current.milliseconds())
        .format()
    );
    this.setState({
      openCalendar: false
    });
  }

  onChangeItineraryTime({ hours, minutes }) {
    const current = moment(this.props.start);
    this.props.onChangeItineraryDate(
      current
        .hours(hours)
        .minutes(minutes)
        .format()
    );
    this.setState({
      openCalendar: false
    });
  }

  onChangeSojourn(plan, min) {
    const plans = this.state.plans.slice(0).map(item => ({
      ...item,
      sojourn: plan.id === item.id ? min : item.sojourn,
      changingSojourn: false
    }));
    this.setState({
      plans
    });
    this.props.onReplace(this.props.id, plans.filter(item => item.id === plan.id));
  }

  onSortEnd({ oldIndex, newIndex }) {
    const plans = arrayMove(this.state.plans, oldIndex, newIndex).map((plan, index) => ({
      ...plan,
      order: index
    }));
    this.props.onReplace(this.props.id, plans);
    this.setState({
      plans
    });
  }

  openCalendar() {
    this.setState({
      openCalendar: true
    });
  }

  closeCalendar() {
    this.setState({
      openCalendar: false
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.itinerary}>
          {this.props.name}
          <button className={styles.calendar} onClick={this.openCalendar}>
            <i className={`${ui.fa.fa} ${ui.fa['fa-calendar']}`} />
          </button>
        </div>
        <SortableList
          plans={this.state.plans}
          start={this.props.start}
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          lockToContainerEdges
          lockOffset={['0%', '100%']}
          helperClass={styles.dragging}
          pressDelay={200}
          useDragHandle
          onClickRemove={this.props.onClickRemove}
          onClickPlace={this.props.onClickPlace}
          onClickCommunication={this.props.onClickCommunication}
          onChangeSojourn={this.onChangeSojourn}
          onChangeItineraryTime={this.onChangeItineraryTime}
        />
        <ModalCalendar
          date={moment(this.props.start).format('YYYY-MM-DD')}
          opened={this.state.openCalendar}
          onSelect={this.onSelectItineraryDate}
          onClose={this.closeCalendar}
        />
      </div>
    );
  }
}

Itinerary.propTypes = {
  id: PropTypes.string.isRequired,
  start: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  plans: PropTypes.array.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onClickPlace: PropTypes.func.isRequired,
  onClickCommunication: PropTypes.func.isRequired,
  onChangeItineraryDate: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired
};

export default Itinerary;
