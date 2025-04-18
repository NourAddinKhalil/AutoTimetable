# Dockerfile للواجهة الأمامية
FROM node:20 AS build
WORKDIR /app
COPY Frontend/auto-timetable-ui/package*.json ./
RUN npm install
COPY Frontend/auto-timetable-ui/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY Frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
