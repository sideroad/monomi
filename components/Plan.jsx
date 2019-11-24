import React from 'react';
import PropTypes from 'prop-types';
import { stringify } from '../helpers/time';

const styles = require('../css/plan.less');

const Plan = props => (
  <button
    className={styles.wrapper}
    style={{
      backgroundImage: `url(${props.plan.place.image})`
    }}
    onClick={props.onClick}
  >
    <div className={styles.overlay} />
    <div className={styles.content}>
      {props.plan.place.name} ({stringify(props.plan.sojourn)} )
    </div>
  </button>
);
Plan.propTypes = {
  plan: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Plan;
