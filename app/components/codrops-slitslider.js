import Ember from "ember";

export default Ember.Component.extend({

    classNames: ['sl-slider-wrapper'],

    // transitions speed
    speed : 900,
    // if true the item's slices will also animate the opacity value
    optOpacity : false,
    // amount (%) to translate both slices - adjust as necessary
    translateFactor : 230,
    // maximum possible angle
    maxAngle : 25,
    // maximum possible scale
    maxScale : 2,
    // slideshow on / off
    autoplay : false,
    // keyboard navigation
    keyboard : true,
    // time between transitions
    interval : 4000,

    slider: null,
    dotnav: null,
    arrownav: null,

    currentSlide: Ember.computed.alias('slider.current'),

    slideCount: function() {
        var c = this.get('slider.slideCount');
        return c == null ? 0 : c;
    }.property('slider.slideCount'),

    registerSlider: function(slider) {
        this.set('slider', slider);
    },

    registerDotNavigation: function(dotnav) {
        this.set('dotnav', dotnav);
    },

    registerArrowNavigation: function(arrownav) {
        this.set('arrownav', arrownav);
    },

    navigate: function (dir, pos) {
        this.get('slider').changeSlide(dir, pos);
    },

    jump: function(pos) {
        var current = this.get('currentSlide');
        if( pos === current || pos >= this.get('slideCount') || pos < 0 ) {

            return false;

        }

        this.navigate( pos > current ? 'next' : 'prev', pos );
    },

    registerListener: function() {
        var v = this.get('parentView'), self = this;
        v.on('keydownLeft', function() {
            self.navigate('prev');
        });
        v.on('keydownRight', function() {
            self.navigate('next');
        });
    }.on('init')
});