import s from './Page.scss';
import React from 'react';
import WixComponent from '../BaseComponents/WixComponent';
import PageHeader from '../PageHeader';
import Content from './Content';
import Tail from './Tail';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SCROLL_TOP_THRESHOLD = 20;
const SHORT_SCROLL_TOP_THRESHOLD = 3;

/**
 * A page container which contains a header and scrollable content
 */
class Page extends WixComponent {

  static defaultProps = {
    gradientCoverTail: true
  }

  constructor() {
    super();

    this._setContainerScrollTopThreshold(false);
    this._handleScroll = this._handleScroll.bind(this);

    this.state = {
      headerHeight: 0,
      tailHeight: 0,
      minimized: false
    };
  }

  componentDidMount() {
    super.componentDidMount();
    this._getScrollContainer().addEventListener('scroll', this._handleScroll);
    this._calculateComponentsHeights();
  }

  componentDidUpdate() {
    // Do not trigger height calculation if the component is minimized
    if (!this.state.minimized) {
      this._calculateComponentsHeights();
    }
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this._getScrollContainer().removeEventListener('scroll', this._handleScroll);
  }

  _calculateComponentsHeights() {
    const {headerHeight, tailHeight} = this.state;
    const newHeaderHeight = this.pageHeaderRef ? this.pageHeaderRef.offsetHeight : headerHeight;
    const newTailHeight = this.pageHeaderTailRef ? this.pageHeaderTailRef.offsetHeight : tailHeight;

    if (headerHeight !== newHeaderHeight || tailHeight !== newTailHeight) {
      this.setState({
        headerHeight: newHeaderHeight,
        tailHeight: newTailHeight
      });
    }
  }

  _setContainerScrollTopThreshold(shortThreshold) {
    this.containerScrollTopThreshold = shortThreshold ? SHORT_SCROLL_TOP_THRESHOLD : SCROLL_TOP_THRESHOLD;
  }

  _getScrollContainer() {
    return this.scrollableContentRef;
  }

  _shouldBeMinimized(containerScrollTop) {
    return containerScrollTop > this.containerScrollTopThreshold;
  }

  _handleScroll() {
    const scrollContainer = this._getScrollContainer();
    const containerScrollTop = scrollContainer.scrollTop;
    const nextMinimized = this._shouldBeMinimized(containerScrollTop);
    const {minimized} = this.state;

    if (minimized !== nextMinimized) {
      this.setState({
        minimized: nextMinimized
      });
    }
  }

  _safeGetChildren(element) {
    if (!element || !element.props || !element.props.children) {
      return [];
    }

    return element.props.children;
  }

  _calculatePageDimensionsStyle() {
    const {maxWidth, sidePadding} = this.props;
    if (!maxWidth && !sidePadding && sidePadding !== 0) {
      return null;
    }

    const styles = {};
    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    if (sidePadding || sidePadding === 0) {
      styles.paddingLeft = `${sidePadding}px`;
      styles.paddingRight = `${sidePadding}px`;
    }

    return styles;
  }

  _pageHeaderContainerStyle() {
    // Fixes width issues when scroll bar is present in windows
    const scrollBarWidth =
      this.scrollableContentRef &&
      this.scrollableContentRef.offsetWidth - this.scrollableContentRef.clientWidth;
    if (scrollBarWidth) {
      return {width: `calc(100% - ${scrollBarWidth}px`};
    }
    return null;
  }

