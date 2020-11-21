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

const Home = () => {
    const isCancelled = useRef(false)
    const marriageBureauApi = useFetch("marriage-bureau")
    const buyerOnboardingApi = useFetch("buyer-onboarding")
    const sellerOnboardingApi = useFetch("seller-onboarding")
    const settingsApi = useFetch("settings")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const [activeCases, setActiveCases] = useState<App.ActivityDetail[]>([])
    const [completedCases, setCompletedCases] = useState<App.ActivityDetail[]>([])
    const [actions, setActions] = useState<App.ActivityDetail[]>([])
    const [totalActivitySummary, setTotalActivitySummary] = useState<App.ActivitySummary>({ name: "", link: "", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 })
    const commonFunctions = useCommonFunctions()

    let location = useLocation();

    const getLatestDataForActiveMarriageBureauCases = (): void => {
        setLoading(true)
        marriageBureauApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    calculateMarriageBureauActivitySummaries(data)
                    setActiveCases(data)
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

    const getMarriageBureauActions = (): void => {
        setLoading(true)
        marriageBureauApi.get("getActions")
            .then(data => {
                if (!isCancelled.current) {
                    setActions(data)
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

    const getMarriageBureauCompletedCases = (): void => {
        setLoading(true)
        marriageBureauApi.get("getClosedCases")
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

    const getLatestDataForActiveBuyerOnboardingCases = (): void => {
        setLoading(true)
        buyerOnboardingApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    calculateBuyerOnboardingActivitySummaries(data)
                    setActiveCases(data)
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

    const getBuyerOnboardingActions = (): void => {
        setLoading(true)
        buyerOnboardingApi.get("getActions")
            .then(data => {
                if (!isCancelled.current) {
                    setActions(data)
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

    const getLatestDataForActiveSellerOnboardingCases = (): void => {
        setLoading(true)
        sellerOnboardingApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    calculateSellerOnboardingActivitySummaries(data)
                    setActiveCases(data)
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

    const getSellerOnboardingActions = (): void => {
        setLoading(true)
        sellerOnboardingApi.get("getActions")
            .then(data => {
                if (!isCancelled.current) {
                    setActions(data)
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

    const calculateMarriageBureauActivitySummaries = (activeCases: App.ActivityDetail[]): void => {
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "marriage-bureau/all-instances", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        let activitySummaries: App.ActivitySummary[] = []


        //TODO - work out how to pull this fetch block into common functions
        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    data.filter(result => result.process === "marriage-bureau").sort((a, b) => a.orderNumber - b.orderNumber).forEach(setting => {
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


    const calculateBuyerOnboardingActivitySummaries = (activeCases: App.ActivityDetail[]): void => {
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "buyer-onboarding/all-instances", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        let activitySummaries: App.ActivitySummary[] = []


        //TODO - work out how to pull this fetch block into common functions
        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    data.filter(result => result.process === "buyer-onboarding").sort((a, b) => a.orderNumber - b.orderNumber).forEach(setting => {
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

    const calculateSellerOnboardingActivitySummaries = (activeCases: App.ActivityDetail[]): void => {
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "seller-onboarding/all-instances", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        let activitySummaries: App.ActivitySummary[] = []


        //TODO - work out how to pull this fetch block into common functions
        settingsApi.get("getSettings")
            .then((data: App.Setting[]) => {
                if (!isCancelled.current) {
                    data.filter(result => result.process === "seller-onboarding").sort((a, b) => a.orderNumber - b.orderNumber).forEach(setting => {
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

        //location.pathname will give you current route path 
        if (location.pathname.split("/")[1] === "marriage-bureau") {
            getLatestDataForActiveMarriageBureauCases();
            getMarriageBureauActions();
            getMarriageBureauCompletedCases();
        } else if (location.pathname.split("/")[1] === "buyer-onboarding") {
            getLatestDataForActiveBuyerOnboardingCases();
            getBuyerOnboardingActions();
        } else if (location.pathname.split("/")[1] === "seller-onboarding") {
            getLatestDataForActiveSellerOnboardingCases();
            getSellerOnboardingActions();
        }

        return () => {
            isCancelled.current = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

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
                    {location.pathname.split("/")[1] === "marriage-bureau" &&
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