I'll analyze this JasperReports migration issue. Let me gather more context about the project structure and check for existing .jasper files.

## Diagnosis

**Root Cause: Deliberate Binary Incompatibility in JasperReports 7.x**

The error `incompatible class: net.sf.jasperreports.engine.base.JRBaseReport` occurs because **JasperReports 7.0.0+ deliberately broke backward compatibility for compiled `.jasper` files**.

### Official Source (JasperReports 7.0.0 Change Log):
> *"the backward compatibility of serialized/compiled `*.jasper` report template files has been deliberately broken... Source `*.jrxml` report templates need to be recompiled using the new version of the library."*

The error log confirms this — `sales.jasper` was compiled with JasperReports 6.20.5, and attempting to load it with 7.0.1 fails due to incompatible class structure.

---

## Minimum Recovery Plan

### Option 1: Recompile JRXML with JasperReports 7.x (Recommended)

1. **Add Maven plugin to pom.xml** to compile JRXML at build time:
```xml
<build>
  <plugins>
    <plugin>
      <groupId>net.sf.jasperreports</groupId>
      <artifactId>jasperreports-maven-plugin</artifactId>
      <version>1.0.0</version>
      <executions>
        <execution>
          <goals>
            <goal>compile</goal>
          </goals>
        </execution>
      </executions>
    </plugin>
  </plugins>
</build>
```

2. **Run**: `mvn jasperreports:compile` — generates new `.jasper` files compatible with 7.x

### Option 2: Compile JRXML at Runtime (Code Change)

Modify `LegacyReportLoader.java` to compile JRXML instead of loading precompiled `.jasper`:

```java
public JasperPrint loadAndFill() throws JRException {
    InputStream jrxml = getClass().getResourceAsStream("/reports/sales_legacy.jrxml");
    JasperReport report = JasperCompileManager.compileReport(jrxml);
    return JasperFillManager.fillReport(report, new HashMap<>(), new JREmptyDataSource(1));
}
```

---

## Recommendation

**Option 2** is the minimum change — it requires no pom.xml changes and eliminates the dependency on precompiled binaries. The existing `sales_legacy.jrxml` in `src/main/resources/reports/` can be compiled directly at runtime.
