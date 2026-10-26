import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import { Button, Table, Message } from 'semantic-ui-react';
import { Link } from '../../../routes';
import { getCampaignRequests } from '../../../ethereum/campaign';
import { readableRpcError } from '../../../ethereum/readErrors';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    try {
      const loaded = await getCampaignRequests(address);
      return { address, ...loaded, loadError: '' };
    } catch (error) {
      return {
        address,
        requests: [],
        requestCount: '0',
        approversCount: '0',
        loadError: readableRpcError(error),
      };
    }
  }

  renderRows() {
    return this.props.requests.map((request, index) => (
      <RequestRow
        request={request}
        id={index}
        key={index}
        address={this.props.address}
        approversCount={this.props.approversCount}
      />
    ));
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary>Add Request</Button>
          </a>
        </Link>
        {this.props.loadError ? (
          <div role="alert">
            <Message error header="Requests unavailable" content={this.props.loadError} />
          </div>
        ) : (
          <Table>
            <Header>
              <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Amount</HeaderCell>
                <HeaderCell>Recipient</HeaderCell>
                <HeaderCell>Approval Count</HeaderCell>
                <HeaderCell>Approve</HeaderCell>
                <HeaderCell>Finalize</HeaderCell>
              </Row>
            </Header>
            <Body>
              {this.renderRows()}
            </Body>
          </Table>
        )}
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
