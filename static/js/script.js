let hourlyChart, dailyChart;  // Declare variables for the charts

// Handle "Get Weather" and "Get Forecast" button clicks
document.addEventListener("DOMContentLoaded", function () {

    // Get current weather
    function getWeather() {
        let city = document.getElementById("city").value;

        fetch(`/weather/${city}`)
            .then(response => response.json())
            .then(data => {
                // Safely access and update 'currentWeather'
                const currentWeather = document.getElementById('currentWeather');
                if (currentWeather) {
                    if (data.error) {
                        currentWeather.innerHTML = `<p>${data.error}</p>`;
                    } else {
                        currentWeather.innerHTML = `
                            <h3>Current Weather in ${data.city}</h3>
                            <p>Temperature: ${data.temperature}°C</p>
                            <p>Humidity: ${data.humidity}%</p>
                            <p>Pressure: ${data.pressure}mb</p>
                            <p>Condition: ${data.condition}</p>
                            <img src="${data.icon}" alt="Weather Icon">
                        `;
                    }
                } else {
                    console.error('Error: "currentWeather" element not found');
                }
            })
            .catch(error => {
                console.error('Error fetching weather:', error);
            });
    }

    // Get weather forecast
    function getForecast() {
        let city = document.getElementById("city").value;

        fetch(`/forecast/${city}`)
            .then(response => response.json())
            .then(data => {
                //  Safely access and update 'forecastResult'
                const forecastResult = document.getElementById('forecastResult');
                if (forecastResult) {
                    forecastResult.innerHTML = `
                        <h3>Weather Forecast for ${data.city}</h3>
                    `;

                    // Update hourly chart
                    const hourlyTemps = data.hourly.map(hour => hour.temp_c);
                    const hourlyTimes = data.hourly.map(hour => hour.time.split(' ')[1]);

                    if (hourlyChart) hourlyChart.destroy();  // Destroy previous chart if it exists

                    const ctxHourly = document.getElementById('hourlyWeatherChart').getContext('2d');
                    hourlyChart = new Chart(ctxHourly, {
                        type: 'line',
                        data: {
                            labels: hourlyTimes,
                            datasets: [{
                                label: 'Temperature (°C)',
                                data: hourlyTemps,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Temperature (°C)'
                                    }
                                }
                            }
                        }
                    });

                    // Update daily chart
                    const dailyTemps = data.daily.map(day => day.day.avgtemp_c);
                    const dailyDates = data.daily.map(day => day.date);

                    if (dailyChart) dailyChart.destroy();  // Destroy previous chart if it exists

                    const ctxDaily = document.getElementById('dailyWeatherChart').getContext('2d');
                    dailyChart = new Chart(ctxDaily, {
                        type: 'bar',
                        data: {
                            labels: dailyDates,
                            datasets: [{
                                label: 'Avg Temperature (°C)',
                                data: dailyTemps,
                                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                                borderColor: 'rgba(153, 102, 255, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Avg Temperature (°C)'
                                    }
                                }
                            }
                        }
                    });

                } else {
                    console.error('Error: "forecastResult" element not found');
                }
            })
            .catch(error => {
                console.error('Error fetching forecast:', error);
            });
    }

    // Event listeners for buttons
    document.getElementById('getWeatherBtn').addEventListener('click', getWeather);
    document.getElementById('getForecastBtn').addEventListener('click', getForecast);
});