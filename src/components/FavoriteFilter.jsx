import React from 'react';
import PropTypes from 'prop-types';

const styles = require('../css/favorite-filter.less');
const ui = {
  // eslint-disable-next-line global-require
  fa: require('../css/koiki-ui/fa/less/font-awesome.less'),
};

const FavoriteFilter = props =>
  <div className={styles.filter} >
    <button
      className={`${styles.favorite} ${props.filtered ? styles.filtered : ''}`}
      onClick={props.onClickFilter}
    >
      <i className={`${ui.fa.fa} ${ui.fa[props.filtered ? 'fa-heart' : 'fa-heart-o']}`} />
    </button>
  </div>;

FavoriteFilter.propTypes = {
  filtered: PropTypes.bool.isRequired,
  onClickFilter: PropTypes.func.isRequired,
};

export default FavoriteFilter;
