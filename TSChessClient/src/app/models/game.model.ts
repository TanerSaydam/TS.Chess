export class GameModel{
    stone: StoneType = "";
    row: number = 0;
    column: number = 0;
    color: StoneColorType = "White"
}

export const Games: GameModel[] = [
    // White stones
    { row: 1, column: 1, stone: "rook", color: "White" },
    { row: 2, column: 1, stone: "knight", color: "White" },
    { row: 3, column: 1, stone: "bishop", color: "White" },
    { row: 4, column: 1, stone: "queen", color: "White" },
    { row: 5, column: 1, stone: "king", color: "White" },
    { row: 6, column: 1, stone: "bishop", color: "White" },
    { row: 7, column: 1, stone: "knight", color: "White" },
    { row: 8, column: 1, stone: "rook", color: "White" },
    { row: 1, column: 2, stone: "pawn", color: "White" },
    { row: 2, column: 2, stone: "pawn", color: "White" },
    { row: 3, column: 2, stone: "pawn", color: "White" },
    { row: 4, column: 2, stone: "pawn", color: "White" },
    { row: 5, column: 2, stone: "pawn", color: "White" },
    { row: 6, column: 2, stone: "pawn", color: "White" },
    { row: 7, column: 2, stone: "pawn", color: "White" },
    { row: 8, column: 2, stone: "pawn", color: "White" },

    // Black stones
    { row: 1, column: 8, stone: "rook", color: "Black" },
    { row: 2, column: 8, stone: "knight", color: "Black" },
    { row: 3, column: 8, stone: "bishop", color: "Black" },
    { row: 4, column: 8, stone: "queen", color: "Black" },
    { row: 5, column: 8, stone: "king", color: "Black" },
    { row: 6, column: 8, stone: "bishop", color: "Black" },
    { row: 7, column: 8, stone: "knight", color: "Black" },
    { row: 8, column: 8, stone: "rook", color: "Black" },
    { row: 1, column: 7, stone: "pawn", color: "Black" },
    { row: 2, column: 7, stone: "pawn", color: "Black" },
    { row: 3, column: 7, stone: "pawn", color: "Black" },
    { row: 4, column: 7, stone: "pawn", color: "Black" },
    { row: 5, column: 7, stone: "pawn", color: "Black" },
    { row: 6, column: 7, stone: "pawn", color: "Black" },
    { row: 7, column: 7, stone: "pawn", color: "Black" },
    { row: 8, column: 7, stone: "pawn", color: "Black" }
];

export type StoneColorType = "White" | "Black"
export type StoneType = "" | "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"