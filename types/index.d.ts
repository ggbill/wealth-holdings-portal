declare module App {

    interface Season{
        _id: string,
        name: string,
        location: string,
        startDate: Date,
        endDate: Date,
        teamList: Team[],
        playerList: Player[],
        fixtureList: Fixture[],
        isActive: boolean
    } 

    interface Team{
        _id: string,
        name: string,
        isActive: boolean
    }

    interface Player{
        _id: string,
        firstName: string,
        surname: string,
        imageUrl: string,
        isActive: boolean
    } 

    interface FixturePlayer{
        _id: any,
        player: Player,
        goalCount: number,
        penaltyCount: number,
        isMotm: boolean
    }

    interface Fixture{
        _id: string,
        fixtureType: string,
        kickoffDateTime: Date,
        result: string,
        goalsAgainst: number,
        oppositionOwnGoals: number,
        isPenalties: boolean,
        opposition: Team,
        players: FixturePlayer[],
        isActive: boolean
    } 
}