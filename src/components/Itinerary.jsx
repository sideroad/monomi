import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import autoBind from 'react-autobind';
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { stringify } from '../helpers/time';
import TimeControl from '../components/TimeControl';

const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

const styles = require('../css/itinerary.less');


const DragHandle = SortableHandle(({ plan }) =>
  <div
    className={styles.image}
    style={{
      backgroundImage: `url(${plan.place.image})`
    }}
  />
);

const SortableItem = SortableElement(({
  plan,
  onClickPlace,
  onClickRemove,
  onClickCommunication,
  onClickSojourn,
  onChangeSojourn,
}) =>
  <li key={plan.id} className={styles.item}>
    <div className={styles.place} >
      <div className={styles.time}>
        <div className={styles.start}>{moment(plan.start).format('HH:mm')}</div>
        <div className={styles.end}>{plan.end ? moment(plan.end).format('HH:mm') : ''}</div>
      </div>
      <DragHandle plan={plan} />
      <div className={styles.right}>
        <button
          className={styles.name}
          onClick={() => onClickPlace(plan.place)}
        >
          {plan.place.name}
        </button>
        <div className={styles.control}>
          {
            plan.changingSojourn ?
              <TimeControl
                min={plan.sojourn}
                onSubmit={min => onChangeSojourn(plan, min)}
              />
            :
              <button
                className={styles.sojourn}
                onClick={() => onClickSojourn(plan)}
              >
                <i className={`${ui.fa.fa} ${ui.fa['fa-clock-o']}`} />
                {stringify(plan.sojourn)}
              </button>
          }
          <button
            className={styles.remove}
            onClick={() => onClickRemove(plan.id)}
          >
            <i className={`${ui.fa.fa} ${ui.fa['fa-trash']}`} />
          </button>
        </div>
      </div>
    </div>
    {
      plan.transit ?
        <div className={styles.transit} >
          <button className={`${styles.mode} ${plan.communication.id === 'walking' ? styles.activate : ''}`} onClick={() => onClickCommunication(plan.id, 'walking')}>
            <i className={`${ui.fa.fa} ${ui.fa['fa-male']} ${plan.communication.id === 'walking' ? styles.activate : ''}`} />
          </button>
          <button className={`${styles.mode} ${plan.communication.id === 'driving' ? styles.activate : ''}`} onClick={() => onClickCommunication(plan.id, 'driving')}>
            <i className={`${ui.fa.fa} ${ui.fa['fa-car']}`} />
          </button>
          <button className={`${styles.mode} ${plan.communication.id === 'transit' ? styles.activate : ''}`} onClick={() => onClickCommunication(plan.id, 'transit')}>
            <i className={`${ui.fa.fa} ${ui.fa['fa-subway']} ${plan.communication.id === 'transit' ? styles.activate : ''}`} />
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
      : ''
    }
  </li>
);

const SortableList = SortableContainer(({
  plans,
  onClickPlace,
  onClickRemove,
  onClickCommunication,
  onClickSojourn,
  onChangeSojourn,
}) =>
  <ul className={styles.list}>
    {plans.map((plan, index) => (
      <SortableItem
        key={`plan-${index}-${plan.id}`}
        index={index}
        plan={plan}
        onClickRemove={onClickRemove}
        onClickPlace={onClickPlace}
        onClickCommunication={onClickCommunication}
        onClickSojourn={onClickSojourn}
        onChangeSojourn={onChangeSojourn}
      />
    ))}
  </ul>);

class Itinerary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plans: props.plans,
    };
    autoBind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      plans: nextProps.plans
    });
  }

  onClickSojourn(plan) {
    const plans = this.state.plans.slice(0).map(item => ({
      ...item,
      changingSojourn: plan.id === item.id
    }));
    this.setState({
      plans
    });
  }

  onChangeSojourn(plan, min) {
    const plans = this.state.plans.slice(0).map(item => ({
      ...item,
      sojourn: plan.id === item.id ? min : item.sojourn
    }));
    this.setState({
      plans,
      changingSojourn: false,
    });
    this.props.onReplace(
      this.props.id,
      plans.filter(item => item.id === plan.id)
    );
  }

  onSortEnd({ oldIndex, newIndex }) {
    const plans = arrayMove(this.state.plans, oldIndex, newIndex);
    const oldOrder = this.state.plans[oldIndex].order;
    const newOrder = this.state.plans[newIndex].order;
    this.props.onReplace(
      this.props.id,
      [{
        ...this.state.plans[oldIndex],
        order: newOrder,
      }, {
        ...this.state.plans[newIndex],
        order: oldOrder,
      }]
    );
    this.setState({
      plans
    });
  }

  render() {
    return (
      <div
        className={styles.container}
      >
        <div className={styles.itinerary}>
          {this.props.name}
        </div>
        <SortableList
          plans={this.state.plans}
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          lockToContainerEdges
          lockOffset={['0%', '100%']}
          helperClass={styles.dragging}
          pressDelay={200}
          useDragHandle
          useWindowAsScrollContainer
          onClickRemove={this.props.onClickRemove}
          onClickPlace={this.props.onClickPlace}
          onClickCommunication={this.props.onClickCommunication}
          onClickSojourn={this.onClickSojourn}
          onChangeSojourn={this.onChangeSojourn}
        />
      </div>
    );
  }
}

Itinerary.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  plans: PropTypes.array.isRequired,
  onClickRemove: PropTypes.func.isRequired,
  onClickPlace: PropTypes.func.isRequired,
  onClickCommunication: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
};

export default Itinerary;
