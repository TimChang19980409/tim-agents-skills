package com.example.report;

import java.io.InputStream;
import java.util.Map;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.util.JRLoader;

public class CjkInvoiceReportService {

  public byte[] exportPdf(Map<String, Object> params) throws JRException {
    InputStream compiled = getClass().getResourceAsStream("/reports/invoice_zh.jasper");
    JasperPrint print = JasperFillManager.fillReport(JRLoader.loadObject(compiled), params, new net.sf.jasperreports.engine.JREmptyDataSource(1));
    return JasperExportManager.exportReportToPdf(print);
  }
}
