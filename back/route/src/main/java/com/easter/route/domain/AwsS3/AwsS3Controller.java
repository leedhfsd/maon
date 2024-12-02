package com.easter.route.domain.AwsS3;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/maon")
public class AwsS3Controller {

	private final AmazonS3 amazonS3Client;

	@Value("${aws.s3.bucket}")
	private String bucket;

	// 단일 업로드
	@PostMapping("/upload-file")
	public ResponseEntity<String> uploadFile(@RequestPart("uploadFile") MultipartFile file) {
		String originalFilename = file.getOriginalFilename();
		//String key = "member/" + originalFilename; // 경로 추가
		String fileUrl;
		ObjectMetadata metadata = new ObjectMetadata();
		metadata.setContentType(file.getContentType());
		metadata.setContentLength(file.getSize());

		try (InputStream inputStream = file.getInputStream()) {
			PutObjectRequest putObjectRequest = new PutObjectRequest(
				bucket, originalFilename, inputStream, metadata
			);
			amazonS3Client.putObject(putObjectRequest);
			fileUrl = "https://d384lablk8zd6p.cloudfront.net/" + putObjectRequest.getKey();
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("파일 업로드에 실패했습니다: " + originalFilename);
		}
		return ResponseEntity.ok().body(fileUrl);
	}

	// 다중 업로드
	@PostMapping("/upload-files")
	public ResponseEntity<?> uploadFiles(@RequestPart("uploadFiles") List<MultipartFile> files) throws IOException {
		List<String> urls = new ArrayList<>();
		for (MultipartFile file : files) {
			String originalFilename = file.getOriginalFilename();
			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType(file.getContentType());
			metadata.setContentLength(file.getSize());

			try (InputStream inputStream = file.getInputStream()) {
				PutObjectRequest putObjectRequest = new PutObjectRequest(
					bucket, originalFilename, inputStream, metadata
				);
				amazonS3Client.putObject(putObjectRequest);
				String fileUrl = "https://d384lablk8zd6p.cloudfront.net/" + putObjectRequest.getKey();
				urls.add(fileUrl);
			} catch (IOException e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("파일 업로드에 실패했습니다: " + originalFilename);
			}
		}
		return ResponseEntity.ok().body(urls);
	}
}
