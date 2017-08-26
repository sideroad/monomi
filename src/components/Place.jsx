import React from 'react';
import PropTypes from 'prop-types';

const styles = require('../css/place.less');

const Place = props =>
  <a
    className={styles.place}
    href={props.link}
    rel="noopener noreferrer"
    target="_blank"
  >
    <div
      className={styles.image}
      style={{
        backgroundImage: `url(${props.image})`
      }}
    />
    <div
      className={styles.name}
    >
      {props.name}
    </div>
  </a>;

Place.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Place;
