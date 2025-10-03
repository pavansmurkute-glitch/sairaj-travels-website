# =========================
# 1. Build stage
# =========================
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven files first for dependency caching
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code and build the JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests

# =========================
# 2. Runtime stage
# =========================
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*SNAPSHOT.jar app.jar

# Expose port 8080 (Render will map it dynamically)
EXPOSE 8080

# Java options injected by Render
ENV JAVA_OPTS=""

# Run Spring Boot app
CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
