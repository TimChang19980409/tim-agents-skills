package com.example.invoice;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.util.UUID;

@Entity
public class InvoiceLine {
  @Id
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  private Invoice invoice;
}
