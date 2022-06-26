FROM node:16.15.0-alpine

WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["npm", "start"]