import React from "react"
import "./activityBarChart.scss"
import { Card, Button, CardActions, CardContent } from "@material-ui/core"
import { Bar } from "react-chartjs-2"
import 'chartjs-plugin-datalabels'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'

interface InputProps {
    activitySummaries: App.ActivitySummary[]
    activeCases: App.ActivityDetail[]
    pathname: string
    title: string
}

const highConfidenceColor = '#57ab6e'
const mediumConfidenceColor = '#FF8C42'
const lowConfidenceColor = '#EE6055'
const onHoldColor = '#a7a7a7'

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

    const getGreyCountDataset = () => {
        if (props.activitySummaries.length) {
            let greyCountDataset = []

            props.activitySummaries.forEach(element => {
                greyCountDataset.push(element.greyCount)
            });

            return (greyCountDataset)
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
        labels: getLabels(),
        datasets: [
            {
                label: "HIGH",
                data: getGreenCountDataset(),
                backgroundColor: highConfidenceColor,
            },
            {
                label: "MEDIUM",
                data: getAmberCountDataset(),
                backgroundColor: mediumConfidenceColor,
            },
            {
                label: "LOW",
                data: getRedCountDataset(),
                backgroundColor: lowConfidenceColor,
            },
            {
                label: "HOLD",
                data: getGreyCountDataset(),
                backgroundColor: onHoldColor,
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
            callbacks: {
                label: function (tooltipItem, data) {
                    let instances = []
                    props.activeCases.forEach(activeCase => {
                        if (activeCase._current_step === tooltipItem.xLabel) {
                            if (activeCase.confidence === data.datasets[tooltipItem.datasetIndex].label) {
                                { props.pathname === "marriage-bureau" &&  instances.push(`${activeCase.buyer} purchasing ${activeCase.seller}`)}
                                { props.pathname === "seller-onboarding" && instances.push(activeCase.firmName) }
                                { props.pathname === "buyer-onboarding" &&  instances.push(activeCase.firmName)}
                                
                            }
                        }
                    });
                    return instances
                }
            }
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
            <h3>{props.title}</h3>
            <Card>
                <CardContent>
                    <span className="key-title">Key</span>
                    <table className="summary-table">
                        <tbody>
                            <tr>
                                <td className="label-cell">
                                    <div className="key-wrapper">
                                        <div className="key" style={{ backgroundColor: highConfidenceColor }}></div>
                                        High Confidence
                                    </div>
                                </td>
                                <td className="label-cell">
                                    <div className="key-wrapper">
                                        <div className="key" style={{ backgroundColor: mediumConfidenceColor }}></div>
                                        Medium Confidence
                                    </div>
                                </td>
                                <td className="label-cell">
                                    <div className="key-wrapper">
                                        <div className="key" style={{ backgroundColor: lowConfidenceColor }}></div>
                                        Low Confidence
                                    </div>
                                </td>
                                <td className="label-cell">
                                    <div className="key-wrapper">
                                        <div className="key" style={{ backgroundColor: onHoldColor }}></div>
                                        On Hold
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="chart-container">
                        <Bar
                            data={data}
                            options={options}
                        />
                    </div>

                </CardContent>
                <CardActions>
                    {props.pathname === "marriage-bureau" && <Button component={Link} to="/marriage-bureau/active-pipeline">Pipeline <NavigateNextIcon /></Button>}
                    {props.pathname === "seller-onboarding" && <Button component={Link} to="/seller-onboarding/active-pipeline">Pipeline <NavigateNextIcon /></Button>}
                    {props.pathname === "buyer-onboarding" && <Button component={Link} to="/buyer-onboarding/active-pipeline">Pipeline <NavigateNextIcon /></Button>}
                </CardActions>
            </Card>

        </div>
    )
}

export default ActivityBarChart