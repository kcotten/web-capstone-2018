$(document).ready(function(e) {

        //Variable instantiation.
	var map_fullscreen = false;

	var menu_width = "30%";
	var map_width = "70%";
	
	var windowHeight = $(window).height();
	var windowWidth = $(window).outerWidth(true);
	console.log("Height: " + windowHeight);
	console.log("Width: " + windowWidth);
	

	$("#menuid").css({
            "width":menu_width
	})
	$("#mapid").css({
            "width":map_width
	})
	$("#horiz_bar").css({
	})

	
	/*$("#menu_button").click(function () {
	    console.log("CLICK!");
            $("#menu_button").animate({
                "right":"500"
	    }, 500, "easeOutBounce")
	})*/


        $("#menu_button2").click(function(){
	    /*$("#menu_button").transition({
	        "right":"500"
	    },500,"easeInOutBack")*/
	    if (map_fullscreen) {
	        $("#menuid").css({
                    "width":menu_width
	        })
	        $("#mapid").css({
                    "width":map_width
	        })
	        map_fullscreen = false;
	    } else {
	        $("#menuid").css({
                    "width":"0%"
	        })
	        $("#mapid").css({
                    "width":"100%"
	        })
	        map_fullscreen = true;
	    }
	});
});


var app = function() {

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    //FIXME: When vue is working, implement this and remove above method.
    //self.press_menu_button = function () {
    //    
    //};
    
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {

        },
        methods: {

        },
    });
    
    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {

    }

    return self;
};

var APP = null;

jQuery(function(){APP = app();});
