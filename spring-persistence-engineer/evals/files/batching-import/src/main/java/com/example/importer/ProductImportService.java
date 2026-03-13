package com.example.importer;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductImportService {
  @Transactional
  public void importSnapshots(List<ProductSnapshot> snapshots) {
    for (ProductSnapshot snapshot : snapshots) {
      // repository.save(snapshot.toEntity());
    }
  }
}
