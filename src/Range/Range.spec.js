import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import Range from './Range';
import Input from '../Input';
import Label from '../Label';
import DatePicker from '../DatePicker';
import '../utils/RangePolyfill.js';


import {rangeTestkitFactory} from '../../testkit';
import {rangeTestkitFactory as enzymeRangeTestkitFactory} from '../../testkit/enzyme';
import {mount} from 'enzyme';

describe('Range', () => {
  describe('testkit', () => {
    it('should exist', () => {
      const div = document.createElement('div');
      const dataHook = 'compHook';
      const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(<div><Range dataHook={dataHook}><Label/><Input/><Input/></Range></div>));
      const rangeTestkit = rangeTestkitFactory({wrapper, dataHook});
      expect(rangeTestkit.exists()).toBeTruthy();
    });

    it('should exist without label', () => {
      const div = document.createElement('div');
      const dataHook = 'compHook';
      const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(<div><Range dataHook={dataHook}><Input/><Input/></Range></div>));
      const rangeTestkit = rangeTestkitFactory({wrapper, dataHook});
      expect(rangeTestkit.exists()).toBeTruthy();
    });

    it('should work with datePickers', () => {
      const onChange = jest.fn();
      const div = document.createElement('div');
      const dataHook = 'compHook';
      const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(<div><Range dataHook={dataHook}><DatePicker onChange={onChange}/><DatePicker onChange={onChange}/></Range></div>));
      const rangeTestkit = rangeTestkitFactory({wrapper, dataHook});
      expect(rangeTestkit.exists()).toBeTruthy();
    });

    describe('enzyme testkit', () => {
      it('should exist', () => {
        const dataHook = 'myDataHook';
        const wrapper = mount(<div><Range dataHook={dataHook}><Label/><Input/><Input/></Range></div>);
        const textFieldTestkit = enzymeRangeTestkitFactory({wrapper, dataHook});
        expect(textFieldTestkit.exists()).toBeTruthy();
      });

      it('should exist without label', () => {
        const div = document.createElement('div');
        const dataHook = 'compHook';
        const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(<div><Range dataHook={dataHook}><Input/><Input/></Range></div>));
        const rangeTestkit = rangeTestkitFactory({wrapper, dataHook});
        expect(rangeTestkit.exists()).toBeTruthy();
      });
    });
  });
});
