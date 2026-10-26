import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import { approveRequest, finalizeRequest } from '../ethereum/campaign';
import { prepareSigner } from '../ethereum/prepareSigner';
import { describeTransactionError } from '../ethereum/walletState';
import { WalletContext } from './WalletProvider';
import { weiToEther, hasSpendingMajority } from '../ethereum/units';

class RequestRow extends Component {
  static contextType = WalletContext;

  state = {
    approve: { errorMessage: '', loading: false },
    finalize: { errorMessage: '', loading: false },
  };

  onApprove = async () => {
    this.setState({ approve: { loading: true, errorMessage: '' } });
    try {
      const signer = await prepareSigner(this.context);
      await approveRequest(this.props.address, this.props.id, signer);
      this.setState({ approve: { loading: false, errorMessage: '' } });
    } catch (error) {
      this.setState({
        approve: { loading: false, errorMessage: describeTransactionError(error) },
      });
    }
  };

  onFinalize = async () => {
    this.setState({ finalize: { loading: true, errorMessage: '' } });
    try {
      const signer = await prepareSigner(this.context);
      await finalizeRequest(this.props.address, this.props.id, signer);
      this.setState({ finalize: { loading: false, errorMessage: '' } });
    } catch (error) {
      this.setState({
        finalize: { loading: false, errorMessage: describeTransactionError(error) },
      });
    }
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = hasSpendingMajority(request.approvalCount, approversCount);

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{weiToEther(request.value)}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount} / {approversCount}</Cell>
        <Cell>
          {request.complete ? null : (
            <div>
              <Button
                color="green"
                basic
                type="button"
                loading={this.state.approve.loading}
                onClick={this.onApprove}
              >
                Approve
              </Button>
              {this.state.approve.errorMessage ? (
                <div role="alert">{this.state.approve.errorMessage}</div>
              ) : null}
            </div>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <div>
              <Button
                color="teal"
                basic
                type="button"
                loading={this.state.finalize.loading}
                onClick={this.onFinalize}
              >
                Finalize
              </Button>
              {this.state.finalize.errorMessage ? (
                <div role="alert">{this.state.finalize.errorMessage}</div>
              ) : null}
            </div>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
