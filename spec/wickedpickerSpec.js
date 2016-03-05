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
    var close = '.wickedpicker__close';

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

    it("Should show timepicker on click.", function () {
        input.click();
        expect(timepicker).toBeVisible();
    });

    it("Should show current time in input field for initial focus.", function () {
        input.click();
        var value = input.val();
        expect(value).toBe(now);
    });

    it("Should show current time on timepicker for initial click.", function () {
        input.click();
        var value = $(hoursText).text() + ' : ' + $(minText).text() + ' ' + $(meridiemText).text();
        expect(value).toBe(now);
    });

    it("Should close the timepicker when the X is clicked", function() {
       input.click();
        $(close).click();
        expect(timepicker).toBeHidden();
    });

    it("Should close the timepicker when anything other than the timepicker is clicked", function() {
        input.click();
        $('html').click();
        expect(timepicker).toBeHidden();
    });

    it("Should increase hours value when hours control up is clicked", function () {
        input.click();
        var hoursUp = $(hoursText).siblings(controlUp);
        hoursUp.click();
        expect(input.val().split(':')[0].trim()).toBe($(hoursText).text());
    });

    it("Should decrease hours value when hours control down is clicked", function () {
        input.click();
        var down = $(hoursText).siblings(controlDown);
        down.click();
        expect(input.val().split(':')[0].trim()).toBe($(hoursText).text());
    });

    it("Should increase minutes value when minutes control up is clicked", function () {
        input.click();
        var minutesUp = $(minText).siblings(controlUp);
        minutesUp.click();
        expect(input.val().split(' ')[2].trim()).toBe($(minText).text());
    });

    it("Should decrease minutes value when minutes control down is clicked", function () {
        input.click();
        var down = $(minText).siblings(controlDown);
        down.click();
        expect(input.val().split(' ')[2].trim()).toBe($(minText).text());
    });

    it("Should switch the meridiem value when meridiem control up is clicked", function () {
        input.click();
        var meridiemUp = $(meridiemText).siblings(controlUp);
        meridiemUp.click();
        expect(input.val().split(' ')[3].trim()).toBe($(meridiemText).text());
    });

    it("Should switch the meridiem value when meridiem control down is clicked", function () {
        input.click();
        var down = $(meridiemText).siblings(controlDown);
        down.click();
        expect(input.val().split(' ')[3].trim()).toBe($(meridiemText).text());
    });

});
