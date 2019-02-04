import React, {Component} from 'react';
import {Table, Button, Icon, Message} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class RequestRow extends Component {

    state = {
        approve: {
            errorMessage: '',
            loading: false
        },

        finalize: {
            errorMessage: '',
            loading: false
        }
    }
    
    onApprove = async () => {

        this.setState({ approve: {loading: true, errorMessage: '' }});

        try {
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            })

        } catch (error) {
            this.setState({ approve: {errorMessage: error.message }});
        }


        this.setState({ approve: {loading: false}});
    }

    onFinalize = async () => {

        this.setState({ finalize: {loading: true, errorMessage: '' }});
        
        try {
            const campaign = Campaign(this.props.address);
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            })

        } catch (error) {
            this.setState({ finalize: {errorMessage: error.message }});
        }

        
        this.setState({ finalize: {loading: false}});

    }


    render() {

        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount/2;

        return (
            <Row
                disabled={request.complete}
                positive={readyToFinalize && !request.complete}
            >
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount} / {approversCount}</Cell>

                <Cell>
                    { request.complete ? null : (
                            <Button
                                color={'green'}
                                basic
                                loading={this.state.approve.loading}
                                onClick={this.onApprove}
                            >
                                Approve
                            </Button>
                    )}
                </Cell>

                <Cell>
                    { request.complete ? null : (
                        <Button
                            color={'teal'}
                            basic
                            loading={this.state.finalize.loading}
                            onClick={this.onFinalize}
                        >
                            Finalize
                        </Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;