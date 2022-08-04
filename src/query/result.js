

class TableColumns extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableName: null,
            columns: [],
            loading: true
        };
        this.loadColumns();
    }
    
    async loadColumns() {
        console.log("Loading columns...");
        this.setState({loading: true});

        const columns = await getTableColumns('matriculas');
        this.setState({tableName: 'matriculas', columns: columns, loading: false});
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

