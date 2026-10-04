# 1. Use a lightweight Python base image
FROM python:3.11-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the requirements file first (this caches dependencies to make future builds faster)
COPY requirements.txt .

# 4. Install the Python packages
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of your project files into the container
COPY . .

# 6. Expose the port your FastAPI app runs on
EXPOSE 8000

# 7. Start the application
CMD ["python", "app.py"]