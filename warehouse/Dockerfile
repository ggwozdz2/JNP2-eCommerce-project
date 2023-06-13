# Use the official Python base image
FROM python:3.8-slim-buster

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code to the working directory
COPY . .

# Expose the port that the Flask app will run on
EXPOSE 8082

# Run the Flask app
CMD ["python3", "warehouse.py"]

