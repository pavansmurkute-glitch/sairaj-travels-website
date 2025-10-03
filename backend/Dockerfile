# Use Maven with OpenJDK 21 as base image
FROM maven:3.9.4-eclipse-temurin-21

# Set working directory
WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:resolve -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/sairaj-travels-backend-0.0.1-SNAPSHOT.jar"]
