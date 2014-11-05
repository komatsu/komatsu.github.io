define(
    ['backbone'],
    function(Backbone) {

        var Scoreboard = Backbone.Model.extend({
            defaults: {
                currentTurn: "o",
                oScore: 0,
                xScore: 0,
            },

            incrementScore: function(player) {
                var key = player + "Score"; //oScore or xScore

                this.set(key, this.get(key) + 1);
            },

            changeTurn: function(game) {
                this.set("currentTurn", game.get("currentTurn"));
             }
        });

        return Scoreboard;
    }
);