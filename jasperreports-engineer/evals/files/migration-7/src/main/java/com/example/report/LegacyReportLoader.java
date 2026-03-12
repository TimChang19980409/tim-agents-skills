package com.example.report;

import java.io.InputStream;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;

public class LegacyReportLoader {

  public JasperPrint loadAndFill() throws JRException {
    InputStream compiled = getClass().getResourceAsStream("/reports/sales.jasper");
    JasperReport report = (JasperReport) JRLoader.loadObject(compiled);
    return JasperFillManager.fillReport(report, new java.util.HashMap<>(), new net.sf.jasperreports.engine.JREmptyDataSource(1));
  }
}
