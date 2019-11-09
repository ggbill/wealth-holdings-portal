import React, { Component } from "react"
import ConfigureFixtureDialog from "./ConfigureFixtureDialog"
import FixtureTable from "./FixtureTable"
import './fixture.scss'
import Button from "@material-ui/core/Button"

interface FixtureState {
    fixture: App.Fixture,
    fixtureList: App.Fixture[],
    playerList: App.Player[],
    teamList: App.Team[],
    isCreateFixtureDialogOpen: boolean
    isEditFixtureDialogOpen: boolean
}

class FixtureAdmin extends Component<{}, FixtureState> {

    constructor(props) {
        super(props);
        this.state = {
            fixture: {
                _id: "",
                fixtureType: "",
                kickoffDateTime: new Date(),
                result: "",
                goalsAgainst: 0,
                oppositionOwnGoals: 0,
                isPenalties: false,
                opposition: {
                    _id: "",
                    name: "",
                    isActive: true
                },
                players: [],
                isActive: true
            },
            fixtureList: [],
            playerList: [],
            teamList: [],
            isCreateFixtureDialogOpen: false,
            isEditFixtureDialogOpen: false,
        };
    }

    componentDidMount() {
        this.getFixtures()
        // this.getPlayers()
        this.getTeams()
    }


    getFixtures = (): void => {
        fetch('http://localhost:8080/fixtures/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ fixtureList: data })
            })
            .catch(error => {
                console.log(`something didnt work: ${error}`);
            })
    }

    createFixture = (fixture: App.Fixture): void => {
        fetch('http://localhost:8080/fixtures/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fixture
            })
        })
            .then(res => res.json())
            .then(data => {
                this.getFixtures()
            })
            .catch(error => {
                console.log(`something didnt work: ${error}`);
            })
    }

    deleteFixture = (id): void => {

        let fixtureToDelete;
        this.state.fixtureList.forEach(fixture => {
            if (fixture._id === id) {
                fixtureToDelete = fixture;
                fixtureToDelete.isActive = false;
            }
        });

        this.updateFixture(fixtureToDelete);

    }

    updateFixture = (fixture: App.Fixture): void => {

        fetch(`http://localhost:8080/fixtures/${fixture._id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fixture: fixture
            })
        })
            .then(res => res.json())
            .then(data => {
                // console.log(`that worked: ${JSON.stringify(data)}`);
                this.getFixtures();
            })
            .catch(error => {
                console.log(`something didnt work: ${error}`);
            })
    }

    getTeams = (): void => {
        fetch('http://localhost:8080/teams/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ teamList: data })
            })
            .catch(error => {
                console.log(`something didnt work: ${error}`);
            })
    }

    handleClose = () => {
        this.setState({ isCreateFixtureDialogOpen: false })
    };

    handleClickOpen = () => {
        this.setState({ isCreateFixtureDialogOpen: true })
    };


    render() {
        return (
            <div className="fixture">
                <h2>Fixtures</h2>
                <FixtureTable
                    fixtureList={this.state.fixtureList}
                    teamList={this.state.teamList}
                    playerList={this.state.playerList}
                    deleteFixture={this.deleteFixture}
                    updateFixture={this.updateFixture}
                    createFixture={this.createFixture}
                />
                <br />
                <div className="button-container">
                    <Button variant="contained" onClick={this.handleClickOpen}> Create New Fixture </Button>
                </div>

                {/* Create Fixture Dialog */}
                <ConfigureFixtureDialog
                    isFixtureDialogOpen={this.state.isCreateFixtureDialogOpen}
                    handleClose={this.handleClose}
                    createFixture={this.createFixture}
                    updateFixture={this.updateFixture}
                    teamList={this.state.teamList}
                    playerList={this.state.playerList}
                    isCreateFixtureDialog={true}
                    fixture={this.state.fixture}
                />

                
            </div>
        )
    }

}

export default FixtureAdmin