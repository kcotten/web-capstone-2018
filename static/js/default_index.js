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

    self.initMap = function() {
        // loads map into div called mapid
        var mymap = L.map("mapid").setView([36.98, 237.98], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoia2NvdHRlbiIsImEiOiJjam5qOTBxczQwd3hnM3BvM2g3a3B2amZsIn0.zmWKaRsfmBEdwlU3ejmKqQ'
        }).addTo(mymap);
        // Add filelayer, move to filelayer init or get rid of possibly
        var style = {color:'red', opacity: 1.0, fillOpacity: 1.0, weight: 2, clickable: false};
            L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
            L.Control.fileLayerLoad({
            fitBounds: true,
            layerOptions: {style: style,
                         pointToLayer: function (data, latlng) {
                            return L.circleMarker(latlng, {style: style});
                        }},
        }).addTo(mymap);
    }
    
    self.initLayers = function() {
        
    }

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            map: null,
            tileLayer: null,
            layers: [],
        },
        mounted() { 
            /* Code to run when app is mounted */ 
            this.initMap();
            this.initLayers();
        },
        methods: {
            initMap: self.initMap,
            initLayers: self.initLayers,

        },
    });
    
    // If we are logged in, shows the form to add posts.
    if (is_logged_in) {

    }

    return self;
};

var APP = null;

jQuery(function(){APP = app();});
