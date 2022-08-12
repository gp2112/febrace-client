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
            columns: props.columns,
            rows: props.rows
        };

        this.limit = this.props.limit;

    }

    renderHeader() {
        const header = [];
        for (let col of this.state.columns) {
            header.push(
                <th key={col}>{col}</th>
            );
        }
        return header;
    }

    renderRows() {
        const rows = []; let i=0;

        for (let row of this.state.rows) {
            if (i >= this.limit) break;

            let fields = [];
            for (let col of this.state.columns)
                fields.push(
                    <td key={col}>row[col]</td>
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
