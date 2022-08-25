import './App.css';


import React, {Component} from 'react';

import 'materialize-css/dist/css/materialize.min.css';

import M from "materialize-css";

import {tableRequest, getTableColumns} from "./FebraceApi"
import QueryForm from "./query/form.js"


const tables = {
    Docentes: 'docentes_parquet',
    Escolas: 'escolas_parquet',
    Matriculas: 'matriculas-parquet',
    Turmas: 'turmas_parquet'

};

class NavBar extends Component {
    render() {
        return (
             <nav className="navbar cyan darken-1">
                <div className="nav-content">
                    <div className="nav-wrapper">
                      <a href="/" className="brand-logo">
                            <i className="material-icons mr-4">settings_ethernet</i>
                            Febrace Analytics
                      </a>
                      <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><a href="/search">Extração de Dados</a></li>
                        <li><a href="/doc">Doc</a></li>
                        <li><a href="/sobre">Sobre</a></li>
                      </ul>
                    </div>
                </div>
              </nav>
        )
    }
}

class ExtractForm extends Component {
    render () {

        let lines = [];

        for (let table of Object.keys(tables))
            lines.push(<li> {{table}} </li>);
        return (<div><ul>tables</ul></div>);
    }
}



async function sendBtnHandle(e) {
    
    const tableName = 'matriculas';
    const fields = "nu_ano_censo,nu_mes";
    const filters = {
        and: [
            {field: "nu_ano_censo", equals: "2020"},
            {field: "nu_mes", equals: "4"}
        ] 
    };
    
    
    const data = await tableRequest(tableName, fields, filters, 10);

}

class App extends Component {

    componentDidMount() {
        M.AutoInit();
    }

    constructor(props) {
        super(props);
        this.state = {
            tablename: '',
            allowSearch: false
        };
    }

    checkEmpty = (e) => {
        const target = e.target;
        this.setState({allowSearch: target.value.length>0});
    };

    changeTableName = () => {
        const t = document.getElementById('tablename');

        this.setState({tablename: t.value});
    };

    render() {

        const tableInput = (
            <div className="row query-form table-query">
                <div className="col s10">
                    <input id="tablename" type="text" onChange={this.checkEmpty} placeholder="Tabela a ser buscada" />
                </div>
                <div className="col s2">
                    <button className={ this.state.allowSearch ? "btn" : "btn grey"} onClick={this.changeTableName} disabled={!this.state.allowSearch} >
                        Buscar
                    </button>
                </div>
            </div>
        );

        return (
            <>
                <header>
                    <NavBar />
                </header>
                <main>
                    {!this.state.tablename.length ?
                        tableInput : <QueryForm tablename={this.state.tablename}/>
                    }
                </main>
            </>
        );
    }
}

export default App;
