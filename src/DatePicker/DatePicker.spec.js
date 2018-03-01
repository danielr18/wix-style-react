import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {mount} from 'enzyme';
import {createDriverFactory} from '../test-common';
import applyPolyfills from './Polyfills';
import {datePickerTestkitFactory} from '../../testkit/index';
import {datePickerTestkitFactory as enzymeDatePickerTestkitFactory} from '../../testkit/enzyme';
import datePickerDriverFactory from './DatePicker.driver';
import Input from '../Input';
import DatePicker from './DatePicker';
import isSameDay from 'date-fns/is_same_day';
import '../utils/RangePolyfill.js';

describe('DatePicker', () => {
  const createDriver = createDriverFactory(datePickerDriverFactory);
  let onChange;

  applyPolyfills(window, global);

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('date picker input', () => {
    it('should exist', () => {
      const {inputDriver} = createDriver(<DatePicker onChange={onChange}/>);

      expect(inputDriver.exists()).toBe(true);
    });

    it('should set inputDataHook from props', () => {
      const {inputDriver} = createDriver(<DatePicker onChange={onChange} inputDataHook={'inputDataHook'}/>);

      expect(inputDriver.getDataHook()).toBe('inputDataHook');
    });

    it('should set datePicker disabled from props', () => {
      const {inputDriver} = createDriver(<DatePicker onChange={onChange} disabled/>);

      expect(inputDriver.isDisabled()).toBeTruthy();
    });

    it('should not open calendar when disabled', () => {
      const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange} disabled/>);

      inputDriver.trigger('click');
      expect(calendarDriver.isVisible()).toBe(false);
    });

    it('should show correct value from props', () => {
      const date = new Date(2017, 9, 2);
      const {inputDriver} = createDriver(<DatePicker onChange={onChange} value={date}/>);

      expect(inputDriver.getValue()).toBe('10/02/2017');
    });

    it('should show correct value from props depends on date format', () => {
      const date = new Date(2017, 9, 2);
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange} value={date}
        dateFormat={'DD/MM/YYYY'}
        />);

      expect(inputDriver.getValue()).toBe('02/10/2017');
    });

    it('should set placeholder from placeholderText property', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        placeholderText={'Datepicker test placeholder'}
        />);

      expect(inputDriver.getPlaceholder()).toBe('Datepicker test placeholder');
    });

    it('should set placeholder from placeholder property for customInput', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        customInput={<Input placeholder={'Input test placeholder'}/>}
        />);

      expect(inputDriver.getPlaceholder()).toBe('Input test placeholder');
    });

    it('should set placeholder from placeholder property for customInput even if placeholderText property was specified', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        customInput={<Input placeholder={'customInputPlaceholder'}/>}
        placeholderText={'textPlaceholder'}
        />);

      expect(inputDriver.getPlaceholder()).toBe('customInputPlaceholder');
    });

    it('should be readonly', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        readOnly
        />);

      expect(inputDriver.getReadOnly()).toBeTruthy();
    });

    it('should not be readonly', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        />);

      expect(inputDriver.getReadOnly()).toBeFalsy();
    });

    it('has prefix by default', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        />);

      expect(inputDriver.hasPrefix()).toBe(true);
    });

    it('has custom prefix', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        prefix={<span>#</span>}
        />);

      expect(inputDriver.hasPrefix()).toBe(true);
    });
  });

  describe('calendar', () => {
    it('should not show calendar on start', () => {
      const {calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

      expect(calendarDriver.isVisible()).toBe(false);
    });

    it('should not call onChange when trying to select an already selected date with enter', () => {
      const value = new Date(2017, 5, 2);
      const {inputDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);

      inputDriver.trigger('click');
      inputDriver.trigger('keyDown', {keyCode: 13});

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when trying to select an already selected date with click', () => {
      const value = new Date();
      const {calendarDriver, inputDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);

      inputDriver.trigger('click');
      calendarDriver.clickOnSelectedDay();

      expect(onChange).not.toHaveBeenCalled();
    });

    describe('should be opened', () => {
      it('on click on datePickerInput', () => {
        const {calendarDriver, inputDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        expect(calendarDriver.isVisible()).toBe(true);
      });

      it('on focus', () => {
        const value = new Date(2017, 5, 2);
        const {inputDriver, calendarDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);
        inputDriver.focus();
        expect(calendarDriver.isVisible()).toBe(true);
      });
    });

    describe('should be closed', () => {
      it('on select date with Enter key', () => {
        const value = new Date(2017, 5, 2);
        const {inputDriver, calendarDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);

        inputDriver.trigger('click');
        inputDriver.trigger('keyDown', {key: 'ArrowRight', keyCode: 39});
        inputDriver.trigger('keyDown', {key: 'Enter', keyCode: 13});

        expect(calendarDriver.isVisible()).toBe(false);
      });

      it('on select date with click', () => {
        const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        calendarDriver.clickOnNthDay();

        setTimeout(() => expect(calendarDriver.isVisible()).toBe(false), 0);
      });

      it('on press "Escape" key', () => {
        const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        inputDriver.trigger('keyDown', {key: 'Escape', keyCode: 27});

        expect(calendarDriver.isVisible()).toBe(false);
      });

      it('on press "Tab" key', () => {
        const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        inputDriver.trigger('keyDown', {key: 'Tab', keyCode: 9});

        expect(calendarDriver.isVisible()).toBe(false);
      });

      it('on outside click', () => {
        const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        calendarDriver.mouseClickOutside();

        expect(calendarDriver.isVisible()).toBe(false);
      });
    });

    it('should not close calendar on select when "shouldCloseOnSelect" property is false', () => {
      const {inputDriver, calendarDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          shouldCloseOnSelect={false}
          />
      );

      inputDriver.trigger('click');
      calendarDriver.clickOnNthDay();

      expect(calendarDriver.isVisible()).toBe(true);
    });

    it('should call onChange when click on available day', () => {
      const value = new Date(2017, 7, 1);
      const expectedValue = new Date(2017, 7, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          value={value}
          onChange={onChange}
          />
      );
      inputDriver.trigger('click');
      calendarDriver.clickOnNthDay(1);

      const newValue = onChange.mock.calls[0][0];

      expect(onChange).toHaveBeenCalled();
      expect(isSameDay(newValue, expectedValue)).toBe(true);
    });

    it('should not give an ability to select past dates if it is specified in props', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          value={date}
          excludePastDates
          />
      );

      inputDriver.trigger('click');
      calendarDriver.clickOnNthDay();

      expect(onChange).not.toHaveBeenCalled();
      expect(calendarDriver.isVisible()).toBe(true);
    });

    describe('navbar arrow navigation', () => {
      it('should select previous month on previous month button click - LTR mode', () => {
        const date = new Date(2015, 9, 2);
        const {calendarDriver, inputDriver} = createDriver(
          <DatePicker
            onChange={onChange}
            value={date}
            />
        );

        inputDriver.trigger('click');
        calendarDriver.clickOnPrevMonthButton();
        calendarDriver.clickOnNthDay();

        const newDate = onChange.mock.calls[0][0];
        expect(newDate.getMonth()).toEqual(8);
        expect(newDate.getDate()).toEqual(1);
      });

      it('should select next month on next month button click - LTR mode', () => {
        const date = new Date(2015, 9, 2);
        const {calendarDriver, inputDriver} = createDriver(
          <DatePicker
            onChange={onChange}
            value={date}
            />
        );

        inputDriver.trigger('click');
        calendarDriver.clickOnNextMonthButton();
        calendarDriver.clickOnNthDay();

        const newDate = onChange.mock.calls[0][0];

        expect(newDate.getMonth()).toEqual(10);
        expect(newDate.getDate()).toEqual(1);
      });

      it('should select previous month on previous month button click - RTL mode', () => {
        const date = new Date(2015, 9, 2);
        const {calendarDriver, inputDriver} = createDriver(
          <DatePicker
            onChange={onChange}
            value={date}
            rtl
            />
        );

        inputDriver.trigger('click');
        calendarDriver.clickOnPrevMonthButton();
        calendarDriver.clickOnNthDay();

        const newDate = onChange.mock.calls[0][0];
        expect(newDate.getMonth()).toEqual(8);
        expect(newDate.getDate()).toEqual(1);
      });

      it('should select next month on next month button click - RTL mode', () => {
        const date = new Date(2015, 9, 2);
        const {calendarDriver, inputDriver} = createDriver(
          <DatePicker
            onChange={onChange}
            value={date}
            rtl
            />
        );

        inputDriver.trigger('click');
        calendarDriver.clickOnNextMonthButton();
        calendarDriver.clickOnNthDay();

        const newDate = onChange.mock.calls[0][0];
        expect(newDate.getMonth()).toEqual(10);
        expect(newDate.getDate()).toEqual(1);
      });
    });

    describe('locale', () => {
      const setup = ({showMonthDropdown = false} = {}) => {
        const date = new Date(2015, 9, 2);
        const {calendarDriver, inputDriver, driver} = createDriver(
          <DatePicker
            onChange={onChange}
            locale="fr"
            value={date}
            showMonthDropdown={showMonthDropdown}
            />
        );

        inputDriver.trigger('click');

        return {
          calendarDriver,
          driver,
          inputDriver
        };
      };

      it('should display translated month in caption', () => {
        const {calendarDriver} = setup();
        expect(calendarDriver.getMonthCaption()).toEqual('octobre');
      });

      it('should display translated month in dropdown label', () => {
        const {calendarDriver} = setup({
          showMonthDropdown: true
        });
        expect(calendarDriver.getMonthDropdownLabel()).toEqual('octobre');
      });

      it('should display translated months in dropdown options', () => {
        const {calendarDriver} = setup({
          showMonthDropdown: true
        });
        expect(calendarDriver.getMonthDropdownDriver().optionContentAt(0)).toEqual('janvier');
      });

      it('should display translated weekdays', () => {
        const {calendarDriver} = setup();
        expect(calendarDriver.getNthWeekDayName(0)).toEqual('lu');
      });
    });

    it('should show date in provided format instead of locale format', () => {
      const date = new Date(2017, 9, 2);
      const {inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          locale="fr"
          dateFormat="YYYY/MM/DD"
          value={date}
          />
      );

      expect(inputDriver.getValue()).toBe('2017/10/02');
    });

    it('should show header', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker onChange={onChange} value={date}/>
      );

      inputDriver.trigger('click');
      expect(calendarDriver.isHeaderVisible()).toEqual(true);
      expect(calendarDriver.isYearCaptionExists()).toEqual(true);
      expect(calendarDriver.isMonthCaptionExists()).toEqual(true);
    });

    it('should show year dropdown', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          showYearDropdown
          value={date}
          />
      );


      inputDriver.trigger('click');
      expect(calendarDriver.isYearDropdownExists()).toEqual(true);
      expect(calendarDriver.isYearCaptionExists()).toEqual(false);
    });

    it('should show month dropdown', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          showMonthDropdown
          value={date}
          />
      );


      inputDriver.trigger('click');
      expect(calendarDriver.isMonthDropdownExists()).toEqual(true);
      expect(calendarDriver.isMonthCaptionExists()).toEqual(false);
    });

    describe('with year dropdown', () => {
      it('should give a possibility to choose date from another year', () => {
        const date = new Date(2015, 9, 2);
        const {calendarDriver, inputDriver} = createDriver(
          <DatePicker
            onChange={onChange}
            showYearDropdown
            value={date}
            />
        );

        inputDriver.trigger('click');
        calendarDriver.clickOnYearDropdown();
        calendarDriver.clickOnNthYear();
        expect(calendarDriver.getSelectedYear()).not.toEqual(date.getFullYear());
      });
    });

    describe('When trigger open and close', () => {
      it('should open calendar using ref', () => {
        const {calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        calendarDriver.open();

        expect(calendarDriver.isVisible()).toBe(true);
      });

      it('should close calendar using ref', () => {
        const {calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        calendarDriver.open();
        expect(calendarDriver.isVisible()).toBe(true);

        calendarDriver.close();
        expect(calendarDriver.isVisible()).toBe(false);
      });
    });

    describe('keyboard navigation', () => {
      it('should navigate days correctly with keyboard - LTR mode', () => {
        const date = new Date(2018, 1, 5);
        const {calendarDriver} = createDriver(<DatePicker onChange={onChange} value={date}/>);

        calendarDriver.open();

        expect(calendarDriver.getFocusedDay()).toEqual('5');

        calendarDriver.pressLeftArrow();

        expect(calendarDriver.getFocusedDay()).toEqual('4');

        calendarDriver.pressRightArrow();
        calendarDriver.pressRightArrow();

        expect(calendarDriver.getFocusedDay()).toEqual('6');
      });

      it('should navigate days correctly with keyboard - RTL mode', () => {
        const date = new Date(2018, 1, 5);
        const {calendarDriver} = createDriver(<DatePicker onChange={onChange} rtl value={date}/>);

        calendarDriver.open();

        expect(calendarDriver.getFocusedDay()).toEqual('5');

        calendarDriver.pressLeftArrow();

        expect(calendarDriver.getFocusedDay()).toEqual('6');

        calendarDriver.pressRightArrow();
        calendarDriver.pressRightArrow();

        expect(calendarDriver.getFocusedDay()).toEqual('4');
      });

      it('should not update input value while navigating the calendar', () => {
        const date = new Date(2018, 1, 5);
        const {calendarDriver, inputDriver} = createDriver(<DatePicker onChange={onChange} value={date}/>);

        calendarDriver.open();

        expect(inputDriver.getValue()).toEqual('02/05/2018');

        calendarDriver.pressLeftArrow();

        expect(inputDriver.getValue()).toEqual('02/05/2018');
      });

      it('should keep selected day unchanged when navigating with keyboard', () => {
        const date = new Date(2018, 1, 5);
        const {calendarDriver} = createDriver(<DatePicker onChange={onChange} value={date}/>);

        calendarDriver.open();

        expect(calendarDriver.getSelectedDay()).toEqual('5');
        expect(calendarDriver.getFocusedDay()).toEqual('5');

        calendarDriver.pressLeftArrow();

        expect(calendarDriver.getSelectedDay()).toEqual('5');
        expect(calendarDriver.getFocusedDay()).toEqual('4');
      });
    });
  });

  describe('testkit', () => {
    it('should exist', () => {
      const div = document.createElement('div');
      const dataHook = 'dataHook';
      const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(
        <div>
          <DatePicker
            onChange={() => {
            }}
            dataHook={dataHook}
            />
        </div>
      ));
      const {driver, calendarDriver, inputDriver} = datePickerTestkitFactory({wrapper, dataHook});

      expect(driver.exists()).toBe(true);
      expect(inputDriver.exists()).toBe(true);
      expect(calendarDriver.isVisible()).toBe(false);
    });
  });

  describe('enzyme testkit', () => {
    it('should exist', () => {
      const dataHook = 'dataHook';
      const wrapper = mount(<DatePicker
        onChange={() => {
        }}
        dataHook={dataHook}
        />);
      const {driver, calendarDriver, inputDriver} = enzymeDatePickerTestkitFactory({wrapper, dataHook});

      expect(driver.exists()).toBe(true);
      expect(inputDriver.exists()).toBe(true);
      expect(calendarDriver.isVisible()).toBe(false);
    });
  });
});
