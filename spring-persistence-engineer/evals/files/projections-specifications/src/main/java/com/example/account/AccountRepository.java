package com.example.account;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<AccountRecord, UUID> {
  List<AccountRecord> findByStatusAndCountry(String status, String country);
  List<AccountRecord> findByStatusAndCreatedAtAfter(String status, Instant createdAt);
  List<AccountRecord> findByCountryAndCreatedAtAfter(String country, Instant createdAt);
}
