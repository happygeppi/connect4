class Computer {
  constructor(depth, game) {
    this.depth = depth;
    this.game = game;
    this.initEvaluation();
  }

  initEvaluation() {
    this.evaluation = {
      draw: 0,
      win: (winning, computerPlayer, depth) => {
        const mult = (computerPlayer % 2 == 1) * 2 - 1;
        if (computerPlayer == winning) return mult * 1000 * depth;
        return -mult * 1000 * depth;
      },
      0: 0,
      1: 5 + this.random(-2, 5),
      2: 20 + this.random(-5, 15),
      3: 50 + this.random(-10, 50),
    };
  }

  random = (a, b) => Math.floor(Math.random() * (b - a) + a);

  getBestMove(board, toMove) {
    let alpha = -Infinity;
    let beta = Infinity;

    const nextMoves = this.nextMoves(board, toMove);
    let bestMove = null;

    // maximizing
    if (toMove % 2 == 1) {
      let maxEval = -Infinity;

      for (const move of nextMoves) {
        const moveEval = this.minimax(
          move,
          toMove,
          3 - toMove,
          alpha,
          beta,
          this.depth - 1
        );
        if (moveEval > maxEval) {
          maxEval = moveEval;
          bestMove = move;
        }
        alpha = Math.max(alpha, moveEval);
        if (beta <= alpha) break;
      }

      return { i: bestMove.i, evaluation: maxEval };
    }

    // else minimizing
    let minEval = Infinity;

    for (const move of nextMoves) {
      const moveEval = this.minimax(
        move,
        toMove,
        3 - toMove,
        alpha,
        beta,
        this.depth - 1
      );
      if (moveEval < minEval) {
        minEval = moveEval;
        bestMove = move;
      }
      beta = Math.min(beta, moveEval);
      if (beta <= alpha) break;
    }

    return { i: bestMove.i, evaluation: minEval };
  }

  minimax(move, player, toMove, alpha, beta, depth) {
    if (this.game.checkWin(move.board, move.i, move.j))
      return this.evaluation.win(move.player, player, Math.max(depth, 1));

    if (this.game.checkDraw(move.board)) return this.evaluation.draw;

    if (depth == 0) return this.evaluate(move.board);

    const nextMoves = this.nextMoves(move.board, toMove);

    // maximizing
    if (toMove % 2 == 1) {
      let maxEval = -Infinity;

      for (const move of nextMoves) {
        const moveEval = this.minimax(
          move,
          player,
          3 - toMove,
          alpha,
          beta,
          depth - 1
        );
        maxEval = Math.max(maxEval, moveEval);
        alpha = Math.max(alpha, moveEval);
        if (beta <= alpha) break;
      }

      return maxEval;
    }

    // else minimizing
    let minEval = Infinity;

    for (const move of nextMoves) {
      const moveEval = this.minimax(
        move,
        player,
        3 - toMove,
        alpha,
        beta,
        depth - 1
      );
      minEval = Math.min(minEval, moveEval);
      beta = Math.min(beta, moveEval);
      if (beta <= alpha) break;
    }

    return minEval;
  }

  evaluate(board) {
    let boardValue = 0;

    const offsets = [
      {
        offset: 1,
        from: { x: 0, y: 0 },
        to: { x: this.game.w - 1, y: this.game.h - 4 },
      },
      {
        offset: this.game.h,
        from: { x: 0, y: 0 },
        to: { x: this.game.w - 4, y: this.game.h - 1 },
      },
      {
        offset: this.game.h + 1,
        from: { x: 0, y: 0 },
        to: { x: this.game.w - 4, y: this.game.h - 4 },
      },
      {
        offset: this.game.h - 1,
        from: { x: 3, y: 3 },
        to: { x: this.game.w - 1, y: this.game.h - 1 },
      },
    ];

    for (let player = 1; player <= 2; player++) {
      for (const off of offsets) {
        for (let x = off.from.x; x <= off.to.x; x++) {
          for (let y = off.from.y; y <= off.to.y; y++) {
            let opponentInTheWay = false;
            let index = this.game.h * x + y;
            let counter = 0;
            for (let step = 0; step < 4; step++) {
              if (board[index] == player) counter++;
              else if (board[index] == 3 - player) {
                opponentInTheWay = true;
                break;
              }
              index += off.offset;
            }

            if (!opponentInTheWay)
              boardValue += this.evaluation[counter] * ((player == 1) * 2 - 1);
          }
        }
      }
    }

    return boardValue;
  }

  nextMoves(board, toMove) {
    const next = [];
    for (let i = 0; i < this.game.w; i++) {
      let j;
      for (j = this.game.h - 1; j >= -1; j--)
        if (board[this.game.h * i + j] === 0) break;

      if (j >= 0) {
        const nextBoard = board.slice();
        nextBoard[this.game.h * i + j] = toMove;
        const move = { board: nextBoard, i: i, j: j, player: toMove };

        if (
          next.length > 0 &&
          Math.abs(i - this.game.w / 2) < Math.abs(next[0].i - this.game.w / 2)
        )
          next.unshift(move);

        next.push(move);
      }
    }

    return next;
  }
}
