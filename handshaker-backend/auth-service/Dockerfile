# Stage 1: build
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app

# Copy everything from the backend root (context is handshaker-backend)
COPY . .

# Build all modules
RUN mvn clean package -DskipTests

# Stage 2: runtime
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy only auth-service JAR
COPY --from=build /app/auth-service/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
