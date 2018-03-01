import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popper from 'popper.js';

import DayPicker from 'react-day-picker/DayPicker';

import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import addYears from 'date-fns/add_years';
import subYears from 'date-fns/sub_years';
import parse from 'date-fns/parse';
import isSameDay from 'date-fns/is_same_day';
import startOfMonth from 'date-fns/start_of_month';

import WixComponent from '../BaseComponents/WixComponent';
import CalendarIcon from '../Icons/dist/components/Calendar';
import localeUtilsFactory, {formatDate} from './LocaleUtils';

import styles from './DatePicker.scss';
import arrowStyles from './arrow.scss';
import Input from '../Input';
import DatePickerHead from './DatePickerHead';

/**
 * DatePicker component
 *
 * ### Keyboard support
 * * `Left`: Move to the previous day.
 * * `Right`: Move to the next day.
 * * `Up`: Move to the previous week.
 * * `Down`: Move to the next week.
 * * `PgUp`: Move to the previous month.
 * * `PgDn`: Move to the next month.
 * * `Home`: Move to the previous year.
 * * `End`: Move to the next year.
 * * `Enter`/`Esc`/`Tab`: close the calendar. (`Enter` & `Esc` calls `preventDefault`)
 *
 */
export default class DatePicker extends WixComponent {
  static displayName = 'DatePicker';

  static propTypes = {
    /** Can provide Input with your custom props */
    customInput: PropTypes.node,

    /** Custom date format */
    dateFormat: PropTypes.string,

    /** DatePicker instance locale */
    locale: PropTypes.oneOf([
      'en',
      'es',
      'pt',
      'fr',
      'de',
      'pl',
      'it',
      'ru',
      'ja',
      'ko',
      'tr',
      'sv',
      'no',
      'nl',
      'da'
    ]),

    /** Is the DatePicker disabled */
    disabled: PropTypes.bool,

    /** Past dates are unselectable */
    excludePastDates: PropTypes.bool,

    /** Only the truthy dates are selectable */
    filterDate: PropTypes.func,

    /** dataHook for the DatePicker's Input */
    inputDataHook: PropTypes.string,

    /** calendarDataHook for the DatePicker's calendar view */
    calendarDataHook: PropTypes.string,

    /** Called upon every value change */
    onChange: PropTypes.func.isRequired,

    /** placeholder of the Input */
    placeholderText: PropTypes.string,

    /** RTL mode */
    rtl: PropTypes.bool,

    /** Display a selectable yearDropdown */
    showYearDropdown: PropTypes.bool,

    /** Display a selectable monthDropdown */
    showMonthDropdown: PropTypes.bool,

    /** The selected date */
    value: PropTypes.object,

    /** should the calendar close on day selection */
    shouldCloseOnSelect: PropTypes.bool,

    /** controls the whether the calendar will be visible or not */
    isOpen: PropTypes.bool
  };

  static defaultProps = {
    value: new Date(),
    locale: 'en',
    dateFormat: 'MM/DD/YYYY',
    filterDate: () => true,
    shouldCloseOnSelect: true,
    rtl: false
  };

