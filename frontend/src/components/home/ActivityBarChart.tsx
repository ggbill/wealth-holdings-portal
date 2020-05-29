import React from "react"
import "./activityBarChart.scss"
import { Card, Button, CardActions, CardContent } from "@material-ui/core"
import { Bar } from "react-chartjs-2"
import 'chartjs-plugin-datalabels'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'

interface InputProps {
    activitySummaries: App.ActivitySummary[]
}

const ActivityBarChart = (props: InputProps) => {

    const getGreenCountDataset = () => {
        if (props.activitySummaries.length) {
            return ([
                props.activitySummaries[0].greenCount,
                props.activitySummaries[1].greenCount,
                props.activitySummaries[2].greenCount,
                props.activitySummaries[3].greenCount,
                props.activitySummaries[4].greenCount,
                props.activitySummaries[5].greenCount,
                props.activitySummaries[6].greenCount,
                props.activitySummaries[7].greenCount
            ])
        }
    }
    const getAmberCountDataset = () => {
        if (props.activitySummaries.length) {
            return ([
                props.activitySummaries[0].amberCount,
                props.activitySummaries[1].amberCount,
                props.activitySummaries[2].amberCount,
                props.activitySummaries[3].amberCount,
                props.activitySummaries[4].amberCount,
                props.activitySummaries[5].amberCount,
                props.activitySummaries[6].amberCount,
                props.activitySummaries[7].amberCount
            ])
        }
    }
    const getRedCountDataset = () => {
        if (props.activitySummaries.length) {
            return ([
                props.activitySummaries[0].redCount,
                props.activitySummaries[1].redCount,
                props.activitySummaries[2].redCount,
                props.activitySummaries[3].redCount,
                props.activitySummaries[4].redCount,
                props.activitySummaries[5].redCount,
                props.activitySummaries[6].redCount,
                props.activitySummaries[7].redCount
            ])
        }
    }

    const data = {
        labels: ["Onboard Lead", "Initial Fee Payment", "High Level Due Diligence", "Heads of Terms", "Detailed Due Diligence",
            "Formal Offer", "Transaction Agreement", "Final Fee Payment"],
        datasets: [
            {
                label: 'On Time',
                data: getGreenCountDataset(),
                backgroundColor: '#57ab6e',
            },
            {
                label: 'At Risk',
                data: getAmberCountDataset(),
                backgroundColor: '#FF8C42',
            },
            {
                label: 'Overdue',
                data: getRedCountDataset(),
                backgroundColor: '#EE6055',
            }
        ]

    };

    const options = {
        scales: {
            xAxes: [{ stacked: true }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function (value) { if (Number.isInteger(value)) { return value; } },
                    stepSize: 1
                },
                stacked: true
            }]

        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        maintainAspectRatio: false,
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



    return (
        <div className="activity-bar-chart">
            <h3>Activity Breakdown</h3>
            <Card>
                <CardContent>
                    <Bar
                        data={data}
                        options={options}
                    />
                </CardContent>
                <CardActions>
                    <Button component={Link} to="/active-pipeline">Active Pipeline <NavigateNextIcon /></Button>
                </CardActions>
            </Card>

        </div>
    )
}

export default ActivityBarChart