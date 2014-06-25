import Ember from "ember";

export default Ember.View.extend({

    keyDown: function(event) {
        var arrow = { left: 37, up: 38, right: 39, down: 40};
        switch(event.keyCode) {
            case arrow.left :
                this.trigger('keydownLeft');
                break;
            case arrow.right :
                this.trigger('keydownRight');
                break;
        }
    },

    doFocus: function() {
        this.$().focus();
    }.on('didInsertElement')
});