# ---- Build Stage ----
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven files and download dependencies first
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Run Stage ----
FROM eclipse-temurin:17-jdk

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Render sets $PORT automatically, so we pass it to Spring Boot
ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=$PORT app.jar"]
