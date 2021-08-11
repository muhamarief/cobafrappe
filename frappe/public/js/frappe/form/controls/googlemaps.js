frappe.provide('frappe.utils.utils');
let marker;
let i;

frappe.ui.form.ControlGooglemaps = frappe.ui.form.ControlData.extend({
	horizontal: false,

	format_for_input(value) {
		var bounds = new google.maps.LatLngBounds();

		if (value) {
			this.objValue;
			this.objValue = JSON.parse(value);
			const icon = {
				url: "https://iconsplace.com/wp-content/uploads/_icons/ff0000/256/png/radio-tower-icon-14-256.png",
				scaledSize: new google.maps.Size(20, 20)
			};

			var points = this.objValue.features.filter(function(ele) {
				return Object.entries(ele.properties).length === 0 ;
			});

			var circle = this.objValue.features.filter(function(ele) {
				return ele.properties.point_type === "circle" ;
			});

			if (points.length > 0) {
				const center = points[0].geometry.coordinates

				let map = new google.maps.Map(document.getElementById("map"), {
					// zoom: 15,
					// center: { lat: center[1], lng: center[0] },
					mapTypeId: "terrain",
				});

				for (i = 0; i < points.length; i++) {  
					this.marker = new google.maps.Marker({
						position: new google.maps.LatLng(points[i].geometry.coordinates[1], points[i].geometry.coordinates[0]),
						map: map,
						icon: icon
					});

					bounds.extend(this.marker.position);
				}

				map.fitBounds(bounds);

				if (circle.length > 0) {
					for (i = 0; i < circle.length; i++) {  
						const cityCircle = new google.maps.Circle({
							fillColor: "rgb(51, 136, 255)",
							fillOpacity: 0.2,
							strokeWeight: 1,
							strokeColor: "rgb(51, 136, 255)",
							clickable: false,
							editable: true,
							zIndex: 1,
							map,
							center: {lng: circle[i].geometry.coordinates[0], lat: circle[i].geometry.coordinates[1]},
							radius: circle[i].properties.radius
						});
					}
				}

				const drawingManager = new google.maps.drawing.DrawingManager({
					drawingMode: google.maps.drawing.OverlayType.MARKER,
					drawingControl: true,
					drawingControlOptions: {
					  position: google.maps.ControlPosition.TOP_CENTER,
					  drawingModes: [
						google.maps.drawing.OverlayType.MARKER,
						google.maps.drawing.OverlayType.CIRCLE,
						// google.maps.drawing.OverlayType.POLYGON,
						// google.maps.drawing.OverlayType.POLYLINE,
						// google.maps.drawing.OverlayType.RECTANGLE,
					  ],
					},
					markerOptions: {
					  icon: icon,
					},
					circleOptions: {
						fillColor: "rgb(51, 136, 255)",
						fillOpacity: 0.2,
						strokeWeight: 1,
						strokeColor: "rgb(51, 136, 255)",
						clickable: false,
						editable: true,
						zIndex: 1,
					  },
				});
				drawingManager.setMap(map);

				google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
					if (event.type == 'circle') {
						
						let newDataCircle = 
						{
							"type": "Feature",
							"properties": {
							  "point_type": "circle",
							  "radius": event.overlay.getRadius()
							},
							"geometry": {
							  "type": "Point",
							  "coordinates": [
								event.overlay.getCenter().lng(),
								event.overlay.getCenter().lat()
							  ]
							}
						}

						self.objValue.features.push(newDataCircle);
						self.set_value(JSON.stringify(self.objValue));
					} else if (event.type == 'marker') {

						let newDataMarker = 
						{
							"type": "Feature",
							"properties": {},
							"geometry": {
								"type": "Point",
								"coordinates": [
								event.overlay.getPosition().lng(),
								event.overlay.getPosition().lat()]
							}
						}

						self.objValue.features.push(newDataMarker);
						self.set_value(JSON.stringify(self.objValue));
					}
				});
			}



		} else if (value===undefined) {
			const icon = {
				url: "https://iconsplace.com/wp-content/uploads/_icons/ff0000/256/png/radio-tower-icon-14-256.png",
				scaledSize: new google.maps.Size(20, 20)
			};

			let map = new google.maps.Map(document.getElementById("map"), {
				zoom: 13,
				center: { lat: -6.304551452226169, lng: 106.68479307871746 },
				mapTypeId: "terrain",
			});

			const drawingManager = new google.maps.drawing.DrawingManager({
				drawingMode: google.maps.drawing.OverlayType.MARKER,
				drawingControl: true,
				drawingControlOptions: {
				  position: google.maps.ControlPosition.TOP_CENTER,
				  drawingModes: [
					google.maps.drawing.OverlayType.MARKER,
					google.maps.drawing.OverlayType.CIRCLE,
					// google.maps.drawing.OverlayType.POLYGON,
					// google.maps.drawing.OverlayType.POLYLINE,
					// google.maps.drawing.OverlayType.RECTANGLE,
				  ],
				},
				markerOptions: {
				  icon: icon,
				},
				circleOptions: {
					fillColor: "rgb(51, 136, 255)",
					fillOpacity: 0.2,
					strokeWeight: 1,
					strokeColor: "rgb(51, 136, 255)",
					clickable: false,
					editable: true,
					zIndex: 1,
				  },
			});
			drawingManager.setMap(map);

			google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
				if (event.type == 'circle') {
					
					var data_layers =
						{
							"type": "FeatureCollection",
							"features": [
								{
									"type": "Feature",
									"properties": {
									  "point_type": "circle",
									  "radius": event.overlay.getRadius()
									},
									"geometry": {
									  "type": "Point",
									  "coordinates": [
										event.overlay.getCenter().lng(),
										event.overlay.getCenter().lat()
									  ]
									}
								}
							]
						}

					// let newDataCircle = 
					// {
					// 	"type": "Feature",
					// 	"properties": {
					// 	  "point_type": "circle",
					// 	  "radius": event.overlay.getRadius()
					// 	},
					// 	"geometry": {
					// 	  "type": "Point",
					// 	  "coordinates": [
					// 		event.overlay.getCenter().lng(),
					// 		event.overlay.getCenter().lat()
					// 	  ]
					// 	}
					// }

					// self.objValue.features.push(newDataCircle);
					self.set_value(JSON.stringify(data_layers));
				} else if (event.type == 'marker') {

					var data_layers =
						{
							"type": "FeatureCollection",
							"features": [
								{
									"type": "Feature",
									"properties": {},
									"geometry": {
										"type": "Point",
										"coordinates": [
										event.overlay.getPosition().lng(),
										event.overlay.getPosition().lat()]
									}
								}
							]
						}

					// let newDataMarker = 
					// {
					// 	"type": "Feature",
					// 	"properties": {},
					// 	"geometry": {
					// 		"type": "Point",
					// 		"coordinates": [
					// 		event.overlay.getPosition().lng(),
					// 		event.overlay.getPosition().lat()]
					// 	}
					// }

					// self.objValue.features.push(newDataMarker);
					self.set_value(JSON.stringify(data_layers));
				}
			});

			// google.maps.event.addListener(map, 'click', function(event) {
			// 	self.draw_map(this, event.latLng);
	
			// 	var data_layers =
			// 	{
			// 		"type": "FeatureCollection",
			// 		"features": [
			// 			{
			// 			"type": "Feature",
			// 			"properties": {},
			// 			"geometry": {
			// 				"type": "Point",
			// 				"coordinates": [
			// 				event.latLng.lng(),
			// 				event.latLng.lat()]
			// 				}
			// 			}
			// 		]
			// 	}

			// 	self.set_value(JSON.stringify(data_layers));
			// });

			// const drawingManager = new google.maps.drawing.DrawingManager({
			// 	drawingMode: google.maps.drawing.OverlayType.MARKER,
			// 	drawingControl: true,
			// 	drawingControlOptions: {
			// 	  position: google.maps.ControlPosition.TOP_CENTER,
			// 	  drawingModes: [
			// 		google.maps.drawing.OverlayType.MARKER,
			// 		google.maps.drawing.OverlayType.CIRCLE,
			// 		// google.maps.drawing.OverlayType.POLYGON,
			// 		// google.maps.drawing.OverlayType.POLYLINE,
			// 		// google.maps.drawing.OverlayType.RECTANGLE,
			// 	  ],
			// 	},
			// 	markerOptions: {
			// 	  icon: icon,
			// 	},
			// 	circleOptions: {
			// 	  fillColor: "rgb(51, 136, 255)",
			// 	  fillOpacity: 0.2,
			// 	  strokeWeight: 1,
			// 	  strokeColor: "rgb(51, 136, 255)",
			// 	  clickable: false,
			// 	  editable: true,
			// 	  zIndex: 1,
			// 	},
			// });
			// drawingManager.setMap(map);
		}
	},

	draw_map(map, position) {
		const icon = {
			url: "https://iconsplace.com/wp-content/uploads/_icons/ff0000/256/png/radio-tower-icon-14-256.png",
			scaledSize: new google.maps.Size(15, 15)
		};
	
		if (marker) {
			marker.setPosition(position);
		} else {
			if (position) {
				marker = new google.maps.Marker({
					position: position,
					map: map,
					icon: icon
				});
			}
		}

		if (marker) {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() {
				marker.setAnimation(null);
			}, 750);
		}
	},

    make_wrapper() {
		// Create the elements for map area
		this._super();
		self = this;

		let $input_wrapper = this.$wrapper.find('.control-input-wrapper');
		this.map_id = 'map';

		this.map_area = $(
			`<div class="map-wrapper border">
				<div id="` + this.map_id + `" style="min-height: 400px; z-index: 1; max-width:100%"></div>
			</div>`
		);

		this.map_area.prependTo($input_wrapper);
		this.$wrapper.find('.control-input').addClass("hidden");
		
		const icon = {
			url: "https://iconsplace.com/wp-content/uploads/_icons/ff0000/256/png/radio-tower-icon-14-256.png",
			scaledSize: new google.maps.Size(15, 15)
		};
	}
});