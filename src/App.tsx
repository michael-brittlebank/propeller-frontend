import * as React from 'react';
import './App.css';
import logo from './logo.svg';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { map, uniq, filter, cloneDeep } from 'lodash';
import { IMedicationInterface } from './interfaces/types/medication.interface';
import { IErrorInterface } from './interfaces/responses/error.interface';
import { IGroupConfigInterface } from './interfaces/types/groupConfig.interface';
import { IErrorFieldInterface } from './interfaces/responses/errorField.interface';

interface IState {
    currentSearch: string;
    searchResults: IMedicationInterface[];
    filteredResults: IMedicationInterface[];
    isInitialPageState: boolean;
    isSearchComplete: boolean;
    error: IErrorInterface | undefined;
    filterOptions: {
        formFactors: string[];
        diseases: string[];
    };
    appliedFilters: {
        formFactors: string[];
        diseases: string[];
    };
}

class App extends React.Component<any, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            currentSearch: '',
            searchResults: [],
            filteredResults: [],
            isInitialPageState: true,
            isSearchComplete: false,
            error: undefined,
            filterOptions: {
                formFactors: [],
                diseases: [],
            },
            appliedFilters: {
                formFactors: [],
                diseases: []
            }
        };
        this._onSearchChange = this._onSearchChange.bind(this);
        this._submitGroupSearch = this._submitGroupSearch.bind(this);
        this._addRemoveDiseaseFilter = this._addRemoveDiseaseFilter.bind(this);
        this._filterSearchResults = this._filterSearchResults.bind(this);
        this._addRemoveFormFactorFilter = this._addRemoveFormFactorFilter.bind(this);
    }

    public render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Propeller Health - Front End Developer Skills Assessment</h1>
                </header>
                <main className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-8 col-lg-6">
                            <form className="p-3" onSubmit={this._submitGroupSearch}>
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
                                {
                                    // display submit button if search string is not empty
                                    this.state.currentSearch.length > 0 ?
                                        <button
                                            type="submit"
                                            className="btn btn-primary">Submit</button>
                                        :
                                        null
                                }
                            </form>
                        </div>
                    </div>
                    {
                        this.state.searchResults.length > 0 ?
                            <div className="row">
                                {/*filters*/}
                                <div className="col-12">
                                    <h3><u>Filters</u></h3>
                                </div>
                                <div className="col-4">
                                    <h5>Form Factor</h5>
                                    {map(this.state.filterOptions.formFactors, (formFactor: string, index: number) => {
                                        const id: string = 'form-factor-' + index;
                                        return (
                                            <div key={index}>
                                                <label htmlFor={id}>
                                                    {formFactor}
                                                    <input type="checkbox"
                                                           id={id}
                                                           checked={this.state.appliedFilters.formFactors.indexOf(formFactor) !== -1}
                                                           onChange={this._addRemoveFormFactorFilter.bind(this, formFactor)}/>
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="col-4">
                                    <h5>Diseases</h5>
                                    {map(this.state.filterOptions.diseases, (disease: string, index: number) => {
                                        const id: string = 'disease-' + index;
                                        return (
                                            <div key={index}>
                                                <label htmlFor={id}>
                                                    {disease}
                                                    <input
                                                        type="checkbox"
                                                        id={id}
                                                        checked={this.state.appliedFilters.diseases.indexOf(disease) !== -1}
                                                        onChange={this._addRemoveDiseaseFilter.bind(this, disease)}/>
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="col-4">
                                    <h5>Sensors (todo)</h5>
                                    <div>
                                        <label htmlFor="sensor-na">
                                            No filter
                                            <input type="radio"
                                                   name="sensor"
                                                   id="sensor-na"
                                                   disabled={true}
                                                   checked={true}
                                                   readOnly={true}/>
                                        </label>
                                        <br/>
                                        <label htmlFor="sensor-yes">
                                            Has sensor
                                            <input type="radio"
                                                   name="sensor"
                                                   id="sensor-yes"
                                                   disabled={true}
                                                   checked={false}
                                                   readOnly={true}/>
                                        </label>
                                        <br/>
                                        <label htmlFor="sensor-no">
                                            Does not have sensor
                                            <input type="radio"
                                                   name="sensor"
                                                   id="sensor-no"
                                                   disabled={true}
                                                   checked={false}
                                                   readOnly={true}/>
                                        </label>
                                    </div>
                                </div>
                                {/*data*/}
                                <div className="col-12">
                                    <table className="table table-striped">
                                        <thead>
                                        <tr>
                                            <th scope="col">Id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Short Name</th>
                                            <th scope="col">Type</th>
                                            <th scope="col">Form Factor</th>
                                            <th scope="col">Sensors</th>
                                            <th scope="col">Diseases</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {map(this.state.filteredResults, (medication: IMedicationInterface, index: number) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{medication.id}</td>
                                                    <td>{medication.name}</td>
                                                    <td>{medication.shortName}</td>
                                                    <td>{medication.type}</td>
                                                    <td>{medication.formFactor}</td>
                                                    <td>{medication.sensors ? medication.sensors.join(', ') : '-'}</td>
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
                                                    {this.state.filteredResults.length}
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
                        !!this.state.error && this.state.isSearchComplete && !this.state.isInitialPageState ?
                            <div className="alert alert-warning" role="alert">
                                <h4><u>¡Errors encountered!</u></h4>
                                <div className="row justify-content-center">
                                    {map(this.state.error.elements, (errorField: IErrorFieldInterface, index: number) => {
                                        return (
                                            <div key={index} className="col-6 error-field">
                                                <p>
                                                    Id: {errorField.id}
                                                </p>
                                                <p>
                                                    Field: {errorField.field}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
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
        // reset ui after user input
        this.setState({
            currentSearch: searchValue,
            isInitialPageState: false,
            isSearchComplete: false,
            error: undefined,
            // reset search results
            searchResults: [],
            filteredResults: [],
            // reset filters
            filterOptions: {
                formFactors: [],
                diseases: [],
            },
            appliedFilters: {
                formFactors: [],
                diseases: []
            }
        });
    }

    private _submitGroupSearch(e: React.MouseEvent<HTMLFormElement>): void {
        e.preventDefault();
        // only call api if search string is not empty
        if (this.state.currentSearch.length > 0) {
            // todo, move api url to .env config file
            axios({
                method: 'GET',
                url: 'https://dev.propellerhealth.com/api/groups/' + this.state.currentSearch + '/config',
                headers: {
                    'x-ph-api-version': '3.31.0'
                }
            })
                .then((response: AxiosResponse<IGroupConfigInterface>) => {
                    const uniqueFormFactors: string[] = uniq(
                        map(response.data.medications, (medication: IMedicationInterface) => {
                            return medication.formFactor;
                        })
                    );
                    const uniqueDiseases: string[] = [];
                    map(response.data.medications, (medication: IMedicationInterface) => {
                        medication.diseases.forEach((disease: string) => {
                            if (uniqueDiseases.indexOf(disease) === -1) {
                                uniqueDiseases.push(disease);
                            }
                        });
                    });

                    this.setState({
                        searchResults: response.data.medications,
                        filteredResults: response.data.medications,
                        filterOptions: {
                            formFactors: uniqueFormFactors,
                            diseases: uniqueDiseases,
                        },
                        isSearchComplete: true
                    });
                })
                .catch((error: AxiosError) => {
                    // null check for ts happiness
                    this.setState({
                        error: !!error && !!error.response ? error.response.data : error,
                        isSearchComplete: true
                    });
                });
        }
    }

    private _addRemoveDiseaseFilter(diseaseFilter: string): void {
        let appliedDiseaseFilters: string[] = cloneDeep(this.state.appliedFilters.diseases);
        if (this.state.appliedFilters.diseases.indexOf(diseaseFilter) === -1) {
            // add disease to filter
            appliedDiseaseFilters = [
                ...appliedDiseaseFilters,
                diseaseFilter
            ]
        } else {
            // remove disease from filter
            appliedDiseaseFilters = filter(this.state.appliedFilters.diseases, (disease: string) => {
                return disease !== diseaseFilter
            });
        }
        this.setState(
            {
                appliedFilters: {
                    ...this.state.appliedFilters,
                    diseases: appliedDiseaseFilters
                }
            },
            () => {
                this._filterSearchResults();
            });
    }

    private _addRemoveFormFactorFilter(formFactorFilter: string): void {
        let appliedFormFactorFilters: string[] = cloneDeep(this.state.appliedFilters.formFactors);
        if (this.state.appliedFilters.formFactors.indexOf(formFactorFilter) === -1) {
            // add disease to filter
            appliedFormFactorFilters = [
                ...appliedFormFactorFilters,
                formFactorFilter
            ]
        } else {
            // remove disease from filter
            appliedFormFactorFilters = filter(this.state.appliedFilters.formFactors, (formFactor: string) => {
                return formFactor !== formFactorFilter
            });
        }
        this.setState(
            {
                appliedFilters: {
                    ...this.state.appliedFilters,
                    formFactors: appliedFormFactorFilters
                }
            },
            () => {
                this._filterSearchResults();
            });
    }


    private _filterSearchResults(): void {
        this.setState({
            filteredResults: filter(this.state.searchResults, (medication: IMedicationInterface) => {
                // filter diseases
                if (this.state.appliedFilters.diseases.length > 0) {
                    let hasDiseaseFilter: boolean = false;
                    for (const disease of medication.diseases) {
                        if (this.state.appliedFilters.diseases.indexOf(disease) !== -1) {
                            hasDiseaseFilter = true;
                        }
                    }
                    if (!hasDiseaseFilter) {
                        return false;
                    }
                }
                // filter form factors
                if (this.state.appliedFilters.formFactors.length > 0) {
                    if (this.state.appliedFilters.formFactors.indexOf(medication.formFactor) === -1) {
                        return false
                    }
                }
                return true;
            })
        });
    }
}

export default App;
