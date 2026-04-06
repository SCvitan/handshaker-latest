package com.handshaker.profiles_service.service;

import com.handshaker.profiles_service.dto.DocumentUploadResult;
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

    public DocumentUploadResult uploadDocument(UUID userId, MultipartFile file) {

        validateDocument(file);

        boolean isImage = isImage(file);

        String key = "documents/" + userId + "/" + UUID.randomUUID() + "-" + file.getOriginalFilename();

        try {

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(
                    request,
                    RequestBody.fromInputStream(
                            file.getInputStream(),
                            file.getSize()
                    )
            );

            String thumbnailUrl = null;

            if (isImage) {
                thumbnailUrl = uploadThumbnail(userId, file);
            }

            return new DocumentUploadResult(
                    publicUrl + "/handshaker/" + key,
                    thumbnailUrl,
                    isImage
            );

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload document", e);
        }
    }

    private String uploadThumbnail(UUID userId, MultipartFile file) throws IOException {

        String key = "documents/" + userId + "/thumb-" + UUID.randomUUID() + ".jpg";

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Thumbnails.of(file.getInputStream())
                .size(200, 200)
                .crop(Positions.CENTER)
                .outputFormat("jpg")
                .outputQuality(0.8)
                .toOutputStream(outputStream);

        byte[] thumbnail = outputStream.toByteArray();

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType("image/jpeg")
                .build();

        s3Client.putObject(
                request,
                RequestBody.fromBytes(thumbnail)
        );

        return publicUrl + "/handshaker/" + key;
    }

    private void validateDocument(MultipartFile file) {

        if (file.getContentType() == null) {
            throw new RuntimeException("Invalid file");
        }

        if (!file.getContentType().startsWith("image/")
                && !file.getContentType().equals("application/pdf")) {

            throw new RuntimeException("Only images and PDFs allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File too large (10MB max)");
        }
    }

    private boolean isImage(MultipartFile file) {
        return file.getContentType() != null &&
                file.getContentType().startsWith("image/");
    }

}
