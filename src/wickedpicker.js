/**
 * Created by ericgagnon on 6/15/15.
 */
(function ($) {


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

    var Timepicker = function (element, options) {


        this.defaults = {
            now: new Date()
        };
        this.element = $(element);
        this.element.addClass('hasTimepicker');
        this.element.attr('onkeypress', 'return false;');
        this.createTimepicker();
        this.options = $.extend({}, this.defaults, options);
        this.timepicker = $('.wicked-picker');
        this.up = $('.wicked-picker__controls__control-up');
        this.down = $('.wicked-picker__controls__control-down');
        this.hoursElem = $('.wicked-picker__controls__control--hours');
        this.minutesElem = $('.wicked-picker__controls__control--minutes');
        this.meridiemElem = $('.wicked-picker__controls__control--meridiem');
        this.canClick = ['hasTimepicker', this.timepicker.selector.substring(1), this.up.selector.substring(1), this.down.selector.substring(1), this.hoursElem.selector.substring(1), this.minutesElem.selector.substring(1), this.meridiemElem.selector.substring(1)];
        this.selectedHour = ((this.defaults.now.getHours() + 11) % 12) + 1;
        this.selectedMin = ((this.defaults.now.getMinutes() < 10) ? '0' : '') + this.defaults.now.getMinutes();
        this.selectedMeridiem = (this.defaults.now.getHours() > 12) ? 'PM' : 'AM';
        this.attach(element);

        return this;
    };

    $.extend(Timepicker.prototype = {


        showTimepicker: function (element) {
            var timepickerPos = $(element.target).offset();
            this.setText(element);
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

        createTimepicker: function () {
            if ($('.wicked-picker').length === 0)
                $('body').append('<div class="wicked-picker"> <p class="wicked-picker__title">Timepicker</p> <ul class="wicked-picker__controls"> <li class="wicked-picker__controls__control"> <span class="wicked-picker__controls__control-up"></span><span class="wicked-picker__controls__control--hours">00</span><span class="wicked-picker__controls__control-down"></span> </li> <li class="wicked-picker__controls__control"> <span class="wicked-picker__controls__control-up"></span><span class="wicked-picker__controls__control--minutes">00</span><span class="wicked-picker__controls__control-down"></span> </li> <li class="wicked-picker__controls__control"> <span class="wicked-picker__controls__control-up"></span><span class="wicked-picker__controls__control--meridiem">AM</span><span class="wicked-picker__controls__control-down"></span> </li> </ul> </div>');
        },

        attach: function (element) {
            $(element).on('focus', $.proxy(this.showTimepicker, this));
            $('html').on('click', $.proxy(this.hideTimepicker, this));
        },

        setTime: function (time) {
            this.setHours(time.getHours());
            this.setMinutes(time.getMinutes());
            this.setMeridiem();
        },

        getTime: function () {
            return [this.getHours + ' : ' + this.getMinutes() + ' ' + this.getMeridiem()];
        },

        setHours: function (hours) {
            var hour = new Date();
            hour.setHours(hours);
            var hoursText = ((hour.getHours() + 11) % 12) + 1;
            this.hoursElem.text(hoursText);
            this.selectedHour = hoursText;
        },

        getHours: function () {
            var hours = new Date();
            hours.setHours(this.hoursElem.text());
            return hours.getHours();
        },

        setMinutes: function (minutes) {
            var minute = new Date();
            minute.setMinutes(minutes);
            var minutesText = minute.getMinutes();
            var min = ((minutesText < 10) ? '0' : '') + minutesText;
            this.minutesElem.text(min);
            this.selectedMin = min;
        },

        getMinutes: function () {
            var minutes = new Date();
            minutes.setMinutes(this.minutesElem.text());
            var minutesText = minutes.getMinutes();
            return ((minutesText < 10) ? '0' : '') + minutesText;
        },

        setMeridiem: function (inputMeridiem) {
            var newMeridiem = '';
            if(inputMeridiem === undefined) {
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
            $(input.target).val(this.selectedHour + ' : ' + this.selectedMin + ' ' + this.selectedMeridiem);
            $(input.target).attr('value', this.selectedHour + ' : ' + this.selectedMin + ' ' + this.selectedMeridiem);
        },

        getText: function (input) {
            return $(input.target).val();
        }


    });

    $.fn.timepicker = function (options) {
        return this.each(function () {
            new Timepicker(this, options);
        });
    };

}(jQuery));