  render() {
    const {backgroundImageUrl, gradientClassName, children, gradientCoverTail} = this.props;
    const {headerHeight, tailHeight, minimized} = this.state;
    const hasBackgroundImage = !!backgroundImageUrl;
    const hasGradientClassName = !!gradientClassName && !backgroundImageUrl;
    const {
      PageHeader,
      PageContent,
      PageTail
    } = getChildrenObject(children);

    const contentFullScreen = PageContent && PageContent.props.fullScreen;
    const pageDimensionsStyle = this._calculatePageDimensionsStyle();
    this._setContainerScrollTopThreshold(PageTail && hasGradientClassName);
    const imageHeight = `${headerHeight + (PageTail ? -tailHeight : 39)}px`;
    const gradientHeight = gradientCoverTail ? `${headerHeight + (PageTail ? -SCROLL_TOP_THRESHOLD : 39)}px` : imageHeight;

    return (
      <div className={s.page}>
        <div
          style={this._pageHeaderContainerStyle()}
          className={classNames(s.pageHeaderContainer, {
            [s.minimized]: minimized,
            [s.withoutBottomPadding]: PageTail && minimized
          })}
          ref={r => this.pageHeaderRef = r}
          >
          {
            PageHeader &&
              <div className={s.pageHeader} style={pageDimensionsStyle}>
                {React.cloneElement(
                  PageHeader, {
                    minimized,
                    hasBackgroundImage
                  })}
              </div>
          }
          {
            PageTail &&
              <div
                data-hook="page-tail"
                className={classNames(s.tail, {[s.minimized]: minimized})}
                style={pageDimensionsStyle}
                ref={r => this.pageHeaderTailRef = r}
                >
                {React.cloneElement(PageTail, {minimized})}
              </div>
          }
        </div>
        <div
          className={s.scrollableContent}
          data-hook="page-scrollable-content"
          ref={r => this.scrollableContentRef = r}
          >
          <div className={s.contentPlaceholder} style={{height: `${headerHeight}px`}}/>
          {
            hasBackgroundImage &&
              <div
                className={s.imageBackgroundContainer}
                style={{height: imageHeight}}
                data-hook="page-background-image"
                >
                <div
                  className={s.imageBackground}
                  style={{backgroundImage: `url(${backgroundImageUrl})`}}
                  />
              </div>
          }
          {
            hasGradientClassName && !hasBackgroundImage &&
              <div
                data-hook="page-gradient-class-name"
                className={`${s.gradientBackground} ${gradientClassName}`}
                style={{height: gradientHeight}}
                />
          }
          <div className={s.contentContainer}>
            <div className={classNames(s.content, {[s.contentFullScreen]: contentFullScreen})} style={contentFullScreen ? null : pageDimensionsStyle}>
              {this._safeGetChildren(PageContent)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Page.displayName = 'Page';
Page.Header = PageHeader;
Page.Content = Content;
Page.Tail = Tail;

Page.propTypes = {
  /** Background image url of the header beackground */
  backgroundImageUrl: PropTypes.string,
  /** Sets the max width of the header and the content */
  maxWidth: PropTypes.number,
  /** Sets padding of the sides of the page */
  sidePadding: PropTypes.number,
  /** Header background color class name, allows to add a gradient to the header */
  gradientClassName: PropTypes.string,
  /** If false Gradient will not cover Page.Tail */
  gradientCoverTail: PropTypes.bool,
  children: PropTypes.arrayOf((children, key) => {
    const childrenObj = getChildrenObject(children);

    if (!childrenObj.PageHeader) {
      return new Error(`Page: Invalid Prop children, must contain Page.Header`);
    }

    if (!childrenObj.PageContent) {
      return new Error(`Page: Invalid Prop children, must contain Page.Content`);
    }

    if (
      children[key].type !== Page.Header &&
      children[key].type !== Page.Content &&
      children[key].type !== Page.Tail
    ) {
      return new Error(`Page: Invalid Prop children, unknown child ${children[key].type}`);
    }
  }).isRequired
};

function getChildrenObject(children) {
  return React.Children.toArray(children).reduce((acc, child) => {
    switch (child.type) {
      case Page.Header : {
        acc.PageHeader = child;
        break;
      }
      case Page.Content : {
        acc.PageContent = child;
        break;
      }
      case Page.Tail : {
        acc.PageTail = child;
        break;
      }
      default : {
        break;
      }
    }
    return acc;
  }, {});
}

export default Page;
