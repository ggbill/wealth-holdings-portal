import React, { useState, useRef } from 'react'
import './home.scss'
// import useCommonFunctions from '../../hooks/useCommonFunctions'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import TotalInstancesPieChart from './TotalInstancesPieChart'
import ActivityBarChart from './ActivityBarChart'
import LatestActions from './LatestActions'
import { useLocation } from 'react-router-dom'
import SummaryFigures from '../activePipeline/SummaryFigures'
import { FormControlLabel, Switch } from '@material-ui/core'

interface InputProps {
    auth: any
}

const Home = (props: InputProps) => {
    const isCancelled = useRef(false)
    // const settingsApi = useFetch("settings")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const [activeCases, setActiveCases] = useState<App.ActivityDetail[]>([])
    const [completedCases, setCompletedCases] = useState<App.ActivityDetail[]>([])
    const [closedCases, setClosedCases] = useState<App.ActivityDetail[]>([])
    const [actions, setActions] = useState<App.ActivityDetail[]>([])
    const [totalActivitySummary, setTotalActivitySummary] = useState<App.ActivitySummary>({} as App.ActivitySummary)
    // const commonFunctions = useCommonFunctions()
    const [isSimplyBizFilter, setIsSimplyBizFilter] = useState<boolean>(null)
    const [authorisedUserProfile, setAuthorisedUserProfile] = useState<any>(null)

    const { getProfile, isAuthenticated } = props.auth;

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
                    setClosedCases(data.filter(result => result.activityAction === "Close Case"))
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
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "", totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0 }
        let tempActivitySummaries: App.ActivitySummary[] = []

        if (location.pathname.split("/")[1] === "marriage-bureau") {
            tempActivitySummaries =
                [
                    { name: "Introductions", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Heads of Terms", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Detailed Due Diligence", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Formal Offer", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Transaction Agreement", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Fee Payment", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 }
                ]
        } else if (location.pathname.split("/")[1] === "buyer-onboarding") {
            tempActivitySummaries =
                [
                    { name: "Introductory Call", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Director Follow Up", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Buyer Due Diligence", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Buyer's Pack", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                ]
        } else if (location.pathname.split("/")[1] === "seller-onboarding") {
            tempActivitySummaries =
                [
                    { name: "Introductory Call", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Director Follow Up", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Seller Due Diligence", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                    { name: "Seller's Pack", link: "", greenCount: 0, amberCount: 0, redCount: 0, greyCount: 0, totalCount: 0 },
                ]
        }

        activeCases.forEach(activeCase => {
            tempActivitySummaries.forEach(activitySummary => {
                if (activeCase._current_step === activitySummary.name) {
                    activitySummary.totalCount++
                    if (activeCase.confidence === "HIGH") {
                        activitySummary.greenCount++
                    } else if (activeCase.confidence === "MEDIUM") {
                        activitySummary.amberCount++
                    } else if (activeCase.confidence === "LOW") {
                        activitySummary.redCount++
                    } else if (activeCase.confidence === "HOLD") {
                        activitySummary.greyCount++
                    }
                }
            });
        });

        tempActivitySummaries.forEach(tempActivitySummary => {
            tempTotalActivitySummary.totalCount += tempActivitySummary.totalCount
            tempTotalActivitySummary.greenCount += tempActivitySummary.greenCount
            tempTotalActivitySummary.amberCount += tempActivitySummary.amberCount
            tempTotalActivitySummary.redCount += tempActivitySummary.redCount
            tempTotalActivitySummary.greyCount += tempActivitySummary.greyCount
        });

        setActivitySummaries(tempActivitySummaries)
        setTotalActivitySummary(tempTotalActivitySummary)


    }

    React.useEffect(() => {
        if (isAuthenticated() && !isCancelled.current) {
            getProfile((err, profile) => {
                if (err) {
                    console.log(err)
                }
                setAuthorisedUserProfile(profile)

                if (profile && profile.name !== "a.morley@simplybiz.co.uk") {
                    setIsSimplyBizFilter(false)
                }else{
                    setIsSimplyBizFilter(true)
                }
            });
        }

        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    React.useEffect(() => {
        if (isSimplyBizFilter !== null){
            getCompletedCases()
            getLatestDataForActiveCases()
            getActions()
        }
        

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
            {activeCases.length > 0 &&
                <div className="content home-page">
                    {isSimplyBizFilter !== null && authorisedUserProfile && authorisedUserProfile.name !== "a.morley@simplybiz.co.uk" &&
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
                    }

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
                                activeCount={totalActivitySummary.greenCount + totalActivitySummary.amberCount + totalActivitySummary.redCount}
                                onHoldCount={totalActivitySummary.greyCount}
                                completeCount={completedCases.length}
                                closedCount={closedCases.length}
                                pathname={location.pathname.split("/")[1]}
                                title="All Deals"
                            />
                        }
                        {location.pathname.split("/")[1] !== "marriage-bureau" &&
                            <TotalInstancesPieChart
                                activeCount={totalActivitySummary.greenCount + totalActivitySummary.amberCount + totalActivitySummary.redCount}
                                onHoldCount={totalActivitySummary.greyCount}
                                completeCount={activeCases.filter(result => result._current_step === "Complete").length}
                                closedCount={closedCases.length}
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