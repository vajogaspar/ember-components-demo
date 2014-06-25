import Ember from "ember";

export default Ember.Component.extend({
    classNames: ['sl-slider'],

    attributeBindings: ['style'],

    current: null,

    size: {width:0,height:0},

    slides: [],

    slideCount: Ember.computed.alias('slides.length'),

    style: function() {
        var size = this.get('size');
        return 'width:'+size.width+'px;height:'+size.height+'px;';
    }.property('size.width', 'size.height'),

    _setSize: function() {
        this.set('size', {
            width : this.$().parent().outerWidth(true),
            height : this.$().parent().outerHeight(true)
        });
    }.on('didInsertElement'),

    initResizeHandler: function() {
        var view = this;

        if (!this.get('resizeHandler')) {
            var resizeHandler = function() {
                Ember.run.debounce(view, view._setSize, 350);
            };

            this.set('resizeHandler', resizeHandler);
            this.$(window).on('resize', this.get('resizeHandler'));
        }
    }.on('didInsertElement'),

    register: function() {
        this.get('parentView').registerSlider(this);
    }.on('init'),

    willDestroy: function() {
        this.get('parentView').unregisterSlider(this);
        this.$(window).off('resize', this.get('resizeHandler'));
    }.on('willDestroyElement'),

    registerSlide: function(slide) {
        var cur = this.get('current');

        this.get('slides').pushObject(slide);

        if (cur === null) {
            this.set('current', 0);
            slide.set('isVisible', true);
        } else {
            slide.set('isVisible', false);
        }
    },

    changeSlide: function(dir, pos) {
        if( this.get('isAnimating') || this.get('slideCount') < 2 ) {
            return false;
        }
        this.set('isAnimating', true);

        var nextSlide, movingSlide, currentSlide = this.get('slides').objectAt(this.get('current'));

        if (pos !== undefined) {
            this.set('current', pos);
        } else if (dir === 'next') {
            this.set('current',
                (this.get('current') < this.get('slideCount') - 1 ? (1 + this.get('current')) : 0)
            );

        } else if (dir === 'prev') {
            this.set('current',
                (this.get('current') > 0 ? (this.get('current') - 1) : (this.get('slideCount') - 1))
            );
        }

        nextSlide = this.get('slides').objectAt(this.get('current'));
        movingSlide = ( dir === 'next' ) ? currentSlide : nextSlide;
        this.set('oldSlide', currentSlide);
        this.set('movedSlide', movingSlide);

        this.trigger('onBeforeSlideChange', {});

        currentSlide.set('transitionElements', null);
        movingSlide.prepareAnimate(dir);

        if (dir === 'prev') {
            Ember.run.later(this, function() {
                currentSlide.set('transitionElements', 'back');
                movingSlide.animate();

            }, 50);
        } else {
            Ember.run.later(this, function() {
                nextSlide.set('transitionElements', 'next');
                movingSlide.animate();

            }, 50);
        }

        nextSlide.set('isVisible', true);

    },

    animationEnded: function() {
        this.get('movedSlide').setProperties({
            'isAnimating': false,
            'isAnimationEnding': false,
            'dir': null,
            'transitionElements': null
        });
        this.get('oldSlide').setProperties({
            'transitionElements': null,
            'isVisible': false
        });

        this.set('isAnimating', false);
    }
});