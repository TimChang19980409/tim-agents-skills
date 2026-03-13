package com.example.invoice;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;
import java.util.UUID;

@Entity
public class Invoice {
  @Id
  private UUID id;

  @OneToMany(mappedBy = "invoice", fetch = FetchType.LAZY)
  private List<InvoiceLine> lines;
}
