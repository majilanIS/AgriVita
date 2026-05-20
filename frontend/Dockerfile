# Build stage
FROM node:24-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# Production stage: serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: replace default nginx config to support SPA history mode
RUN rm /etc/nginx/conf.d/default.conf
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
	listen 80;
	server_name _;
	root /usr/share/nginx/html;
	index index.html;
	location / {
		try_files $uri $uri/ /index.html;
	}
	error_page 500 502 503 504 /50x.html;
	location = /50x.html {
		root /usr/share/nginx/html;
	}
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
