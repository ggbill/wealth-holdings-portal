import React from 'react';
import "./totalInstancesPieChart.scss"
import { Card, Button, CardActions, CardContent } from "@material-ui/core"
import { Pie } from "react-chartjs-2"
import 'chartjs-plugin-datalabels'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'

interface InputProps {
    activeCount: number,
    onHoldCount: number,
    completeCount: number,
    closedCount: number,
    pathname: string
    title: string
}

const activeColor = '#F61067'
const onHoldColor = '#a7a7a7'
const completedColor = '#011936'

const TotalInstancesPieChart = (props: InputProps) => {

    const data = {
        labels: [
            'Active',
            'On Hold',
            'Completed',
        ],
        datasets: [{
            // data: [7, 3, 15],
            data: [props.activeCount, props.onHoldCount, props.completeCount],
            backgroundColor: [
                activeColor,
                onHoldColor,
                completedColor
            ],
            hoverBackgroundColor: [
                activeColor,
                onHoldColor,
                completedColor
            ]
        }]

    };

    const options = {
        responsive: true,
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

    return (
        <div className="total-instances-pie-chart">
            <h3>{props.title}</h3>
            <Card>
                <CardContent>
                    <table className="summary-table">
                        <tbody>
                            <tr>
                                <td className="label-cell">
                                    <div className="key-wrapper">
                                        <div className="key" style={{ backgroundColor: activeColor }}></div>
                                        Active:
                                    </div>
                                </td>
                                <td className="value-cell">{props.activeCount}</td>
                            </tr>
                            <tr>
                                <td className="label-cell">
                                <div className="key-wrapper">
                                        <div className="key" style={{ backgroundColor: onHoldColor }}></div>
                                        On Hold:
                                    </div>
                                </td>
                                <td className="value-cell">{props.onHoldCount}</td>
                            </tr>
                            <tr>
                                <td className="label-cell">
                                <div className="key-wrapper">
                                        <div className="key" style={{ backgroundColor: completedColor }}></div>
                                        Complete:
                                    </div>
                                </td>
                                <td className="value-cell">{props.completeCount}</td>
                            </tr>
                            <tr className="total-row">
                                <td className="label-cell">Total:</td>
                                <td className="value-cell">{props.activeCount + props.onHoldCount + props.completeCount}</td>
                            </tr>
                            <tr className="aborted-row">
                                <td className="label-cell">(Aborted):</td>
                                <td className="value-cell">{props.closedCount}</td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <h2>Total: {props.onTimeCount + props.atRiskCount + props.overdueCount}</h2>
                    <h2>Complete: {props.completeCount}</h2> */}

                    <div className="chart-wrapper">
                        <Pie
                            data={data}
                            options={options}
                        />
                    </div>

                    {/* {props.pathname !== "marriage-bureau" && <span className="pie-chart-label">(Onboarding Firms by RAG status)</span>}
                    {props.pathname === "marriage-bureau" && <span className="pie-chart-label">(In Progress Deals by RAG status)</span>} */}

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

export default TotalInstancesPieChart