import React, {Component} from 'react';

import {tableRequest, getTableColumns} from "../FebraceApi"

import 'materialize-css/dist/css/materialize.min.css';
import './query.css';
import '../App.css';

import M from "materialize-css";

const mathExpressions = {
    equals: '=',
    bigger: '>',
    lower: '<'
};
const MAXGARBAGE = 25;

class Select extends Component {

    componentDidMount() {
        M.AutoInit();
        M.FormSelect.init();
    }

    constructor(props) {
        super(props);
        this.state = {
            columns: props.columns,
            selectedColumn: props.defaultColumn ? props.defaultColumn : '',
            value: props.defaultValue ? props.defaultValue : '',
            operation: 'equals'
        };
        this.changeQuery = props.changeQuery;
        this.removeQuery = props.removeQuery;
        this.index = props.index;
    }


    selectColumn = (col) => {
        this.setState({selectedColumn: col});
        this.changeQuery(this.index, col, this.state.value, this.state.operation);
    }

    setValue = (value) => {
        this.setState({value: value});
        this.changeQuery(this.index, this.state.selectedColumn, parseInt(value), this.state.operation);
    }

    removeq = () => {
        console.log(this.index);
        this.removeQuery(this.index);
    }

    selectOp = (val) => {
        this.setState({operation: val});
        this.changeQuery(this.index, this.state.selectedColumn, this.state.value, val);
    }

    render() {
        let options = [];
        for (let col of this.state.columns) {
           options.push(<option key={col.Name} value={col.Name} >{col.Name}</option>);
        }
        console.log(this.state);
        return  (
            <div className="input-field col s12">
                <div className="input-field col s3">

                    <select className="" value={this.state.selectedColumn} onChange={e => this.selectColumn(e.target.value)}>
                        <option value="" disabled >Select a column.</option>
                        {options}
                    </select>
                </div>
                <div className="input-field col s3">
                    <select className="" value={this.state.operation} onChange={e => this.selectOp(e.target.value)}>
                            <option value="equals">equals</option>
                            <option value="bigger">bigger than</option>
                            <option value="lower">lower than</option>
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



class Filter extends Component {

    componentDidMount() {
        M.AutoInit();
        M.FormSelect.init();
    }

    constructor(props) {
        super(props);
        console.log(props.columns);
        this.state = {
            columns: props.columns,
            query: [],
            type: props.type ? props.type : 'and', // and/or
            loading: true
        };
        this.removedCount = 0;
        this.updateFilter = props.updateFilter;
        this.canAddColumn = true;
    }


    toString() {
        let expr = '';
        for (let q in this.state.query) {
            if (q)
                expr += ' ' + q.column + ' ' +
                    mathExpressions[q.operation] + ' ' +
                    q.value + ' ';
        }
        return expr;
    }

    garbageCollect() {
        if (this.removedCount < MAXGARBAGE)
            return;

        console.log('COLLECTING GARBAGE!');

        let newQuery = [];
        let select;
        for (let q of this.state.query) {
            if (!q) continue;

            select = <Select index={newQuery.length} changeQuery={this.changeQuery}
                    removeQuery={this.removeQuery} columns={this.state.columns}
                    defaultColumn={q.column} defaultValue={q.value} />;

            newQuery.push({
                type: q.type,
                value: q.value,
                column: q.column,
                select: select
            })

        }
        this.setState({query: newQuery});
        this.removedCount = 0;

    }

    changeQuery = (index, column, value, operation) => {
        let query = this.state.query;
        query[index].column = column;
        query[index].value = value;
        query[index].operation = operation;

        this.setState({query: query});
        this.updateFilter(this.state.type, query);
    }

    removeQuery = (index) => {
        let query = this.state.query;
        query[index] = null;

        console.log(index);
        console.log('remove', query);

        this.setState({query: query});
        this.updateFilter(this.state.type, query);
        this.removedCount++;
        this.garbageCollect();
    }


    addSelect = (e) => {
        e.preventDefault();
        let query = this.state.query;
        if (!this.canAddColumn) return ;

        let select = <Select index={query.length} changeQuery={this.changeQuery}
                    removeQuery={this.removeQuery} columns={this.state.columns} defaultValue="" />;

        query.push({type:'leaf', column: '', operation: 'equals', value: '', select: select});
        this.setState({query: query});
    }

    changeType = (e) => {
        this.updateFilter(e.target.value, this.query);
        this.setState({type: e.target.value});
    }

    render() {

        let canAddColumn = true;
        const selects = []; let i=0;

        for (let q of this.state.query) {
            i++;
            console.log(q);
            if (!q) continue;
            if (!q.value)
                canAddColumn = false;

            selects.push(
                <div key={ i-1 }>
                {q.select}
                </div>
            );
        }


        this.canAddColumn = canAddColumn;


        return (
            <>
                <div className="operation-select">
                    <label>Selecione a Operação:</label>
                    <select value={this.state.type} onChange={ this.changeType }>
                        <option value="and">AND</option>
                        <option value="or">OR</option>
                    </select>
                </div>
                <div className="row">
                { selects }
                </div>
                <div className="right-align">
                    <button className="btn m2">Add SubQuery</button>
                    <button className={!this.canAddColumn ? "btn grey lighten-1" : "btn"}
                        onClick={e => this.addSelect(e)}>Add Column
                    </button>
                </div>
            </>
        );
    }
}

export default Filter;
