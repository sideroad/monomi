import React, { PropTypes } from 'react';
import { Calendar } from 'koiki-ui';
import Modal from 'react-modal';

const styles = require('../css/modal-date-picker.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
  // eslint-disable-next-line global-require
  calendar: require('../css/koiki-ui/calendar.less')
};

const ModalDatePicker = props => (
  <Modal
    isOpen={props.opened}
    contentLabel="EventDate"
    onRequestClose={props.onClose}
    className={styles.modal}
    overlayClassName={styles.overlay}
  >
    <Calendar selected={props.date ? [props.date] : []} onSelect={props.onSelect} styles={ui} />
  </Modal>
);

ModalDatePicker.propTypes = {
  date: PropTypes.string,
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func
};

ModalDatePicker.defaultProps = {
  date: undefined,
  onSelect: () => {}
};

export default ModalDatePicker;
