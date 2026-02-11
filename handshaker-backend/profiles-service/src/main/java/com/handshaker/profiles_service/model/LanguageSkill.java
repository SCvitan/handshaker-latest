package com.handshaker.profiles_service.model;

import com.handshaker.profiles_service.enums.Language;
import jakarta.persistence.*;

@Entity
@Table(name = "language_skills")
public class LanguageSkill {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    @Enumerated(EnumType.STRING)
    private Language language;

    private int written;
    private int spoken;
    private int reading;
    private int understanding;

    public LanguageSkill() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public int getWritten() {
        return written;
    }

    public void setWritten(int written) {
        this.written = written;
    }

    public int getSpoken() {
        return spoken;
    }

    public void setSpoken(int spoken) {
        this.spoken = spoken;
    }

    public int getReading() {
        return reading;
    }

    public void setReading(int reading) {
        this.reading = reading;
    }

    public int getUnderstanding() {
        return understanding;
    }

    public void setUnderstanding(int understanding) {
        this.understanding = understanding;
    }
}
