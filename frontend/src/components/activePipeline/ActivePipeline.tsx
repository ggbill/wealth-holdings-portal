import React, { useState, useRef } from 'react'
import './activePipeline.scss';
import useFetch from "../../hooks/useFetch"
import { Box } from '@material-ui/core'
import Loading from '../shared/Loading';
import ActivityCard from '../activityCard/ActivityCard'
import useCommonFunctions from '../../hooks/useCommonFunctions';

const ActivePipeline = ({ match }) => {
    const isCancelled = useRef(false)
    const kissflowApi = useFetch("kissflow")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [activitySummaries, setActivitySummaries] = useState<App.ActivitySummary[]>([])
    const [totalActivitySummary, setTotalActivitySummary] = useState<App.ActivitySummary>({ name: "", link: "", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 })

    const commonFunctions = useCommonFunctions()

    const getLatestDataForActiveCases = (): void => {
        setLoading(true)
        kissflowApi.get("getLatestDataForActiveCases")
            .then(data => {
                if (!isCancelled.current) {
                    calculateActivitySummaries(data)
                    // console.log(JSON.stringify(data))
                    setLoading(false)
                }
            })
            .catch((err: Error) => {
                if (!isCancelled.current) {
                    setError(err.message)
                }
            })
    }

    const calculateActivitySummaries = (activeCases: App.ActiveCase[]): void => {

        let totalActivitySummary: App.ActivitySummary = { name: "Total Instances", link: "all-instances", redSla: 0, amberSla: 0, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 }

        let activitySummaries: App.ActivitySummary[] = [
            { name: "Onboard Lead", link: "onboard-lead", redSla: 2, amberSla: 1, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Initial Fee Payment", link: "initial-fee-payment", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "High Level Due Diligence", link: "high-level-due-diligence", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Heads of Terms", link: "heads-of-terms", redSla: 42, amberSla: 10, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Detailed Due Diligence", link: "detailed-due-diligence", redSla: 56, amberSla: 12, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Formal Offer", link: "formal-offer", redSla: 14, amberSla: 5, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Transaction Agreement", link: "transaction-agreement", redSla: 28, amberSla: 7, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
            { name: "Final Fee Payment", link: "final-fee-payment", redSla: 30, amberSla: 2, totalCount: 0, greenCount: 0, amberCount: 0, redCount: 0 },
        ]

        activeCases.forEach(activeCase => {
            // console.log(JSON.stringify(activeCase))
            let activeCaseNameFound = false
            activitySummaries.forEach(activitySummary => {
                if (activeCase._current_step === activitySummary.name) {
                    activitySummary.totalCount++
                    totalActivitySummary.totalCount++
                    activeCaseNameFound = true
                    if (commonFunctions.determineRAGStatus(activeCase) === "GREEN") {
                        activitySummary.greenCount++
                        totalActivitySummary.greenCount++
                    } else if (commonFunctions.determineRAGStatus(activeCase) === "AMBER") {
                        activitySummary.amberCount++
                        totalActivitySummary.amberCount++
                    } else {
                        activitySummary.redCount++
                        totalActivitySummary.redCount++
                    }
                }
            });

            if (!activeCaseNameFound) {
                console.log(`could not match active case name ${activeCase._current_step}`)
            }

        });

        setActivitySummaries(activitySummaries)
        setTotalActivitySummary(totalActivitySummary)

    }

    React.useEffect(() => {
        getLatestDataForActiveCases();

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
        <div className="content active-pipeline">
            <h1>Active Pipeline</h1>
            <p>The figures below represent a snapshot of the firms that are currently live in the system.</p>
            <Box className="total-instances-box" display="flex" flexDirection="row" flexWrap="wrap">
                <ActivityCard activitySummary={totalActivitySummary} index={0} />
                {/* <div className="ghost-card"></div>
                <div className="ghost-card"></div> */}
            </Box>
            <Box display="flex" flexDirection="row" flexWrap="wrap">
                {activitySummaries.map((activityCount: App.ActivitySummary, index: number) => {
                    return (
                        <ActivityCard activitySummary={activityCount} index={index} key={index} />
                    )
                })}
            </Box>
        </div >
    )
}

export default ActivePipeline