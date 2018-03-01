const datePickerDriverFactory = component => {
  const getInput = () => component.$('input');
  const getCalendar = () => component.$('.DayPicker');
  const getNthAvailableDay = n => component.$$('[role="gridcell"]:not([class*="outside"])').get(n);
  const getYearDropdown = () => component.$('[data-hook="datepicker-year-dropdown-button"]');
  const getNthYear = n => component.$(`[data-hook="datepicker-year-dropdown"] [data-hook="dropdown-item-${n}"]`);
  const getMonthsDropdown = () => component.$('[data-hook="datepicker-month-dropdown-button"]');
  const getNthMonth = n => component.$(`[data-hook="datepicker-month-dropdown-menu"] [data-hook="dropdown-item-${n === 0 ? n : n - 1}"]`);

  return {
    inputDriver: {
      exists: () => getInput().isPresent(),
      isVisible: () => getInput().isDisplayed(),
      getValue: () => getInput().getAttribute('value'),
      click: () => getInput().click(),
      pressEnterKey: () => getInput().sendKeys(protractor.Key.ENTER),
      pressEscKey: () => getInput().sendKeys(protractor.Key.ESCAPE),
      pressTabKey: () => getInput().sendKeys(protractor.Key.TAB),
      pressArrowRightKey: () => getInput().sendKeys(protractor.Key.ARROW_RIGHT)
    },
    calendarDriver: {
      getElement: () => getCalendar(),
      exists: () => getCalendar().isPresent(),
      isVisible: () => getCalendar().isDisplayed(),
      clickOnNthAvailableDay: (n = 0) => getNthAvailableDay(n).click(),
      openYearDropdownOptions: () => getYearDropdown().click(),
      clickOnNthYear: (n = 1) => getNthYear(n).click(),
      openMonthDropdownOptions: () => getMonthsDropdown().click(),
      clickOnNthMonth: (n = 0) => getNthMonth(n).click()
    }
  };
};

export default datePickerDriverFactory;
