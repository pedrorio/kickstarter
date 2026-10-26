import React from 'react';
import { Button } from 'semantic-ui-react';
import { WalletContext } from './WalletProvider';
import { shortAddress } from '../ethereum/walletState';

function WalletStatusView({ wallet }) {
  if (!wallet) return null;

  let detail = 'Checking for an Ethereum wallet…';
  let action = null;

  if (wallet.status === 'connecting') {
    detail = 'Waiting for the wallet…';
  } else if (wallet.status === 'no-wallet') {
    detail = 'No Ethereum wallet found in this browser.';
    action = (
      <a href="https://metamask.io/download/" rel="noopener noreferrer">
        Install MetaMask
      </a>
    );
  } else if (wallet.status === 'disconnected') {
    detail = wallet.walletName
      ? `${wallet.walletName} is available.`
      : 'A wallet is available.';
    action = (
      <Button type="button" size="small" primary onClick={wallet.connect}>
        Connect wallet
      </Button>
    );
  } else if (wallet.status === 'rejected') {
    detail = 'The wallet connection was rejected.';
    action = (
      <Button type="button" size="small" onClick={wallet.connect}>
        Try again
      </Button>
    );
  } else if (wallet.status === 'error') {
    detail = wallet.errorMessage || 'The wallet connection failed.';
    action = (
      <Button type="button" size="small" onClick={wallet.connect}>
        Try again
      </Button>
    );
  } else if (wallet.status === 'wrong-chain') {
    detail = `This wallet is on the wrong network. Switch to ${wallet.expectedChainName}.`;
    action = (
      <Button type="button" size="small" primary onClick={wallet.switchChain}>
        Switch network
      </Button>
    );
  } else if (wallet.status === 'connected') {
    detail = `Connected ${shortAddress(wallet.account)} on ${wallet.expectedChainName}.`;
  }

  return (
    <div
      className="item wallet-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-busy={wallet.status === 'pending' || wallet.status === 'connecting'}
    >
      <span>{detail}</span>
      {wallet.chainWarning ? <span>{wallet.chainWarning}</span> : null}
      {wallet.errorMessage && wallet.status === 'wrong-chain' ? <span>{wallet.errorMessage}</span> : null}
      {action}
    </div>
  );
}

const WalletStatus = () => (
  <WalletContext.Consumer>
    {(wallet) => <WalletStatusView wallet={wallet} />}
  </WalletContext.Consumer>
);

export default WalletStatus;
