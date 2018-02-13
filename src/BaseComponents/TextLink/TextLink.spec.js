import React from 'react';
import textLinkDriverFactory from './TextLink.driver';
import TextLink from './TextLink';
import {createDriverFactory} from '../../test-common';
import {textLinkTestkitFactory} from '../../../testkit';
import {textLinkTestkitFactory as enzymeTextLinkTestkitFactory} from '../../../testkit/enzyme';
import {isTestkitExists, isEnzymeTestkitExists} from '../../../testkit/test-common';
import {spy} from 'sinon';
import {mount} from 'enzyme';

describe('TextLink', () => {

  const createDriver = createDriverFactory(textLinkDriverFactory);

  it('should have a textLink', () => {
    const driver = createDriver(<TextLink link=""/>);

    expect(driver.exists()).toBeTruthy();
  });

  it('should render children', () => {
    const children = '<div>123</div>';
    const driver = createDriver(<TextLink link="">{children}</TextLink>);

    expect(driver.getContent()).toBe(children);
  });

  it('should be with medium size by defualt', () => {
    const driver = createDriver(<TextLink link=""/>);
    expect(driver.getSize()).toBe('medium');
  });

  it('should be with small size', () => {
    const driver = createDriver(<TextLink link="" size="small"/>);
    expect(driver.getSize()).toBe('small');
  });

  it('should be with dark background', () => {
    const driver = createDriver(<TextLink link="" theme="darkBackground" size="small"/>);
    expect(driver.isDarkBackground()).toBeTruthy();
  });

  it('should be with greyscale theme', () => {
    const driver = createDriver(<TextLink link="" theme="greyScale" size="small"/>);
    expect(driver.isGreyScale()).toBeTruthy();
  });

  it('should get greyscale theme', () => {
    const driver = createDriver(<TextLink link="" theme="greyScale" size="small"/>);
    expect(driver.getTheme()).toEqual('greyScale');
  });

  it('should get normal theme', () => {
    const driver = createDriver(<TextLink link="" size="small"/>);
    expect(driver.getTheme()).toEqual('normal');
  });

  it('should be with light background', () => {
    const driver = createDriver(<TextLink link="" size="small"/>);
    expect(driver.isLightBackground()).toBeTruthy();
  });

  it('should be with underline', () => {
    const driver = createDriver(<TextLink link="" underlineStyle="always"/>);
    expect(driver.isUnderline()).toBeTruthy();
  });

  it('should not be with underline', () => {
    const driver = createDriver(<TextLink link="" underlineStyle="never"/>);
    driver.hover();
    expect(driver.isUnderline()).toBeFalsy();
  });

  it('should not be with underline by defualt', () => {
    const driver = createDriver(<TextLink link=""/>);
    expect(driver.isUnderline()).toBeFalsy();
  });

  it('should have underline on hover', () => {
    const driver = createDriver(<TextLink link=""/>);
    driver.hover();
    expect(driver.isUnderline()).toBeTruthy();
  });

  it('should have a link', () => {
    const driver = createDriver(<TextLink link="https://www.wix.com"/>);
    expect(driver.getLink()).toBe('https://www.wix.com/');
  });

  it('should have a rel', () => {
    const driver = createDriver(<TextLink rel="bookmark" target="_blank" link="https://www.wix.com"/>);
    expect(driver.getRel()).toBe('bookmark');
  });

  it('should have a target', () => {
    const driver = createDriver(<TextLink target="_blank" link="https://www.wix.com"/>);
    expect(driver.getTarget()).toBe('_blank');
  });

  it('should call the onClick func when clicked', () => {
    const onClickFunc = spy();
    const driver = createDriver(<TextLink link="" onClick={onClickFunc}/>);

    driver.click();

    expect(onClickFunc.calledOnce).toEqual(true);
  });

  it('should not call the onClick func if clicked when disabled', () => {
    const onClickFunc = spy();
    const driver = createDriver(<TextLink disabled link="" onClick={onClickFunc}/>);

    driver.click();

    expect(onClickFunc.called).toEqual(false);
  });
});

describe('testkit', () => {
  it('should exist', () => {
    expect(isTestkitExists(<TextLink link=""/>, textLinkTestkitFactory)).toBe(true);
  });
});

describe('enzyme testkit', () => {
  it('should exist', () => {
    expect(isEnzymeTestkitExists(<TextLink link=""/>, enzymeTextLinkTestkitFactory, mount)).toBe(true);
  });

  it('should not exist', () => {
    expect(isEnzymeTestkitExists(<TextLink link=""/>, enzymeTextLinkTestkitFactory, mount, {withoutDataHook: true})).toBe(false);
  });
});
