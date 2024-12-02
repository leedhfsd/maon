package com.easter.route.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@Configuration
public class MongoConfig {

	@Value("${spring.data.mongodb.username}")
	private String username;

	@Value("${spring.data.mongodb.password}")
	private String password;

	@Value("${spring.data.mongodb.host}")
	private String host;

	@Value("${spring.data.mongodb.port}")
	private String port;

	@Value("${spring.data.mongodb.database}")
	private String database;

	@Bean
	public MongoTemplate mongoTemplate() throws Exception {
		String connectionString = String.format(
			"mongodb://%s:%s@%s:%s/%s?authSource=admin",
			username,
			password,
			host,
			port,
			database
		);

		MongoClient mongoClient = MongoClients.create(
			MongoClientSettings.builder()
				.applyConnectionString(new ConnectionString(connectionString))
				.build());

		return new MongoTemplate(mongoClient, database);
	}
}