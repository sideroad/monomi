import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PrevNextButton from '../components/PrevNextButton';

const styles = require('../css/side-bar.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false
    };
  }

  render() {
    return (
      <div
        className={styles.sideBar}
      >
        {
          this.props.closeClickedOutSide ?
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              className={`${styles.overlay} ${this.state.opened ? styles.open : styles.close}`}
              onClick={() => {
                this.setState({
                  opened: !this.state.opened
                });
              }}
            />
          : ''
        }
        <button
          className={`${styles.opener} ${this.state.opened ? styles.open : styles.close}`}
          onClick={(evt) => {
            evt.preventDefault();
            this.setState({
              opened: true
            });
          }}
        >
          <i className={`${ui.fa.fa} ${ui.fa[this.props.icon]}`} />
        </button>
        <PrevNextButton
          className={styles.closeButton}
          opened={this.state.opened}
          onClick={() => {
            this.setState({
              opened: false
            });
          }}
        />
        <div
          className={`${styles.container} ${this.state.opened ? styles.open : styles.close}`}
        >
          {this.state.opened ? this.props.children : ''}
        </div>
      </div>
    );
  }
}

SideBar.propTypes = {
  icon: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  closeClickedOutSide: PropTypes.bool
};

SideBar.defaultProps = {
  closeClickedOutSide: true
};

export default SideBar;
