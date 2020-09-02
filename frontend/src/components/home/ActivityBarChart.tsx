import React from "react"
import "./activityBarChart.scss"
import { Card, Button, CardActions, CardContent } from "@material-ui/core"
import { Bar } from "react-chartjs-2"
import 'chartjs-plugin-datalabels'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'

interface InputProps {
    activitySummaries: App.ActivitySummary[]
    pathname: string
}

const ActivityBarChart = (props: InputProps) => {

    const getGreenCountDataset = () => {
        if (props.activitySummaries.length) {
            let greenCountDataset = []

            props.activitySummaries.forEach(element => {
                greenCountDataset.push(element.greenCount)
            });

            return (greenCountDataset)
        }
    }
    const getAmberCountDataset = () => {
        if (props.activitySummaries.length) {
            let greenCountDataset = []

            props.activitySummaries.forEach(element => {
                greenCountDataset.push(element.amberCount)
            });

            return (greenCountDataset)
        }
    }

    const getRedCountDataset = () => {
        if (props.activitySummaries.length) {
            let greenCountDataset = []

            props.activitySummaries.forEach(element => {
                greenCountDataset.push(element.redCount)
            });

            return (greenCountDataset)
        }
    }

    const getLabels = () => {
        if (props.activitySummaries.length) {
            let labels = []

            props.activitySummaries.forEach(element => {
                labels.push(element.name)
            });

            return (labels)
        }
    }

    const data = {
        // labels: ["Onboard Lead", "Initial Fee Payment", "High Level Due Diligence", "Heads of Terms", "Detailed Due Diligence",
        //     "Formal Offer", "Transaction Agreement", "Final Fee Payment"],
        labels: getLabels(),
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
                    {props.pathname === "marriage-bureau" ?
                        <Button component={Link} to="/marriage-bureau/active-pipeline">Active Pipeline <NavigateNextIcon /></Button> :
                        <Button component={Link} to="/buyer-onboarding/active-pipeline">Active Pipeline <NavigateNextIcon /></Button>
                    }

                </CardActions>
            </Card>

        </div>
    )
}

export default ActivityBarChart