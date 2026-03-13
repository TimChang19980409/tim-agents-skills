package com.example.member;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.time.Instant;
import java.util.UUID;

@Entity
public class MemberRecord {
  @Id
  private UUID id;
  private String email;
  private Instant deletedAt;
}
