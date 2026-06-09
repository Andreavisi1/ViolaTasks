CSV upload zone — the dashboard's entry point. Drag a file or click "Scegli file"; reflects the loaded filename, row count, or a parse error.

```jsx
<Dropzone onFile={handleCsv} fileName={file?.name} rowCount={events.length} error={parseError} />
```

Wire `onFile` to PapaParse; pass `error` (string) to show the malformed-CSV banner, `fileName`+`rowCount` once parsed.
