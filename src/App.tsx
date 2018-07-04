import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import axios, { AxiosResponse } from 'axios';
import { map } from 'lodash';
import { IMedicationInterface } from './interfaces/medication.interface';
import { IGroupConfigInterface } from './interfaces/groupConfig.interface';

interface IState {
    currentSearch: string;
    searchResults: IMedicationInterface[];
    isInitialPageState: boolean;
    isSearchComplete: boolean;
}

class App extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            currentSearch: '',
            searchResults: [],
            isInitialPageState: true,
            isSearchComplete: false
        };
        this._onSearchChange = this._onSearchChange.bind(this);
        this._submitGroupSearch = this._submitGroupSearch.bind(this);
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Propeller Health - Front End Developer Skills Assessment</h1>
                </header>
                <main className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-8 col-lg-6">
                            <form className="p-3">
                                <div className="form-group">
                                    <label htmlFor="search-input">Search Groups</label>
                                    <input
                                        type="text"
                                        id="search-input"
                                        className="form-control"
                                        placeholder="Search..."
                                        value={this.state.currentSearch}
                                        onChange={this._onSearchChange}/>
                                    {
                                        this.state.currentSearch.length < 1 && !this.state.isInitialPageState ?
                                            <div className="alert alert-danger" role="alert">
                                                Please enter a search term
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={this._submitGroupSearch}>Submit</button>
                            </form>
                        </div>
                    </div>
                    {
                        this.state.searchResults.length > 0 ?
                            <div className="row">
                                <div className="col-12">
                                    <table className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th scope="col">Id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Short Name</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Form Factor</th>
                                            <th scope="col">Diseases</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {map(this.state.searchResults, (medication: IMedicationInterface, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{medication.id}</td>
                                                    <td>{medication.name}</td>
                                                    <td>{medication.shortName}</td>
                                                    <td>{medication.type}</td>
                                                    <td>{medication.formFactor}</td>
                                                    <td>{medication.diseases.join(', ')}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr className="table-secondary">
                                            <td className="text-right" colSpan={2}>
                                                <h5>Total Results:</h5>
                                            </td>
                                            <td className="text-left" colSpan={4}>
                                                <h5>
                                                    {this.state.searchResults.length}
                                                </h5>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            :
                            null
                    }
                    {
                        this.state.searchResults.length < 1 && this.state.isSearchComplete && !this.state.isInitialPageState ?
                            <div className="alert alert-warning" role="alert">
                                No matching search results
                            </div>
                            :
                            null
                    }
                </main>
            </div>
        );
    }

    private _onSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
        // todo, add input debouncing
        const searchValue: string = e.target.value;
        this.setState({
            currentSearch: searchValue,
            searchResults: [],
            isInitialPageState: false,
            isSearchComplete: false
        });
    }

    private _submitGroupSearch(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        if (this.state.currentSearch.length > 0) {
            axios({
                method: 'GET',
                url: 'https://dev.propellerhealth.com/api/groups/' + this.state.currentSearch + '/config',
                headers: {
                    'x-ph-api-version': '3.31.0'
                }
            })
                .then((response: AxiosResponse<IGroupConfigInterface>) => {
                    this.setState({
                        searchResults: response.data.medications,
                        isSearchComplete: true
                    });
                })
                .catch((err: any) => {
                    console.warn(err);
                });
        }
    }
}

export default App;
