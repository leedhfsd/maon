package com.easter.route.domain.record.repository;


import java.util.Optional;

import com.easter.route.domain.record.entity.Record;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordRepository extends MongoRepository<Record, String> {
	@Override
	Record save(Record record);

	@Override
	Optional<Record> findById(String id);
}
