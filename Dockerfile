#Dockerfile for frontend

FROM node:18-alpine AS builder
WORKDIR /frontend

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 