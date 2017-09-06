import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = require('../css/place.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

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
      <div
        ref={(elem) => { this.dom = elem; }}
        className={`${styles.place} ${this.state.animating ? styles.animate : ''}`}
      >
        <a
          className={styles.left}
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
        </a>
        <div className={styles.right}>
          <a
            className={styles.title}
            href={this.props.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className={styles.name}>
              {this.props.name}
            </span>
          </a>
          <div
            className={styles.control}
          >
            <button
              className={styles.favorite}
              onClick={this.props.onClickFavorite}
            >
              <i className={`${ui.fa.fa} ${ui.fa[this.props.favorite ? 'fa-heart' : 'fa-heart-o']}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Place.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  onClickFavorite: PropTypes.func.isRequired,
  favorite: PropTypes.bool.isRequired,
};

export default Place;
