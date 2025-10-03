# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper & pre-fetch deps (faster builds)
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw -q -DskipTests dependency:go-offline

# Copy source and build
COPY src ./src
RUN ./mvnw -q -DskipTests package

# ---- Run stage ----
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# non-root user for safety
RUN useradd -ms /bin/bash appuser
USER appuser

# Copy the built jar (wildcard handles your SNAPSHOT name)
COPY --from=build /app/target/*-SNAPSHOT.jar app.jar

# Render injects $PORT; we pass it to Spring Boot
EXPOSE 8080
ENV JAVA_OPTS=""
CMD ["bash","-lc","java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
