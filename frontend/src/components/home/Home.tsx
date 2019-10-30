import './home.scss';
import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import useFetch from "../../hooks/useFetch"
import moment from 'moment'
import LastNextFixturesSection from './LastNextFixturesSection';
import PlayerCard from '../player/PlayerCard';
import SeasonResultsSummaryTable from '../season/SeasonResultsSummaryTable';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: 150
        },
    }),
);

const Home = () => {

    const classes = useStyles();

    const seasonsApi = useFetch(
        "http://localhost:8080/seasons"
    );

    const [currentSeason, setCurrentSeason] = useState<App.Season>({
        _id: "",
        name: "",
        location: "",
        startDate: new Date(),
        endDate: new Date(),
        teamList: [],
        playerList: [],
        fixtureList: [],
        isActive: false
    })
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const getCurrentSeason = (): void => {
        setLoading(true)
        seasonsApi.get("getCurrentSeason")
            .then((data: App.Season[]) => {
                data[0].fixtureList.sort((a, b) => {
                    return (a.kickoffDateTime > b.kickoffDateTime ? -1 : 1)
                })
                setCurrentSeason(data[0])
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
                setLoading(false)
            })
    }

    React.useEffect(() => {
        getCurrentSeason();
    }, []);

    if (loading) {
        return (
            <i>Loading...</i>
        )
    }

    if (error) {
        return (
            <i>{error}</i>
        )
    }

    return (
        <>
            <div className="header-section">
                <div className="hero-image">
                    <img src={require('../../images/hero-image.png')} />
                </div>
            </div>

            <div className="content">
                <div className="last-next-fixture-section">
                    <LastNextFixturesSection fixtureList={currentSeason.fixtureList} />
                </div>
                <h2>Fixtures & Results</h2>
                <SeasonResultsSummaryTable
                    fixtureList={currentSeason.fixtureList}
                />
            </div>
        </>
    )
}

export default Home