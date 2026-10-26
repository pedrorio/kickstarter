import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { Link, Router } from '../../../routes';
import { createRequest } from '../../../ethereum/campaign';
import { prepareSigner } from '../../../ethereum/prepareSigner';
import { describeTransactionError } from '../../../ethereum/walletState';
import { WalletContext } from '../../../components/WalletProvider';

class RequestNew extends Component {
  static contextType = WalletContext;

  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  state = {
    description: '',
    value: '',
    recipient: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { address } = this.props;
    const { description, value, recipient } = this.state;
    this.setState({ loading: true, errorMessage: '' });

    try {
      const signer = await prepareSigner(this.context);
      await createRequest(address, description, value, recipient, signer);
      Router.replaceRoute(`/campaigns/${address}/requests`);
      this.setState({ description: '', value: '', recipient: '' });
    } catch (error) {
      this.setState({ errorMessage: describeTransactionError(error) });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label htmlFor="request-description">Description</label>
            <Input
              id="request-description"
              value={this.state.description}
              onChange={(event) => this.setState({ description: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="request-value">Value</label>
            <Input
              id="request-value"
              label="ether"
              labelPosition="right"
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor="request-recipient">Recipient</label>
            <Input
              id="request-recipient"
              value={this.state.recipient}
              onChange={(event) => this.setState({ recipient: event.target.value })}
            />
          </Form.Field>
          {this.state.errorMessage ? (
            <div role="alert">
              <Message error header="Oops!" content={this.state.errorMessage} />
            </div>
          ) : null}
          <Button primary loading={this.state.loading} type="submit">Contribute</Button>
        </Form>
      </Layout>
    );
  }
}

export default RequestNew;
