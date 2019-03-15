import React, { PureComponent } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { IconButton } from 'hadron-react-buttons';
import {
  createTab,
  closeTab,
  prevTab,
  nextTab,
  moveTab,
  selectTab
} from 'modules/tabs';
import CollectionTab from 'components/collection-tab';
import CreateTab from 'components/create-tab';

import styles from './workspace.less';

/**
 * W key is key code 87.
 */
const KEY_W = 87;

/**
 * T key is key code 84.
 */
const KEY_T = 84;

/**
 * ] is 221.
 */
const KEY_CLOSE_BRKT = 221;

/**
 * [ = 219
 */
const KEY_OPEN_BRKT = 219;

/**
 * The collection workspace contains tabs of multiple collections.
 */
@DragDropContext(HTML5Backend)
class Workspace extends PureComponent {
  static displayName = 'Workspace';

  static propTypes = {
    tabs: PropTypes.array.isRequired,
    closeTab: PropTypes.func.isRequired,
    createTab: PropTypes.func.isRequired,
    prevTab: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired,
    moveTab: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired
  };

  /**
   * Instantiate the component.
   *
   * @param {Object} props - The properties.
   */
  constructor(props) {
    super(props);
    this.boundHandleKeypress = this.handleKeypress.bind(this);
  }

  /**
   * Add the keypress listener on mount.
   */
  componentDidMount() {
    window.addEventListener('keydown', this.boundHandleKeypress);
  }

  /**
   * Remove the keypress listener on unmount.
   */
  componentWillUnmount() {
    window.removeEventListener('keydown', this.boundHandleKeypress);
  }

  /**
   * Handle key press. This listens for CTRL/CMD+T and CTRL/CMD+W to control
   * natural opening and closing of collection tabs. CTRL/CMD+SHIFT+] and
   * CTRL/CMD+SHIFT+[ to go forward and backwards through the tabs.
   *
   * @param {Event} evt - The event.
   */
  handleKeypress(evt) {
    if (evt.ctrlKey || evt.metaKey) {
      if (evt.shiftKey) {
        if (evt.keyCode === KEY_CLOSE_BRKT) {
          this.props.nextTab();
        } else if (evt.keyCode === KEY_OPEN_BRKT) {
          this.props.prevTab();
        }
      } else {
        if (evt.keyCode === KEY_W) {
          this.props.closeTab(this.props.tabs.findIndex(tab => tab.isActive));
          if (this.props.tabs.length > 0) {
            evt.preventDefault();
          }
        } else if (evt.keyCode === KEY_T) {
          this.props.createTab(this.lastNamespace());
        }
      }
    }
  }

  /**
   * Get the last namespace in the list.
   *
   * @returns {String} The last namespace in the list.
   */
  lastNamespace() {
    if (this.props.tabs.length > 0) {
      return this.props.tabs[this.props.tabs.length - 1].namespace;
    }
    return '';
  }

  /**
   * Render the tabs.
   *
   * @returns {Component} The component.
   */
  renderTabs() {
    return this.props.tabs.map((tab, i) => {
      return (
        <CollectionTab
          key={i}
          index={i}
          namespace={tab.namespace}
          subTab="Documents"
          isActive={tab.isActive}
          closeTab={this.props.closeTab}
          selectTab={this.props.selectTab}
          moveTab={this.props.moveTab} />
      );
    });
  }

  /**
   * Render the Workspace component.
   *
   * @returns {Component} The rendered component.
   */
  render() {
    return (
      <div className={classnames(styles.workspace)}>
        <div className={classnames(styles['workspace-tabs'])}>
          <div className={classnames(styles['workspace-tabs-prev'])}>
            <i className="fa fa-chevron-left" aria-hidden/>
          </div>
          <div className={classnames(styles['workspace-tabs-container'])}>
            {this.renderTabs()}
            <CreateTab
              createTab={this.props.createTab}
              lastNamespace={this.lastNamespace()}/>
          </div>
          <div className={classnames(styles['workspace-tabs-next'])}>
            <i className="fa fa-chevron-right" aria-hidden/>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Map the store state to properties to pass to the components.
 *
 * @param {Object} state - The store state.
 *
 * @returns {Object} The mapped properties.
 */
const mapStateToProps = state => ({
  tabs: state.tabs
});

/**
 * Connect the redux store to the component.
 * (dispatch)
 */
const MappedWorkspace = connect(
  mapStateToProps,
  {
    createTab,
    closeTab,
    prevTab,
    nextTab,
    moveTab,
    selectTab
  }
)(Workspace);

export default MappedWorkspace;
export { Workspace };
