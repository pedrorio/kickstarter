import React, { Component } from 'react';
import { Card, Button, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { getDeployedCampaigns } from '../ethereum/factory';
import { Link } from '../routes';

class CampaignIndex extends Component {
  static async getInitialProps() {
    try {
      const campaigns = await getDeployedCampaigns();
      return { campaigns, loadError: '' };
    } catch (error) {
      return {
        campaigns: [],
        loadError: error.message || 'Campaigns could not be loaded.',
      };
    }
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => ({
      header: address,
      description: (
        <Link route={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
    }));

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Link route="/campaigns/new">
          <a>
            <Button
              floated="right"
              content="Create campaign"
              icon="add circle"
              primary
            />
          </a>
        </Link>
        {this.props.loadError ? (
          <Message error header="Campaigns unavailable" content={this.props.loadError} />
        ) : null}
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default CampaignIndex;
