# Publishing an update

1. Set `GITHUB_REPOSITORY` in `js/main.js` to `owner/repository`.
2. Update both version fields in `CSXS/manifest.xml`.
3. Create a ZIP whose root contains `CSXS/manifest.xml`, `index.html`, `js/`, `jsx/`, and the bundled tools.
4. Name it `MyInstants-SFX-vX.Y.Z.zip`.
5. Generate the checksum:

   - Windows: `Get-FileHash .\MyInstants-SFX-vX.Y.Z.zip -Algorithm SHA256 | Select-Object -ExpandProperty Hash | Out-File -Encoding ascii .\MyInstants-SFX-vX.Y.Z.zip.sha256`
   - macOS: `shasum -a 256 MyInstants-SFX-vX.Y.Z.zip > MyInstants-SFX-vX.Y.Z.zip.sha256`

6. Create a public GitHub Release tagged `vX.Y.Z` and attach both files. Do not mark it as a draft.
