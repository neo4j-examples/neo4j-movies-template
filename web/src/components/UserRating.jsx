import React, {PropTypes} from 'react';

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
            <a href="#"
               onClick={this.onDeleteRatingClick.bind(this, movieId)}
               className="nt-user-rating-delete">
              Unrate
            </a>
            :
            null
        }
      </span>
    );
  }

  renderStar(isEmpty, movieId, rating) {
    return (
      <a key={rating}
         className="nt-user-rating-star"
         href="#"
         onClick={this.onRateClick.bind(this, movieId, rating)}>
        {isEmpty ? '\u2606' : '\u2605'}
      </a>);
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

