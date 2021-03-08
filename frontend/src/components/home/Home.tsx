import React, { useState, useRef } from 'react'
import './home.scss'
import useCommonFunctions from '../../hooks/useCommonFunctions'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import TotalInstancesPieChart from './TotalInstancesPieChart'
import ActivityBarChart from './ActivityBarChart'
import LatestActions from './LatestActions'
import { useLocation } from 'react-router-dom'
import SummaryFigures from '../activePipeline/SummaryFigures'
import { FormControlLabel, Switch } from '@material-ui/core'

const Home = () => {
    const isCancelled = useRef(false)
    const settingsApi = useFetch("settings")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const [activeCases, setActiveCases] = useState<App.ActivityDetail[]>([])
    const [completedCases, setCompletedCases] = useState<App.ActivityDetail[]>([])
    const [actions, setActions] = useState<App.ActivityDetail[]>([])
    const [totalActivitySummary, setTotalActivitySummary] = useState<App.ActivitySummary>({ name: "", link: "", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 })
    const commonFunctions = useCommonFunctions()
    const [isSimplyBizFilter, setIsSimplyBizFilter] = useState<boolean>(false)

    let location = useLocation();

    let process = ""

    if (location.pathname.split("/")[1] === "marriage-bureau") {
        process = "marriage-bureau"
    } else if (location.pathname.split("/")[1] === "buyer-onboarding") {
        process = "buyer-onboarding"
    } else if (location.pathname.split("/")[1] === "seller-onboarding") {
        process = "seller-onboarding"
    }

    const processApi = useFetch(process)

    const getLatestDataForActiveCases = (): void => {
        setLoading(true)
        processApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    if (isSimplyBizFilter) {
                        if (location.pathname.split("/")[1] === "marriage-bureau") {
                            setActiveCases(data.filter((activeCase) =>
                                activeCase.isSimplyBizDeal === true
                            ))

                            calculateActivitySummaries(data.filter((activeCase) =>
                                activeCase.isSimplyBizDeal === true
                            ))

                        } else {
                            setActiveCases(data.filter((activeCase) =>
                                (activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true")
                            ))

                            calculateActivitySummaries(data.filter((activeCase) =>
                                (activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true")
                            ))

                        }
                    } else {
                        calculateActivitySummaries(data)
                        setActiveCases(data)
                    }

                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    const getActions = (): void => {
        setLoading(true)
        processApi.get("getActions")
            .then(data => {
                if (!isCancelled.current) {
                    if (isSimplyBizFilter) {
                        if (location.pathname.split("/")[1] === "marriage-bureau") {
                            setActions(data.filter((activeCase) =>
                                activeCase.isSimplyBizDeal === true
                            ))
                        } else {
                            setActions(data.filter((activeCase) =>
                                (activeCase.isSimplyBizMember === true || activeCase.isSimplyBizMember === "true")
                            ))
                        }
                    } else {
                        setActions(data)
                    }
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    const getCompletedCases = (): void => {
        setLoading(true)
        processApi.get("getClosedCases")
            .then(data => {
                if (!isCancelled.current) {
                    setCompletedCases(data.filter(result => result.activityAction !== "Close Case"))
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    setError(err.message)
                    setLoading(false)
                }
            })
    }

    const calculateActivitySummaries = (activeCases: App.ActivityDetail[]): void => {
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: `${location.pathname.split("/")[1]}/all-instances`, redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        let activitySummaries: App.ActivitySummary[] = []

        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    data.filter(result => result.process === location.pathname.split("/")[1]).sort((a, b) => a.orderNumber - b.orderNumber).forEach(setting => {
                        activitySummaries.push({
                            name: setting.activityName,
                            link: "",
                            amberSla: setting.amberSla,
                            redSla: setting.redSla,
                            greenCount: 0,
                            amberCount: 0,
                            redCount: 0,
                            totalCount: 0
                        })
                    });

                    let tempActivitySummaries = commonFunctions.calculateActivitySummaries(activeCases, activitySummaries)
                    setActivitySummaries(tempActivitySummaries)

                    tempActivitySummaries.forEach(tempActivitySummary => {
                        tempTotalActivitySummary.totalCount += tempActivitySummary.totalCount
                        tempTotalActivitySummary.greenCount += tempActivitySummary.greenCount
                        tempTotalActivitySummary.amberCount += tempActivitySummary.amberCount
                        tempTotalActivitySummary.redCount += tempActivitySummary.redCount
                    });

                    setTotalActivitySummary(tempTotalActivitySummary)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    console.log(err)
                }
            })
    }

    React.useEffect(() => {
            return () => {
                // console.log("return")
                isCancelled.current = true;
            };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    React.useEffect(() => {
        getCompletedCases()
        getLatestDataForActiveCases()
        getActions()

        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, [isSimplyBizFilter]);

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <>
            {activeCases &&
                <div className="content home-page">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isSimplyBizFilter}
                                onChange={() => setIsSimplyBizFilter(!isSimplyBizFilter)}
                                name="isSimplyBizFilter"
                            />
                        }
                        label={`Display SimplyBiz Data Only: ${isSimplyBizFilter.valueOf()}`}
                    />
                    {(location.pathname.split("/")[1] === "marriage-bureau" || location.pathname.split("/")[1] === "buyer-onboarding") &&
                        <div className="summary-figures-wrapper">
                            <SummaryFigures
                                activeCases={activeCases}
                                isFilterApplied={() => false}
                                clearAllFilters={() => false}
                                pathname={location.pathname.split("/")[1]}
                                title="Pipeline - Summary Figures"
                            />
                        </div>
                    }

                    <div className="row-1">
                        {location.pathname.split("/")[1] === "marriage-bureau" &&
                            <TotalInstancesPieChart
                                onTimeCount={totalActivitySummary.greenCount}
                                atRiskCount={totalActivitySummary.amberCount}
                                overdueCount={totalActivitySummary.redCount}
                                completeCount={completedCases.length}
                                pathname={location.pathname.split("/")[1]}
                                title="All Deals"
                            />
                        }
                        {location.pathname.split("/")[1] !== "marriage-bureau" &&
                            <TotalInstancesPieChart
                                onTimeCount={totalActivitySummary.greenCount}
                                atRiskCount={totalActivitySummary.amberCount}
                                overdueCount={totalActivitySummary.redCount}
                                completeCount={activeCases.filter(result => result._current_step === "Complete").length}
                                pathname={location.pathname.split("/")[1]}
                                title="Firms"

                            />
                        }
                        <ActivityBarChart
                            activitySummaries={activitySummaries}
                            pathname={location.pathname.split("/")[1]}
                            title="Pipeline - Activity Breakdown"
                        />
                    </div>
                    <div className="latest-actions-wrapper">
                        <LatestActions
                            actions={actions}
                            pathname={location.pathname.split("/")[1]}
                        />
                    </div>
                </div>
            }
        </>
    )
}

export default Home