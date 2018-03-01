import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {isClassExists} from '../../test/utils';
import labelDriverFactory from '../Label/Label.driver';
import {testkitFactoryCreator} from '../test-common';

const labelTestkitFactory = testkitFactoryCreator(labelDriverFactory);

const checkboxDriverFactory = ({element, wrapper, component}) => {
  const checkbox = element.querySelector('input');
  const labelDriver = () => labelTestkitFactory({wrapper: element, dataHook: 'checkbox-label'});

  return {
    exists: () => !!element,
    click: () => ReactTestUtils.Simulate.change(checkbox),
    isChecked: () => isClassExists(element, 'checked'),
    isDisabled: () => isClassExists(element, 'disabled'),
    isIndeterminate: () => element.querySelectorAll('.indeterminate').length === 1,
    hasError: () => isClassExists(element, 'hasError'),
    getLabel: () => labelDriver().getLabelText(),
    getLabelDriver: () => labelDriver(),
    setProps: props => {
      const ClonedWithProps = React.cloneElement(component, Object.assign({}, component.props, props), ...(component.props.children || []));
      ReactDOM.render(<div ref={r => element = r}>{ClonedWithProps}</div>, wrapper);
    }
  };
};

export default checkboxDriverFactory;
