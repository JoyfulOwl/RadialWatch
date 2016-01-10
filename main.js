/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global window, document, tizen, console, setTimeout */
/*jslint plusplus: true*/

var canvas, context, str_day, clockRadius, isAmbientMode, watchRadius = document.width / 2,
	battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery;

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        'use strict';
        window.setTimeout(callback, 1000 / 60);
    };

function renderDots() {
    'use strict';

    var dx = 0,
        dy = 0,
        i = 1,
        angle = null;

    context.save();

    // Assigns the clock creation location in the middle of the canvas
    context.translate(canvas.width / 2, canvas.height / 2);

    // Assign the style of the number which will be applied to the clock plate
    context.beginPath();

    context.fillStyle = '#ffffff';

    // Create 12 dots in a circle
    for (i = 1; i <= 12; ++i) {
        angle = (i - 12) * (Math.PI * 2) /12;
        dx = clockRadius * 0.9 * Math.cos(angle);
        dy = clockRadius * 0.9 * Math.sin(angle);

        context.arc(dx, dy, 4, 0, 2 * Math.PI, false);
        context.fill();
    }
    context.closePath();
}

function renderLines() {
	'use strict';

    var dxi = 0,
        dyi = 0,
        dxf = 0,
        dyf = 0,
        i = 1,
        angle = null;

    for (i = 1; i <= 60; ++i) {
        angle = (i - 15) * (Math.PI * 2) /60;
        dxi = watchRadius * 0.94 * Math.cos(angle);
        dyi = watchRadius * 0.94 * Math.sin(angle);
        dxf = watchRadius * Math.cos(angle);
        dyf = watchRadius * Math.sin(angle);
        
        context.beginPath();
        context.strokeStyle = '#bfbfbf';
        context.lineWidth = 2;
        context.moveTo(dxi, dyi);
        context.lineTo(dxf, dyf);
        context.stroke();
        context.closePath();
    }
    
//	var i = 1,
//		angle = null;
//
//	context.save();
//
//	// Assigns the clock creation location in the middle of the canvas
//	context.translate(canvas.width / 2, canvas.height / 2);
//
//	// Assign the style of the number which will be applied to the clock plate
//	context.beginPath();
//
//	context.strokeStyle = '#bfbfbf';
//	context.lineWidth = 20;
//	
//	// Create 12 dots in a circle
//	for (i = 1; i <= 60; ++i) {
//		angle = (i - 15) * (Math.PI * 2) / 60;
//    
//		context.arc(0,0,clockRadius*0.95, angle - 0.1, angle + 0.1);
//		context.stroke();
//	}
//	context.closePath();
}

function renderHourNeedle(hour) {
    'use strict';

    var angle = null;

    angle = (hour - 3) * (Math.PI * 2) / 12;
    
    //render
    context.save();
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = '#3333ff';
    context.arc(0,0,clockRadius*0.85, angle - 0.05, angle + 0.05);
    context.stroke();
    context.restore();
}

function renderMinuteNeedle(minute) {
    'use strict';

    var angle = null;

    angle = (minute - 15) * (Math.PI * 2) / 60;
    
    //render
    context.save();
    context.rotate(angle);
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = '#3333ff';
    context.moveTo(clockRadius*0.9, -3);
    context.lineTo(clockRadius,0);
    context.lineTo(clockRadius*0.9, 3);
    context.closePath();
    context.stroke();
    context.restore();
    
}

function getDate() {
    'use strict';

    var date;
    try {
        date = tizen.time.getCurrentDateTime();
    } catch (err) {
        console.error('Error: ', err.message);
        date = new Date();
    }

    return date;
}

function renderBattery() {
	var batteryLevel = Math.floor(battery.level*100),
		batteryDegree = batteryLevel * Math.PI*2 / 100;
	
	context.save();
	context.beginPath();
	context.lineWidth = 5;
	context.strokeStyle('ffffff');
	context.arc(0, 0, watchRadius*0.5, 0, 1.9*Math.PI);
	context.stroke();
	context.closePath();
}
//
//function renderDate() {
//	//todo
//}
//
//function renderDay() {
//	var date = getDate(),
//		str_day = document.getElementById('str_day'),
//		day = date.getDay(),
//		arr_day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
//	
//
//    if(day < 0 || day > 6) {
//        str_day.innerHTML = "Test";
//    }
//    else {
//        str_day.innerHTML = arr_day[day];
//    }
//}
//
//function mediaButton() {
//	//todo
//}

function watch() {
    'use strict';

    if (isAmbientMode === true) {
        return;
    }

    // Import the current time
    // no inspection JSUnusedAssignment
    var date = getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        minute = minutes + (seconds / 60),
        nextMove = 1000 - date.getMilliseconds();

    // Erase the previous time
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderDots();
    renderLines();
    renderHourNeedle(hours);
    renderMinuteNeedle(minute);
    renderBattery();
//    renderDay();

    context.restore();

    setTimeout(function() {
        window.requestAnimationFrame(watch);
    }, nextMove);
}

function ambientWatch() {
    'use strict';

    // Import the current time
    // noinspection JSUnusedAssignment
    var date = getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        hour = hours + minutes / 60,
        minute = minutes + seconds / 60;

    // Erase the previous time
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderHourNeedle(hour);
    renderMinuteNeedle(minute);

    context.restore();
}

window.onload = function onLoad() {
    'use strict';

    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    clockRadius = document.body.clientWidth / 2;

    // Assigns the area that will use Canvas
    canvas.width = document.body.clientWidth;
    canvas.height = canvas.width;

    // add eventListener for tizenhwkey
    window.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === 'back') {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (err) {
                console.error('Error: ', err.message);
            }
        }
    });

    // add eventListener for timetick
    window.addEventListener('timetick', function() {
        console.log("timetick is called");
        ambientWatch();
    });

    // add eventListener for ambientmodechanged
    window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            isAmbientMode = true;
            ambientWatch();

        } else {
            // rendering normal case
            isAmbientMode = false;
            window.requestAnimationFrame(watch);
        }
    });

    // normal case
    isAmbientMode = false;
    window.requestAnimationFrame(watch);
};
