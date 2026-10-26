import React, { Component } from 'react';
import { Card, Grid, Button, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { getCampaignSummary } from '../../ethereum/campaign';
import { weiToEther } from '../../ethereum/units';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    try {
      const summary = await getCampaignSummary(props.query.address);
      return {
        ...summary,
        address: props.query.address,
        loadError: '',
      };
    } catch (error) {
      return {
        minimumContribution: '',
        balance: '',
        requestsCount: '',
        approversCount: '',
        manager: '',
        address: props.query.address,
        loadError: error.message || 'This campaign could not be loaded.',
      };
    }
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager,
    } = this.props;

    const items = [
      {
        header: manager,
        meta: 'Address of manager',
        description: 'The manager created this campaign and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become an approver',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: approversCount,
        meta: 'Number of Approvers',
        description: 'Number of people who already donated to this campaign.',
        style: { overflowWrap: 'break-word' },
      },
      {
        header: balance ? weiToEther(balance) : '',
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend.',
        style: { overflowWrap: 'break-word' },
      },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Show</h3>
        {this.props.loadError ? (
          <Message error header="Campaign unavailable" content={this.props.loadError} />
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>
                {this.renderCards()}
              </Grid.Column>
              <Grid.Column width={6}>
                <ContributeForm address={this.props.address} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                  <a>
                    <Button primary>View Requests</Button>
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Layout>
    );
  }
}

export default CampaignShow;
