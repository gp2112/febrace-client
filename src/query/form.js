import React, {Component} from 'react';

import {tableRequest, getTableColumns} from "../FebraceApi";
import Filter from "./filter.js";

import 'materialize-css/dist/css/materialize.min.css';
import './query.css';
import '../App.css';
import Result from "./result.js";

import M from "materialize-css";


class QueryForm extends Component {
     componentDidMount() {
        M.AutoInit();
        M.FormSelect.init();
        
        const chipElems = document.querySelector('.chips');
        this.selectsInstance = M.Chips.init(chipElems, {});
       
    }

    constructor(props) {
        super(props);
        
        this.selectsInstance = null;

        this.state = {
            tableName: 'matriculas',
            columns: [],
            selectedColumns: [],
            filter: {},
            loading: true,
            viewCode: false,
            result: null,
            showResult: false,
            limit: 100
        };
        this.canAddColumn = true;

        this.loadColumns();

    }
    
    __recurToExpr(query) {
        console.log('recur', query);
        if (query.type === "leaf") {
            let s = {field: query.column};
            s[query.operation] = query.value;
            return s;
        }
        let q, c;
        let children = {};

        if (query.and) {
            q = query.and;
            children.and = [];
            c = children.and;
        }
        else if (query.or) {
            q = query.or;
            children.or = [];
            c = children.or;
        }
        else throw new Error("Invalid expression!");
       
        
        for (let sub of q) {
            if (!sub) continue;
            c.push(this.__recurToExpr(sub));
        }
        return children;

    }

    toExpr() {

       return this.__recurToExpr(this.state.filter); 
    }
    
    loadColumnsOptions(columns) {
         let chipOptions = {
            placeholder: 'Escolha as colunas desejadas',
            secondaryPlaceholder: '+coluna',
            autocompleteOptions: {
                data: {},
            },
            onChipAdd: this.updateSelectedColumns,
            onChipDelete: this.updateSelectedColumns,
            limit: 11
        };

        for (let col of columns) {
            chipOptions.autocompleteOptions.data[col.Name] = null;
        }
        
        const chipElems = document.querySelector('.chips');
        this.selectsInstance = M.Chips.init(chipElems, chipOptions);

    }

    async loadColumns() {
        console.log("Loading columns...");
        this.setState({loading: true});

        const columns = await getTableColumns(this.state.tableName);
        this.loadColumnsOptions(columns);
        this.setState({columns: columns, loading: false});
    }

    updateSelectedColumns = () => {
        let selected = [];
        console.log(this.selectsInstance);
        for (let chip of this.selectsInstance.chipsData)
            selected.push(chip.tag);
        this.setState({selectedColumns: selected});
        console.log("SELECT", selected);
    }

    updatefilter = (op, query) => {
                    
        const f = {};
        f[op] = query;
        this.setState({filter: f});
        console.log('Filter:');
        console.log(this.state.filter);
        console.log(this.toExpr());
    }

    toggleView = () => {
        let r = !this.state.viewCode;
        this.setState({viewCode: r});
    }

    search = async () => {
        this.setState({loading: true});
        const resp = await tableRequest(this.state.tableName, 
                            this.state.selectedColumns, this.toExpr(), this.state.limit);

        console.log(resp);

        const showR = resp && resp.length > 0;

        this.setState({loading: false, result: resp, showResult: showR});

    }

    toggleResult = () => {
        const nr = !this.state.showResult;
        this.setState({showResult: nr})
    }

    changeLimit = (e) => {
        this.setState({limit: parseInt(e.target.value)})
    }

    render() {
        
        if (this.state.showResult)
            return (
               <div className="results"> 
                    <Result data={this.state.result} />
                    
                </div>
            )

        let exp = {};

        try { 
            exp = this.toExpr();
        } catch (e) {
            console.log(e);
        }

        const resultEmpty = !this.state.result || this.state.result.length == 0;
                
        return (

            <div className="query-form">
               
                <input type="text" id="tablename" />
                <label htmlFor="tablename">Tabela</label>


                <div id="colsSelect" className="chips chips-autocomplete chips-placeholder">
                </div>
                <label htmlFor="colsSelect">Colunas</label>


                { !this.state.loading ?
                    <>
                    <Filter columns={this.state.columns} updateFilter={this.updatefilter} />
                    </> :
                    <img className="loading-gif" width="75" src={require("../static/img/loading.gif")}/>
                } 
            
                

                {this.state.viewCode ? 
                    <div id="queryCode" className="code-box">
                        <pre>
                        <code>
                        {JSON.stringify(exp, null, 4)}
                        </code>
                        </pre>
                        
                    </div> : <p></p>
                }
                <div className="row"> 
                    <div className="col s3">
                        <input type="number" value={this.state.limit} min="1" max="10000" placeholder="limit" onChange={this.changeLimit} />
                    </div>
                    <div className="col s9 right-align">
                        <div className="col s3">
                            <button className="btn orange" onClick={this.toggleView}>
                                Ver Código
                            </button>
                        </div>
                        <div className="col s2 ">
                            <button className="btn green" onClick={this.search}>
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


export default QueryForm;
