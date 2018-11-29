import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import autoBind from 'react-autobind';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { stringify } from '../helpers/time';
import DurationControl from '../components/DurationControl';
import TimeControl from '../components/TimeControl';
import Plan from '../components/Plan';
import ModalDatePicker from '../components/ModalDatePicker';
import ModalCalendar from '../components/ModalCalendar';

const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less')
};

const styles = require('../css/itinerary.less');

const DragHandle = SortableHandle(({ plan, locked }) => (
  <div
    className={styles.image}
    style={{
      backgroundImage: `url(${plan.place.image})`,
      cursor: locked ? 'auto' : '-webkit-grab'
    }}
  />
));

const SortableItem = SortableElement(
  ({
    plan,
    locked,
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
          <div className={`${styles.start} ${locked ? styles.locked : ''}`}>
            {moment(plan.start).isSame(moment(start)) && !locked ? (
              <TimeControl
                hours={moment(start).hours()}
                minutes={moment(start).minutes()}
                onSubmit={onChangeItineraryTime}
              />
            ) : (
              moment(plan.start).format('HH:mm')
            )}
          </div>
          <div className={`${styles.end} ${locked ? styles.locked : ''}`}>
            {plan.end ? moment(plan.end).format('HH:mm') : ''}
          </div>
        </div>
        {locked ? (
          <Plan plan={plan} onClick={() => onClickPlace(plan.place)} />
        ) : (
          <DragHandle plan={plan} locked={locked} />
        )}
        {!locked ? (
          <div className={styles.right}>
            <button className={styles.name} onClick={() => onClickPlace(plan.place)}>
              {plan.place.name}
            </button>
            <div className={styles.control}>
              {!locked ? (
                <DurationControl
                  disabled={locked}
                  min={plan.sojourn}
                  onSubmit={min => onChangeSojourn(plan, min)}
                />
              ) : null}
              {!locked ? (
                <button className={styles.remove} onClick={() => onClickRemove(plan.id)}>
                  <i className={`${ui.fa.fa} ${ui.fa['fa-trash']}`} />
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {plan.transit ? (
        <div className={styles.transit}>
          {!locked || plan.communication.id === 'walking' ? (
            <button
              className={`${styles.mode} ${
                plan.communication.id === 'walking' ? styles.activate : ''
              }`}
              disabled={locked}
              onClick={() => onClickCommunication(plan, 'walking')}
            >
              <i
                className={`${ui.fa.fa} ${ui.fa['fa-male']} ${
                  plan.communication.id === 'walking' ? styles.activate : ''
                }`}
              />
            </button>
          ) : null}
          {!locked || plan.communication.id === 'driving' ? (
            <button
              className={`${styles.mode} ${
                plan.communication.id === 'driving' ? styles.activate : ''
              }`}
              disabled={locked}
              onClick={() => onClickCommunication(plan, 'driving')}
            >
              <i className={`${ui.fa.fa} ${ui.fa['fa-car']}`} />
            </button>
          ) : null}
          {!locked || plan.communication.id === 'transit' ? (
            <button
              className={`${styles.mode} ${
                plan.communication.id === 'transit' ? styles.activate : ''
              }`}
              disabled={locked}
              onClick={() => onClickCommunication(plan, 'transit')}
            >
              <i
                className={`${ui.fa.fa} ${ui.fa['fa-subway']} ${
                  plan.communication.id === 'transit' ? styles.activate : ''
                }`}
              />
            </button>
          ) : null}
          <a className={styles.link} href={plan.page} target="_blank" rel="noopener noreferrer">
            {stringify(plan.transit)}
          </a>
          <div className={styles.dashed} />
        </div>
      ) : (
        <div className={styles.transit}>&nbsp;</div>
      )}
    </li>
  )
);

const SortableList = SortableContainer(
  ({
    name,
    plans,
    locked,
    onClickLock,
    onClickPlace,
    onClickRemove,
    onClickCommunication,
    onChangeSojourn,
    start,
    onChangeItineraryTime,
    openDatePicker,
    openCalendar
  }) => (
    <ul className={styles.list}>
      <li className={styles.itinerary}>
        <div className={styles.title}>{name}</div>
        <div className={styles.buttons}>
          <button className={styles.icon} onClick={onClickLock}>
            <i className={`${ui.fa.fa} ${ui.fa[locked ? 'fa-lock' : 'fa-unlock']}`} />
          </button>
          {locked ? (
            <button className={styles.icon} onClick={openCalendar}>
              <i className={`${ui.fa.fa} ${ui.fa['fa-columns']}`} />
            </button>
          ) : (
            <button className={styles.icon} onClick={openDatePicker}>
              <i className={`${ui.fa.fa} ${ui.fa['fa-calendar']}`} />
            </button>
          )}
        </div>
      </li>
      {(plans || []).map((plan, index) => (
        <SortableItem
          key={`plan-${index}-${plan.id}`}
          index={index}
          plan={plan}
          start={start}
          locked={locked}
          disabled={locked}
          onClickRemove={onClickRemove}
          onClickPlace={onClickPlace}
          onClickCommunication={onClickCommunication}
          onChangeSojourn={onChangeSojourn}
          onChangeItineraryTime={onChangeItineraryTime}
        />
      ))}
      <li className={styles.item} />
    </ul>
  )
);

class Itinerary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: props.plans,
      openDatePicker: false,
      openCalendar: false
    };
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.state.plans, nextProps.plans)) {
      this.setState({
        plans: nextProps.plans
      });
    }
  }

  onClickCalendar() {
    this.setState({
      openDatePicker: true
    });
  }

  onClickRemove(id) {
    this.props.onRemove(id);
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
      openDatePicker: false
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
      openDatePicker: false
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
    this.props.onChangePlan({
      ...plan,
      sojourn: min
    });
  }

  onClickCommunication(plan, communication) {
    const plans = this.state.plans.slice(0).map(item => ({
      ...item,
      communication: plan.id === item.id ? communication : item.communication
    }));
    this.setState({
      plans
    });
    this.props.onChangePlan({
      ...plan,
      communication
    });
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

  openDatePicker() {
    this.setState({
      openDatePicker: true
    });
  }

  closeDatePicker() {
    this.setState({
      openDatePicker: false
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
        <SortableList
          name={this.props.name}
          plans={this.state.plans}
          start={this.props.start}
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          lockOffset={['0%', '100%']}
          helperClass={styles.dragging}
          pressDelay={200}
          useDragHandle
          locked={this.props.locked}
          onClickLock={this.props.onClickLock}
          openDatePicker={this.openDatePicker}
          openCalendar={this.openCalendar}
          onClickRemove={this.onClickRemove}
          onClickPlace={this.props.onClickPlace}
          onClickCommunication={this.onClickCommunication}
          onChangeSojourn={this.onChangeSojourn}
          onChangeItineraryTime={this.onChangeItineraryTime}
        />
        <ModalDatePicker
          date={moment(this.props.start).format('YYYY-MM-DD')}
          opened={this.state.openDatePicker}
          onSelect={this.onSelectItineraryDate}
          onClose={this.closeDatePicker}
        />
        <ModalCalendar
          date={this.props.start}
          plans={this.state.plans}
          opened={this.state.openCalendar}
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
  locked: PropTypes.bool.isRequired,
  onClickLock: PropTypes.func.isRequired,
  onClickPlace: PropTypes.func.isRequired,
  onChangeItineraryDate: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChangePlan: PropTypes.func.isRequired
};

export default Itinerary;
