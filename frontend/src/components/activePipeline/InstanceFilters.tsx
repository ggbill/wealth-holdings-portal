import './instanceFilters.scss';
import React, { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import useCommonFunctions from '../../hooks/useCommonFunctions';

interface InputProps {
    activeCases: App.ActivityDetail[]
    activitySummaries: App.ActivitySummary[]
    setFilteredActiveCases: (filteredActiveCases: App.ActivityDetail[]) => void
    setTableFilters: (tableFilters: App.TableFilters) => void
    tableFilters: App.TableFilters
    path: string
    isFilterApplied: () => boolean
    clearAllFilters: () => void
    pathname: string
}

const InstanceFilters = (props: InputProps) => {
    const [uniqueActivityNames, setUniqueActivityNames] = useState<string[]>([])
    const [uniqueBdmNames, setUniqueBdmNames] = useState<string[]>([])
    const [uniqueRagStatuses, setUniqueRagStatuses] = useState<string[]>([])

    const commonFunctions = useCommonFunctions()

    const generateFilterLists = (): void => {
        let uniqueActivityNames: string[] = props.activeCases.map(activeCase => activeCase._current_step)
        setUniqueActivityNames([...new Set(uniqueActivityNames)])

        let uniqueRagStatuses: string[] = props.activeCases.map(activeCase => commonFunctions.determineRAGStatus(activeCase, props.activitySummaries))
        setUniqueRagStatuses([...new Set(uniqueRagStatuses)])

        let uniqueBdmNames: string[] = props.activeCases.map(activeCase => activeCase._current_assigned_to.Name)
        setUniqueBdmNames([...new Set(uniqueBdmNames)])
    }

    const filterActiveCases = (): void => {
        let filteredActiveCases = props.activeCases;

        filteredActiveCases = filteredActiveCases.filter(activeCase => {

            let currentRAGStatus
            currentRAGStatus = commonFunctions.determineRAGStatus(activeCase, props.activitySummaries)

            return (
                (props.tableFilters.currentActivity === "All" || activeCase._current_step === props.tableFilters.currentActivity) &&
                (props.tableFilters.ragStatus === "All" || currentRAGStatus === props.tableFilters.ragStatus) &&
                (props.tableFilters.assignedBdm === "All" || activeCase._current_assigned_to.Name === props.tableFilters.assignedBdm)
            )
        });

        props.setFilteredActiveCases(filteredActiveCases)

    }

    const handleChange = (event) => {
        const value = event.target.value;
        props.setTableFilters({
            ...props.tableFilters,
            [event.target.name]: value
        });
    }

    React.useEffect(() => {
        generateFilterLists();
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    //fire when table filter changed
    React.useEffect(() => {
        filterActiveCases()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tableFilters]);

    return (
        <div className="filters">
            <h3>Filters {props.isFilterApplied() && <span className="clear-filters" onClick={() => props.clearAllFilters()}>Clear</span>}</h3>
            <div className="dropdown-wrapper">
                <FormControl className="current-activity">
                    <InputLabel id="current-activity-select-label">Current Activity</InputLabel>
                    <Select
                        labelId="current-activity-select-label"
                        id="current-activity-select"
                        name="currentActivity"
                        value={props.tableFilters.currentActivity}
                        onChange={handleChange}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {
                            uniqueActivityNames.map((activityName: string, index: number) => {
                                return (<MenuItem className="highlighted" key={index} value={activityName}>{activityName}</MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className="rag-status">
                    <InputLabel id="rag-status-select-label">RAG Status</InputLabel>
                    <Select
                        labelId="rag-status-select-label"
                        id="rag-status-select"
                        name="ragStatus"
                        value={props.tableFilters.ragStatus}
                        onChange={handleChange}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {
                            uniqueRagStatuses.map((ragStatus: string, index: number) => {
                                return (<MenuItem className="highlighted" key={index} value={ragStatus}>{ragStatus}</MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className="assigned-bdm">
                    <InputLabel id="assigned-bdm-select-label">Assignee</InputLabel>
                    <Select
                        labelId="assigned-bdm-select-label"
                        id="assigned-bdm-select"
                        name="assignedBdm"
                        value={props.tableFilters.assignedBdm}
                        onChange={handleChange}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {
                            uniqueBdmNames.map((bdmName: string, index: number) => {
                                return (<MenuItem className="highlighted" key={index} value={bdmName}>{bdmName}</MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
            </div>
        </div>
    )
}

export default InstanceFilters