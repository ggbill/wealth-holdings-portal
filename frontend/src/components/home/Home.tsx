import React, { useState, useRef } from 'react'
import './home.scss'
import useCommonFunctions from '../../hooks/useCommonFunctions'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import TotalInstancesPieChart from './TotalInstancesPieChart'
import ActivityBarChart from './ActivityBarChart'
import LatestActions from './LatestActions'
import { useLocation } from 'react-router-dom'

const Home = () => {
    const isCancelled = useRef(false)
    const marriageBureauApi = useFetch("marriage-bureau")
    const buyerOnboardingApi = useFetch("buyer-onboarding")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const [activeCases, setActiveCases] = useState<App.ActivityDetail[]>([])
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

    const calculateMarriageBureauActivitySummaries = (activeCases: App.ActivityDetail[]): void => {
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "marriage-bureau/all-instances", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        let tempActivitySummaries = commonFunctions.calculateMarriageBureauActivitySummaries(activeCases)

        setActivitySummaries(tempActivitySummaries)

        tempActivitySummaries.forEach(tempActivitySummary => {
            tempTotalActivitySummary.totalCount += tempActivitySummary.totalCount
            tempTotalActivitySummary.greenCount += tempActivitySummary.greenCount
            tempTotalActivitySummary.amberCount += tempActivitySummary.amberCount
            tempTotalActivitySummary.redCount += tempActivitySummary.redCount
        });

        setTotalActivitySummary(tempTotalActivitySummary)
    }

    const calculateBuyerOnboardingActivitySummaries = (activeCases: App.ActivityDetail[]): void => {
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "buyer-onboarding/all-instances", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        let tempActivitySummaries = commonFunctions.calculateBuyerOnboardingActivitySummaries(activeCases)

        setActivitySummaries(tempActivitySummaries)

        tempActivitySummaries.forEach(tempActivitySummary => {
            tempTotalActivitySummary.totalCount += tempActivitySummary.totalCount
            tempTotalActivitySummary.greenCount += tempActivitySummary.greenCount
            tempTotalActivitySummary.amberCount += tempActivitySummary.amberCount
            tempTotalActivitySummary.redCount += tempActivitySummary.redCount
        });

        setTotalActivitySummary(tempTotalActivitySummary)
    }



    React.useEffect(() => {

        //location.pathname will give you current route path 
        if (location.pathname.split("/")[1] === "marriage-bureau") {
            getLatestDataForActiveMarriageBureauCases();
            getMarriageBureauActions();
        } else if (location.pathname.split("/")[1] === "buyer-onboarding") {
            getLatestDataForActiveBuyerOnboardingCases();
            getBuyerOnboardingActions();
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
                    <div className="row-1">
                        <TotalInstancesPieChart
                            onTimeCount={totalActivitySummary.greenCount}
                            atRiskCount={totalActivitySummary.amberCount}
                            overdueCount={totalActivitySummary.redCount}
                            pathname={location.pathname.split("/")[1]}
                        />
                        <ActivityBarChart
                            activitySummaries={activitySummaries}
                            pathname={location.pathname.split("/")[1]}
                        />
                    </div>
                    <div className="row-2">
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