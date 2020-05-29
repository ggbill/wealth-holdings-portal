import React, { useEffect, useRef, useState } from 'react';
import "./totalInstancesPieChart.scss"
import { Card, Button, CardActions, CardContent } from "@material-ui/core"
// import { Pie } from "react-chartjs-2"
import 'chartjs-plugin-datalabels'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'
import Chartjs from 'chart.js'

interface InputProps {
    onTimeCount: number,
    atRiskCount: number,
    overdueCount: number
}

const TotalInstancesPieChart = (props: InputProps) => {

    const chartConfig = {
        type: 'pie',
        data: {
            labels: [
                'On Time',
                'At Risk',
                'Overdue'
            ],
            datasets: [{
                // data: [1, 2, 3],
                data: [props.onTimeCount, props.atRiskCount, props.overdueCount],
                backgroundColor: [
                    '#57ab6e',
                    '#FF8C42',
                    '#EE6055'
                ],
                hoverBackgroundColor: [
                    '#57ab6e',
                    '#FF8C42',
                    '#EE6055'
                ]
            }]
        },
        options: {
            responsive: true,
            // legend: {
            //     position: "bottom",
            //     align: "middle"
            // },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            plugins: {
                datalabels: {
                    formatter: (value, ctx) => {
                        if (value) {
                            return value;
                        }
    
                        return '';
                    },
                    color: '#fff',
                    font: {
                        weight: 'bold',
                        size: 16,
                    }
    
                }
            }
        }
    }

    const chartContainer = useRef(null);
    const [chartInstance, setChartInstance] = useState<any>(null);

    const updateDataset = (datasetIndex, newData) => {
        chartInstance.data.datasets[datasetIndex].data = newData;
        chartInstance.update();
    };

    useEffect(() => {
        // console.log("set up chart")
        if (chartContainer && chartContainer.current) {
            // console.log("new chart")
            const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
            setChartInstance(newChartInstance);
        }
    }, [chartContainer]);

    // useEffect(() => {
    //     console.log(props)
    //     if (chartInstance) {
    //         console.log("chart instance")
    //         console.log(chartInstance.data.datasets[0].data)
    //         if ((chartInstance.data.datasets[0].data[0] !== props.onTimeCount) ||
    //             (chartInstance.data.datasets[0].data[1] !== props.atRiskCount) ||
    //             (chartInstance.data.datasets[0].data[2] !== props.overdueCount)) {
    //             console.log("update data")
    //             const data = [props.onTimeCount, props.atRiskCount, props.overdueCount]
    //             updateDataset(0, data)
    //         }
    //     }
    // }, [props]);

    return (
        <div className="total-instances-pie-chart">
            <h3>Active Instances</h3>
            <Card>
                <CardContent>
                    <h2>Total: {props.onTimeCount + props.atRiskCount + props.overdueCount}</h2>
                    <div className="chart-wrapper">
                        {/* <Pie
                            data={data}
                            options={options}
                            ref={(reference) => setChartReference(reference)}
                        /> */}
                        <canvas ref={chartContainer} />
                    </div>

                </CardContent>

                <CardActions>
                    <Button component={Link} to="/active-pipeline">Active Pipeline <NavigateNextIcon /></Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default TotalInstancesPieChart