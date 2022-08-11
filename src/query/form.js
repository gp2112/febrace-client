import React, {Component} from 'react';

import {tableRequest, getTableColumns} from "../FebraceApi";
import Filter from "./filter.js";

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
        
        this.selectsInstance = null;

        this.state = {
            tableName: 'matriculas',
            columns: [],
            selectedColumns: [],
            filter: {},
            loading: true,
        };
        this.canAddColumn = true;

        this.loadColumns();

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
            limit: 11,
            minLength: 1
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
        for (let chip of this.selectsInstance.chipsData)
            selected.push(chip.tag);
        this.setState({selectedColumns: selected});
    }

    updatefilter = (op, query) => {
        this.setState({filter: query});
    }

    render() {
            
        return (
            <div className="query-form">
                
                
                <div className="chips chips-autocomplete chips-placeholder">
                </div>

                { !this.state.loading ?
                    <>
                    <Filter columns={this.state.columns} updateFilter={this.updatefilter} />
                    </> :
                    <img className="loading-gif" width="75" src={require("../static/img/loading.gif")}/>
                }
    

            </div>
        );
    }

}


export default QueryForm;
