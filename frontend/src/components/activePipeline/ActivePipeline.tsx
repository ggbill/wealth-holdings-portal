import React, { useState, useRef } from 'react'
import './activePipeline.scss';
import useFetch from "../../hooks/useFetch"
import { Box } from '@material-ui/core'
import Loading from '../shared/Loading';
import ActivityCard from '../shared/ActivityCard'
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

        let tempActivitySummaries = commonFunctions.calculateActivitySummaries(activeCases)
        setActivitySummaries(tempActivitySummaries)

        tempActivitySummaries.forEach(activitySummary => {
            totalActivitySummary.totalCount += activitySummary.totalCount
            totalActivitySummary.greenCount += activitySummary.greenCount
            totalActivitySummary.amberCount += activitySummary.amberCount
            totalActivitySummary.redCount += activitySummary.redCount
        });

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
                {activitySummaries.map((activitySummary: App.ActivitySummary, index: number) => {
                    return (
                        <ActivityCard activitySummary={activitySummary} index={index} key={index} />
                    )
                })}
            </Box>
        </div >
    )
}

export default ActivePipeline