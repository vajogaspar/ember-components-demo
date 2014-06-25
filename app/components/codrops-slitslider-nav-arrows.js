import Ember from "ember";

export default Ember.Component.extend({
    tagName: 'nav',

    classNames: ['nav-arrows'],

    doSomething: function() {
        this.get('parentView').registerArrowNavigation(this);
    }.on('didInsertElement'),

    actions: {
        previous: function() {
            this.get('parentView').navigate('prev');
            console.log('prev action handler');
        },
        next: function() {
            this.get('parentView').navigate('next');
            console.log('next action handler');
        }
    }

});