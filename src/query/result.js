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
            data: props.data
        };

        this.limit = this.props.limit;

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
            if (i >= this.limit) break;

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

            </div>
        );

    }


}

export default Result;
