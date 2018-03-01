import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {testkitFactoryCreator} from '../test-common';
import {isClassExists} from '../../test/utils';
import textDriverFactory from '../Text/Text.driver';

const textTestkitFactory = testkitFactoryCreator(textDriverFactory);

const selectorDriverFactory = ({element, wrapper, component}) => {
  const toggleInput = () => element.querySelector('[data-hook="toggle"] > input');
  const image = () => element.querySelector('[data-hook="selector-image"]');
  const titleTextDriver = () => textTestkitFactory({wrapper: element, dataHook: 'selector-title'});
  const subtitleTextDriver = () => textTestkitFactory({wrapper: element, dataHook: 'selector-subtitle'});
  const extraNode = () => element.querySelector('[data-hook="selector-extra-node"]');

  return {
    exists: () => !!element,
    isImageTiny: () => isClassExists(image(), 'tiny'),
    isImageSmall: () => isClassExists(image(), 'small'),
    isImagePortrait: () => isClassExists(image(), 'portrait'),
    isImageLarge: () => isClassExists(image(), 'large'),
    isImageCinema: () => isClassExists(image(), 'cinema'),
    isImageCircle: () => isClassExists(image(), 'circle'),
    isImageRectangular: () => isClassExists(image(), 'rectangular'),
    toggleType: () => toggleInput().getAttribute('type'),
    isChecked: () => !!toggleInput().checked,
    hasImage: () => !!image(),
    getImage: () => image().childNodes[0],
    titleTextDriver,
    subtitleTextDriver,
    hasExtraNode: () => !!extraNode(),
    getExtraNode: () => extraNode().childNodes[0],
    toggle: () => ReactTestUtils.Simulate.click(element),
    setProps: props => {
      const ClonedWithProps = React.cloneElement(component, Object.assign({}, component.props, props), ...(component.props.children || []));
      ReactDOM.render(<div ref={r => element = r}>{ClonedWithProps}</div>, wrapper);
    }
  };
};

export default selectorDriverFactory;

