# -*- coding: utf-8 -*-
# Copyright (c) 2020, Frappe Technologies and contributors
# For license information, please see license.txt

from __future__ import unicode_literals

import frappe

from pymysql import InternalError


@frappe.whitelist()
def get_coords(doctype, filters, type):
	'''Get a geojson dict representing a doctype.'''
	filters_sql = get_coords_conditions(doctype, filters)[4:]

	coords = None
	if type == 'location_field':
		coords = return_location(doctype, filters_sql)
	elif type == 'coordinates':
		coords = return_coordinates(doctype, filters_sql)

	out = convert_to_geojson(type, coords)
	return out

def get_google_coords(doctype, filters, type):
	'''Get a google coords json dict representing a doctype.'''
	filters_sql = get_coords_conditions(doctype, filters)[4:]

	google_coords = None
	if type == 'google_coordinates':
		google_coords = return_google_coordinates(doctype, filters_sql)

	out = convert_to_geojson(type, google_coords)
	return out

def convert_to_geojson(type, coords):
	'''Converts GPS coordinates to geoJSON string.'''
	geojson = {"type": "FeatureCollection", "features": None}

	if type == 'location_field':
		geojson['features'] = merge_location_features_in_one(coords)
	elif type == 'coordinates':
		geojson['features'] = create_gps_markers(coords)
	elif type == 'googlemaps_coordinates':
		geojson = create_google_gps_markers(coords)

	return geojson


def merge_location_features_in_one(coords):
	'''Merging all features from location field.'''
	geojson_dict = []
	for element in coords:
		geojson_loc = frappe.parse_json(element['location'])
		if not geojson_loc:
			continue
		for coord in geojson_loc['features']:
			coord['properties']['name'] = element['name']
			geojson_dict.append(coord.copy())

	return geojson_dict


def create_gps_markers(coords):
	'''Build Marker based on latitude and longitude.'''
	geojson_dict = []
	for i in coords:
		node = {"type": "Feature", "properties": {}, "geometry": {"type": "Point", "coordinates": None}}
		node['properties']['name'] = i.name
		node['geometry']['coordinates'] = [i.latitude, i.longitude]
		geojson_dict.append(node.copy())

	return geojson_dict

def create_google_gps_markers(coords):
	for i in coords:
		i.google_maps_location['properties']['name'] = i.name
	
	return coords


def return_location(doctype, filters_sql):
	'''Get name and location fields for Doctype.'''
	if filters_sql:
		try:
			coords = frappe.db.sql('''SELECT name, location FROM `tab{}`  WHERE {}'''.format(doctype, filters_sql), as_dict=True)
		except InternalError:
			frappe.msgprint(frappe._('This Doctype does not contain location fields'), raise_exception=True)
			return
	else:
		coords = frappe.get_all(doctype, fields=['name', 'location'])
	return coords


def return_coordinates(doctype, filters_sql):
	'''Get name, latitude and longitude fields for Doctype.'''
	if filters_sql:
		try:
			coords = frappe.db.sql('''SELECT name, latitude, longitude FROM `tab{}`  WHERE {}'''.format(doctype, filters_sql), as_dict=True)
		except InternalError:
			frappe.msgprint(frappe._('This Doctype does not contain latitude and longitude fields'), raise_exception=True)
			return
	else:
		coords = frappe.get_all(doctype, fields=['name', 'latitude', 'longitude'])
	return coords

def return_google_coordinates(doctype, filters_sql):
	'''Get name and googlemaps fields for Doctype.'''
	print("sampe ini nih gw")
	if filters_sql:
		try:
			g_coords = frappe.db.sql('''SELECT name, google_maps_location FROM `tab{}` WHERE {}'''.format(doctype, filters_sql), as_dict=True)
		except InternalError:
			frappe.msgprint(frappe._('This Doctype does not contain latitude and longitude fields'), raise_exception=True)
			return
	else:
		g_coords = frappe.get_all(doctype, fields=['name', 'google_maps_location'])
	
	return g_coords

def get_coords_conditions(doctype, filters=None):
	'''Returns SQL conditions with user permissions and filters for event queries.'''
	from frappe.desk.reportview import get_filters_cond
	if not frappe.has_permission(doctype):
		frappe.throw(frappe._("Not Permitted"), frappe.PermissionError)

	return get_filters_cond(doctype, filters, [], with_match_conditions=True)
