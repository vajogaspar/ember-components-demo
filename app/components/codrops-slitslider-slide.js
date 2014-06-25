import Ember from "ember";

export default Ember.Component.extend({

    classNames: ['sl-slide'],

    classNameBindings: ['orientationClass', 'transElemClass'],

    attributeBindings: ['style'],

    isAnimating: false,

    isAnimationEnding: false,

    transitionElements: null,

    dir: null,

    size: Ember.computed.alias('parentView.size'),

    translateFactor: Ember.computed.alias('parentView.parentView.translateFactor'),

    resetStyle: 'transform:translate(0%,0%) rotate(0deg) scale(1);opacity:1;',

    style: function() {
        return this.get('isAnimating') ?
        'z-index:'+this.get('parentView.slideCount')+';'
        : 'z-index:1;';
    }.property('isAnimating'),

    transElemClass: function() {
        var t = this.get('transitionElements');

        return t !== null ?
            (t === 'back' ? 'sl-trans-back-elems' : 'sl-trans-elems')
            : null;
    }.property('transitionElements'),

    slice1Style: function() {
        var ret, dir = this.get('dir');
        if (this.get('isAnimating')) {

            if (dir === 'prev') {

                if (this.get('isAnimationEnding')) {

                    ret = this.get('resetStyle');

                } else {

                    ret = ('transform:translate' +
                        (this.get('orientation') === 'horizontal' ? 'Y' : 'X') + '(-' +
                        this.get('parentView.parentView.translateFactor') + '%) rotate(' +
                        this.get('slice1angle') + 'deg) scale(' + this.get('slice1scale') + ');');

                }
            } else if (dir === 'next') {

                if (this.get('isAnimationEnding')) {

                    ret = ('transform:translate' +
                        (this.get('orientation') === 'horizontal' ? 'Y' : 'X') + '(-' +
                        this.get('parentView.parentView.translateFactor') + '%) rotate(' +
                        this.get('slice1angle') + 'deg) scale(' + this.get('slice1scale') + ');');


                } else {

                    ret = '';

                }
            }
            ret+= 'transition:all ' + this.get('parentView.parentView.speed')+ 'ms ease-in-out;';
        } else {
            ret = null;
        }
        //console.log('slice1Style: '+ret);
        return ret;
    }.property('isAnimating', 'isAnimationEnding', 'dir', 'orientation'),

    slice2Style: function() {
        var ret, dir = this.get('dir');
        if (this.get('isAnimating')) {
            if (dir === 'prev') {
                if (this.get('isAnimationEnding')) {
                    ret = this.get('resetStyle');
                } else {

                    ret = ('transform:translate' +
                        (this.get('orientation') === 'horizontal' ? 'Y' : 'X') + '(' +
                        this.get('parentView.parentView.translateFactor') + '%) rotate(' +
                        this.get('slice2angle') + 'deg) scale(' + this.get('slice2scale') + ');'
                    );

                }
            } else if (dir === 'next') {
                if (this.get('isAnimationEnding')) {
                    ret = ('transform:translate' +
                        (this.get('orientation') === 'horizontal' ? 'Y' : 'X') + '(' +
                        this.get('parentView.parentView.translateFactor') + '%) rotate(' +
                        this.get('slice2angle') + 'deg) scale(' + this.get('slice2scale') + ');');

                } else {
                    ret = '';

                }
            }
            ret+= 'transition:all ' + this.get('parentView.parentView.speed')+ 'ms ease-in-out;';
        } else {
            ret = null;
        }
        //console.log('slice2Style: '+ret);
        return ret;
    }.property('isAnimating', 'isAnimationEnding', 'dir', 'orientation'),

    contentWrapper1Style: function() {

        return this.get('contentWrapperStyle');

    }.property('parentView.parentView.speed', 'contentWrapperStyle'),

    contentWrapper2Style: function() {

        return this.get('contentWrapperStyle') +
            (this.get('orientation') === 'horizontal' ?
                'margin-top:-' + (this.get('parentView.size.height') / 2) +'px'
                : 'margin-left:-' + (this.get('parentView.size.width') / 2) +'px'
            );
    }.property('parentView.size', 'orientation', 'contentWrapperStyle'),

    contentWrapperStyle: function() {

        return this.get('parentView.style');

    }.property('parentView.style'),

    orientationClass: function() {
        var o = this.get('orientation');
        return o ? 'sl-slide-'+o : null;
    }.property('orientation'),

    doSomething: function() {
        this.get('parentView').registerSlide(this);
    }.on('didInsertElement'),

    prepareAnimate: function(dir) {
        if (this.get('isAnimating')) {
            return false;
        }

        this.set('dir', dir);
        this.set('isAnimationEnding', false);
        this.set('isAnimating', true);
    },

    animate: function() {
        if (this.get('isAnimating')) {
            this.set('isAnimationEnding', true);
            var slider, el = this.$('.sl-content-slice:nth-of-type(2)');
            slider = this.get('parentView');
            var fn = function () {
                el.off('webkitTransitionEnd', fn);
                slider.animationEnded();
            };
            el.on('webkitTransitionEnd', fn);
        }
    }
});