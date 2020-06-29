import React, { useState, useRef } from 'react'
import './home.scss'
import useCommonFunctions from '../../hooks/useCommonFunctions'
import useFetch from "../../hooks/useFetch"
import Loading from '../shared/Loading'
import TotalInstancesPieChart from './TotalInstancesPieChart'
import ActivityBarChart from './ActivityBarChart'
import _ from 'lodash';
import LatestActions from './LatestActions'

interface InputProps {
    auth: any
}

const Home = (props: InputProps) => {

    const { isAuthenticated } = props.auth;
    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const [activeCases, setActiveCases] = useState<App.ActiveCase[]>([])
    const [actions, setActions] = useState<App.ActivityDetail[]>([])
    // const [newActiveCases, setNewActiveCases] = useState<App.ActiveCase[]>([])
    const [totalActivitySummary, setTotalActivitySummary] = useState<App.ActivitySummary>({ name: "", link: "", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 })
    const commonFunctions = useCommonFunctions()


    const getLatestDataForActiveCases = (): void => {
        setLoading(true)
        kissflowApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    calculateActivitySummaries(data)
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

    const getActions = (): void => {
        setLoading(true)
        kissflowApi.get("getActions")
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

    const calculateActivitySummaries = (activeCases: App.ActiveCase[]): void => {
        let tempTotalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "all-instances", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }
        let tempActivitySummaries = commonFunctions.calculateActivitySummaries(activeCases)
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
        getLatestDataForActiveCases();
        getActions();
        // let pollDb = setInterval(() => getLatestDataForActiveCases(), 10000)
        return () => {
            isCancelled.current = true;
            // clearInterval(pollDb)
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    // React.useEffect(() => {

    //     console.log("compare")
    //     console.log(newActiveCases)
    //     console.log(activeCases)

    //     if (_.isEqual(newActiveCases, activeCases)) {
    //         console.log("equal")
    //         console.log("")
    //     } else {
    //         console.log("different")
    //         console.log("")
    //         calculateActivitySummaries(newActiveCases)
    //         setActiveCases(newActiveCases)
    //     }
    // }, [newActiveCases]);

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
                    <h1>Reporting Portal</h1>
                    <div className="row-1">
                        <TotalInstancesPieChart
                            onTimeCount={totalActivitySummary.greenCount}
                            atRiskCount={totalActivitySummary.amberCount}
                            overdueCount={totalActivitySummary.redCount}
                        />
                        <ActivityBarChart
                            activitySummaries={activitySummaries}
                        />
                    </div>
                    {/* {actions && */}
                    <div className="row-2">
                        <LatestActions actions={actions} />
                    </div>
                    {/* } */}

                </div>
            }
        </>

    )
}

export default Home