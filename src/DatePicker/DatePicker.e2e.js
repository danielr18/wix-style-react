import eyes from 'eyes.it';
import {datePickerTestkitFactory, getStoryUrl} from '../../testkit/protractor';
import autoExampleDriver from 'wix-storybook-utils/AutoExampleDriver';

describe('DatePicker', () => {
  const storyUrl = getStoryUrl('3. Inputs', '3.6 DatePicker');
  const {inputDriver, calendarDriver} = datePickerTestkitFactory({dataHook: 'storybook-datepicker'});

  beforeAll(() => {
    browser.get(storyUrl);
  });

  beforeEach(() => {
    autoExampleDriver.reset();
  });

  eyes.it('should not open calendar when disabled', () => {
    autoExampleDriver.setProps({disabled: true});
    inputDriver.click();

    expect(calendarDriver.exists()).toBe(false);
  });

  eyes.it('should not close calendar on selecting date with click when shouldCloseOnSelect prop set to false', () => {
    autoExampleDriver.setProps({shouldCloseOnSelect: false});
    inputDriver.click();

    calendarDriver.clickOnNthAvailableDay(10);

    expect(calendarDriver.exists()).toBe(true);
    expect(calendarDriver.isVisible()).toBe(true);
  });

  describe('default', () => {
    eyes.it('should show inputDriver', () => {
      expect(inputDriver.isVisible()).toBe(true);
    });

    eyes.it('should open calendar when click on inputDriver', () => {
      inputDriver.click();
      expect(calendarDriver.exists()).toBe(true);
      expect(calendarDriver.isVisible()).toBe(true);
    });

    eyes.it('should close calendar on selecting date with click', () => {
      inputDriver.click();
      calendarDriver.clickOnNthAvailableDay(1);
      expect(calendarDriver.exists()).toBe(false);
    });

    eyes.it('should close calendar on Escape key', () => {
      inputDriver.click();
      expect(calendarDriver.exists()).toBe(true);

      inputDriver.pressEscKey();
      expect(calendarDriver.exists()).toBe(false);
    });

    eyes.it('should close calendar on Tab key', () => {
      inputDriver.click();
      expect(calendarDriver.exists()).toBe(true);

      inputDriver.pressTabKey();
      expect(calendarDriver.exists()).toBe(false);
    });

    eyes.it('should not change date', () => {
      inputDriver.click();
      inputDriver.pressEnterKey();

      expect(inputDriver.getValue()).toBe('2017/05/01');
    });

    eyes.it('should select next day date', () => {
      inputDriver.click();
      inputDriver.pressArrowRightKey();
      inputDriver.pressEnterKey();

      expect(inputDriver.getValue()).toBe('2017/05/02');
    });
  });

  describe('with year and month dropdown', () => {
    eyes.it('should select 2027 year', () => {
      autoExampleDriver.setProps({showYearDropdown: true, showMonthDropdown: true});
      inputDriver.click();

      calendarDriver.openYearDropdownOptions();
      calendarDriver.clickOnNthYear();
      calendarDriver.clickOnNthAvailableDay();

      expect(inputDriver.getValue()).toBe('2027/05/01');
    });

    eyes.it('should select February', () => {
      autoExampleDriver.setProps({showYearDropdown: true, showMonthDropdown: true});
      inputDriver.click();

      calendarDriver.openMonthDropdownOptions();
      calendarDriver.clickOnNthMonth(2);
      calendarDriver.clickOnNthAvailableDay();

      expect(inputDriver.getValue()).toBe('2017/02/01');
    });

    eyes.it('should select February and 2026 year', () => {
      autoExampleDriver.setProps({showYearDropdown: true, showMonthDropdown: true});
      inputDriver.click();

      calendarDriver.openYearDropdownOptions();
      calendarDriver.clickOnNthYear(2);
      calendarDriver.openMonthDropdownOptions();
      calendarDriver.clickOnNthMonth(2);
      calendarDriver.clickOnNthAvailableDay();

      expect(inputDriver.getValue()).toBe('2026/02/01');
    });
  });
});
