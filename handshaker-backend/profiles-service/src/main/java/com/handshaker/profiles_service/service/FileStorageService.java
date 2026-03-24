package com.handshaker.profiles_service.service;

import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.geometry.Positions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileStorageService {

    private final S3Client s3Client;
    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${r2.bucket}")
    private String bucket;

    @Value("${r2.public-url}")
    private String publicUrl;

    public FileStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadProfileImage(UUID userId, MultipartFile file) {

        String key = "profiles/" + userId + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        try {
            // Process image: resize, crop, convert to JPEG
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Thumbnails.of(file.getInputStream())
                    .size(256, 256)              // standard size
                    .crop(Positions.CENTER)       // center crop
                    .outputFormat("jpg")          // normalize format
                    .outputQuality(0.8)           // compression
                    .toOutputStream(outputStream);

            byte[] processedImage = outputStream.toByteArray();

            // Upload to R2
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType("image/jpeg")  // important: correct content type
                    .build();

            s3Client.putObject(
                    request,
                    RequestBody.fromBytes(processedImage)
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to process/upload file", e);
        }

        log.info("Profile picture uploaded to R2");

        return publicUrl + "/" + "handshaker" + "/" + key;
    }

}
