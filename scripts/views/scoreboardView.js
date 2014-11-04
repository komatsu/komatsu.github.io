define(
    [
        'backbone',
    ],
    function(Backbone) {

        var ScoreboardView = Backbone.View.extend({

            template: _.template($("#scoreboardTemplate").html()),

            initialize: function() {
                this.listenTo(this.model, "change", this.render);
            },

            render: function() {
                var attr = _.clone(this.model.toJSON());

                attr.oTurnVisibility = (attr.currentTurn === "o" ? "" : "invisible");
                attr.xTurnVisibility = (attr.currentTurn === "x" ? "" : "invisible");
                this.$el.html(this.template(attr));
                return this;
            }
        });

        return ScoreboardView;
    }
);