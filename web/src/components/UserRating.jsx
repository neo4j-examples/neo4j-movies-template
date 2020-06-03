import React from 'react';
import PropTypes from 'prop-types';

const minRating = 1;
const maxRating = 5;

export default class UserRating extends React.Component {
  render() {
    var stars = [];
    var {movieId, savedRating} = this.props;

    for (let i = minRating; i <= maxRating; i++) {
      stars.push(this.renderStar(!savedRating || i > savedRating, movieId, i));
    }

    return (
      <span className="nt-user-rating">
        {stars}
        {
          savedRating ?
            <button
               onClick={this.onDeleteRatingClick.bind(this, movieId)}
               className="buttonLink nt-user-rating-delete">
              Unrate
            </button>
            :
            null
        }
      </span>
    );
  }

  renderStar(isEmpty, movieId, rating) {
    return (
      <button key={rating}
         className="buttonLink nt-user-rating-star"
         onClick={this.onRateClick.bind(this, movieId, rating)}>
        {isEmpty ? '\u2606' : '\u2605'}
      </button>);
  }

  onRateClick(movieId, rating, e) {
    e.preventDefault();
    this.props.onSubmitRating(movieId, rating);
  }

  onDeleteRatingClick(movieId, e) {
    e.preventDefault();
    this.props.onDeleteRating(movieId);
  }
}

UserRating.propTypes = {
  movieId: PropTypes.number.isRequired,
  savedRating: PropTypes.number,
  onSubmitRating: PropTypes.func.isRequired,
  onDeleteRating: PropTypes.func.isRequired
};

UserRating.displayName = 'UserRating';

