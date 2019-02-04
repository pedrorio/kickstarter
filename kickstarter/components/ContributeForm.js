import React, {Component} from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Component {

    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        const { address } = this.props;

        const campaign = Campaign(address);

        this.setState({ loading: true, errorMessage: '' });

        try {

            const accounts = await web3.eth.getAccounts();

            await campaign.methods.contribute().send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.value, 'ether')
                });

            Router.replaceRoute(`/campaigns/${address}`);

            this.setState({ value: '' });

        } catch(error) {

            this.setState({ errorMessage: error.message});

        }

        this.setState({ loading: false });

    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        label={'ether'}
                        labelPosition={'right'}
                        value={this.state.value}
                        onChange={event => this.setState({value: event.target.value})}
                    />
                </Form.Field>

                <Message error header={'Oops!'} content={this.state.errorMessage}></Message>
                <Button primary loading={this.state.loading}>Contribute</Button>
            </Form>
        );
    }
}

export default ContributeForm;