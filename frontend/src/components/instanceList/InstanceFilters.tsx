import './instanceFilters.scss';
import React, { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, Link } from "@material-ui/core";
import useCommonFunctions from '../../hooks/useCommonFunctions';

interface InputProps {
    activeCases: App.ActiveCase[]
    setFilteredActiveCases: (filteredActiveCases: App.ActiveCase[]) => void
    setTableFilters: (tableFilters: App.TableFilters) => void
    tableFilters: App.TableFilters
    path: string
}

const InstanceFilters = (props: InputProps) => {
    const [uniqueActivityNames, setUniqueActivityNames] = useState<string[]>([])
    const [uniqueBdmNames, setUniqueBdmNames] = useState<string[]>([])
    const [uniqueRagStatuses, setUniqueRagStatuses] = useState<string[]>([])

    const commonFunctions = useCommonFunctions()

    const generateFilterLists = (): void => {
        let uniqueActivityNames: string[] = props.activeCases.map(activeCase => activeCase._current_step)
        setUniqueActivityNames([...new Set(uniqueActivityNames)])

        let uniqueRagStatuses: string[] = props.activeCases.map(activeCase => commonFunctions.determineRAGStatus(activeCase))
        setUniqueRagStatuses([...new Set(uniqueRagStatuses)])

        let uniqueBdmNames: string[] = props.activeCases.map(activeCase => activeCase.assignedBdm.Name)
        setUniqueBdmNames([...new Set(uniqueBdmNames)])

        let activeCaseFound = false
        uniqueActivityNames.forEach(uniqueActivityName => {
            if (!activeCaseFound) {
                if (props.path === "/onboard-lead" && uniqueActivityName == "Onboard Lead") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "Onboard Lead" })
                } else if (props.path === "/initial-fee-payment" && uniqueActivityName === "Initial Fee Payment") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "Initial Fee Payment" })
                } else if (props.path === "/high-level-due-diligence" && uniqueActivityName === "High Level Due Diligence") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "High Level Due Diligence" })
                } else if (props.path === "/heads-of-terms" && uniqueActivityName === "Heads of Terms") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "Heads of Terms" })
                } else if (props.path === "/detailed-due-diligence" && uniqueActivityName === "Detailed Due Diligence") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "Detailed Due Diligence" })
                } else if (props.path === "/formal-offer" && uniqueActivityName === "Formal Offer") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "Formal Offer" })
                } else if (props.path === "/transaction-agreement" && uniqueActivityName === "Transaction Agreement") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "Transaction Agreement" })
                } else if (props.path === "/final-fee-payment" && uniqueActivityName === "Final Fee Payment") {
                    activeCaseFound = true
                    props.setTableFilters({ ...props.tableFilters, currentActivity: "Final Fee Payment" })
                }
            }
        });
    }

    const filterActiveCases = (): void => {
        let filteredActiveCases = props.activeCases;

        filteredActiveCases = filteredActiveCases.filter(activeCase => {
            return (
                (props.tableFilters.currentActivity === "All" || activeCase._current_step === props.tableFilters.currentActivity) &&
                (props.tableFilters.ragStatus === "All" || commonFunctions.determineRAGStatus(activeCase) === props.tableFilters.ragStatus) &&
                (props.tableFilters.assignedBdm === "All" || activeCase.assignedBdm.Name === props.tableFilters.assignedBdm)
            )
        });

        props.setFilteredActiveCases(filteredActiveCases)

    }

    const clearFilters = (): void => {
        props.setTableFilters({
            currentActivity: "All",
            ragStatus: "All",
            assignedBdm: "All"
        })
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
            <h2>Filters</h2>
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
                                return (<MenuItem key={index} value={activityName}>{activityName}</MenuItem>)
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
                                return (<MenuItem key={index} value={ragStatus}>{ragStatus}</MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
                <FormControl className="assigned-bdm">
                    <InputLabel id="assigned-bdm-select-label">Assigned BDM</InputLabel>
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
                                return (<MenuItem key={index} value={bdmName}>{bdmName}</MenuItem>)
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            {
                (props.tableFilters.currentActivity !== "All" ||
                    props.tableFilters.ragStatus !== "All" ||
                    props.tableFilters.assignedBdm !== "All") &&

                <Link onClick={clearFilters}>
                    Clear Filters
                </Link>
            }


        </div>
    )
}

export default InstanceFilters