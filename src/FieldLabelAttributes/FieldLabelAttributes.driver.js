import tooltipDriverFactory from '../../src/Tooltip/Tooltip.driver';

const fieldLabelAttributesDriverFactory = ({element, wrapper}) => {
  return {
    exists: () => !!element,
    getTooltipTestKit: () => tooltipDriverFactory({wrapper, element: element.querySelector('[data-hook="info"]')}),
    hasRequired: () => !!element.querySelectorAll('[data-hook="required"]').length,
    hasInfo: () => !!element.querySelectorAll('[data-hook="info"]').length
  };
};

export default fieldLabelAttributesDriverFactory;
