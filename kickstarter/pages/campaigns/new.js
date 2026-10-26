import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { createCampaign } from '../../ethereum/factory';
import { prepareSigner } from '../../ethereum/prepareSigner';
import { describeTransactionError } from '../../ethereum/walletState';
import { WalletContext } from '../../components/WalletProvider';
import { Router } from '../../routes';

class CampaignNew extends Component {
  static contextType = WalletContext;

  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: '' });

    try {
      const signer = await prepareSigner(this.context);
      await createCampaign(this.state.minimumContribution, signer);
      Router.pushRoute('/');
    } catch (error) {
      this.setState({ errorMessage: describeTransactionError(error) });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label htmlFor="minimum-contribution">Minimum Contribution</label>
            <Input
              id="minimum-contribution"
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) => this.setState({ minimumContribution: event.target.value })}
            />
          </Form.Field>
          {this.state.errorMessage ? (
            <div role="alert">
              <Message error header="Oops!" content={this.state.errorMessage} />
            </div>
          ) : null}
          <Button primary loading={this.state.loading} type="submit">Create</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
