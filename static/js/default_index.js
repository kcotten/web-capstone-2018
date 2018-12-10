$(document).ready(function(e) {
        //Variable instantiation.
	var menu_width = "30%";
	var map_width = "100%";
	var windowHeight = $(window).height();
	var windowWidth = $(window).outerWidth(true);

	$("#menuid").css({
            "width":menu_width
	})
	$("#mapid").css({
            "width":map_width
	})

	const track_titles = document.querySelectorAll('.track_title');
	track_titles.forEach(element => {
	  var width = (.3*windowWidth)-255;
          element.style.width=width;
	});
});

//Anything that needs to resize itself should go in the resizeFunction.
window.addEventListener("resize", resizeFunction);
function resizeFunction() {
    var windowHeight = $(window).height();
    var windowWidth = $(window).outerWidth(true);
    var menu_width = "30%";
    var map_width = "100%";
    const track_titles = document.querySelectorAll('.track_title');
    track_titles.forEach(element => {
        var width = (.3*windowWidth)-255;
        element.style.width=width;
    });
    $("#menuid").css({
        "width":menu_width
    })
    $("#mapid").css({
        "width":map_width
    })
}


var app = function() {

    const None = undefined;
    //var user_email = "";
    var track_count = 0;
    var customLayer;
    var map;

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { track_count = 0; return v.map(function(e) {e._idx = track_count++;});};

    self.add_track = function () {
        console.log("add_track(): " + self.vue.track_add_title);
	self.vue.adding_track = false;
        $.post(add_track_url, {track_title: self.vue.track_add_title,},
            function (response) {
                var new_track = {
                    id: response.track_id,
                    track_title: self.vue.track_add_title,
                    track_content: "",
                    track_author: user_email,
                    show_file_field: true,
                    track_is_fav: "no",
                };
                self.get_tracks();                
                self.vue.track_list.unshift(new_track);
                self.process_tracks();
            });
    };

    self.get_tracks = function() {
        var param = None;
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: get_track_list_url,
            data: JSON.stringify(param),
            success: function (response) {
                self.vue.track_list = response.track_list;
                self.process_tracks();
            }
        });

        /* $.getJSON(get_track_list_url,
            function(response) {
                self.vue.track_list = response.track_list;
                self.process_tracks();
            }
        ); */
    };   

    self.process_tracks = function() { 
        enumerate(self.vue.track_list);
        self.vue.track_list.map(function (e) {
            Vue.set(e, 'show_file_field', false);
            Vue.set(e, 'need_to_upload', (e.track_content === ""));
	    Vue.set(e, 'is_favorited', e.track_is_fav === "yes");
        });
    };

    // TODO: place holder edit functionality
    self.edit_track = function(track_idx, track_content, track_title) {
        $.post(edit_track_url, {
                id:self.vue.track_list[track_idx].id, 
                title: track_title
            },
            function(response) {
            });
    };

    self.upload_track = function(event, track) {
        var track_id = track.id;
	    track.show_file_field = false;
        var input = event.target;
        var file = input.files[0];
        if (file) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
                // here is where we can also call the map
                $.post(upload_track_url, {
                    track_content: reader.result,
                    track_id: track_id
                });
		        track.need_to_upload = false;
                //self.get_track_for_display(track_id);
            }, false);
            // Reads the file as text. Triggers above event handler.
            reader.readAsDataURL(file);
        };
    };
    
    self.get_track_for_display = function(track_id) {
        $.getJSON(get_track_content_url, {track_id: track_id, }, 
            function(response) {
                var gpx = response.track_content;
                new L.GPX(gpx, {
                    async: true,
                    marker_options: {
                        startIconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
                        endIconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-red.png',
                        wptIconUrls: {
                            '': 'http://leafletjs.com/examples/custom-icons/leaf-orange.png',
                            'Geocache Found': 'http://leafletjs.com/examples/custom-icons/leaf-orange.png',
                            'Park': 'http://leafletjs.com/examples/custom-icons/leaf-orange.png'
                          },
                        shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png'
                    }
                })
                .on('loaded', function(e) {
                    self.vue.map.fitBounds(e.target.getBounds());
                })
                .addTo(self.vue.map);
            }
        );
    };

    self.delete_track = function(id) {
	var track_id = id;
        $.post(delete_track_url, {track_id: track_id},
            function (response) {
	        self.get_tracks();
        });
    };

    self.initMap = function() {
        this.map = L.map("mapid").setView([36.98, 237.98], 13);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoia2NvdHRlbiIsImEiOiJjam5qOTBxczQwd3hnM3BvM2g3a3B2amZsIn0.zmWKaRsfmBEdwlU3ejmKqQ',
        }).addTo(this.map);
    }
    
    self.initLayers = function() {
        // TODO: move the filelayer here maybe        
    }

    self.get_user_email = function() {
        $.getJSON(get_user_email_for_frontend_url,
            function(response) {
                if(response.email != None) {
                    // user_email is meant to be local to the js, probably redundant?
                    user_email = response.email;
                    self.vue.user_email = response.email;
                } else {
                    user_email = "";
                    self.vue.user_email = "";
                }                
            }
        );
    };

    self.initPage = function() {
        
    }

    self.click_add_track_btn = function() {
	//This is only for whether or not to show input fields. Does not add the track.
        if(self.vue.adding_track) {
            self.vue.adding_track = false;
	    } else {
            self.vue.adding_track = true;
	    }
        self.vue.track_add_title = "";
    };
    
    self.click_load_track_btn = function(track) {
        var track_id = track.id;
        self.get_track_for_display(track_id);
    };

    self.click_upload_btn = function(track) {
        if(track.show_file_field) {
            track.show_file_field = false;
        } else {
            track.show_file_field = true;
        }
    };

    self.fav_track = function(track) {
        var track_id = track.id;
        var fav;
        var tfav = track.track_is_fav;
        if(tfav == "yes") {
            fav = "no";
        } else {
            fav = "yes";
        }
        $.post(set_favorites_url, {track_id: track_id, fav: fav},
            function (response) {
                //self.get_fav();
                self.get_tracks();
            }
	    );
    }

    self.click_menu_btn = function () {
        if(self.vue.map_fullscreen) {
            $("#mapid").css({
                "width":"70%"
            })
            document.getElementById("menu_button").style.marginRight= "0%";
            self.vue.map_fullscreen = false;
        } else {
            $("#mapid").css({
                "width":"100%"
            })
            document.getElementById("menu_button").style.marginRight= "-30%";
            self.vue.map_fullscreen = true;
        }
    };

    self.star_mouseover = function (track) {
        if(track.is_favorited) {
                track.is_favorited = false;
        } else {
                track.is_favorited = true;
        }
    };

    self.star_mouseout = function (track) {
       //An edge case issue may exist where I move out before track_s_fav can be updated.
       track.is_favorited = (track.track_is_fav === 'yes');
    };

    self.collapse_tracks_top = function () {
        self.vue.collapse_my_tracks = !self.vue.collapse_my_tracks;
    };

    self.collapse_tracks_bottom = function () {
        self.vue.collapse_fav_tracks = !self.vue.collapse_fav_tracks;
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            map: null,
            tileLayer: null,
            layers: [],
            track_list: [],
            fav_list: [],
            track_content: null,
            map_fullscreen: false,
            adding_track: false,
            track_add_title: "",
            collapse_my_tracks: false,
            collapse_fav_tracks: false,
        },
        mounted() { 
            /* Code to run when app is mounted */
            this.initMap();
            this.initLayers();
            //this.initPage();
        },
        methods: {
            initMap: self.initMap,
            initLayers: self.initLayers,
            add_track: self.add_track,
            edit_track: self.edit_track,
            upload_track: self.upload_track,
            get_user_email: self.get_user_email,
            click_add_track_btn: self.click_add_track_btn,
            click_upload_btn: self.click_upload_btn,
            click_load_track_btn: self.click_load_track_btn,
            click_menu_btn: self.click_menu_btn,
            collapse_tracks_top: self.collapse_tracks_top,
            collapse_tracks_bottom: self.collapse_tracks_bottom,
            star_mouseover: self.star_mouseover,
            star_mouseout: self.star_mouseout,
            get_track_for_display: self.get_track_for_display,
            delete_track: self.delete_track,
            get_fav: self.get_fav,
            fav_track: self.fav_track,
        },
    });
    
    // If we are logged in can do a variety of things based on that
    if (is_logged_in === 'true') {
      //Get tracks
      self.get_tracks();
    }

    return self;
};

var APP = null;

jQuery(function(){APP = app();});
