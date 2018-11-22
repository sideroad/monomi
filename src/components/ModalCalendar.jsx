import React, { PropTypes } from 'react';
import Modal from 'react-modal';

const styles = require('../css/modal-calendar.less');

const ModalCalendar = props => (
  <Modal
    isOpen={props.opened}
    contentLabel="EventDate"
    onRequestClose={props.onClose}
    className={styles.modal}
    overlayClassName={styles.overlay}
  >
    <div />
  </Modal>
);

ModalCalendar.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

ModalCalendar.defaultProps = {};

export default ModalCalendar;
