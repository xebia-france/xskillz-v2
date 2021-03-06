import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {Paper, RaisedButton, DatePicker, Snackbar, AutoComplete} from 'material-ui'

import DateTimeFormat from '../../tools/date';

class EmployeeDatePicker extends Component {

    static propTypes = {
        saveEmployeeDate: PropTypes.func.isRequired,
        users: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {date: null, userId: null, submit: false, snackOpen: false};
    }

    onChangeDate = (event, date) => this.setState({date});

    disableWeekends = date => date.getDay() === 0 || date.getDay() === 6;

    onUserChange = (name, index) => index >= 0 && this.setState({userId: this.props.users.list[index].id});

    saveEmployeeDate = () => {
        this.setState({snackOpen: false, submit: true});
        return this.props.saveEmployeeDate(this.state.userId, this.state.date);
    };

    onSnackClose = () => {
        this.setState({snackOpen: false, submit: false});
    };

    render() {
        let {date, userId, submit, snackOpen} = this.state;
        const users = this.props.users.list;
        const employeeDateSaved = this.props.users.employeeDateSaved;
        if (submit && employeeDateSaved) {
            snackOpen = true;
        }
        let userNames = [];
        if (users) {
            userNames = _.flatMap(users, user => user.name);
        }
        return (
            <Paper style={{margin: '.2rem', padding: '1rem'}}>
                <h3>Définir la date de démarrage dans la société</h3>
                <div>
                    <AutoComplete
                        floatingLabelText="Équipier"
                        hintText="Chercher un équipier"
                        filter={AutoComplete.fuzzyFilter}
                        dataSource={userNames}
                        maxSearchResults={10}
                        onNewRequest={::this.onUserChange}/>
                </div>
                <div>
                    <DatePicker
                        locale="fr"
                        DateTimeFormat={DateTimeFormat}
                        hintText="Embauché le"
                        value={date}
                        onChange={::this.onChangeDate}
                        shouldDisableDate={this.disableWeekends}/>
                </div>
                <div style={{marginTop: '1rem', clear: 'both'}}>
                    <RaisedButton
                      label="Valider"
                      primary={true}
                      onClick={::this.saveEmployeeDate}
                      disabled={_.isNull(userId) || _.isNull(date)}/>
                </div>
                <Snackbar
                    bodyStyle={{backgroundColor: '#008500'}}
                    open={snackOpen}
                    message="Date de démarrage mise à jour"
                    onRequestClose={::this.onSnackClose}
                    autoHideDuration={3000}/>
            </Paper>
        )
    }
}

export default EmployeeDatePicker;