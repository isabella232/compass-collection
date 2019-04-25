import React from 'react';
import { mount } from 'enzyme';

import CreateTab from 'components/create-tab';
import styles from './create-tab.less';

describe('CreateTab [Component]', () => {
  let component;
  let createTabSpy;

  beforeEach(() => {
    createTabSpy = sinon.spy();

    component = mount(
      <CreateTab activeNamespace="db.coll" createTab={createTabSpy} />
    );
  });

  afterEach(() => {
    createTabSpy = null;
    component = null;
  });

  it('renders the tab div', () => {
    expect(component.find(`.${styles['create-tab']}`)).to.be.present();
  });

  context('when clicking the create button', () => {
    it('calls the action', () => {
      component.find(`.${styles['create-tab']}`).simulate('click');
      expect(createTabSpy.calledWith('db.coll')).to.equal(true);
    });
  });
});