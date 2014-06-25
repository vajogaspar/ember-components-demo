import Ember from "ember";

var itemObject = Ember.Object.extend({
    isCurrent: false,
    targetPage: 0
});

export default Ember.Component.extend({
    tagName: 'nav',

    classNames: ['nav-dots'],

    slideCount: Ember.computed.alias('parentView.slideCount'),
    current: Ember.computed.alias('parentView.currentSlide'),
    oldCurrent: null,
    items: [],

    updateItems: function() {
        var i, addCount, slideCount = this.get('slideCount');
        addCount = slideCount - this.get('items.length');

        for (i=0; i < addCount; i++) {
            this.get('items').pushObject(itemObject.create({'isCurrent':false, 'targetPage':(i+slideCount-1)}));
        }

    }.observes('slideCount').on('didInsertElement'),

    updateCurrent: function() {
        var from, to, a = this.get('items');
        from = this.get('oldCurrent');
        to = this.get('current');

        if (from !== null) {
            a.objectAt(from).set('isCurrent', false);
        }
        if (to !== null) {
            a.objectAt(to).set('isCurrent', true);
        }
        this.set('oldCurrent', to);
    }.observes('current').on('didInsertElement'),

    doSomething: function() {
        this.get('parentView').registerDotNavigation(this);
    }.on('didInsertElement'),

    actions: {
        navigate: function(target) {
            console.log('navigation req: '+target);
            this.get('parentView').jump(target);
        }
    }
});