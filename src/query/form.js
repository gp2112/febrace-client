import React, {Component} from 'react';

import {tableRequest, getTableColumns} from "../FebraceApi"

import 'materialize-css/dist/css/materialize.min.css';
import './query.css';
import '../App.css';

import M from "materialize-css";

class QueryForm extends Component {
    
    componentDidMount() {
        M.AutoInit();
        M.FormSelect.init();
    }

    constructor(props) {
        super(props);
        this.state = {
            tableName: 'matriculas',
            columns: [],
            loading: true
        };
        this.loadColumns();

    }
    
    async loadColumns() {
        console.log("Loading columns...");
        this.setState({loading: true});

        const columns = await getTableColumns(this.state.tableName);
        this.setState({columns: columns, loading: false});
    }

    changeTable(e) {
        this.setState({tableName: e.element.value})
    }

    render() {

        let options = [];
        for (let col of this.state.columns) {
           options.push(<option key={col.Name} value={col.Name} >{col.Name}</option>); 
        }
        let select =  (   

            <select className="browser-default">
                <option value="" disabled defaultValue>Choose a column.</option>
                {options}
            </select>
        );



        return (
            <form className="query-form">
                <input type="text" id="tablename" onChange={this.changeTable}/>
                <div className="input-field col s12">
                    {select}
                </div>
                { this.state.loading ? 
                    <img className="loading-gif" width="75" src={require("../static/img/loading.gif")}/> :
                    <img hidden />
                }

            </form>
        );
    }
}

export default QueryForm;
