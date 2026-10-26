import React, { Component } from 'react';
import { BrowserProvider } from 'ethers';
import { addChainParams } from '../ethereum/chains';
import { collectAnnouncedProviders } from '../ethereum/eip6963';
import { readPublicConfig } from '../ethereum/runtimeConfig';
import {
  isUnknownChainError,
  isUserRejection,
  parseChainId,
  reduceAccountsChanged,
  reduceChainChanged,
  selectProvider,
  sessionFromAccounts,
} from '../ethereum/walletState';

export const WalletContext = React.createContext(null);

function initialState(config) {
  return {
    status: 'pending',
    account: null,
    walletChainId: null,
    expectedChainId: config.chainId,
    expectedChainName: config.chainName,
    chainWarning: config.chainWarning || '',
    networkEndpoint: config.networkEndpoint || '',
    errorMessage: '',
    walletName: '',
  };
}

class WalletProvider extends Component {
  constructor(props) {
    super(props);
    const config = props.config || readPublicConfig();
    this.state = initialState(config);
    this.ethereum = null;
    this.mounted = false;
    this.connect = this.connect.bind(this);
    this.switchChain = this.switchChain.bind(this);
    this.getSigner = this.getSigner.bind(this);
    this.getSession = this.getSession.bind(this);
    this.onAccountsChanged = this.onAccountsChanged.bind(this);
    this.onChainChanged = this.onChainChanged.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.discover();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.unbind();
  }

  setSafe(update) {
    if (this.mounted) this.setState(update);
  }

  unbind() {
    if (!this.ethereum || typeof this.ethereum.removeListener !== 'function') return;
    this.ethereum.removeListener('accountsChanged', this.onAccountsChanged);
    this.ethereum.removeListener('chainChanged', this.onChainChanged);
  }

  bind(provider) {
    this.unbind();
    this.ethereum = provider;
    if (provider && typeof provider.on === 'function') {
      provider.on('accountsChanged', this.onAccountsChanged);
      provider.on('chainChanged', this.onChainChanged);
    }
  }

  async discover() {
    const announced = await collectAnnouncedProviders(window);
    if (!this.mounted) return;
    const selected = selectProvider(announced, window.ethereum);
    this.bind(selected.provider);
    if (!selected.provider) {
      this.setSafe({
        status: 'no-wallet',
        walletName: '',
        account: null,
        walletChainId: null,
        errorMessage: '',
      });
      return;
    }

    this.setSafe({ walletName: selected.name });
    try {
      const accounts = await selected.provider.request({ method: 'eth_accounts' });
      const chainHex = await selected.provider.request({ method: 'eth_chainId' });
      const session = sessionFromAccounts({
        accounts,
        walletChainId: parseChainId(chainHex),
        expectedChainId: this.state.expectedChainId,
      });
      this.setSafe({ ...session, errorMessage: '' });
    } catch (error) {
      this.setSafe({ status: 'disconnected', account: null, errorMessage: '' });
    }
  }

  getSession() {
    return {
      status: this.state.status,
      account: this.state.account,
      walletChainId: this.state.walletChainId,
      expectedChainId: this.state.expectedChainId,
      expectedChainName: this.state.expectedChainName,
      errorMessage: this.state.errorMessage,
    };
  }

  async connect() {
    if (!this.ethereum) {
      const errorMessage = 'No Ethereum wallet is installed in this browser.';
      this.setSafe({ status: 'no-wallet', errorMessage, account: null });
      return { ...this.getSession(), status: 'no-wallet', errorMessage, account: null };
    }

    this.setSafe({ status: 'connecting', errorMessage: '' });
    try {
      const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
      const chainHex = await this.ethereum.request({ method: 'eth_chainId' });
      const session = sessionFromAccounts({
        accounts,
        walletChainId: parseChainId(chainHex),
        expectedChainId: this.state.expectedChainId,
      });
      this.setSafe({ ...session, errorMessage: '' });
      return { ...this.getSession(), ...session, errorMessage: '' };
    } catch (error) {
      if (isUserRejection(error)) {
        const rejected = {
          status: 'rejected',
          account: null,
          errorMessage: 'The wallet connection was rejected.',
        };
        this.setSafe(rejected);
        return { ...this.getSession(), ...rejected };
      }
      const failed = {
        status: 'error',
        errorMessage: error.message || 'The wallet connection failed.',
      };
      this.setSafe(failed);
      return { ...this.getSession(), ...failed };
    }
  }

  async switchChain() {
    if (!this.ethereum) return this.getSession();
    const params = addChainParams(this.state.expectedChainId, this.state.networkEndpoint);
    try {
      await this.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: params.chainId }],
      });
    } catch (error) {
      if (isUnknownChainError(error)) {
        if (!params.rpcUrls.length) {
          const errorMessage = 'This network is not in the wallet, and no RPC URL is configured to add it.';
          this.setSafe({ errorMessage });
          return { ...this.getSession(), errorMessage };
        }
        try {
          await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          });
        } catch (addError) {
          const errorMessage = isUserRejection(addError)
            ? 'The network switch was rejected.'
            : (addError.message || 'The wallet could not add this network.');
          this.setSafe({ errorMessage });
          return { ...this.getSession(), errorMessage };
        }
      } else if (isUserRejection(error)) {
        const errorMessage = 'The network switch was rejected.';
        this.setSafe({ errorMessage });
        return { ...this.getSession(), errorMessage };
      } else {
        const errorMessage = error.message || 'The wallet could not switch networks.';
        this.setSafe({ errorMessage });
        return { ...this.getSession(), errorMessage };
      }
    }

    const chainHex = await this.ethereum.request({ method: 'eth_chainId' });
    const accounts = this.state.account
      ? [this.state.account]
      : await this.ethereum.request({ method: 'eth_accounts' });
    const session = sessionFromAccounts({
      accounts,
      walletChainId: parseChainId(chainHex),
      expectedChainId: this.state.expectedChainId,
    });
    this.setSafe({ ...session, errorMessage: '' });
    return { ...this.getSession(), ...session, errorMessage: '' };
  }

  async getSigner() {
    if (!this.ethereum) {
      throw new Error('No Ethereum wallet is connected.');
    }
    const provider = new BrowserProvider(this.ethereum);
    return provider.getSigner();
  }

  onAccountsChanged(accounts) {
    this.setSafe((state) => reduceAccountsChanged(state, accounts));
  }

  onChainChanged(chainId) {
    this.setSafe((state) => reduceChainChanged(state, chainId));
  }

  render() {
    const value = {
      ...this.state,
      connect: this.connect,
      switchChain: this.switchChain,
      getSigner: this.getSigner,
      getSession: this.getSession,
    };
    return (
      <WalletContext.Provider value={value}>
        {this.props.children}
      </WalletContext.Provider>
    );
  }
}

export default WalletProvider;
