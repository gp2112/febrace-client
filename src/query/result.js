import React, {Component} from 'react';


import 'materialize-css/dist/css/materialize.min.css';
import './query.css';
import '../App.css';

import M from "materialize-css";

class Result extends Component {

    componentDidMount() {
        M.AutoInit();
    }


    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            limit: 20
        };


    }

    renderHeader() {
        const header = [];
        for (let col of this.columns) {
            header.push(
                <th key={col}>{col}</th>
            );
        }
        return header;
    }

    renderRows() {
        const rows = []; let i=0;

        for (let row of this.state.data) {
            if (i >= this.state.limit) break;

            let fields = [];
            for (let col of this.columns)
                fields.push(
                    <td key={col}>{row[col]}</td>
                );

            rows.push(
                <tr key={i++}>
                    {fields}
                </tr>
            );
        }
        return rows;
    }


    toCSV = () => {
        let csvData = [this.columns];
        let fields;
        for (let row of this.state.data) {
            fields = [];

            for (let col of this.columns)
                fields.push(row[col]);

            csvData.push(fields.join(','));
        }
        csvData = csvData.join('\n');

        const downloadLink = document.createElement('a');
        const blob = new Blob(['\ufeff', csvData]);
        const url = URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = "data.csv";

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    }

    render() {

        this.columns = Object.keys(this.state.data[0]);

        const header = this.renderHeader();
        const rows = this.renderRows();

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            {header}
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table> 
                
                <p>Vizualizando {rows.length} de {this.state.data.length}</p>
                
                <div className="row">
                    <div className="col">
                        <button className="btn red" onClick={this.toggleResult}>Voltar</button>
                    </div>
                    <div className="col">
                        <button className="btn green" onClick={this.toCSV}>Download</button>
                    </div>
                </div>
                
            </div>
        );

    }


}

export default Result;
