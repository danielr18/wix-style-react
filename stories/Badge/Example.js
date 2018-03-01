import React from 'react';
import {Email} from 'wix-style-react/Icons';
import DropdownComposite from '../../src/DropdownComposite';
import Dropdown from '../../src/Dropdown';
import Label from '../../src/Label';
import TextField from '../../src/TextField';
import Input from '../../src/Input';
import {SKIN, TYPE} from 'wix-ui-backoffice/dist/src/components/Badge/constants';
import style from './Badge.scss';
import Badge from 'wix-style-react/Badge';

const skinOptions = Object.keys(SKIN).map(value => ({id: value, value}));
const typeOptions = Object.keys(TYPE).map(value => ({id: value, value}));

const iconsOptions = [{id: 'none', value: 'none'}, {id: 'Email', value: 'Email'}];

class ControlledBadgeExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      skin: SKIN.default,
      type: TYPE.solid,
      children: 'I\'M A BADGE!',
      prefixIcon: 'none',
      suffixIcon: 'none'
    };
  }
  render() {
    return (
      <div className={style.container}>
        <div style={{width: '200px'}}>
          <h1> Props </h1>
          <TextField><Label>children</Label><Input value={this.state.children} onChange={e => this.setState({children: e.target.value})}/></TextField>
          <DropdownComposite><Label>skin</Label><Dropdown selectedId={this.state.skin} options={skinOptions} onSelect={option => this.setState({skin: option.value})}/></DropdownComposite>
          <DropdownComposite><Label>type</Label><Dropdown selectedId={this.state.type} options={typeOptions} onSelect={option => this.setState({type: option.value})}/></DropdownComposite>

          <DropdownComposite><Label>prefixIcon</Label><Dropdown selectedId={this.state.prefixIcon} options={iconsOptions} onSelect={option => this.setState({prefixIcon: option.value})}/></DropdownComposite>
          <DropdownComposite><Label>suffixIcon</Label><Dropdown selectedId={this.state.suffixIcon} options={iconsOptions} onSelect={option => this.setState({suffixIcon: option.value})}/></DropdownComposite>
        </div>
        <div>
          <h1> Preview </h1>

          <br/><br/><br/><br/><br/><br/>

          <Badge
            skin={this.state.skin}
            type={this.state.type}
            prefixIcon={this.state.prefixIcon === 'Email' ? <Email/> : null}
            suffixIcon={this.state.suffixIcon === 'Email' ? <Email/> : null}
            data-hook="storybook-badge"
            >
            {this.state.children}
          </Badge>
        </div>
      </div>
    );
  }
}

export default () => <ControlledBadgeExample/>;
