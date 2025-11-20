# Use the official Bun image
FROM oven/bun:latest

# Set the working directory in the container to /
WORKDIR /

# Copy package.json and bun.lock to the working directory
COPY package.json bun.lock ./

# Install any needed packages specified in package.json
RUN bun install --production

# Bundle the app source inside the Docker image 
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["bun", "run", "src/backend/server.ts"]