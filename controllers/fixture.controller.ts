import Fixture, { IFixture } from '../models/fixture.model';

var mongoose = require('mongoose');

export namespace FixtureController {

    export async function GetFixtures(): Promise<IFixture[]> {
        return new Promise((resolve: (result: IFixture[]) => void, reject: (error: Error) => void) => {
            Fixture
                .find({}, function (err, result) {
                    if (err) {
                        console.error("Error: " + err);
                    }
                    resolve(result);
                })
                .populate('season opposition players motm scorers penaltyScorers'); // expands the nested objects in the output
        });
    }

    export async function GetFixtureById(id: string): Promise<IFixture> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Fixture.findById(id, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
                .populate('season opposition players motm scorers penaltyScorers'); // expands the nested team objects in the output
        });
    }

    export async function CreateFixture(fixture: IFixture): Promise<IFixture> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            console.log(fixture);
            Fixture.create({
                fixtureType: fixture.fixtureType,
                kickoffDateTime: fixture.kickoffDateTime,
                isWin: fixture.isWin,
                goalsAgainst: fixture.goalsAgainst,
                isPenalties: fixture.isPenalties,
                penaltiesAgainst: fixture.penaltiesAgainst,
                season: fixture.season,
                opposition: fixture.opposition,
                players: fixture.players,
                motm: fixture.motm,
                scorers: fixture.scorers,
                pentaltyScorers: fixture.pentaltyScorers
            }, function (err, result: IFixture) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

    export async function UpdateFixture(id: string, fixture: IFixture): Promise<IFixture> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Fixture.findByIdAndUpdate(id, {
                fixtureType: fixture.fixtureType,
                kickoffDateTime: fixture.kickoffDateTime,
                isWin: fixture.isWin,
                goalsAgainst: fixture.goalsAgainst,
                isPenalties: fixture.isPenalties,
                penaltiesAgainst: fixture.penaltiesAgainst,
                season: fixture.season,
                opposition: fixture.opposition,
                players: fixture.players,
                motm: fixture.motm,
                scorers: fixture.scorers,
                pentaltyScorers: fixture.pentaltyScorers
            }, function (err, result) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

}