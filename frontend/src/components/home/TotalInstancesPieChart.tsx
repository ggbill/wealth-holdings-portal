import React from 'react';
import "./totalInstancesPieChart.scss"
import { Card, Button, CardActions, CardContent } from "@material-ui/core"
import { Pie } from "react-chartjs-2"
import 'chartjs-plugin-datalabels'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'

interface InputProps {
    onTimeCount: number,
    atRiskCount: number,
    overdueCount: number,
    completeCount: number,
    pathname: string
    title: string
}

const TotalInstancesPieChart = (props: InputProps) => {

    const data = {
        labels: [
            'On Time',
            'At Risk',
            'Overdue'
        ],
        datasets: [{
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
                                <td className="label-cell">Complete:</td>
                                <td className="value-cell">{props.completeCount}</td>
                            </tr>
                            <tr>
                                {props.pathname !== "marriage-bureau" && <td className="label-cell">Onboarding:</td>}
                                {props.pathname === "marriage-bureau" && <td className="label-cell">In Progress:</td>}
                                <td className="value-cell">{props.onTimeCount + props.atRiskCount + props.overdueCount}</td>
                            </tr>
                            <tr className="total-row">
                                <td className="label-cell">Total:</td>
                                <td className="value-cell">{props.onTimeCount + props.atRiskCount + props.overdueCount + props.completeCount}</td>
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

                    {props.pathname !== "marriage-bureau" && <span className="pie-chart-label">(Onboarding Firms by RAG status)</span>}
                    {props.pathname === "marriage-bureau" && <span className="pie-chart-label">(In Progress Deals by RAG status)</span>}

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