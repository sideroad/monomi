import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = require('../css/place.less');

class Place extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animating: true
    };
  }

  componentDidMount() {
    this.dom.addEventListener('webkitAnimationEnd', () => {
      this.setState({
        animating: false
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      this.setState({
        animating: true
      });
    }
  }

  render() {
    return (
      <a
        ref={(elem) => { this.dom = elem; }}
        className={`${styles.place} ${this.state.animating ? styles.animate : ''}`}
        href={this.props.link}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${this.props.image})`
          }}
        />
        <div
          className={styles.name}
        >
          {this.props.name}
        </div>
      </a>
    );
  }
}

Place.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default Place;
