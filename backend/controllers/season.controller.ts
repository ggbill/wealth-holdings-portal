import Season, { ISeason } from '../models/season.model';
import Fixture, { IFixture } from '../models/fixture.model';
import Team, { ITeam } from '../models/team.model';
import { IPlayer } from '../models/player.model';
import { IFixturePlayer } from '../models/fixturePlayer.model';
import { PlayerController } from './player.controller'

var mongoose = require('mongoose');
const moment = require('moment')

interface SeasonStat {
    seasonName: string,
    seasonId: string,
    seasonStartDate: Date,
    capCount: number,
    goalCount: number,
    motmCount: number,
    winCount: number,
    lossCount: number
}

interface PlayerSeasonStat {
    player: any,
    seasonStat: SeasonStat
}

interface PlayerCareerStat {
    player: any,
    seasonStatList: SeasonStat[],
    capTotal: number,
    goalTotal: number,
    motmTotal: number,
    winTotal: number,
    lossTotal: number
}

export namespace SeasonController {

    export async function GetSeasons(): Promise<ISeason[]> {
        return new Promise((resolve: (result: ISeason[]) => void, reject: (error: Error) => void) => {
            Season
                .find({ isActive: true }, function (err, result) {
                    if (err) {
                        console.error("Error: " + err);
                    }
                    resolve(result);
                })
                // .populate('teamList fixtureList fixtureList.opposition fixtureList.players.player'); // expands the nested objects in the output
                .populate({
                    path: 'fixtureList',
                    model: 'Fixture',
                    populate: [
                        {
                            path: 'opposition',
                            model: 'Team'
                        },
                        {
                            path: 'players.player',
                            model: 'Player',
                        }
                    ]
                })
                .populate({
                    path: 'teamList',
                    model: 'Team'
                })
                .populate({
                    path: 'playerList',
                    model: 'Player'
                })
        });
    }

