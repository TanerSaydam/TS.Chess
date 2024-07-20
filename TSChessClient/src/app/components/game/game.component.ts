import { Component, numberAttribute, signal } from '@angular/core';
import { BoardModel } from '../../models/board.model';
import { CommonModule } from '@angular/common';
import { GameModel, Games, StoneColorType, StoneType } from '../../models/game.model';
import { HistoryModel } from '../../models/history.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export default class GameComponent {
  board = signal<BoardModel>(new BoardModel());
  games = signal<GameModel[]>(Array.from(Games));
  selectedStone = signal<GameModel>(new GameModel());
  whoIsTurn = signal<StoneColorType>("White");
  histories = signal<HistoryModel[]>([]);
  currentPos = signal<{ row: number, column: number }>({ row: 0, column: 0 });
  prevPos = signal<{ row: number, column: number }>({ row: 0, column: 0 });

  haveStone(row: number, column: number) {
    const game = this.games().find(p => p.row == row && p.column == column);
    if (game) {
      let stoneIcon = `fa-${game.color === "White" ? 'regular' : 'solid'} `;
      switch (game.stone) {
        case "pawn":
          stoneIcon += "fa-chess-pawn"
          break;
        case "queen":
          stoneIcon += "fa-chess-queen"
          break;
        case "king":
          stoneIcon += "fa-chess-king"
          break;
        case "rook":
          stoneIcon += "fa-chess-rook"
          break;
        case "bishop":
          stoneIcon += "fa-chess-bishop"
          break;

        case "knight":
          stoneIcon += "fa-chess-knight"
          break;
        default:
          break;
      }
      return stoneIcon
    }

    return "";
  }

  selectOrMoveToStone(row: number, column: number) {
    let game = this.games().find(p => p.row == row && p.column == column);
    if (this.selectedStone().stone !== "" && !game) {
      game = new GameModel();
      game.row = row;
      game.column = column;
      const isItLegalMove = this.checkRules(this.selectedStone(), game);
      if (!isItLegalMove) return;

      this.currentPos.set({ row, column });

      this.setHistory(row, column, false);

      this.selectedStone().row = row;
      this.selectedStone().column = column;
      this.selectedStone.set(new GameModel());
      this.whoIsTurn.set(this.whoIsTurn() === "White" ? "Black" : "White");
    } else if (this.selectedStone().stone !== "" && game) {
      if (this.selectedStone().color === game.color) {
        this.selectedStone.set(game);
        this.prevPos.set({ row, column });
        return;
      }
      const isItLegalMove = this.checkRules(this.selectedStone(), game);
      if (!isItLegalMove) return;

      this.currentPos.set({ row, column });

      game.stone = this.selectedStone().stone;
      game.color = this.selectedStone().color;
      this.setHistory(row, column, true);

      this.selectedStone().stone = "";
      this.whoIsTurn.set(this.whoIsTurn() === "White" ? "Black" : "White");
    } else if (game) {
      if (game.color === this.whoIsTurn()) {
        this.selectedStone.set(game);
        this.prevPos.set({ row, column });
      }
    }

    // Check if the game is over after each move
    if (this.isGameOver()) {
      alert('Game Over');
      this.reset();
    }
  }

  setHistory(row: number, column: number, eatStone: boolean) {
    const history = new HistoryModel();
    history.row = row;
    history.column = column;
    history.stone = this.selectedStone().stone!;
    history.numberOfMoves = this.whoIsTurn() === "White" ? history.numberOfMoves + 1 : history.numberOfMoves;
    history.move = this.setMoveToHistory(this.selectedStone().row, row, column, history.stone, eatStone, this.selectedStone().color!);
    history.color = this.whoIsTurn();
    this.histories.update(prev => [...prev, history]);
  }

  setMoveToHistory(oldRow: number, row: number, column: number, stone: StoneType, eatStone: boolean = false, color: StoneColorType) {
    let rowLetter = "";
    let oldLetter = "";
    if (row === 1) rowLetter = "a";
    else if (row === 2) rowLetter = "b";
    else if (row === 3) rowLetter = "c";
    else if (row === 4) rowLetter = "d";
    else if (row === 5) rowLetter = "e";
    else if (row === 6) rowLetter = "f";
    else if (row === 7) rowLetter = "g";
    else if (row === 8) rowLetter = "h";

    if (oldRow === 1) oldLetter = "a";
    else if (oldRow === 2) oldLetter = "b";
    else if (oldRow === 3) oldLetter = "c";
    else if (oldRow === 4) oldLetter = "d";
    else if (oldRow === 5) oldLetter = "e";
    else if (oldRow === 6) oldLetter = "f";
    else if (oldRow === 7) oldLetter = "g";
    else if (oldRow === 8) oldLetter = "h";

    let stoneIcon = `fa-${color === "White" ? 'regular' : 'solid'} `;
    switch (stone) {
      case "pawn":
        stoneIcon += "fa-chess-pawn"
        break;
      case "queen":
        stoneIcon += "fa-chess-queen"
        break;
      case "king":
        stoneIcon += "fa-chess-king"
        break;
      case "rook":
        stoneIcon += "fa-chess-rook"
        break;
      case "bishop":
        stoneIcon += "fa-chess-bishop"
        break;

      case "knight":
        stoneIcon += "fa-chess-knight"
        break;
      default:
        break;
    }

    return `${stone !== "pawn" ? `<i class="${stoneIcon}"></i>` : ''}${eatStone ? oldLetter + 'x' : ''}${rowLetter}${column}`;
  }

  checkIfThisColumnIsSelected(row: number, column: number, rowIndex: number, columnIndex: number) {
    const kingInDanger = this.isTheKingInDanger();
    const kingPosition = this.games().find(piece => piece.stone === "king" && piece.color === this.whoIsTurn());

    if (kingInDanger && kingPosition && kingPosition.row === row && kingPosition.column === column) {
      return "king-in-danger";
    }

    if ((this.prevPos().row === row && this.prevPos().column === column) ||
      (this.currentPos().row === row && this.currentPos().column === column)) {
      return "selected";
    }

    if ((columnIndex + rowIndex) % 2 == 0) {
      return 'white';
    }
    return 'orange';
  }

  reset() {
    location.reload();
  }

  checkRules(current: GameModel, newPos: GameModel): boolean {
    if (current.stone === "pawn") {
      return this.pawnRules(current, newPos) && this.isKingInDangerAfterMove(current, newPos);
    } else if (current.stone === "rook") {
      return this.rookRules(current, newPos) && this.isKingInDangerAfterMove(current, newPos);
    } else if (current.stone === "knight") {
      return this.knightRules(current, newPos) && this.isKingInDangerAfterMove(current, newPos);
    } else if (current.stone === "bishop") {
      return this.bishopRules(current, newPos) && this.isKingInDangerAfterMove(current, newPos);
    } else if (current.stone === "queen") {
      return this.queenRules(current, newPos) && this.isKingInDangerAfterMove(current, newPos);
    } else if (current.stone === "king") {
      return this.kingRules(current, newPos);
    }

    return false;
  }

  pawnRules(current: GameModel, newPos: GameModel) {
    let posNum: number = 1;
    let doublePosNum: number = 2;
    let startPos: number = 2;

    if (current.color === "Black") {
      posNum = -1;
      doublePosNum = -2;
      startPos = 7;
    }

    if (current.row === newPos.row && newPos.stone === "") {
      if (current.column + posNum === newPos.column) return true;
      if (current.column === startPos) {
        if (current.column + doublePosNum == newPos.column) return true;
      }
    } else if ((current.row + 1 === newPos.row || current.row - 1 === newPos.row) && newPos.stone !== "") {
      if (current.column + posNum === newPos.column) return true;
    }

    return false;
  }

  rookRules(current: GameModel, newPos: GameModel) {
    // Rook can only move vertically or horizontally
    const sameRow = current.row === newPos.row;
    const sameColumn = current.column === newPos.column;

    if (sameRow || sameColumn) {
      // Check if there is any piece on the path between current and new position
      if (sameRow) {
        const minColumn = Math.min(current.column, newPos.column);
        const maxColumn = Math.max(current.column, newPos.column);
        for (let col = minColumn + 1; col < maxColumn; col++) {
          if (this.games().some(p => p.row === current.row && p.column === col && p.stone !== "")) {
            return false;
          }
        }
      } else if (sameColumn) {
        const minRow = Math.min(current.row, newPos.row);
        const maxRow = Math.max(current.row, newPos.row);
        for (let row = minRow + 1; row < maxRow; row++) {
          if (this.games().some(p => p.row === row && p.column === current.column && p.stone !== "")) {
            return false;
          }
        }
      }

      // If there is a piece at new position, it must be of different color
      if (newPos.stone !== "" && newPos.color === current.color) {
        return false;
      }

      return true;
    }

    return false;
  }

  knightRules(current: GameModel, newPos: GameModel) {
    // Possible moves for a knight in terms of row and column changes
    const possibleMoves = [
      { rowChange: 2, columnChange: 1 },
      { rowChange: 2, columnChange: -1 },
      { rowChange: -2, columnChange: 1 },
      { rowChange: -2, columnChange: -1 },
      { rowChange: 1, columnChange: 2 },
      { rowChange: 1, columnChange: -2 },
      { rowChange: -1, columnChange: 2 },
      { rowChange: -1, columnChange: -2 },
    ];

    // Check if the new position matches any of the possible moves
    for (const move of possibleMoves) {
      if (
        current.row + move.rowChange === newPos.row &&
        current.column + move.columnChange === newPos.column
      ) {
        // If there is a piece at the new position, it must be of a different color
        if (newPos.stone !== "" && newPos.color === current.color) {
          return false;
        }
        return true;
      }
    }

    return false;
  }

  bishopRules(current: GameModel, newPos: GameModel) {
    // Bishop can only move diagonally
    const rowDifference = Math.abs(current.row - newPos.row);
    const columnDifference = Math.abs(current.column - newPos.column);

    if (rowDifference === columnDifference) {
      // Check if there is any piece on the path between current and new position
      const rowStep = current.row < newPos.row ? 1 : -1;
      const columnStep = current.column < newPos.column ? 1 : -1;

      let row = current.row + rowStep;
      let column = current.column + columnStep;

      while (row !== newPos.row && column !== newPos.column) {
        if (this.games().some(p => p.row === row && p.column === column && p.stone !== "")) {
          return false;
        }
        row += rowStep;
        column += columnStep;
      }

      // If there is a piece at new position, it must be of different color
      if (newPos.stone !== "" && newPos.color === current.color) {
        return false;
      }

      return true;
    }

    return false;
  }

  queenRules(current: GameModel, newPos: GameModel) {
    // Queen can move like both a Rook and a Bishop
    const sameRow = current.row === newPos.row;
    const sameColumn = current.column === newPos.column;
    const rowDifference = Math.abs(current.row - newPos.row);
    const columnDifference = Math.abs(current.column - newPos.column);

    // Check if move is like a Rook
    if (sameRow || sameColumn) {
      if (sameRow) {
        const minColumn = Math.min(current.column, newPos.column);
        const maxColumn = Math.max(current.column, newPos.column);
        for (let col = minColumn + 1; col < maxColumn; col++) {
          if (this.games().some(p => p.row === current.row && p.column === col && p.stone !== "")) {
            return false;
          }
        }
      } else if (sameColumn) {
        const minRow = Math.min(current.row, newPos.row);
        const maxRow = Math.max(current.row, newPos.row);
        for (let row = minRow + 1; row < maxRow; row++) {
          if (this.games().some(p => p.row === row && p.column === current.column && p.stone !== "")) {
            return false;
          }
        }
      }

      if (newPos.stone !== "" && newPos.color === current.color) {
        return false;
      }

      return true;
    }

    // Check if move is like a Bishop
    if (rowDifference === columnDifference) {
      const rowStep = current.row < newPos.row ? 1 : -1;
      const columnStep = current.column < newPos.column ? 1 : -1;

      let row = current.row + rowStep;
      let column = current.column + columnStep;

      while (row !== newPos.row && column !== newPos.column) {
        if (this.games().some(p => p.row === row && p.column === column && p.stone !== "")) {
          return false;
        }
        row += rowStep;
        column += columnStep;
      }

      if (newPos.stone !== "" && newPos.color === current.color) {
        return false;
      }

      return true;
    }

    return false;
  }

  kingRules(current: GameModel, newPos: GameModel): boolean {
    // King can move one square in any direction
    const rowDifference = Math.abs(current.row - newPos.row);
    const columnDifference = Math.abs(current.column - newPos.column);

    if (rowDifference <= 1 && columnDifference <= 1) {
      // If there is a piece at the new position, it must be of different color
      if (newPos.stone !== "" && newPos.color === current.color) {
        return false;
      }

      // Simulate the move to check if the king will be in danger
      const originalGames = [...this.games()];

      // Update the game state to reflect the king's new position
      const newGames: GameModel[] = this.games().map(game => {
        if (game.row === current.row && game.column === current.column) {
          return { ...game, row: newPos.row, column: newPos.column };
        } else if (game.row === newPos.row && game.column === newPos.column) {
          return null; // Remove the piece at the new position if there is one
        }
        return game;
      }).filter(game => game !== null) as GameModel[];

      this.games.set(newGames);

      // Check if the king is in danger after the move
      const isInDanger = this.isTheKingInDanger();

      // Revert the games to the original state
      this.games.set(originalGames);

      return !isInDanger;
    }

    return false;
  }

  isKingInDangerAfterMove(current: GameModel, newPos: GameModel): boolean {
    const originalGames = [...this.games()];

    // Simulate the move
    const newGames: GameModel[] = this.games().map(game => {
      if (game.row === current.row && game.column === current.column) {
        return { ...game, row: newPos.row, column: newPos.column };
      } else if (game.row === newPos.row && game.column === newPos.column) {
        return null; // Remove the piece at the new position if there is one
      }
      return game;
    }).filter(game => game !== null) as GameModel[];

    this.games.set(newGames);

    // Check if the king is in danger after the move
    const isInDanger = this.isTheKingInDanger();

    // Revert the games to the original state
    this.games.set(originalGames);

    return !isInDanger;
  }

  isTheKingInDanger(): boolean {
    const currentPlayerColor = this.whoIsTurn();
    const kingPosition = this.games().find(
      (piece) => piece.stone === "king" && piece.color === currentPlayerColor
    );

    if (!kingPosition) {
      return false; // If there is no king for the current player, return false
    }

    for (const piece of this.games()) {
      if (piece.color !== currentPlayerColor) {
        const isDangerousMove = this.checkRulesWithoutKingSafety(piece, kingPosition);
        if (isDangerousMove) {
          return true;
        }
      }
    }

    return false;
  }

  checkRulesWithoutKingSafety(current: GameModel, newPos: GameModel): boolean {
    if (current.stone === "pawn") {
      return this.pawnRules(current, newPos);
    } else if (current.stone === "rook") {
      return this.rookRules(current, newPos);
    } else if (current.stone === "knight") {
      return this.knightRules(current, newPos);
    } else if (current.stone === "bishop") {
      return this.bishopRules(current, newPos);
    } else if (current.stone === "queen") {
      return this.queenRules(current, newPos);
    } else if (current.stone === "king") {
      return this.kingRules(current, newPos);
    }

    return false;
  }

  isGameOver(): boolean {    
    //console.log("King in danger :" + this.isTheKingInDanger());
    //console.log("King is checkmated :" + this.isKingCheckmated());
    if (this.isTheKingInDanger() && this.isKingCheckmated()) {
      console.log("Game over");
      
    }
    return false;
  }

  isKingCheckmated(): boolean {
    const currentPlayerColor = this.whoIsTurn();
    const kingPosition = this.games().find(
      (piece) => piece.stone === "king" && piece.color === currentPlayerColor
    );
  
    if (!kingPosition) {
      return false;
    }
  
    const possibleMoves = [
      { rowChange: 1, columnChange: 0 },
      { rowChange: -1, columnChange: 0 },
      { rowChange: 0, columnChange: 1 },
      { rowChange: 0, columnChange: -1 },
      { rowChange: 1, columnChange: 1 },
      { rowChange: 1, columnChange: -1 },
      { rowChange: -1, columnChange: 1 },
      { rowChange: -1, columnChange: -1 },
    ];
  
    let isSafe: boolean[] = [];

    for (const move of possibleMoves) {
      const newRow = kingPosition.row + move.rowChange;
      const newColumn = kingPosition.column + move.columnChange;
      const newPos: GameModel = { row: newRow, column: newColumn, stone: kingPosition.stone, color: kingPosition.color };
  
      isSafe.push(this.isSafeSquareForKing(kingPosition, newPos));
    } 
    
    const kingCanEscape = isSafe.includes(true);
    
    return !kingCanEscape;
  }
  
  isSafeSquareForKing(king: GameModel, newPos: GameModel): boolean {
    if (newPos.row < 1 || newPos.row > 8 || newPos.column < 1 || newPos.column > 8) {
      return false;
    }
  
    // Eğer yeni pozisyonda kendi taşı varsa, o pozisyona hareket edemez
    const pieceAtNewPos = this.games().find(p => p.row === newPos.row && p.column === newPos.column);
    if (pieceAtNewPos && pieceAtNewPos.color === king.color) {
      return false;
    }

    const originalGames = [...this.games()];
  
    const newGames: GameModel[] = this.games().map(game => {
      if (game.row === king.row && game.column === king.column) {
        return { ...game, row: newPos.row, column: newPos.column };
      } else if (game.row === newPos.row && game.column === newPos.column) {
        return null;
      }
      return game;
    }).filter(game => game !== null) as GameModel[];
  
    this.games.set(newGames);
  
    const isInDanger = this.isTheKingInDanger();
  
    this.games.set(originalGames);
  
    return !isInDanger;
  }
}