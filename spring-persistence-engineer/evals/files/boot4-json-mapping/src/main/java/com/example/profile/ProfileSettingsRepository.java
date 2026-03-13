package com.example.profile;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileSettingsRepository extends JpaRepository<ProfileSettings, UUID> {}
