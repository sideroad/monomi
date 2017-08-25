import React, { PropTypes } from 'react';

const styles = require('../css/close-button.less');

const CloseButton = props =>
  <button
    className={`${styles.button} ${props.opened ? styles.open : styles.close} ${props.className}`}
    onClick={(evt) => {
      evt.preventDefault();
      props.onClick();
    }}
  >
    <div className={styles.left} />
    <div className={styles.right} />
  </button>;

CloseButton.propTypes = {
  className: PropTypes.string,
  opened: PropTypes.bool,
  onClick: PropTypes.func,
};

CloseButton.defaultProps = {
  opened: true,
  className: '',
  onClick: () => {},
};

export default CloseButton;
