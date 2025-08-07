# Create `llms-full.txt` by Using the `generate-llms-full.py` Script

The `generate-llms-full.py` script generates an `llms-full.txt` file when the Docusaurus site is built.

> [!CAUTION]
>
> If this script stops working, it's because [gitingest](https://github.com/coderamp-labs/gitingest) is either down or has limited its API usage. If that happens, we'll need to find another way or host gitingest ourselves and provide it with an API key from an AI language model provider (OpenAI, Claude, etc.) to generate the `llms-full.txt` file.

## Why do we need this script?

The `docusaurus-plugin-llms` plugin can generate a `llms-full.txt` file, the file doesn't include front-matter metadata. Currently, this seems to be the expected behavior for the `llms.txt` standard.

However, we need to be able to tell AI language models when our documentation applies to only specific editions, which is already specified in `tags` in the front-matter properties of each Markdown file.

By using [gitingest](https://github.com/coderamp-labs/gitingest), we can generate a `llms-full.txt` that includes front-matter data as well as a directory tree within `llms-full.txt` to provide AI language models with better context into our documentation, particularly front-matter metadata (like edition tags) and documentation navigation.

## Usage

The `generate-llms-full` script runs when the Docusaurus site is built:

```shell
npm run generate-llms-full
```

You should rarely have to run the following Python script directly, unless you want to do testing:

```shell
python scripts/generate-llms-full.py
```

### Requirements

- Python 3.8+
- gitingest package

> [!NOTE]
>
> For local development, install gitingest manually by using `pip install --user gitingest` or `pipx install gitingest`. For GitHub Actions, gitingest is automatically installed in the workflow for building and deploying the docs site at `.github/workflows/deploy.yml`.

### What the `generate-llms-full.py` script does

1. Uses gitingest to analyze the `docs` directory.
2. Includes only .mdx documentation files (`docs/*.mdx`, `docs/**/*.mdx`, and `src/components/en-us`).
3. Focuses on the latest version of English documentation.
4. Excludes build artifacts, node_modules, and other irrelevant files.
5. Generates a comprehensive AI-friendly text digest.
6. Adds a custom header for ScalarDL documentation context.
7. Outputs to `build/llms-full.txt`.

### Configuration

The script includes these file patterns:

- **Include:** `docs/*.mdx`, `docs/**/*.mdx`, `src/components/en-us/*.mdx`, `src/components/en-us/**/*.mdx` (only latest English docs)
- **Exclude:** `node_modules/*`, `.git/*`, `build/*`, `*.log`
- **Max file size:** 100KB per file

### Benefits over `docusaurus-plugin-llms`

- Better repository understanding and context
- More comprehensive file inclusion
- Optimized format for AI language model consumption
- Active maintenance and updates
- Superior pattern matching and filtering
