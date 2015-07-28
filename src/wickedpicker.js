/**
 * wickedpicker v0.1 - A simple jQuery timepicker.
 * Copyright (c) 2015 Eric Gagnon - http://github.com/wickedRidge/wickedpicker
 * License: MIT
 *
 */

(function ($, window, document, undefined) {

    "use strict";

    if (typeof String.prototype.endsWith != 'function') {
        String.prototype.endsWith = function (str) {
            return str.length > 0 && this.substring(this.length - str.length, this.length) === str;
        }
    }

    var findOne = function (haystack, arr) {
        return arr.some(function (v) {
            return haystack.indexOf(v) >= 0;
        });
    };

    var pluginName = "wickedpicker",
        defaults = {
            now: new Date(),
            twentyFour: false
        };


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
        this.canClick = ['hasWickedpicker', this.timepicker.selector.substring(1), this.up.selector.substring(1), this.down.selector.substring(1), this.hoursElem.selector.substring(1), this.minutesElem.selector.substring(1), this.meridiemElem.selector.substring(1)];
        this.selectedHour = this.parseHours(this.options.now.getHours());
        this.selectedMin = this.parseMinutes(this.options.now.getMinutes());
        this.selectedMeridiem = this.parseMeridiem(this.options.now.getHours());
        this.attach(element);

    }

    $.extend(Wickedpicker.prototype, {
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
            $(this.up).off('click').on('click', $.proxy(this.changeValue, this, '+', element));

            $(this.down).off('click').on('click', $.proxy(this.changeValue, this, '-', element));
        },

        hideTimepicker: function (element) {
            var targetClass = element.target.className.split(' ');
            if (findOne(targetClass, this.canClick) === false) {
                this.timepicker.hide();
            }
        },

        createPicker: function () {
            if ($('.wickedpicker').length === 0) {
                $('body').append('<div class="wickedpicker"> <p class="wickedpicker__title">Timepicker</p> <ul class="wickedpicker__controls"> <li class="wickedpicker__controls__control"> <span class="wickedpicker__controls__control-up"></span><span class="wickedpicker__controls__control--hours">00</span><span class="wickedpicker__controls__control-down"></span> </li><li class="wickedpicker__controls__control--separator">:</li> <li class="wickedpicker__controls__control"> <span class="wickedpicker__controls__control-up"></span><span class="wickedpicker__controls__control--minutes">00</span><span class="wickedpicker__controls__control-down"></span> </li> <li class="wickedpicker__controls__control"> <span class="wickedpicker__controls__control-up"></span><span class="wickedpicker__controls__control--meridiem">AM</span><span class="wickedpicker__controls__control-down"></span> </li> </ul> </div>');
            }
        },
        //docket fix meridiem control

        showHideMeridiemControl: function () {
            if (this.options.twentyFour === false) {
                $('.wickedpicker__controls__control--meridiem').parent().show();
            }
            else {
                $('.wickedpicker__controls__control--meridiem').parent().hide();
            }
        },
        attach: function (element) {
            $(element).on('focus', $.proxy(this.showPicker, this));
            $('html').on('click', $.proxy(this.hideTimepicker, this));
        },

        setTime: function (time) {
            this.setHours(time.getHours());
            this.setMinutes(time.getMinutes());
            this.setMeridiem();
        },

        getTime: function () {
            return [this.formatTime(this.getHours(), this.getMinutes(), this.getMeridiem())];
        },

        setHours: function (hours) {
            var hour = new Date();
            hour.setHours(hours);
            var hoursText = this.parseHours(hour.getHours());
            this.hoursElem.text(hoursText);
            this.selectedHour = hoursText;
        },

        getHours: function () {
            var hours = new Date();
            hours.setHours(this.hoursElem.text());
            return hours.getHours();
        },

        parseHours: function (hours) {
            return (this.options.twentyFour === false) ? ((hours + 11) % 12) + 1 : hours;
        },

        setMinutes: function (minutes) {
            var minute = new Date();
            minute.setMinutes(minutes);
            var minutesText = minute.getMinutes();
            var min = this.parseMinutes(minutesText);
            this.minutesElem.text(min);
            this.selectedMin = min;
        },

        getMinutes: function () {
            var minutes = new Date();
            minutes.setMinutes(this.minutesElem.text());
            return minutes.getMinutes();
        },

        parseMinutes: function (minutes) {
            return ((minutes < 10) ? '0' : '') + minutes;
        },

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

        getMeridiem: function () {
            return this.meridiemElem.text();
        },

        parseMeridiem: function (hours) {
            return (hours > 12) ? 'PM' : 'AM';
        },

        changeValue: function (operator, input, element) {

            var target = (operator === '+') ? element.target.nextSibling : element.target.previousSibling;
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

        setText: function (input) {
            $(input.target).val(this.formatTime(this.selectedHour, this.selectedMin, this.selectedMeridiem));
        },

        getText: function (input) {
            return $(input.target).val();
        },

        formatTime: function (hour, min, meridiem) {
            if (this.options.twentyFour) {
                return hour + ' : ' + min;
            }
            else {
                return hour + ' : ' + min + ' ' + meridiem;
            }
        },
        //public functions
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