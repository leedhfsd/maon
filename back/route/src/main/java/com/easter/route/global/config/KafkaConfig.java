package com.easter.route.global.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.record.CompressionType;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.easter.route.domain.running.entity.dto.LocationDto;

@Configuration
@EnableKafka
public class KafkaConfig {

	// Kafka message는 Exactly Once로 전달한다. 이는
	// 이를 위해 INDENPOTENCE,
	@Bean
	public Map<String, Object> producerConfigs() {
		Map<String, Object> props = new HashMap<>();
		props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "k11c207.p.ssafy.io:29094,k11c207.p.ssafy.io:39094,k11c207.p.ssafy.io:49094");
		props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
		props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
		props.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, CompressionType.LZ4.name);
		props.put(ProducerConfig.ACKS_CONFIG, "all");
		props.put(ProducerConfig.BATCH_SIZE_CONFIG, 32768);
		props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
		props.put(ProducerConfig.LINGER_MS_CONFIG, 10);
		// 재시도 설정
		props.put(ProducerConfig.RETRIES_CONFIG, 3); // 최대 재시도 횟수 설정
		props.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG, 1000); // 재시도 간격 (밀리초)
		return props;
	}

	@Bean
	public <K, V>ProducerFactory<K, V> producerFactory() {
		DefaultKafkaProducerFactory<K, V> factory = new DefaultKafkaProducerFactory<>(producerConfigs());
		// Exactly once delivery (최종 전송 보장을 위한 랜덤 transactional Id 생성)
		// factory.setTransactionIdPrefix("tx");
		return factory;
	}

	@Bean
	public <K, V>KafkaTemplate<K, V> kafkaTemplate() {
		return new KafkaTemplate<>(producerFactory());
	}

	@Bean
	public Map<String, Object> consumerConfigs() {
		Map<String, Object> props = new HashMap<>();
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "k11c207.p.ssafy.io:29094,k11c207.p.ssafy.io:39094,k11c207.p.ssafy.io:49094");
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
		props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.easter.route.domain.running.entity.dto");
		return props;
	}

	@Bean
	public <K, V>ConsumerFactory<K, V> consumerFactory() {
		return new DefaultKafkaConsumerFactory<>(consumerConfigs());
	}

	@Bean
	public ConsumerFactory<String, LocationDto> locationConsumerFactory() {
		Map<String, Object> props = new HashMap<>();
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "k11c207.p.ssafy.io:29094,k11c207.p.ssafy.io:39094,k11c207.p.ssafy.io:49094");
		// ErrorHandlingDeserializer 설정 추가
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
		props.put(ErrorHandlingDeserializer.KEY_DESERIALIZER_CLASS, StringDeserializer.class);
		props.put(ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class);
		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

		JsonDeserializer<LocationDto> deserializer = new JsonDeserializer<>(LocationDto.class);
		deserializer.addTrustedPackages("*");  // 원래 패키지 경로 유지

		return new DefaultKafkaConsumerFactory<>(
			props,
			new ErrorHandlingDeserializer<>(new StringDeserializer()),
			new ErrorHandlingDeserializer<>(deserializer)
		);
	}

	@Bean
	public <K, V>ConcurrentKafkaListenerContainerFactory<K, V> kafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<K, V> factory = new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory());
		factory.getContainerProperties().setPollTimeout(3000);
		return factory;
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, LocationDto> locationKafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, LocationDto> factory = new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(locationConsumerFactory());
		factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
		return factory;
	}
}
