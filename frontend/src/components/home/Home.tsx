import './home.scss';
import React, { useState } from 'react'
import useFetch from "../../hooks/useFetch"
import moment from 'moment'
import LastNextFixturesSection from '../fixture/LastNextFixturesSection'
import FixtureCard from '../fixture/FixtureCard'
import Loading from '../shared/Loading';

const Home = () => {

    const seasonsApi = useFetch("seasons");
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

    const [futureFixtureList, setFutureFixtureList] = useState<App.Fixture[]>([]);
    const [pastFixtureList, setPastFixtureList] = useState<App.Fixture[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const getCurrentSeason = (): void => {
        setLoading(true)
        seasonsApi.get("getCurrentSeason")
            .then((data: App.Season[]) => {
                // console.log(`data: ${JSON.stringify(data)}`) 

                if (data.length) {
                    data[0].fixtureList.sort((a, b) => {
                        return (a.kickoffDateTime > b.kickoffDateTime ? -1 : 1)
                    })
                    setCurrentSeason(data[0])
                    sortFixtures(data[0])
                }
                setLoading(false)
            })
            .catch((err: Error) => {
                setError(err.message)
                setLoading(false)
            })
    }

    const sortFixtures = (season: App.Season) => {
        let now = moment()
        let pastFixtureList: App.Fixture[] = []
        let futureFixtureList: App.Fixture[] = []

        season.fixtureList.forEach(fixture => {
            if (moment(fixture.kickoffDateTime).isBefore(now)) {
                pastFixtureList.push(fixture)
            } else if (moment(fixture.kickoffDateTime).isAfter(now)) {
                futureFixtureList.push(fixture)
            }
        });

        pastFixtureList.sort((a, b) => {
            return (a.kickoffDateTime > b.kickoffDateTime ? -1 : 1)
        })
        futureFixtureList.sort((a, b) => {
            return (a.kickoffDateTime > b.kickoffDateTime ? -1 : 1)
        })

        setPastFixtureList(pastFixtureList)
        setFutureFixtureList(futureFixtureList)

    }

    React.useEffect(() => {
        getCurrentSeason();
        // eslint-disable-next-line react-hooks/exhaustive-deps  
    }, []);

    if (loading) {
        return (
            <Loading />
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
                    <img alt="" src={require('../../images/hero-image.png')} />
                </div>
            </div>

            <div className="content position-relative">
                <div className="last-next-fixture-section">
                    <LastNextFixturesSection fixtureList={currentSeason.fixtureList} />
                </div>
                <div style={{ display: futureFixtureList.length ? 'block' : 'none' }}>
                    <h2>Fixtures</h2>
                    {futureFixtureList.map(fixture => {
                        return (<div className="fixture-card-div" key={fixture._id}><FixtureCard fixture={fixture} /></div>)
                    })}
                    <br />
                </div>

                <div style={{ display: currentSeason._id ? 'block' : 'none' }}>
                    <h2>Results</h2>
                    {pastFixtureList.map(fixture => {
                        return (<div className="fixture-card-div" key={fixture._id}><FixtureCard fixture={fixture} /></div>)
                    })}
                </div>
            </div>
        </>
    )
}

export default Home