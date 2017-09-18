import React from 'react';
import PropTypes from 'prop-types';
import PrevNextButton from '../components/PrevNextButton';

const styles = require('../css/side-bar.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

const SideBar = props =>
  <div
    className={styles.sideBar}
  >
    {
      props.closeClickedOutSide ?
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          className={`${styles.overlay} ${props.opened ? styles.open : styles.close}`}
          onClick={props.onClickClose}
        />
      : ''
    }
    <button
      className={`${styles.opener} ${props.opened ? styles.open : styles.close}`}
      onClick={props.onClickOpen}
    >
      <i className={`${ui.fa.fa} ${ui.fa[props.icon]}`} />
    </button>
    <PrevNextButton
      className={styles.closeButton}
      opened={props.opened}
      onClick={props.onClickClose}
    />
    <div
      className={`${styles.container} ${props.opened ? styles.open : styles.close}`}
    >
      {props.opened ? props.children : ''}
    </div>
  </div>;

SideBar.propTypes = {
  icon: PropTypes.string.isRequired,
  children: PropTypes.element,
  closeClickedOutSide: PropTypes.bool,
  onClickOpen: PropTypes.func.isRequired,
  onClickClose: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
};

SideBar.defaultProps = {
  closeClickedOutSide: true,
  children: () => {}
};

export default SideBar;
