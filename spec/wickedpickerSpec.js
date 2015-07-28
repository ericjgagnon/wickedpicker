/**
 * Created by ericgagnon on 7/20/15.
 */

describe("Wickedpicker", function () {

    var input, timepicker;
    var currentTime = new Date();

    var hours = ((currentTime.getHours() + 11) % 12) + 1;
    var hoursText = '.wickedpicker__controls__control--hours';

    var minutes = ((currentTime.getMinutes() < 10) ? '0' : '') + currentTime.getMinutes();
    var minText = '.wickedpicker__controls__control--minutes';

    var meridiem = (currentTime.getHours() > 12) ? 'PM' : 'AM';
    var meridiemText = '.wickedpicker__controls__control--meridiem';

    var controlUp = '.wickedpicker__controls__control-up';
    var controlDown = '.wickedpicker__controls__control-down';

    var now = hours + ' : ' + minutes + ' ' + meridiem;

    beforeEach(function () {
        input = $('.timepicker').wickedpicker();
        timepicker = $('.wickedpicker');
    });

    afterEach(function () {
       $('html').click();
    });

    it("Should be defined.", function () {
        expect(input).toBeDefined();
    });

    it("Should have the class \"hasWickedpicker\".", function () {
        expect(input).toHaveClass('hasWickedpicker');
    });

    it("Should have timepicker in DOM.", function () {
        expect(timepicker).toBeInDOM();
    });

    it("Should have a hidden timepicker.", function () {
        expect(timepicker).toBeHidden();
    });

    it("Can be focused on.", function () {
        var spyEvent = spyOnEvent(input.selector, 'focus');
        input.focus();
        expect('focus').toHaveBeenTriggeredOn(input.selector);
        expect(spyEvent).toHaveBeenTriggered();

    });

    it("Should show timepicker on focus.", function () {
        input.focus();
        expect(timepicker).toBeVisible();
    });

    it("Should show current time in input field for initial focus.", function () {
        input.focus();
        var value = input.val();
        expect(value).toBe(now);
    });

    it("Should show current time on timepicker for initial focus.", function () {
        input.focus();
        var value = $(hoursText).text() + ' : ' + $(minText).text() + ' ' + $(meridiemText).text();
        expect(value).toBe(now);
    });

    it("Should increase hours value when hours control up is clicked", function () {
        input.focus();
        var hoursUp = $(hoursText).siblings(controlUp);
        hoursUp.click();
        expect(input.val().split(':')[0].trim()).toBe($(hoursText).text());
    });

    it("Should increase hours value when hours control down is clicked", function () {
        input.focus();
        var down = $(hoursText).siblings(controlDown);
        down.click();
        expect(input.val().split(':')[0].trim()).toBe($(hoursText).text());
    });

    it("Should increase minutes value when minutes control up is clicked", function () {
        input.focus();
        var minutesUp = $(minText).siblings(controlUp);
        minutesUp.click();
        expect(input.val().split(' ')[2].trim()).toBe($(minText).text());
    });

    it("Should increase minutes value when minutes control down is clicked", function () {
        input.focus();
        var down = $(minText).siblings(controlDown);
        down.click();
        expect(input.val().split(' ')[2].trim()).toBe($(minText).text());
    });

    it("Should increase meridiem value when meridiem control up is clicked", function () {
        input.focus();
        var meridiemUp = $(meridiemText).siblings(controlUp);
        meridiemUp.click();
        expect(input.val().split(' ')[3].trim()).toBe($(meridiemText).text());
    });

    it("Should increase meridiem value when meridiem control down is clicked", function () {
        input.focus();
        var down = $(meridiemText).siblings(controlDown);
        down.click();
        expect(input.val().split(' ')[3].trim()).toBe($(meridiemText).text());
    });

    it("Should not respond on key press.", function() {
        var spyEvent = spyOnEvent(input.selector, 'keypress');
        input.focus();
        input.keypress();
        expect('keypress').toHaveBeenTriggeredOn(input.selector);
        expect(spyEvent).toHaveBeenTriggered();
        var value = input.val();
        expect(value).toEqual(now);
        expect(value).not.toBe(null);
    });

});
