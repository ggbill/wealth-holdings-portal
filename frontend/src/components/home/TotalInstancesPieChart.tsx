import React from 'react';
import "./totalInstancesPieChart.scss"
import { Card, Button, CardActions, CardContent } from "@material-ui/core"
import { Pie } from "react-chartjs-2"
import 'chartjs-plugin-datalabels'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import { Link } from 'react-router-dom'

interface InputProps {
    onTimeCount: number
    atRiskCount: number
    overdueCount: number
    pathname: string
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
            <h3>Active Instances</h3>
            <Card>
                <CardContent>
                    <h2>Total: {props.onTimeCount + props.atRiskCount + props.overdueCount}</h2>
                    <div className="chart-wrapper">
                        <Pie
                            data={data}
                            options={options}
                        />
                    </div>

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

export default TotalInstancesPieChart