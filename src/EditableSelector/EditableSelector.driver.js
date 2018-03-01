import React from 'react';
import ReactDOM from 'react-dom';
import selectorDriverFactory from '../Selector/Selector.driver';
import editableRowDriverFactory from './EditableRow/EditableRow.driver';
import ReactTestUtils from 'react-dom/test-utils';

const editableSelectorDriverFactory = ({element, wrapper, component}) => {
  const newRowButton = () => element.querySelector('[data-hook="new-row-button-text"]');
  const selectorRowDriver = index => selectorDriverFactory({element: element.querySelectorAll('[data-hook="editable-selector-item"]')[index], wrapper: element});
  const editButtonAt = index => element.querySelectorAll('[data-hook="edit-item"]')[index];
  const deleteButtonAt = index => element.querySelectorAll('[data-hook="delete-item"]').item(index);
  const editableRowDriver = () => editableRowDriverFactory({element: element.querySelector('[data-hook="edit-row-wrapper"]'), wrapper: element});

  return {
    items: () => {
      return [...element.querySelectorAll('[data-hook="editable-selector-item"]')].map(selector => selectorDriverFactory({element: selector}));
    },
    exists: () => !!element,
    isEditing: () => !!element.querySelectorAll('[data-hook="edit-row-wrapper"]').length,
    newRowButton,
    deleteButtonAt,
    editButtonAt,
    addNewRow: label => {
      ReactTestUtils.Simulate.click(newRowButton());
      editableRowDriver().setText(label);
    },
    editRow: (index, label) => {
      ReactTestUtils.Simulate.click(editButtonAt(index));
      editableRowDriver().setText(label);
    },
    deleteRow: index => {
      ReactTestUtils.Simulate.click(deleteButtonAt(index));
    },
    clickApprove: () => editableRowDriver().clickApprove(),
    clickCancel: () => editableRowDriver().clickCancel(),
    title: () => element.querySelector('[data-hook="editable-selector-title"] > span').textContent,
    toggleItem: index => selectorRowDriver(index).toggle(),
    setProps: props => {
      const ClonedWithProps = React.cloneElement(component, Object.assign({}, component.props, props), ...(component.props.children || []));
      ReactDOM.render(<div ref={r => element = r}>{ClonedWithProps}</div>, wrapper);
    }
  };
};

export default editableSelectorDriverFactory;

