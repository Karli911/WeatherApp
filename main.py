from flask import Flask, render_template, jsonify, send_from_directory
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes

API_KEY = "56167929b20143ea8eb75651242909"


# Route to serve the HTML page
@app.route('/')
def home():
    return render_template('index.html') # This serves the HTML file

# Route to get weather by city
@app.route("/weather/<city>", methods=["GET"])
def get_weather(city):
    try:
        url = f"http://api.weatherapi.com/v1/current.json?key={API_KEY}&q={city}&aqi=no"
        print(f'Requesting: {url}')
        response = requests.get(url)
        print(f'Response: {response.text}')
        data = response.json()

        if "error" not in data:
            # Extract relevant data from the API response
            weather_info = {
                'city': data['location']['name'],
                'temperature': data['current']['temp_c'],
                'humidity': data['current']['humidity'],
                'pressure': data['current']['pressure_mb'],
                'condition': data['current']['condition']['text'],
                'icon': data['current']['condition']['icon']
            }
            return jsonify(weather_info)
        else:
            return jsonify({'error': "City not found"}), 404
    
    except Exception as e:
        return jsonify({"error": "Something went wrong in the server: " + str(e)}), 500

# Route to get weather forecast by city (for multiple days)
@app.route("/forecast/<city>", methods=["GET"])
def get_forecast(city):
    try:
        url = f"http://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={city}&days=3&aqi=no&alerts=no"
        print(f'Requesting: {url}')
        response = requests.get(url)
        print(f'Response: {response.text}')
        data = response.json()

        if "error" not in data:
            # Extract relevant data from the API response
            forecast_info = {
                'city': data['location']['name'],
                'current_temperature': data['current']['temp_c'],
                'hourly': data['forecast']['forecastday'][0]['hour'],
                'daily': data['forecast']['forecastday']
            }
            return jsonify(forecast_info)
        else:
            return jsonify({'error': "City not found"}), 404
        
    except Exception as e:
        return jsonify({"error": "Something went wrong in the server: " + str(e)}), 500

# Route for favicon
@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static', 'favicon.ico')


if __name__ == "__main__":
    app.run(debug=True)