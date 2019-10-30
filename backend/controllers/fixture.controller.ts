import Fixture, { IFixture } from '../models/fixture.model';

var mongoose = require('mongoose');

export namespace FixtureController {

    export async function GetFixtures(): Promise<IFixture[]> {
        return new Promise((resolve: (result: IFixture[]) => void, reject: (error: Error) => void) => {
            Fixture
                .find({ isActive: true }, function (err, result) {
                    if (err) {
                        console.error("Error: " + err);
                    }
                    resolve(result);
                })
                .populate('opposition players.player'); // expands the nested objects in the output
                // .populate({
                //     path: 'players',
                //     model: 'FixturePlayer',
                //     populate: [{
                //         path: 'player',
                //         model: 'Player'
                //     }]
                // })
                // .populate({
                //     path: 'opposition',
                //     model: 'Team'
                // })
        });
    }

    export async function GetFixturesForSeason(seasonId: string): Promise<IFixture[]> {
        return new Promise((resolve: (result: IFixture[]) => void, reject: (error: Error) => void) => {
            Fixture
                .find({seasonId: seasonId, isActive: true }, function (err, result) {
                    if (err) {
                        console.error("Error: " + err);
                    }
                    resolve(result);
                })
                .populate('opposition players.player'); // expands the nested objects in the output
        });
    }

    export async function GetFixtureById(id: string): Promise<IFixture> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Fixture.findById({ _id: id, isActive: true }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
                .populate('opposition players.player'); // expands the nested objects in the output
                // .populate({
                //     path: 'players',
                //     model: 'FixturePlayer',
                //     populate: [{
                //         path: 'player',
                //         model: 'Player'
                //     }]
                // })
                // .populate({
                //     path: 'opposition',
                //     model: 'Team'
                // })
        });
    }

    export async function CreateFixture(fixture: IFixture): Promise<IFixture> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Fixture.create({
                fixtureType: fixture.fixtureType,
                kickoffDateTime: fixture.kickoffDateTime,
                result: fixture.result,
                goalsAgainst: fixture.goalsAgainst,
                oppositionOwnGoals: fixture.oppositionOwnGoals,
                isPenalties: fixture.isPenalties,
                penaltiesAgainst: fixture.penaltiesAgainst,
                opposition: fixture.opposition._id,
                players: fixture.players,
                isActive: true
            }, function (err, result) {      
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(GetFixtureById(result._id));
            })
                
        });
    }

    export async function UpdateFixture(id: string, fixture: IFixture): Promise<IFixture> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Fixture.findByIdAndUpdate(id, { ...fixture }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

}