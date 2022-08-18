import React  from 'react';
import {tableRequest, getTableColumns} from "./FebraceApi"
import 'materialize-css/dist/css/materialize.min.css';
import M from "materialize-css";


export
class Form extends React.Component {
    componentDidMount() {
            const selects = document.querySelectorAll('select');
            M.FormSelect.init(selects, {});
    }

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            table: props.table,
            columns: [],
            fields: {}
            
        }
    }

    onload = async (e) => {
        e.preventDefault();
        console.log('load');
        const columns = await getTableColumns(this.state.table);
        this.state.columns = columns;
        console.log(columns);
        this.setState(this.state);
    }

    renderFields() {
        let renderedFields = [];
        for (let field in this.state.fields) {
            renderedFields.push(<>
                <p className="field">field</p>
                <p className="value">fields[field]</p></>
            );
        }

        return renderedFields;
    }

    renderSelect() {
        let options = [];
        for (let col of this.state.columns) {
            options.push(
                <option key={col.Name} value={ col.Name }>{ col.Name }</option>
            );
        }
        return options;
    }

    /*addField() {
        const inpt = document.getElementById('input')
    }*/

    render() {
        return (
            <form id={ this.props.id } className="container">
                <div id="selected">
                
                </div>
                <div id="input input-field  col s12">
                    <select className="browser-default" defaultValue="">
                        <option value="" disabled>Choose a column</option>
                        { this.renderSelect() }
                    </select>
                    <input type="text" placeholder="Colummn Value" />
                    <button id="choose-btn" onClick={ this.onload } className="right btn-floating btn-large waves-effect waves-light red">+</button>
                </div>
            </form>
        );
    }

}


