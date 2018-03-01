import ReactTestUtils from 'react-dom/test-utils';

const toggleSwitchDriverFactory = ({element}) => {

  const toggleSwitch = element.querySelector('input');

  return {
    exists: () => !!element,
    click: () => ReactTestUtils.Simulate.change(toggleSwitch),
    isChecked: () => toggleSwitch.checked,
    isDisabled: () => toggleSwitch.disabled
  };
};

export default toggleSwitchDriverFactory;
