package com.example.session;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.UUID;

@Entity
public class CustomerSession {
  @Id
  @Column(columnDefinition = "char(36)")
  private UUID id;
}
