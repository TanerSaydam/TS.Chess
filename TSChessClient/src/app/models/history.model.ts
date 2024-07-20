import { StoneColorType, StoneType } from "./game.model";

export class HistoryModel{
    stone: StoneType = "";
    numberOfMoves: number = 1;
    row: number = 1;
    column: number = 1;
    move: string = "";
    color: StoneColorType = "White";
}