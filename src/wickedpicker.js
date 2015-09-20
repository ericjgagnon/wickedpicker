/**
 * wickedpicker v0.1.0 - A simple jQuery timepicker.
 * Copyright (c) 2015 Eric Gagnon - http://github.com/wickedRidge/wickedpicker
 * License: MIT
 */

(function ($, window, document, undefined) {

    "use strict";

    if (typeof String.prototype.endsWith != 'function') {
        /*
         * Checks if this string end ends with another string
         *
         * @param {string} the string to be checked
         *
         * @return {bool}
         */
        String.prototype.endsWith = function (string) {
            return string.length > 0 && this.substring(this.length - string.length, this.length) === string;
        }
    }

    /*
     * Returns if the user agent is mobile
     *
     * @return {bool}
     */
    var isMobile = function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    var pluginName = "wickedpicker",
        defaults = {
            now: new Date(),
            twentyFour: false
        };

    /*
     * @param {object} The input object the timepicker is attached to.
     * @param {object} The object containing options
     */
    function Wickedpicker(element, options) {
        this.element = $(element);
        this.options = $.extend({}, defaults, options);

        this.element.addClass('hasWickedpicker');
        this.element.attr('onkeypress', 'return false;');
        this.createPicker();
        this.timepicker = $('.wickedpicker');
        this.up = $('.wickedpicker__controls__control-up');
        this.down = $('.wickedpicker__controls__control-down');
        this.hoursElem = $('.wickedpicker__controls__control--hours');
        this.minutesElem = $('.wickedpicker__controls__control--minutes');
        this.meridiemElem = $('.wickedpicker__controls__control--meridiem');
        this.close = $('.wickedpicker__close');
        this.selectedHour = this.parseHours(this.options.now.getHours());
        this.selectedMin = this.parseMinutes(this.options.now.getMinutes());
        this.selectedMeridiem = this.parseMeridiem(this.options.now.getHours());
        this.setHoverState();
        this.attach(element);
    }

    $.extend(Wickedpicker.prototype, {

        /*
         * Show given input's timepicker
         *
         * @param {object} The input being clicked
         */
        showPicker: function (element) {
            var timepickerPos = $(element.target).offset();
            this.setText(element);
            this.showHideMeridiemControl();
            if (this.getText(element) !== this.getTime()) {
                var inputTime = this.getText(element).replace(':', '').split(' ');
                var newTime = new Date();
                newTime.setHours(inputTime[0]);
                newTime.setMinutes(inputTime[2]);
                this.setTime(newTime);
                this.setMeridiem(inputTime[3]);
            }
            this.timepicker.css({
                'z-index': this.element.css('z-index') + 1,
                position: 'absolute',
                left: timepickerPos.left,
                top: timepickerPos.top + element.target.offsetHeight + 5
            }).show();

            this.handleTimeAdjustments(element);
        },

        /*
         * Hides the timepicker that is currently shown if it is not part of the timepicker
         *
         * @param {Object} The DOM object being clicked on the page
         */
        hideTimepicker: function (element) {
            this.timepicker.hide();
        },

        /*
         * Create a new timepicker. A single timepicker per page
         */
        createPicker: function () {
            if ($('.wickedpicker').length === 0) {
                $('body').append('<div class="wickedpicker"> <p class="wickedpicker__title">Timepicker <span class="wickedpicker__close"></span> </p> <ul class="wickedpicker__controls"> <li class="wickedpicker__controls__control"> <span class="wickedpicker__controls__control-up"></span><span class="wickedpicker__controls__control--hours">00</span><span class="wickedpicker__controls__control-down"></span> </li><li class="wickedpicker__controls__control--separator"><span class="wickedpicker__controls__control--separator-inner">:</span></li> <li class="wickedpicker__controls__control"> <span class="wickedpicker__controls__control-up"></span><span class="wickedpicker__controls__control--minutes">00</span><span class="wickedpicker__controls__control-down"></span> </li> <li class="wickedpicker__controls__control"> <span class="wickedpicker__controls__control-up"></span><span class="wickedpicker__controls__control--meridiem">AM</span><span class="wickedpicker__controls__control-down"></span> </li> </ul> </div>');
            }
        },

        /*
         * Hides the meridiem control if this timepicker is a 24 hour clock
         */
        showHideMeridiemControl: function () {
            if (this.options.twentyFour === false) {
                $('.wickedpicker__controls__control--meridiem').parent().show();
            }
            else {
                $('.wickedpicker__controls__control--meridiem').parent().hide();
            }
        },

        /*
         * Bind the click events to the input
         */
        attach: function (element) {
            $(element).on('click', $.proxy(this.showPicker, this));
            $(this.close).on('click', $.proxy(this.hideTimepicker, this));
        },

        /*
         * Set the time on the timepicker
         *
         * @param {Date} The date being set
         */
        setTime: function (time) {
            this.setHours(time.getHours());
            this.setMinutes(time.getMinutes());
            this.setMeridiem();
        },

        /*
         * Get the time from the timepicker
         */
        getTime: function () {
            return [this.formatTime(this.getHours(), this.getMinutes(), this.getMeridiem())];
        },

        /*
         * Set the timpicker's hour(s) value
         *
         * @param {string} hours
         */
        setHours: function (hours) {
            var hour = new Date();
            hour.setHours(hours);
            var hoursText = this.parseHours(hour.getHours());
            this.hoursElem.text(hoursText);
            this.selectedHour = hoursText;
        },

        /*
         * Get the hour(s) value from the timepicker
         *
         * @return {integer}
         */
        getHours: function () {
            var hours = new Date();
            hours.setHours(this.hoursElem.text());
            return hours.getHours();
        },

        /*
         * Returns the correct hour value based on the type of clock, 12 or 24 hour
         *
         * @param {integer} The hours value before parsing
         *
         * @return {string|integer}
         */
        parseHours: function (hours) {
            return (this.options.twentyFour === false) ? ((hours + 11) % 12) + 1 : (hours < 10) ? '0' + hours : hours;
        },

        /*
         * Sets the timpicker's minutes value
         *
         * @param {string} minutes
         */
        setMinutes: function (minutes) {
            var minute = new Date();
            minute.setMinutes(minutes);
            var minutesText = minute.getMinutes();
            var min = this.parseMinutes(minutesText);
            this.minutesElem.text(min);
            this.selectedMin = min;
        },

        /*
         * Get the minutes value from the timepicker
         *
         * @return {integer}
         */
        getMinutes: function () {
            var minutes = new Date();
            minutes.setMinutes(this.minutesElem.text());
            return minutes.getMinutes();
        },


        /*
         * Return a human-readable mintues value
         *
         * @param {string} minutes
         *
         * @return {string|integer}
         */
        parseMinutes: function (minutes) {
            return ((minutes < 10) ? '0' : '') + minutes;
        },

        /*
         * Set the timepicker's meridiem value, AM or PM
         *
         * @param {string} The new meridiem
         */
        setMeridiem: function (inputMeridiem) {
            var newMeridiem = '';
            if (inputMeridiem === undefined) {
                var meridiem = this.getMeridiem();
                newMeridiem = (meridiem === 'PM') ? 'AM' : 'PM';
            } else {
                newMeridiem = inputMeridiem;
            }
            this.meridiemElem.text(newMeridiem);
            this.selectedMeridiem = newMeridiem;
        },

        /*
         * Get the timepicker's meridiem value, AM or PM
         *
         * @return {string}
         */
        getMeridiem: function () {
            return this.meridiemElem.text();
        },

        /*
         * Get the correct meridiem based on the hours given
         *
         * @param {string|integer} hours
         *
         * @return {string}
         */
        parseMeridiem: function (hours) {
            return (hours > 12) ? 'PM' : 'AM';
        },

        /*
         * Handles time incrementing and decrementing and passes
         * the operator, '+' or '-', the input to be set after the change
         * and the current arrow clicked, to decipher if hours, ninutes, or meridiem.
         *
         * @param {object} The input element
         */
        handleTimeAdjustments: function(element) {
            var timeOut = 0;
            //Click and click and hold timepicker incrementer and decrementer
            $(this.up).add(this.down).off('mousedown click touchstart').on('mousedown click', {
                'Wickedpicker': this,
                'input': element
            }, function (event) {
                var operator = (this.className.indexOf('up') > -1) ? '+' : '-';
                var passedData = event.data;
                if (event.type == 'mousedown') {
                    timeOut = setInterval($.proxy(function (args) {
                        args.Wickedpicker.changeValue(operator, args.input, this);
                    }, this, {'Wickedpicker': passedData.Wickedpicker, 'input': passedData.input}), 200);
                } else {
                    passedData.Wickedpicker.changeValue(operator, passedData.input, this);
                }
            }).bind('mouseup touchend', function () {
                clearInterval(timeOut);
            });
        },

        /*
         * Change the timepicker's time base on what is clicked
         *
         * @param {string} The + or - operator
         * @param {object} The timepicker's associated input to be set post change
         * @param {object} The DOM arrow object clicked, determines if it is hours,
         * minutes, or meridiem base on the operator and its siblings
         */
        changeValue: function (operator, input, clicked) {
            var target = (operator === '+') ? clicked.nextSibling : clicked.previousSibling;
            var targetClass = $(target).attr('class');

            if (targetClass.endsWith('hours')) {
                this.setHours(eval(this.getHours() + operator + 1));
            } else if (targetClass.endsWith('minutes')) {
                this.setMinutes(eval(this.getMinutes() + operator + 1));
            } else {
                this.setMeridiem();
            }
            this.setText(input);
        },

        /*
         * Sets the give input's text to the current timepicker's time
         *
         * @param {object} The input element
         */
        setText: function (input) {
            $(input.target).val(this.formatTime(this.selectedHour, this.selectedMin, this.selectedMeridiem));
        },

        /*
         * Get the given input's value
         *
         * @param {object} The input element
         *
         * @return {string}
         */
        getText: function (input) {
            return $(input.target).val();
        },

        /*
         * Returns the correct time format as a string
         *
         * @param {string} hour
         * @param {string} minutes
         * @param {string} meridiem
         *
         * @return {string}
         */
        formatTime: function (hour, min, meridiem) {
            if (this.options.twentyFour) {
                return hour + ' : ' + min;
            }
            else {
                return hour + ' : ' + min + ' ' + meridiem;
            }
        },

        setHoverState: function () {
            if (!isMobile()) {
                $(this.up).add(this.down).add(this.close).hover(function () {
                    $(this).toggleClass('hover-state');
                });
            }
        },

        //public functions
        /*
         * Returns the requested input element's value
         */
        _time: function () {
            var inputValue = $(this.element).val();
            return (inputValue === '') ? this.formatTime(this.selectedHour, this.selectedMin, this.selectedMeridiem) : inputValue;
        }
    });

    //optional index if multiple inputs share the same class
    $.fn[pluginName] = function (options, index) {
        if (!$.isFunction(Wickedpicker.prototype['_' + options])) {
            return this.each(function () {
                if (!$.data(this, "plugin_" + pluginName)) {
                    $.data(this, "plugin_" + pluginName, new Wickedpicker(this, options));
                }
            });
        }
        else if ($(this).hasClass('hasWickedpicker')) {
            if (index !== undefined) {
                return $.data($(this)[index], 'plugin_' + pluginName)['_' + options]();
            }
            else {
                return $.data($(this)[0], 'plugin_' + pluginName)['_' + options]();
            }
        }
    };

})(jQuery, window, document);