package com.example.report;

import java.io.InputStream;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JsonDataSource;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;

public class SalesExportService {

  public byte[] exportLargeWorkbook(InputStream jsonStream) throws JRException {
    InputStream template = getClass().getResourceAsStream("/reports/sales_json.jrxml");
    var report = JasperCompileManager.compileReport(template);
    JsonDataSource dataSource = new JsonDataSource(jsonStream, "orders.items");
    JasperPrint print = JasperFillManager.fillReport(report, new java.util.HashMap<>(), dataSource);

    java.io.ByteArrayOutputStream output = new java.io.ByteArrayOutputStream();
    JRXlsxExporter exporter = new JRXlsxExporter();
    exporter.setExporterInput(new SimpleExporterInput(print));
    exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(output));
    exporter.exportReport();
    return output.toByteArray();
  }
}
