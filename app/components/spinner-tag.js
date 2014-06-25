import Ember from "ember";

export default Ember.Component.extend({

    tagName: 'span',

    classNameBindings: ['type'],

    type: 'spinner-wave',
    spanCount: 0,

    nHasChanged: function() {
        var i, s, n = this.get('spanCount');
        s = '';
        for (i=0;i<n;i++) {
            s+='<span></span>';
        }
        this.set('template', Ember.Handlebars.compile(s));
        this.rerender();
    }.on('init').observes('spanCount'),

    typeHasChanged: function() {
        switch (this.get('type')) {
            case 'spinner-chasing-dots':
            case 'spinner-double-bounce':
            case 'spinner-wandering-cubes':
                this.set('spanCount', 2);
                break;
            case 'spinner-three-bounce':
                this.set('spanCount', 3);
                break;
            case 'spinner-wave':
                this.set('spanCount', 5);
                break;
            //case 'spinner-pulse':
            //case 'spinner-rotating-plane':
            //case 'spinner-refreshing':
            //case 'spinner-three-quarters':
            //  break;
        }
    }.on('init').observes('type')
});