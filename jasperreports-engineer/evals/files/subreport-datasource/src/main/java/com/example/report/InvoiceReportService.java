package com.example.report;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

public class InvoiceReportService {

  public byte[] exportInvoicePdf(OrderView order) throws JRException {
    InputStream mainReport = getClass().getResourceAsStream("/reports/invoice_main.jasper");

    Map<String, Object> params = new HashMap<>();
    params.put("SUBREPORT_DIR", "classpath:/reports/");
    params.put("INVOICE_NO", order.invoiceNo());

    JasperPrint print = JasperFillManager.fillReport(
        mainReport,
        params,
        new JRBeanCollectionDataSource(List.of(order))
    );

    return JasperExportManager.exportReportToPdf(print);
  }
}
