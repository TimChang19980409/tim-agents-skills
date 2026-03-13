package com.example.order;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.UUID;

@Entity
public class OrderRecord {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID id;
}
