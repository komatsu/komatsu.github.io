define(
    ['backbone', 'underscore'],
    function(Backbone) {

        var GameView = Backbone.View.extend({

            template: $("#gameTemplate").html(),
            humanMarker: $("#o-marker").html(),
            cpuMarker: $("#x-marker").html(),

            events: {
                "click .e-game-cell": "makeHumanMove",
            },

            render: function() {
                this.$el.html(this.template)
                return this;
            },

            resetGame: function(newGameModel) {
                this.$(".e-reset-btn").off();
                this.model.set(this.model.defaults());
                this.render().delegateEvents();
            },

            makeHumanMove: function(evt) {
                var $target = $(evt.currentTarget),
                    row,
                    col,
                    marker,
                    winCells;

                evt.preventDefault();
                row = $target.data("row");
                col = $target.data("col");

                //Ignore clicks during cpu turn or cells that were already selected
                if (this.model.get("currentTurn") === this.model.cpuPlayer ||
                        this.model.get("cells")[row][col]) {
                    return;
                }

                this.model.markCell(this.model.humanPlayer, row, col);
                $target.removeClass("open").append(this.humanMarker);

                //Check game state for win or tie after this move
                winCells = this.model.getWinningSet(this.model.get("cells"), this.humanPlayer);

                if (winCells) {
                    this.trigger("win", this.model.humanPlayer); //Scoreboard will update on "win" event
                    this.showWinners(winCells);
                }
                else if (!winCells && this.model.isGameOver(this.model.get("cells"))) {
                    this.endGame(); //Game ended in a tie
                }
                else { //CPU's turn
                    this.model.set("currentTurn", this.model.cpuPlayer);

                    //Hack - the browser will try to run makeCPUMove prior to
                    //rendering the player's Circle, causing a noticeable delay.
                    //Having the setTimeout will allow the UI to finish updating
                    //before the minimax algorithm starts calculating.
                    setTimeout(this.makeCPUMove.bind(this), null);
                }
            },

            makeCPUMove: function() {
                var bestMove,
                    row,
                    col,
                    winCells;

                this.model.getCPUMove(this.model.get("cells"), this.model.cpuPlayer, 0);
                bestMove = this.model.get("bestMove");
                row = bestMove[0];
                col = bestMove[1];

                this.model.markCell(this.model.cpuPlayer, row, col);
                this.$(".e-cell-" + row + '-' + col).removeClass("open").append(this.cpuMarker);

                winCells = this.model.getWinningSet(this.model.get("cells"), this.model.cpuPlayer);

                if (winCells) {
                    this.trigger("win", this.model.cpuPlayer);
                    this.showWinners(winCells);
                }
                else if (!winCells && this.model.isGameOver(this.model.get("cells"))) {
                    this.endGame();
                }
                else {
                    this.model.set("currentTurn", this.model.humanPlayer);
                }
            },

            showWinners: function(winCells) {
                var $cell;

                _.each(winCells, function(cellCoordinates) {
                    $cell = this.$(".e-cell-" + cellCoordinates[0] + "-" + cellCoordinates[1]);
                    $cell.addClass("winner");
                });

                this.endGame();
            },

            endGame: function() {
                this.undelegateEvents();
                this.$(".e-reset-btn").removeClass("invisible").on("click", this.resetGame.bind(this));
            }
        });

        return GameView;
    }
);