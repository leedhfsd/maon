# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file to the container
COPY build/libs/*.jar /app/app.jar

# Expose the port
EXPOSE 8765

# Set the environment variable to activate the 'prod' profile
ENV SPRING_CLOUD_CONFIG_URI=http://config-server:8888
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
