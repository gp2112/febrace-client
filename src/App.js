//import './App.css';


import React, {Component} from 'react';

import 'materialize-css/dist/css/materialize.min.css';

import M from "materialize-css";

import {tableRequest, getTableColumns} from "./FebraceApi"

const tables = {
    Docentes: 'docentes_parquet',
    Escolas: 'escolas_parquet',
    Matriculas: 'matriculas-parquet',
    Turmas: 'turmas_parquet'

};

class NavBar extends Component {
    render() {
        return (
             <nav className="cyan darken-1">
                <div className="nav-wrapper">
                  <a href="/" className="brand-logo">
                        <i className="material-icons">settings_ethernet</i>
                        Febrace Analytics
                  </a>
                  <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><a href="/search">Extração de Dados</a></li>
                    <li><a href="/doc">Doc</a></li>
                    <li><a href="/sobre">Sobre</a></li>
                  </ul>
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


class TableColumns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableName: null,
            columns: []
        };
        this.loadColumns();
    }
    
    async loadColumns() {
        const columns = await getTableColumns('matriculas');
        this.setState({tableName: 'matriculas', columns: columns});
    }

    render() {
        let heads = [];
        for (let col of this.state.columns)
            heads.push(<tr><td>{col.Name}</td><td></td><td>{col.Type}</td></tr>);

        return (
            <table className="highlight">
                <thead>
                    <tr>
                        <th>Column</th>
                        <th>Descrição</th>
                        <th>Tipo</th>
                    </tr>

                </thead>
                <tbody>
                    {heads}
                </tbody>
            

            </table>);
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

    render() {
        return (
            <>
                <NavBar />
                <TableColumns />
                <button className="btn" onClick={sendBtnHandle} >Test</button> 
            </>
        );
    }
}

export default App;
