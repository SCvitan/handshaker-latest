package com.handshaker.profiles_service.model;

import com.handshaker.profiles_service.enums.AccommodationProvider;
import com.handshaker.profiles_service.enums.AccommodationType;
import com.handshaker.profiles_service.enums.PeopleCount;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "accommodation")
public class Accommodation {

    @Id
    private UUID id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "profile_id")
    private UserProfile profile;

    @Embedded
    private Address address;

    @Enumerated(EnumType.STRING)
    private AccommodationProvider provider;

    @Enumerated(EnumType.STRING)
    private AccommodationType type;

    @Enumerated(EnumType.STRING)
    private PeopleCount peopleInAccommodation;

    @Enumerated(EnumType.STRING)
    private PeopleCount peopleInRoom;

    public Accommodation() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UserProfile getProfile() {
        return profile;
    }

    public void setProfile(UserProfile profile) {
        this.profile = profile;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public AccommodationProvider getProvider() {
        return provider;
    }

    public void setProvider(AccommodationProvider provider) {
        this.provider = provider;
    }

    public AccommodationType getType() {
        return type;
    }

    public void setType(AccommodationType type) {
        this.type = type;
    }

    public PeopleCount getPeopleInAccommodation() {
        return peopleInAccommodation;
    }

    public void setPeopleInAccommodation(PeopleCount peopleInAccommodation) {
        this.peopleInAccommodation = peopleInAccommodation;
    }

    public PeopleCount getPeopleInRoom() {
        return peopleInRoom;
    }

    public void setPeopleInRoom(PeopleCount peopleInRoom) {
        this.peopleInRoom = peopleInRoom;
    }
}
