package com.example.alert;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerchantAlertRepository extends JpaRepository<MerchantAlertRule, UUID> {
  List<MerchantAlertRule> findByMerchantIdAndChannelAndEnabledTrue(UUID merchantId, String channel);
}
