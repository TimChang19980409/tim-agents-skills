I'll investigate the migration issue. Let me gather more context about the project structure and any precompiled files.

Now I have the official documentation. Let me synthesize the findings.

---

## Diagnosis

**Root Cause**: JasperReports 7.0.0 **deliberately broke backward compatibility** for compiled `.jasper` files.

From the official JasperReports README (GitHub):
> "Deprecated code has been removed, leading to a break in backward compatibility for serialized/compiled `*.jasper` report template files. Source `*.jrxml` report templates need to be recompiled using the new version of the library."

The error `InvalidClassException: net.sf.jasperreports.engine.base.JRBaseReport; incompatible class` occurs because:
- `.jasper` files are serialized `JasperReport` objects
- Version 7.x changed the class structure (serialVersionUID mismatch)
- The precompiled `sales.jasper` from the 6.x build job cannot be deserialized by 7.x runtime

---

## Minimum Recovery Plan

1. **Recompile JRXML templates** with JasperReports 7.x:
   ```java
   import net.sf.jasperreports.engine.JasperCompileManager;
   
   // Compile at runtime or as part of build
   JasperReport report = JasperCompileManager.compileReport("sales_legacy.jrxml");
   ```

2. **Option A - Runtime compilation**: Modify `LegacyReportLoader` to compile JRXML instead of loading serialized .jasper

3. **Option B - Build-time compilation**: Add a Maven goal to compile JRXML during the build process with 7.x compiler

4. **Remove precompiled .jasper files** from the deployment — they are now technical debt

---

## Official Sources

- [JasperReports 7.0.0 Change Log](https://github.com/jaspersoft/jasperreports/blob/master/README.md) — "Backward compatibility...has been deliberately broken"
- [Compilation documentation](https://context7.com/jaspersoft/jasperreports/llms.txt) — `JasperCompileManager.compileReport()` API