    export async function GetSeasonById(id: string): Promise<ISeason> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Season.findById({ _id: id, isActive: true }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            })
                // .populate('teamList fixtureList fixtureList.opposition '); // expands the nested objects in the output
                .populate({
                    path: 'fixtureList',
                    model: 'Fixture',
                    populate: [
                        {
                            path: 'opposition',
                            model: 'Team'
                        },
                        {
                            path: 'players.player',
                            model: 'Player',
                        }
                    ]
                })
                .populate({
                    path: 'teamList',
                    model: 'Team'
                })
                .populate({
                    path: 'playerList',
                    model: 'Player'
                })
                .populate({
                    path: 'accoladeList.player',
                    model: 'Player'
                })

        });
    }

    export async function UpdateSeason(id: string, season: ISeason): Promise<any> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Season.findByIdAndUpdate(id, {
                name: season.name,
                location: season.location,
                imageUrl: season.imageUrl,
                startDate: new Date(season.startDate),
                endDate: new Date(season.endDate),
                teamList: season.teamList,
                playerList: season.playerList,
                fixtureList: season.fixtureList,
                accoladeList: season.accoladeList,
                isActive: season.isActive
            }, function (err, result) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

    export async function CreateSeason(season: ISeason): Promise<any> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            console.log(season);
            Season.create({
                name: season.name,
                location: season.location,
                imageUrl: season.imageUrl,
                startDate: new Date(season.startDate),
                endDate: new Date(season.endDate),
                teamList: season.teamList,
                fixtureList: season.fixtureList,
                accoladeList: season.accoladeList,
                isActive: true
            }, function (err, result: ISeason) {
                if (err) {
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

    export async function GetPlayerSeasonStats(seasonId: string): Promise<any> {
        let season: ISeason = await GetSeasonById(seasonId);

        let playerSeasonStatList: PlayerSeasonStat[] = [];

        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            // Create first instance of each player
            season.fixtureList.forEach((fixture: IFixture) => {
                fixture.players.forEach((fixturePlayer: IFixturePlayer) => {
                    let playerSeasonStat: PlayerSeasonStat = { player: {}, seasonStat: { seasonName: "", seasonId: "", seasonStartDate: new Date(), capCount: 0, goalCount: 0, motmCount: 0, winCount: 0, lossCount: 0 } };

                    var index = playerSeasonStatList.findIndex(x => x.player._id === fixturePlayer.player._id)

                    if (index === -1) {
                        playerSeasonStat.player = fixturePlayer.player
                        playerSeasonStatList.push(playerSeasonStat);
                    }
                });
            });

            season.fixtureList.forEach((fixture: IFixture) => {
                fixture.players.forEach((fixturePlayer: IFixturePlayer) => {
                    playerSeasonStatList.forEach(seasonPlayerStat => {
                        if (fixturePlayer.player._id === seasonPlayerStat.player._id) {
                            seasonPlayerStat.seasonStat.capCount++
                            seasonPlayerStat.seasonStat.goalCount += fixturePlayer.goalCount
                            if (fixturePlayer.isMotm) {
                                seasonPlayerStat.seasonStat.motmCount++
                            }
                            if (fixture.result == "WIN") {
                                seasonPlayerStat.seasonStat.winCount++
                            }
                            if (fixture.result == "LOSS") {
                                seasonPlayerStat.seasonStat.lossCount++
                            }
                        }
                    });
                })
            })
            resolve(playerSeasonStatList)
        })
    }

    export async function GetPlayerCareerStats(playerId: string): Promise<SeasonStat[]> {
        let seasonList: ISeason[] = await GetSeasons();
        let playerCareerStatList: SeasonStat[] = []

        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {

            seasonList.forEach(season => {
                let isPlayedInSeason = false;

                let seasonStat: SeasonStat = {
                    seasonName: season.name,
                    seasonId: season._id,
                    seasonStartDate: season.startDate,
                    capCount: 0,
                    goalCount: 0,
                    lossCount: 0,
                    motmCount: 0,
                    winCount: 0
                }

                season.fixtureList.forEach((fixture: IFixture) => {
                    fixture.players.forEach((fixturePlayer: IFixturePlayer) => {
                        if (fixturePlayer.player._id == playerId) {
                            isPlayedInSeason = true;
                            seasonStat.capCount++
                            seasonStat.goalCount += fixturePlayer.goalCount
                            if (fixturePlayer.isMotm) {
                                seasonStat.motmCount++
                            }
                            if (fixture.result == "WIN") {
                                seasonStat.winCount++
                            }
                            if (fixture.result == "LOSS") {
                                seasonStat.lossCount++
                            }
                        }
                    });
                });

                if (isPlayedInSeason) {
                    playerCareerStatList.push(seasonStat)
                }

            });

            resolve(playerCareerStatList)
        })
    }

    export async function GetAllPlayerCareerStats(): Promise<PlayerCareerStat[]> {
        let seasonList: ISeason[] = await GetSeasons();
        let playerList: IPlayer[] = await PlayerController.GetPlayers();
        let playerCareerStatList: PlayerCareerStat[] = []

        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {

            playerList.forEach(player => {

                let playerCareerStat: PlayerCareerStat = {
                    player: player,
                    seasonStatList: [],
                    capTotal: 0,
                    goalTotal: 0,
                    motmTotal: 0,
                    winTotal: 0,
                    lossTotal: 0
                }

                seasonList.forEach(season => {

                    let seasonStat: SeasonStat = {
                        seasonName: season.name,
                        seasonId: season._id,
                        seasonStartDate: season.startDate,
                        capCount: 0,
                        goalCount: 0,
                        lossCount: 0,
                        motmCount: 0,
                        winCount: 0
                    }

                    season.fixtureList.forEach((fixture: IFixture) => {
                        fixture.players.forEach((fixturePlayer: IFixturePlayer) => {

                            // console.log(`fixturePlayer.player._id: ${fixturePlayer.player._id} - player._id: ${player._id}`)

                            if (String(fixturePlayer.player._id) == String(player._id)) {
                                seasonStat.capCount++
                                playerCareerStat.capTotal++
                                seasonStat.goalCount += fixturePlayer.goalCount
                                playerCareerStat.goalTotal += fixturePlayer.goalCount
                                if (fixturePlayer.isMotm) {
                                    seasonStat.motmCount++
                                    playerCareerStat.motmTotal++
                                }
                                if (fixture.result == "WIN") {
                                    seasonStat.winCount++
                                    playerCareerStat.winTotal++
                                }
                                if (fixture.result == "LOSS") {
                                    seasonStat.lossCount++
                                    playerCareerStat.lossTotal++
                                }
                            }
                        });
                    });
                    playerCareerStat.seasonStatList.push(seasonStat)
                });
                playerCareerStatList.push(playerCareerStat)
            });
            resolve(playerCareerStatList)
        })
    }

    export async function GetCurrentSeason(): Promise<ISeason[]> {
        return new Promise((resolve: (result: ISeason[]) => void, reject: (error: Error) => void) => {

            const today = moment().startOf('day')

            Season
                .find({ isActive: true, startDate: {$lte: today.toDate()}, endDate: {$gte: today.toDate()} }, function (err, result) {
                    if (err) {
                        console.error("Error: " + err);
                    }
                    resolve(result);
                })
                .populate({
                    path: 'fixtureList',
                    model: 'Fixture',
                    populate: [
                        {
                            path: 'opposition',
                            model: 'Team'
                        },
                        {
                            path: 'players.player',
                            model: 'Player',
                        }
                    ]
                })
                .populate({
                    path: 'teamList',
                    model: 'Team'
                })
                .populate({
                    path: 'playerList',
                    model: 'Player'
                })
        });
    }
}