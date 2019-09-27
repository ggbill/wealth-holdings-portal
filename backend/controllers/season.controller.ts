import Season, {ISeason} from '../models/season.model';
import Team, {ITeam} from '../models/team.model';

var mongoose = require('mongoose');

export namespace SeasonController {
    
    export async function GetSeasons(): Promise<ISeason[]> {
        return new Promise((resolve: (result: ISeason[]) => void, reject: (error: Error) => void) => {
            Season
            .find({}, function (err, result) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            })
            .populate('teams'); // expands the nested team objects in the output
        });
    }

    export async function GetSeasonById(id: string): Promise<any> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Season.findById(id, function (err, result) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            })
            .populate('teams'); // expands the nested team objects in the output
        });
    }

    export async function UpdateSeason(id: string, season: ISeason): Promise<any> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Season.findByIdAndUpdate(id, {
                name: season.name,
                location: season.location,
                startDate: new Date(season.startDate),
                endDate: new Date(season.endDate),
                teams: season.teams
            }, function (err, result) {
                if (err){
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
                startDate: new Date(season.startDate),
                endDate: new Date(season.endDate),
                teams: season.teams      
            }, function (err, result: ISeason) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }
}