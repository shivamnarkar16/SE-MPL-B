import json
import requests

# Example link
url = "https://instafood-server-7ayg.vercel.app/api/restaurants?lat=12.9351929&lng=77.62448069999999"

# Send a GET request to the URL
response = requests.get(url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Print the content of the response

    restaurants_data = json.loads(response.text)["data"]["cards"][1]["card"]["card"][
        "gridElements"
    ]["infoWithStyle"]["restaurants"]
else:
    # Print an error message if the request was unsuccessful
    print("Failed to fetch data:", response.status_code)


def get_restaurant_details(name):
    for restaurant in restaurants_data:
        restaurant_name = restaurant["info"]["name"].lower()
        if restaurant_name.startswith(name.lower()):
            return restaurant["info"]
    return None


def main():
    while True:
        name = input("Enter the name of the restaurant (or 'quit' to exit): ")
        if name.lower() == "quit":
            break
        restaurant = get_restaurant_details(name)
        if restaurant:
            print("Restaurant details:")
            print("Name:", restaurant["name"])
            print("Locality:", restaurant["locality"])
            print("Area:", restaurant["areaName"])
            print("Cuisines:", ", ".join(restaurant["cuisines"]))
            print("Average Rating:", restaurant["avgRating"])
            print("Total Ratings:", restaurant["totalRatingsString"])
            print("Delivery Time:", restaurant["sla"]["slaString"])
            print("Last Mile Travel:", restaurant["sla"]["lastMileTravelString"])
        else:
            print("Restaurant not found.")


if __name__ == "__main__":
    main()
