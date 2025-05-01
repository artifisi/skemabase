# Contributing to SkemaBase

Thank you for your interest in contributing to SkemaBase! We welcome all contributions,
including bug reports, feature requests, documentation improvements, and code enhancements.

## Getting Started
1. Fork the repository on GitHub.
2. Create a new branch for your changes:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes, following the coding guidelines in this document.
4. Run tests and ensure everything passes:
   ```bash
   npm test
   ```
5. Commit your changes with a clear message:
   ```bash
   git commit -m "Description of your change"
   ```
6. Push to your fork and open a pull request against the `main` branch.

## Code Style
- Use consistent indentation (2 spaces).
- Follow existing file conventions (naming, formatting).
- Add unit tests for new functionality.
- Update documentation (README, docs/) as needed.

## Reporting Issues
If you encounter a bug or unexpected behavior, please open an issue with:
## Release Process
1. Bump version in `package.json` following Semantic Versioning principles.
2. Update `CHANGELOG.md` under the "Unreleased" section with new changes.
3. Commit the version bump and changelog update.
4. Create a Git tag for the new version (e.g., `v0.1.1`).
5. Push changes and tags to GitHub: `git push --follow-tags`.
6. Optionally publish packages to npm and update CLI installation.
- A minimal reproduction case or example schema.
- The exact error message and stack trace (if any).
- Your environment details (OS, Node.js version).

## License
By contributing, you agree that your contributions will be licensed under the project’s
MIT License.