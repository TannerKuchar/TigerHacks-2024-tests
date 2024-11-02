from flask import Flask, render_template, request

app = Flask(__name__)

# ROUTES
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/find')
def find():
    return render_template('find.html')

@app.route('/donate')
def donate():
    return render_template('donate.html')

# SERVER SCRIPTS

# Data Tools
import pandas as pd
from prophet import Prophet
from geopy import distance
import math
from datetime import date
from geopy.geocoders import Nominatim
import json

# Accepted CORS Origins
origins = [
    "http://127.0.0.1:3000/",
    "https://www.zerohungernetwork.com/",
    "https://zerohungernetwork.com/",
]

# GeoPy Initializations
geolocator = Nominatim(user_agent="zerohungernetwork")

# Pandas Initializations
donation_df = pd.read_csv('generated_donations.csv')

# Locations
unique_locations = donation_df['Location'].unique()

# Fit Prophet Models
prophet_donations = Prophet(changepoint_prior_scale=0.8)
prophet_donations_df = pd.read_csv('generated_donations.csv')
prophet_donations_df.rename(columns={'Date': 'ds', '# Meals': 'y'}, inplace=True)
prophet_donations.fit(prophet_donations_df)

prophet_distributions = Prophet(changepoint_prior_scale=0.8)
prophet_distributions_df = pd.read_csv('generated_distributions.csv')
prophet_distributions_df.rename(columns={'Date': 'ds', '# Meals': 'y'}, inplace=True)
prophet_distributions.fit(prophet_distributions_df)

# Get 10 nearby pantries given a zip code
def get_nearby_pantries(zip_code):
    # Convert zip code to lat and long
    location = geolocator.geocode({"postalcode": zip_code, "country": "US"}) 
    if not location:
        return None
    user_location = (location.latitude, location.longitude)

    # Get distances to each pantry location
    distances = {}
    for i, compare_location in enumerate(unique_locations):
        other_location = (donation_df[donation_df['Location'] == compare_location].iloc[0]['Lat'],donation_df[donation_df['Location'] == compare_location].iloc[0]['Long'])
        location_distance = distance.distance(user_location, other_location)
        distances[compare_location] = location_distance.miles

    # Sort the distances
    shortest_distances = sorted(distances.values())[:10] # Get 10 shortest distances
    
    # Match the distances with the pantry locations
    closest_locations = [None] * 10
    for address in distances.keys():
        if distances[address] in shortest_distances: # If address is in the top 10
            index = shortest_distances.index(distances[address])
            closest_locations[index] = {'address': address, 'distance': distances[address]}
        
    return closest_locations

# Predict number of donations given a future date
def predict_donations(location, dt):
    difference = (date.fromisoformat(dt) - date.fromisoformat('2024-11-01')).days
    future = prophet_donations.make_future_dataframe(periods=difference)
    subset = prophet_donations_df[prophet_donations_df['Location'] == location]
    location_fit = Prophet().fit(subset)
    forecast = location_fit.predict(subset)
    return math.ceil(forecast.iloc[-1, 1])

# Predict number of distributions given a future date
def predict_distributions(location, dt):
    difference = (date.fromisoformat(dt) - date.fromisoformat('2024-11-01')).days
    future = prophet_distributions.make_future_dataframe(periods=difference)
    subset = prophet_distributions_df[prophet_distributions_df['Location'] == location]
    location_fit = Prophet().fit(subset)
    forecast = location_fit.predict(subset)
    print("distributions predicted for " + location + " = " + str(math.ceil(forecast.iloc[-1, 1])))
    return math.ceil(forecast.iloc[-1, 1])

# Get the demand for meals at a given location
def get_pantry_demand(location, dt):
    difference = predict_distributions(location, dt) - predict_donations(location, dt)
    if difference > 0:
        return difference
    else:
        return 0

# Finds the pantries with the highest number of meals needed. If a zip code is provided, then it uses the 10 nearest pantries and sorts them by demand.
def get_high_demand_pantries(zip_code=None, dt=None):

    # Dictionary to store meals needed for each location
    meals_needed_dict = dict()
    if zip_code is not None:
        # Get nearby locations based on zip_code
        nearby_locations = get_nearby_pantries(zip_code)

        meals_needed_dict = {
            location['address']: get_pantry_demand(location['address'], dt)
            for location in nearby_locations
        }
    else:
        meals_needed_dict = {location: get_pantry_demand(location, dt) for location in unique_locations}


    # Populate the dictionary with meals needed for each location
    # for location in unique_locations:
    #     meals_needed = get_pantry_demand(location, dt)  # Get the demand for each location
    #     meals_needed_dict[location] = meals_needed      # Store the demand with location as key

    # Sort locations by meals needed in descending order and select the top 10
    top_10_locations = sorted(meals_needed_dict.items(), key=lambda x: x[1], reverse=True)[:10]

    # Create a list of dictionaries with 'location' and 'demand' keys
    top_10_list = [{'location': location, 'demand': demand} for location, demand in top_10_locations]

    return top_10_list
        
            
@app.route('/zhn-endpoint', methods=['POST', 'GET', 'OPTIONS'])
def zhn_endpoint():
    # Set CORS headers for the preflight request
    if request.method == "OPTIONS":
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        if request.referrer in origins:
            headers = {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "3600",
            }
            return ("", 204, headers)
        else:
            headers = {}    
            return ("", 204, headers)

    # Set CORS headers for the main request
    headers = {"Access-Control-Allow-Origin": "*"}
    request_json = request.get_json()
    function = request_json['function']
    match function:
        case('get_nearby_pantries'):
            zip_code = request_json['zip_code']
            return (get_nearby_pantries(zip_code), 200, headers)
        case('predict_donations'):
            location = request_json['location']
            dt = request_json['date']
            return ({'donations': predict_donations(location, dt)})
        case('predict_distributions'):
            location = request_json['location']
            dt = request_json['date']
            return ({'distributions': predict_donations(location, dt)})
        case('get_pantry_demand'):
            location = request_json['location']
            dt = request_json['date']
            return ({'meals needed': get_pantry_demand(location, dt)})
        case('get_high_demand_pantries'):
            dt = request_json['date']
            if 'zip_code' in request_json.keys():
                return get_high_demand_pantries(zip_code=request_json['zip_code'],dt=dt)
            else:
                return get_high_demand_pantries(dt=dt)

    return ('success!', 200, headers)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)