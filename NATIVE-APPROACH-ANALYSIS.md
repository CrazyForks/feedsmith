# Native fast-xml-parser Entity/CDATA Handling Analysis

This branch (`fix/native-entity-cdata-handling`) documents an experimental attempt to replace Feedsmith's custom entity/CDATA handling with fast-xml-parser's native implementation.

## Conclusion

**The native approach does NOT work** and the custom implementation is required.

## Why Native Approach Fails

### 1. stopNodes Prevents Entity/CDATA Processing

Feedsmith uses `stopNodes` configuration to:
- Preserve text content as strings (not parsed as nested nodes)
- Keep HTML/XHTML content verbatim
- Control how content is processed

With stopNodes enabled:
- `&amp;` remains as `&amp;` (NOT decoded)
- `<![CDATA[...]]>` remains as-is (NOT stripped)

This means fast-xml-parser's `processEntities` and `htmlEntities` options have **no effect** on stop node content.

### 2. Removing stopNodes Breaks Content Handling

Without stopNodes, fast-xml-parser tries to parse XHTML content as XML nodes:

```xml
<content type="xhtml">
  <div xmlns="http://www.w3.org/1999/xhtml">
    <p>HTML content here</p>
  </div>
</content>
```

- **With stopNodes**: Content preserved as string `"<div xmlns...><p>HTML content here</p></div>"`
- **Without stopNodes**: Content parsed as nested XML nodes, **losing the original string representation**

### 3. Test Results

| Approach | Entity Handling | CDATA Handling | XHTML Content | Tests |
|----------|----------------|----------------|---------------|-------|
| **stopNodes + custom** | ✅ | ✅ | ✅ Preserved | All pass |
| **Native (no stopNodes)** | ✅ | ✅ | ❌ Broken | ~46 fail |

## Recommendation

Keep the custom implementation from PRs #205 and #206:

1. **stopNodes**: Essential for preserving text/HTML content as strings
2. **Custom parseString()**: Required to decode entities and strip CDATA for stop node content
3. **Custom implementation**: Gives explicit control over processing behavior

## Changes Made in This Branch (DO NOT MERGE)

1. Modified `src/common/config.ts`: Enabled `processEntities` and `htmlEntities`
2. Modified `src/common/utils.ts`: Removed custom entity/CDATA handling
3. Removed `stopNodes` from RSS, Atom, and RDF parser configs
4. Updated tests accordingly

This branch is for documentation/analysis purposes only.
