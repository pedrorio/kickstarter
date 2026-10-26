import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';
import WalletStatus from './WalletStatus';

const Header = () => (
  <Menu style={{ marginTop: '10px' }}>
    <Link route="/">
      <a className="item">CrowdCoin</a>
    </Link>
    <Menu.Menu position="right">
      <WalletStatus />
      <Link route="/">
        <a className="item">Campaigns</a>
      </Link>
      <Link route="/campaigns/new">
        <a className="item">+</a>
      </Link>
    </Menu.Menu>
  </Menu>
);

export default Header;
