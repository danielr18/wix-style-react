import DatePicker from 'wix-style-react/DatePicker';

import format from 'date-fns/format';

export default {
  category: '3. Inputs',
  storyName: '3.6 DatePicker',
  component: DatePicker,
  componentPath: '../src/DatePicker',

  componentProps: setState => ({
    onChange: value => setState({value}),
    dateFormat: 'YYYY/MM/DD',
    dataHook: 'storybook-datepicker',
    value: new Date('2017/05/01')
  }),

  exampleProps: {
    onChange: date => format(date, 'YYYY/MM/DD')
  }
};
