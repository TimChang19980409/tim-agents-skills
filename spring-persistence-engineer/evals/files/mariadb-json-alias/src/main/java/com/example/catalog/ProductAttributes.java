package com.example.catalog;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class ProductAttributes {
  @Id
  private Long id;

  @Column(columnDefinition = "json")
  private String attributes;
}
