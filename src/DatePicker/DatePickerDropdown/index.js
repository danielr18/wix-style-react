import React from 'react';
import PropTypes from 'prop-types';

import DropdownLayout from '../../DropdownLayout';
import Text from '../../Text';
import {ArrowDownThin} from '../../Icons';
import styles from './styles.scss';

export default class DropdownPicker extends React.Component {
  static propTypes = {
    dataHook: PropTypes.string,
    caption: PropTypes.node,
    options: PropTypes.array,
    onChange: PropTypes.func,
    selectedId: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  onClose = () =>
    this.setState({
      isOpen: false
    });

  onSelect = data => {
    this.props.onChange(data);
    this.onClose();
  }

  toggleDropdown = () =>
    this.setState({
      isOpen: !this.state.isOpen
    });

  render() {
    const {
      caption,
      options,
      dataHook,
      selectedId
    } = this.props;

    const {isOpen} = this.state;

    return (
      <div
        data-hook={dataHook}
        className={styles.root}
        >
        <div
          className={styles.button}
          onClick={this.toggleDropdown}
          >
          <Text
            appearance="T1.2"
            dataHook={`${dataHook}-button`}
            children={caption}
            />

          <div className={styles.icon}>
            <ArrowDownThin/>
          </div>
        </div>

        { isOpen &&
          <div className={styles.dropdown}>
            <DropdownLayout
              dataHook={`${dataHook}-menu`}
              visible={isOpen}
              options={options}
              onSelect={this.onSelect}
              onClickOutside={this.onClose}
              closeOnSelect
              selectedId={selectedId}
              />
          </div>
        }
      </div>
    );
  }
}
