import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

const styles = require('../css/itinerary.less');

const Itinerary = props =>
  <div
    className={styles.container}
  >
    <div className={styles.itinerary}>
      {props.name}
    </div>
    <ul className={styles.list}>
      {
        props.plans.map(plan =>
          <li key={plan.id} className={styles.item}>
            <div className={styles.place} >
              <div className={styles.time}>
                <div className={styles.start}>{moment(plan.start).format('HH:mm')}</div>
                <div className={styles.end}>{plan.end ? moment(plan.end).format('HH:mm') : ''}</div>
              </div>
              <div
                className={styles.image}
                style={{
                  backgroundImage: `url(${plan.place.image})`
                }}
              />
              <div className={styles.right}>
                <button
                  className={styles.name}
                  onClick={() => props.onClickPlace(plan.place)}
                >
                  {plan.place.name}
                </button>
                <div className={styles.control}>
                  <div className={styles.sojourn}>
                    ({plan.sojourn}m)
                  </div>
                  <button
                    className={styles.remove}
                    onClick={() => props.onClickRemove(plan.id)}
                  >
                    <i className={`${ui.fa.fa} ${ui.fa['fa-trash']}`} />
                  </button>
                </div>
              </div>
            </div>
            {
              plan.transit ?
                <div className={styles.transit} >
                  <button className={`${styles.mode} ${plan.communication.id === 'walking' ? styles.activate : ''}`} onClick={() => props.onClickCommunication(plan.id, 'walking')}>
                    <i className={`${ui.fa.fa} ${ui.fa['fa-male']} ${plan.communication.id === 'walking' ? styles.activate : ''}`} />
                  </button>
                  <button className={`${styles.mode} ${plan.communication.id === 'driving' ? styles.activate : ''}`} onClick={() => props.onClickCommunication(plan.id, 'driving')}>
                    <i className={`${ui.fa.fa} ${ui.fa['fa-car']}`} />
                  </button>
                  <button className={`${styles.mode} ${plan.communication.id === 'transit' ? styles.activate : ''}`} onClick={() => props.onClickCommunication(plan.id, 'transit')}>
                    <i className={`${ui.fa.fa} ${ui.fa['fa-subway']} ${plan.communication.id === 'transit' ? styles.activate : ''}`} />
                  </button>
                  <a
                    className={styles.link}
                    href={plan.direction.page}
                    target="_blank"
                    rel="noopener noreferrer"
                  >{
                    plan.transit
                  }m
                  </a>
                </div>
              : ''
            }
          </li>
        )
      }
    </ul>
  </div>;

Itinerary.propTypes = {
  name: PropTypes.string.isRequired,
  plans: PropTypes.array.isRequired,
  //eslint-disable-next-line react/no-unused-prop-types
  onClickRemove: PropTypes.func.isRequired,
  //eslint-disable-next-line react/no-unused-prop-types
  onClickPlace: PropTypes.func.isRequired,
  //eslint-disable-next-line react/no-unused-prop-types
  onClickCommunication: PropTypes.func.isRequired,
};

export default Itinerary;
