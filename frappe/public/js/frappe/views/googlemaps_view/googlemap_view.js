/**
 * frappe.views.MapView
 */
 frappe.provide('frappe.utils.utils');
 frappe.provide("frappe.views");
 
 frappe.views.GooglemapView = class GooglemapView extends frappe.views.ListView {
     get view_name() {
         return 'Googlemaps';
     }
 
     setup_defaults() {
         super.setup_defaults();
         this.page_title = __('{0} Googlemaps', [this.page_title]);
     }
 
     setup_view() {
     }
 
     on_filter_change() {
         this.get_google_coords();
     }
 
     render() {
         this.get_google_coords()
             .then(() => {
                 this.render_map_view();
             });
         this.$paging_area.find('.level-left').append('<div></div>');
     }
 
     /// testin
 
     render_map_view() {
        self = this;
		this.map_id = 'map';
        this.$result.html(`<div id="${this.map_id}" class="map-view-container"></div>`);
		
		const icon = {
			url: "https://iconsplace.com/wp-content/uploads/_icons/ff0000/256/png/radio-tower-icon-14-256.png",
			scaledSize: new google.maps.Size(15, 15)
		};

        this.map = new google.maps.Map(document.getElementById("map"), {
            zoom: 20,
            center: { lat: -6.304551452226169, lng: 106.68479307871746 },
            mapTypeId: "terrain",
        });

        if (this.coords.features && this.coords.features.length) {

            // this.coords.features.forEach(
            //     coords => L.geoJSON(coords).bindPopup(coords.properties.name).addTo(this.map)
            // );
            // let lastCoords = this.coords.features[0].geometry.coordinates.reverse();
            // this.map.panTo(lastCoords, 8);
        }
     }
 
     get_google_coords() {
         let get_google_coords_method = this.settings && this.settings.get_google_coords_method || 'frappe.geo.utils.get_google_coords';
 
         if (cur_list.meta.fields.find(i => i.fieldtype === 'google_maps_location')) {
            this.type = 'googlemaps_coordinates';
         }

         return frappe.call({
             method: get_google_coords_method,
             args: {
                 doctype: this.doctype,
                 filters: cur_list.filter_area.get(),
                 type: this.type
             }
         }).then(r => {
             this.coords = r.message;
 
         });
     }
 
 
     get required_libs() {
         return [
             "assets/frappe/js/lib/leaflet/leaflet.css",
             "assets/frappe/js/lib/leaflet/leaflet.js"
         ];
     }
 
 
 };
 