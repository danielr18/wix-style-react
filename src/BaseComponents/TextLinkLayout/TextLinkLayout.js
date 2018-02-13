import React from 'react';
import PropTypes from 'prop-types';
import typography from '../../Typography';
import WixComponent from '../../BaseComponents/WixComponent';

export const ThemeOptions = {
  NORMAL: {type: 'normal', color: {hover: '#4eb7f5', normal: '#3899ec'}},
  DARK_BACKGROUND: {type: 'darkBackground', color: {hover: '#f0f4f7', normal: '#f0f4f7'}},
  GREYSCALE: {type: 'greyScale', color: {hover: '#162d3d', normal: '#162d3d'}}
};

export default class TextLinkLayout extends WixComponent {

  static propTypes = {
    children: PropTypes.node,
    underlineStyle: PropTypes.oneOf(['always', 'hover', 'never']),
    theme: PropTypes.oneOf(['normal', 'darkBackground', 'greyScale']),
    size: PropTypes.oneOf(['small', 'medium']),
    display: PropTypes.oneOf(['block', 'inline-block'])
  };

  static defaultProps = {
    underlineStyle: 'hover',
    theme: ThemeOptions.NORMAL.type,
    size: 'medium',
    display: 'block'
  };

  constructor(props) {
    super(props);
    this.state = {
      isHover: false
    };

    this.toggleHover = this.toggleHover.bind(this);
  }

  toggleHover() {
    this.setState({
      isHover: !this.state.isHover
    });
  }

  getColor() {
    const {theme} = this.props;
    const {isHover} = this.state;
    switch (theme) {
      case ThemeOptions.DARK_BACKGROUND.type:
        return ThemeOptions.DARK_BACKGROUND.color.normal;
      case ThemeOptions.GREYSCALE.type:
        return ThemeOptions.GREYSCALE.color.normal;
      default: {
        const {color} = ThemeOptions.NORMAL;
        return isHover ? color.hover : color.normal;
      }
    }
  }


  render() {
    const {isHover} = this.state;
    const {underlineStyle, size, children, display} = this.props;
    const color = this.getColor();

    const style = {
      color,
      display,
      background: 'none',
      cursor: 'pointer',
      textDecoration: ((underlineStyle === 'hover' && isHover) || underlineStyle === 'always') ? 'underline' : 'none'
    };

    const className = size === 'medium' ? typography.t1_3 : typography.t3_3;

    return (
      <div
        role="link"
        className={className}
        style={style}
        onMouseLeave={this.toggleHover}
        onMouseEnter={this.toggleHover}
      >
        {children}
      </div>
    );
  }
}
