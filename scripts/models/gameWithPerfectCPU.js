define(
    [
        'jquery',
        'underscore',
        'backbone'
    ],
    function($, _, Backbone) {
        //Class to represent a TicTacToe game. Pass in "o" to designate circle's turn; else "x" starts
        var Game = Backbone.Model.extend({
            humanPlayer: "o",
            cpuPlayer: "x",

            winningCombinations: [
                [[0,0],[0,1],[0,2]],
                [[1,0],[1,1],[1,2]],
                [[2,0],[2,1],[2,2]],
                [[0,0],[1,0],[2,0]],
                [[0,1],[1,1],[2,1]],
                [[0,2],[1,2],[2,2]],
                [[0,0],[1,1],[2,2]],
                [[0,2],[1,1],[2,0]]
            ],

            defaults: function() {
                return {
                    currentTurn: "o",
                    bestMove: null,
                    cells: [[null, null, null], [null, null, null], [null, null, null]]
                };
            },

            isGameOver: function(gameState) {
                return !(_.contains(_.flatten(gameState), null));
            },

            getWinningSet: function(gameState, player) {
                var isWin,
                    set,
                    row,
                    col;

                for (var i = 0; i < this.winningCombinations.length; i++) {
                    isWin = true;
                    set = this.winningCombinations[i];

                    _.each(set, function(indices) {
                        row = indices[0];
                        col = indices[1];
                        if (gameState[row][col] !== player) {
                            isWin = false;
                        }
                    });

                    if (isWin) {
                        return set;
                    }
                }

                return false;
            },

            markCell: function(player, row, col) {
                var cells,
                    numCellsFilled;

                if (player !== "o" && player !== "x") {
                    throw "Unknown player";
                }

                cells = this.cloneGameState(this.get("cells"));
                cells[row][col] = player;

                this.set({
                    cells: cells
                });
            },

            cloneGameState: function(gameState) {
                return _.map(gameState, _.clone);
            },

            // Calculate the CPU's move using the minimax algorithm
            getCPUMove: function(gameState, player, depth) {
                var scores = [],
                    moves = [],
                    cpuWinningSet,
                    humanWinningSet,
                    nextPlayer,
                    newGameState,
                    bestScore,
                    index;

                cpuWinningSet = this.getWinningSet(gameState, this.cpuPlayer);
                humanWinningSet = this.getWinningSet(gameState, this.humanPlayer);

                if (cpuWinningSet) {
                    return 10 - depth; //CPU win = positive score
                }
                else if (humanWinningSet) {
                    return depth - 10; //Human win = negative score
                }
                else if (this.isGameOver(gameState)) {
                    return 0; //Tie game
                }

                nextPlayer = (player === this.cpuPlayer) ? this.humanPlayer : this.cpuPlayer;

                for (var row = 0; row < 3; row++) {
                    for (var col = 0; col < 3; col++) {
                        if (gameState[row][col]) {
                            continue; //Skip cells that are non-empty
                        }
                        newGameState = this.cloneGameState(gameState);
                        newGameState[row][col] = player;
                        scores.push(this.getCPUMove(newGameState, nextPlayer, depth + 1));
                        moves.push([row, col]);
                    }
                }

                if (player === this.cpuPlayer) { //CPU's turn -- maxiimize the score
                    bestScore = Math.max.apply(null, scores);
                    index = scores.indexOf(bestScore);
                    this.set("bestMove", moves[index]);
                    return bestScore;
                }
                else { //Human's turn -- Get minimum score since we want the human to score least
                    bestScore = Math.min.apply(null, scores);
                    index = scores.indexOf(bestScore);
                    this.set("bestMove", moves[index]);
                    return bestScore;
                }
            }

        });

        return Game;
    }
);