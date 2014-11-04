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

            scoreMove: function(winningSet, player, depth) {

                //Tie
                if (!winningSet) {
                    return 0;
                }

                //Else there's a 3-in-a-row coordinate set
                //If this is a winning move, give it positive points
                if (player === this.cpuPlayer) {
                    return 10 - depth;
                }
                //Else if this is a losing move, give it negative points
                else {
                    return depth - 10;
                }
            },

            cloneGameState: function(gameState) {
                return _.map(gameState, _.clone);
            },

            //Calculate the CPU's move using the minimax algorithm
            getCPUMove: function(gameState, player, depth) {
                var scores = [],
                    moves = [],
                    winningSet = false,
                    nextPlayer,
                    newGameState,
                    bestScore,
                    index;

                winningSet = this.getWinningSet(gameState, player);

                if (winningSet || this.isGameOver(gameState)) {
                    return this.scoreMove(winningSet, player, depth);
                }

                depth++;
                nextPlayer = (player === this.cpuPlayer) ? this.humanPlayer : this.cpuPlayer;

                for (var row = 0; row < 3; row++) {
                    for (var col = 0; col < 3; col++) {
                        if (gameState[row][col]) {
                            continue; //Skip cells that are non-empty
                        }
                        newGameState = this.cloneGameState(gameState);
                        newGameState[row][col] = player;
                        scores.push(this.getCPUMove(newGameState, nextPlayer, depth));
                        moves.push([row, col]);
                    }
                }
                if (player === this.cpuPlayer) {
                    bestScore = Math.max.apply(null, scores);
                    index = scores.indexOf(bestScore);
                    this.set("bestMove", moves[index]);
                    return bestScore;
                }
                else {
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