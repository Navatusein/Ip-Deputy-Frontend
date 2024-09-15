FROM node:20.12.2-alpine as build
WORKDIR /app
ADD ./ ./
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY environment.sh /docker-entrypoint.d/environment.sh
RUN chmod +x /docker-entrypoint.d/environment.sh
EXPOSE 80
