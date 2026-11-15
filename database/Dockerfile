FROM postgres:16-alpine

ENV POSTGRES_USER=stockflow_user
ENV POSTGRES_PASSWORD=stockflow_pass
ENV POSTGRES_DB=stockflow_db

# Copia el script SQL para que se ejecute automáticamente al crear la base de datos
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
