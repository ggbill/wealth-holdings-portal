import Team, {ITeam} from '../models/team.model';

var mongoose = require('mongoose');

export namespace TeamController {
    
    export async function GetTeams(): Promise<ITeam[]> {
        return new Promise((resolve: (result: ITeam[]) => void, reject: (error: Error) => void) => {
            Team
            .find({}, function (err, result) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

    export async function GetTeamById(id: string): Promise<any> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Team.findById(id, function (err, result) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

    export async function UpdateTeam(id: string, team: ITeam): Promise<ITeam> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Team.findByIdAndUpdate(id, {
                name: team.name,
            }, function (err, result) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }

    export async function CreateTeam(team: ITeam): Promise<ITeam> {
        return new Promise((resolve: (result) => void, reject: (error: Error) => void) => {
            Team.create({
                name: team.name,
            }, function (err, result: ITeam) {
                if (err){
                    console.error("Error: " + err);
                }
                resolve(result);
            });
        });
    }
}