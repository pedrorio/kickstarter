import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { contribute } from '../ethereum/campaign';
import { getSubmitSigner } from '../ethereum/browserSigner';
import { describeTransactionError } from '../ethereum/walletState';
import { Router } from '../routes';

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { address } = this.props;
    this.setState({ loading: true, errorMessage: '' });

    try {
      const signer = await getSubmitSigner();
      await contribute(address, this.state.value, signer);
      Router.replaceRoute(`/campaigns/${address}`);
      this.setState({ value: '' });
    } catch (error) {
      this.setState({ errorMessage: describeTransactionError(error) });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label htmlFor="contribution-amount">Amount to contribute</label>
          <Input
            id="contribution-amount"
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
          />
        </Form.Field>
        {this.state.errorMessage ? (
          <div role="alert">
            <Message error header="Oops!" content={this.state.errorMessage} />
          </div>
        ) : null}
        <Button primary loading={this.state.loading} type="submit">Contribute</Button>
      </Form>
    );
  }
}

export default ContributeForm;
