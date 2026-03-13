package com.example.wallet;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
public class Wallet {
  @Id
  private UUID id;
  private BigDecimal balance;
}
