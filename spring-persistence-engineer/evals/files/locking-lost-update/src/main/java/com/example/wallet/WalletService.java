package com.example.wallet;

import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WalletService {
  @Transactional
  public void applyDelta(UUID walletId, BigDecimal delta) {
    Wallet wallet = null; // repository lookup omitted in fixture
    wallet.setBalance(wallet.getBalance().add(delta));
  }
}
