import React, {Component} from 'react';

import {tableRequest, getTableColumns} from "../FebraceApi"

import 'materialize-css/dist/css/materialize.min.css';
import './query.css';
import '../App.css';

import M from "materialize-css";

class Select extends Component {
    
    componentDidMount() {
        M.AutoInit();
        M.FormSelect.init();
    }

    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns,
            selectedColumn: props.defaultValue,
            value: ''
        };
        this.changeQuery = props.changeQuery;
        this.removeQuery = props.removeQuery;
    }

    
    selectColumn = (col) => {
        this.setState({selectedColumn: col});
        this.changeQuery(this.props.index, col, this.state.value);
    }

    setValue = (value) => {
        this.setState({value: value});
        this.changeQuery(this.props.index, this.state.selectedColumn, value);
        console.log(this.state);
    }

    removeq = () => {
        this.removeQuery(this.props.index);
    }


    render() {
        let options = [];
            for (let col of this.state.columns) {
               options.push(<option key={col.Name} value={col.Name} >{col.Name}</option>); 
            }
            return  (   
                <div className="input-field col s12">
                    <div className="input-field col s6">

                        <select className="browser-default" onChange={e => this.selectColumn(e.target.value)}>
                            <option value="" disabled selected>Select a column.</option>
                            {options}
                        </select>
                    </div>
                    <div className="input-field col s4">
                        <input type="text" placeholder="value" onChange={e => this.setValue(e.target.value)}/>
                    </div>
                    <div className="col s2">
                        <button className="btn red" onClick={e => this.removeq()}>remove</button>
                    </div>
                </div>
            );
        
    }
}

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
            query: [],
            loading: true,
        };
        this.loadColumns();
        this.canAddColumn = true;

    }
    
    async loadColumns() {
        console.log("Loading columns...");
        this.setState({loading: true});

        const columns = await getTableColumns(this.state.tableName);
        this.setState({columns: columns, loading: false});
    }

    changeQuery = (index, column, value) => {
        let query = this.state.query;
        query[index].column = column;
        query[index].value = value;
        console.log(this.state.query);

        this.setState({query: query});
    }

    removeQuery = (index) => {
        let query = this.state.query;
        query = query.filter((val, i, arr) => {return i != index});
        this.setState({query: query});
    }


    changeTable(e) {
        this.setState({tableName: e.element.value})
    }


    addSelect = (e) => {
        e.preventDefault();
        let query = this.state.query;
        if (!this.canAddColumn) return ;

        let select = <Select index={query.length} changeQuery={this.changeQuery} removeQuery={this.removeQuery} columns={this.state.columns} defaultValue="" />;

        query.push({type:'leaf', column: '', value: '', select: select});
        this.setState({query: query});
    }

    render() {
        
        let canAddColumn = true;
        const selects = [];

        for (let q of this.state.query) {
            if (!q) continue;
            if (!q.value || !q.value.length)
                canAddColumn = false;
            selects.push(q.select);
        }
       

        this.canAddColumn = canAddColumn;


        return (
            <div className="query-form">
                <input type="text" id="tablename" onChange={this.changeTable}/>
                <div className="row">
                    {selects}
                </div>
                <div className="right-align">
                    <button className={!this.canAddColumn ? "btn grey lighten-1" : "btn"} 
                        onClick={e => this.addSelect(e)}>Add Column
                    </button>
                </div>
                { this.state.loading ? 
                    <img className="loading-gif" width="75" src={require("../static/img/loading.gif")}/> :
                    <img hidden />
                }

            </div>
        );
    }
}

export default QueryForm;
