package com.handshaker.company_service.service;

import com.handshaker.company_service.dto.JobAdRequest;
import com.handshaker.company_service.dto.JobAdResponse;
import com.handshaker.company_service.model.JobAd;
import com.handshaker.company_service.model.Location;
import com.handshaker.company_service.repository.JobAdRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class JobAdService {

    private final JobAdRepository repository;

    public JobAdService(JobAdRepository repository) {
        this.repository = repository;
    }

    public List<JobAdResponse> getCompanyJobs(UUID userId) {
        return repository.findByCompanyId(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    public JobAdResponse create(UUID userId, JobAdRequest request) {

        JobAd job = new JobAd();

        job.setCompanyId(userId);
        job.setIndustry(request.getIndustry());
        job.setPosition(request.getPosition());
        job.setDescription(request.getDescription());
        job.setWorkType(request.getWorkType());

        Location location = new Location();
        location.setStreet(request.getLocation().getStreet());
        location.setStreetNumber(request.getLocation().getStreetNumber());
        location.setCity(request.getLocation().getCity());
        location.setPostalCode(request.getLocation().getPostalCode());
        location.setCountry(request.getLocation().getCountry());

        job.setLocation(location);

        job.setSalaryType(request.getSalaryType());
        job.setSalaryAmount(request.getSalaryAmount());
        job.setWorkingHoursPerDay(request.getWorkingHoursPerDay());
        job.setWorkingDaysPerMonth(request.getWorkingDaysPerMonth());

        job.setAccommodationProvided(request.getAccommodationProvided());
        job.setTransportationProvided(request.getTransportationProvided());

        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());

        return map(repository.save(job));
    }

    public JobAdResponse update(UUID id, UUID userId, JobAdRequest updated) {

        JobAd job = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompanyId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        job.setIndustry(updated.getIndustry());
        job.setPosition(updated.getPosition());
        job.setDescription(updated.getDescription());
        job.setWorkType(updated.getWorkType());

        if (updated.getLocation() != null) {
            Location location = new Location();
            location.setStreet(updated.getLocation().getStreet());
            location.setStreetNumber(updated.getLocation().getStreetNumber());
            location.setCity(updated.getLocation().getCity());
            location.setPostalCode(updated.getLocation().getPostalCode());
            location.setCountry(updated.getLocation().getCountry());

            job.setLocation(location);
        }

        job.setSalaryType(updated.getSalaryType());
        job.setSalaryAmount(updated.getSalaryAmount());
        job.setWorkingHoursPerDay(updated.getWorkingHoursPerDay());
        job.setWorkingDaysPerMonth(updated.getWorkingDaysPerMonth());

        job.setAccommodationProvided(updated.getAccommodationProvided());
        job.setTransportationProvided(updated.getTransportationProvided());

        job.setUpdatedAt(LocalDateTime.now());

        return map(repository.save(job));
    }

    public void delete(UUID id, UUID userId) {

        JobAd job = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getCompanyId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        repository.delete(job);
    }

    private JobAdResponse map(JobAd job) {
        JobAdResponse dto = new JobAdResponse();

        dto.setId(job.getId());
        dto.setIndustry(job.getIndustry());
        dto.setPosition(job.getPosition());
        dto.setDescription(job.getDescription());

        JobAdResponse.Location location = new JobAdResponse.Location();

        if (job.getLocation() != null) {
            location.street = job.getLocation().getStreet();
            location.streetNumber = job.getLocation().getStreetNumber();
            location.city = job.getLocation().getCity();
            location.postalCode = job.getLocation().getPostalCode();
            location.country = job.getLocation().getCountry();
        }

        dto.setLocation(location);

        dto.setWorkType(job.getWorkType());
        dto.setSalaryType(job.getSalaryType());
        dto.setSalaryAmount(job.getSalaryAmount());
        dto.setWorkingHoursPerDay(job.getWorkingHoursPerDay());
        dto.setWorkingDaysPerMonth(job.getWorkingDaysPerMonth());

        dto.setAccommodationProvided(job.getAccommodationProvided());
        dto.setTransportationProvided(job.getTransportationProvided());

        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());

        return dto;
    }
}
