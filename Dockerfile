FROM node:16.13

WORKDIR /usr/src/app

# Add package file
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source
COPY server.js ./

# Expose port 8080
EXPOSE 8080
CMD npm run start