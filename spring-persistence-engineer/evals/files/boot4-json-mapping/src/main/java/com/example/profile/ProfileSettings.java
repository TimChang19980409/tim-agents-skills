package com.example.profile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;

@Entity
public class ProfileSettings {
  @Id
  private UUID id;

  @Column(name = "settings_payload")
  private String settingsPayload;
}