  constructor(props) {
    super(props);

    this.state = {
      isMonthPickerOpen: false,
      isYearPickerOpen: false,
      value: props.value,
      isOpen: props.isOpen || false
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this._popper = new Popper(
      this.refs.inputRef,
      this.refs.calendarRef,
      {
        placement: 'top-start'
      }
    );
  }

  componentWillUnmount() {
    this._popper.destroy();
    super.componentWillUnmount();
  }

  openCalendar = () => {
    if (!this.state.isOpen) {
      this.setState(
        {
          isOpen: true,
          value: this.props.value
        },
        () => this._popper.scheduleUpdate()
      );
    }
  }

  closeCalendar = () =>
    this.setState({value: this.state.value, isOpen: false});

  _setValue = value =>
    this.setState(
      {value},
      this._popper.scheduleUpdate
    );

  _saveNewValue = (value, modifiers = {}) => {
    if (modifiers.disabled) {
      return;
    }

    const isChanged = !isSameDay(value, this.props.value);
    if (isChanged) {
      this.setState({value}, () => this.props.onChange(value));
    }
    this.props.shouldCloseOnSelect && this.closeCalendar();
  }

  _createDayPickerProps = () => {
    const {
      locale,
      showMonthDropdown,
      showYearDropdown,
      filterDate,
      excludePastDates,
      value: propsValue,
      rtl
    } = this.props;

    const {value} = this.state;

    const localeUtils = localeUtilsFactory(locale);

    const captionElement = (
      <DatePickerHead
        {...{
          date: value,
          showYearDropdown,
          showMonthDropdown,
          localeUtils,
          rtl,
          onChange: this._setValue,

          onLeftArrowClick: () =>
            this._setValue(startOfMonth(addMonths(value, -1))),

          onRightArrowClick: () =>
            this._setValue(startOfMonth(addMonths(value, 1)))
        }}
        />
    );

    return {
      disabledDays:
        excludePastDates ?
          [{before: new Date()}] : // todo adjust with tz
          date => !filterDate(date),

      initialMonth: value,
      initialYear: value,
      selectedDays: parse(propsValue),
      month: value,
      year: value,
      firstDayOfWeek: 1,
      locale,
      showOutsideDays: true,
      modifiers: value ? {'keyboard-selected': value} : {},
      onKeyDown: this._handleKeyDown,
      onDayClick: this._saveNewValue,
      localeUtils,
      canChangeMonth: false, // this disables `navbarElement`, whereas `navbarElement: null` doesn't
      captionElement
    };
  }

  _handleKeyDown = event => {
    const keyHandler = this.keyHandlers[event.keyCode];

    if (keyHandler) {
      event.preventDefault();

      if (!this.state.isOpen) {
        this.openCalendar();
      }

      keyHandler(this.state.value);
    }
  }

  keyHandlers = {
    // enter
    13: value => this._saveNewValue(value),

    // escape
    27: this.closeCalendar,

    // page up
    33: value =>
      this._setValue(subMonths(value, 1)),

    // page down
    34: value =>
      this._setValue(addMonths(value, 1)),

    // end
    35: value =>
      this._setValue(addYears(value, 1)),

    // home
    36: value =>
      this._setValue(subYears(value, 1)),

    // left arrow
    37: value =>
      this._setValue(subDays(value, this.props.rtl ? -1 : 1)),

    // up arrow
    38: value =>
      this._setValue(subDays(value, 7)),

    // right arrow
    39: value =>
      this._setValue(addDays(value, this.props.rtl ? -1 : 1)),

    // down arrow
    40: value =>
      this._setValue(addDays(value, 7)),

    // tab
    9: this.closeCalendar
  };

  onClickOutside() {
    this.closeCalendar();
  }

  render() {
    const {
      dataHook,
      inputDataHook,
      calendarDataHook,
      dateFormat,
      locale,
      disabled,
      placeholderText,
      customInput, // TODO: if we allow input to be custom, then we should pass it all props, how else can it be useful?
      readOnly,
      value: initialValue
    } = this.props;

    const {isOpen} = this.state;

    return (
      <div data-hook={dataHook}>
        <div ref="inputRef">
          {customInput || <Input
            dataHook={inputDataHook}
            value={formatDate(initialValue, dateFormat, locale)}
            onInputClicked={this.openCalendar}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholderText}
            prefix={<span className={styles.icon}><CalendarIcon/></span>}
            onFocus={this.openCalendar}
            onKeyDown={this._handleKeyDown}
            />
          }
        </div>

        <div
          ref="calendarRef"
          data-hook={calendarDataHook}
          className={classNames(
            styles.root,
            {
              [arrowStyles.root]: isOpen
            }
          )}
          >

          {isOpen && <DayPicker {...this._createDayPickerProps()}/>}
        </div>
      </div>
    );
  }
}
