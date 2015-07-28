# Wickedpicker
______________

## wickedpicker.js - A simple jQuery timepicker
______________

## Requirements
______________

* [jQuery](http://jquery.com/download/) (>= 1.9)

## Usage

In your HTML
 ```html
 <body>
 ....
 <input type="text" name="timepicker" class="timepicker"/>
 ....
 <script type="text/javascript" src="jquery-1.11.3.min.js"></script>
  <script type="text/javascript" src="wickedpicker.js"></script>
 </body>
 ```

In your JavaScript file
 ```javascript
     $('.timepicker').wickedpicker();
 ```

Optional twenty-four hour clock setting (default false)
```javascript
    $('.timepicker').wickedpicker({twentyFour: true});
```

Methods

'time' get the current time inside of the input element that has a wickedpicker attached to it.
```javascript
    $('.timepicker').wickedpicker('time');
```

  If multiple input fields have the same class and instantiate a wickedpicker then pass the index of the timepicker
  you'd like to select
 ```javascript
    $('.timepicker').wickedpicker('time', 0);
 ```

## License

 Copyright (c) 2015 Eric Gagnon Licensed under the MIT license.

