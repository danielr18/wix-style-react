import ReactTestUtils from 'react-dom/test-utils';
import inputDriverFactory from '../Input/Input.driver';
import dropdownLayoutDriverFactory from '../DropdownLayout/DropdownLayout.driver';

const datePickerDriverFactory = ({element, wrapper}) => {
  const inputRoot = element && element.children[0].querySelector('.root');
  const inputDriver = inputDriverFactory({element: inputRoot, wrapper});
  const getCalendar = () => element.querySelector('.DayPicker');
  const getNthDay = n => element.querySelectorAll('[role="gridcell"]:not([class*="outside"])')[n];
  const getSelectedDay = () => element.querySelector('[role="gridcell"][aria-selected=true]');
  const getYearDropdown = () => element.querySelector('[data-hook="datepicker-year-dropdown-button"]');
  const getMonthDropdownButton = () => element.querySelector('[data-hook="datepicker-month-dropdown-button"]');
  const getNthYear = n => element.querySelector(`[data-hook="dropdown-item-${n}"]`);
  const getMonthCaption = () => element.querySelector('[data-hook="datepicker-month-caption"]');
  const getYearCaption = () => element.querySelector('[data-hook="datepicker-year-caption"]');
  const getMonthAndYear = () => [getMonthCaption(), getYearCaption()];
  const getNthWeekDayName = n => element.querySelectorAll('[class="DayPicker-Weekday"] abbr')[n];
  const getPrevMonthButton = () => element.querySelector('[data-hook="datepicker-left-arrow"]');
  const getNextMonthButton = () => element.querySelector('[data-hook="datepicker-right-arrow"]');

  const driver = {
    exists: () => !!element
  };

  const calendarDriver = {
    isVisible: () => !!getCalendar(),
    getCurrentMonthWithYear: () => getMonthAndYear() ? getMonthAndYear().map(element => element.textContent).join(' ') : '',
    getNthWeekDayName: (n = 0) => getNthWeekDayName(n) ? getNthWeekDayName(n).textContent : '',
    clickOnNthDay: (n = 0) => ReactTestUtils.Simulate.click(getNthDay(n)),
    clickOnSelectedDay: () => ReactTestUtils.Simulate.click(getSelectedDay()),
    clickOnYearDropdown: () => ReactTestUtils.Simulate.click(getYearDropdown()),
    clickOnNthYear: (n = 1) => ReactTestUtils.Simulate.mouseDown(getNthYear(n)),
    clickOnPrevMonthButton: () => ReactTestUtils.Simulate.click(getPrevMonthButton()),
    clickOnNextMonthButton: () => ReactTestUtils.Simulate.click(getNextMonthButton()),
    open: () => inputDriver.focus(),
    close: () => inputDriver.trigger('keyDown', {key: 'Escape', keyCode: 27}),
    isHeaderVisible: () => !!wrapper.querySelector('[data-hook="datepicker-head"]'),
    isYearDropdownExists: () => !!wrapper.querySelector('[data-hook="datepicker-year-dropdown"]'),
    isYearCaptionExists: () => !!getYearCaption(),
    isMonthDropdownExists: () => !!wrapper.querySelector('[data-hook="datepicker-month-dropdown"]'),
    isMonthCaptionExists: () => !!getMonthCaption(),
    getMonthCaption: () => getMonthCaption().textContent,
    getMonthDropdownLabel: () => getMonthDropdownButton().textContent,
    getSelectedYear: () => getYearDropdown().textContent,
    getFocusedDay: () => element.querySelector('.DayPicker-Day--keyboard-selected').textContent,
    pressLeftArrow: () => inputDriver.trigger('keyDown', {key: 'ArrowLeft', keyCode: 37}),
    pressRightArrow: () => inputDriver.trigger('keyDown', {key: 'ArrowRight', keyCode: 39}),
    getSelectedDay: () => getSelectedDay().textContent,

    getMonthDropdownDriver: () => {
      ReactTestUtils.Simulate.click(element.querySelector('[data-hook="datepicker-month-dropdown-button"]'));

      return dropdownLayoutDriverFactory({
        element: wrapper.querySelector('[data-hook="datepicker-month-dropdown-menu"]'),
        wrapper
      });
    },

    mouseClickOutside: () => document.body.dispatchEvent(new Event('click', {cancelable: true}))
  };

  return {
    driver,
    inputDriver,
    calendarDriver
  };
};

export default datePickerDriverFactory;
