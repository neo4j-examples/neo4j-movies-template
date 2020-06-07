import React from 'react';

export default class Carousel extends React.Component {
  constructor() {
    super();

    this.state = {
      startIndex: 0,
      visibleCount: 0
    };

    this.onWidthChange = this.onWidthChange.bind(this);
  }

  componentDidMount() {
    if (matchMedia) {
      var mq = window.matchMedia('(max-width: 600px)');
      mq.addListener(this.onWidthChange);
      this.onWidthChange(mq);
    }
  }

  onWidthChange(mq) {
    if (mq.matches) {
      this.setState({visibleCount: 2});
    } else {
      this.setState({visibleCount: 5});
    }
  }

  render() {
    var {children} = this.props;
    var {startIndex, visibleCount} = this.state;

    return (
      <div className="nt-carousel" ref="root">
        <button
          className="buttonLink nt-carousel-right"
          onClick={this.onRightClick.bind(this)}><span className="nt-carousel-arrow">&#10097;</span></button>
        <button
          className="buttonLink nt-carousel-left"
          onClick={this.onLeftClick.bind(this)}><span className="nt-carousel-arrow">&#10096;</span></button>
        <ul className="nt-carousel-list" ref="list">
          {
            React.Children.map(children, (c, i) => {
              var style = {
                width: (100 / visibleCount).toFixed(0) + '%',
                display: (i >= startIndex && i - startIndex < visibleCount) ? 'inline-block' : 'none'
              };

              return (
                <li key={i} className="nt-carousel-item" style={style}>
                  {c}
                </li>);
            })
          }
        </ul>
      </div>
    );
  }

  onRightClick(e) {
    e.preventDefault();
    var {startIndex, visibleCount} = this.state;

    if(startIndex + visibleCount < React.Children.count(this.props.children)) {
      this.setState({startIndex: startIndex + 1});
    }
  }

  onLeftClick(e) {
    e.preventDefault();
    var {startIndex} = this.state;

    if (startIndex > 0) {
      this.setState({startIndex: startIndex - 1});
    }
  }
}

Carousel.displayName = 'Carousel';
