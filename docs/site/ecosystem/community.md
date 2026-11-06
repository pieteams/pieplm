# Community

PiePLM is a maintainer-led open-source project. There is no company behind it, no sales team and no private roadmap. Work happens in public on GitHub, and contributions are reviewed on their technical merits.

## Where the project lives

- **Repository:** [github.com/pieteams/pieplm](https://github.com/pieteams/pieplm)
- **Issues:** [github.com/pieteams/pieplm/issues](https://github.com/pieteams/pieplm/issues)
- **Website:** [pieteams.github.io/pieplm](https://pieteams.github.io/pieplm/)
- **Organisation:** [github.com/pieteams](https://github.com/pieteams)

GitHub is the single source of truth. There is no separate forum or chat channel to monitor. If a discussion matters, it belongs in an issue where it can be searched and linked from the documentation.

## How to contribute

### Documentation

The most useful early contribution is a correction or clarification. If a page assumes knowledge it should explain, or describes a workflow that does not match your manufacturing process, open an issue or a pull request.

### Design review

PiePLM is in the design phase, which means the cheapest time to challenge the model is now. Useful design feedback includes:

- a data model that cannot represent a real product structure
- an approval flow that does not match how quality or engineering actually works
- an integration that the API cannot express
- a deployment constraint the architecture ignores

Bring a concrete example, not a preference.

### Code

Implementation contributions will be most useful once the data model and API specification stabilise. Before starting a large change:

1. Open an issue describing the problem and the proposed approach.
2. Wait for a maintainer response on scope.
3. Keep the pull request focused; separate refactoring from behaviour changes.
4. Include tests for the behaviour you add.
5. Update the documentation in the same pull request.

Small fixes such as typos, broken links and obvious bugs can go straight to a pull request.

### Translations

The site includes an English and a Simplified Chinese version. Translation corrections are welcome. Open an issue before starting a new language so that work is not duplicated and the structure stays aligned.

## Review and merge policy

- Every change is reviewed before merge.
- A maintainer may decline a change that expands scope beyond the current milestone.
- Commit messages follow the conventional prefix style used in the repository (`feat:`, `fix:`, `docs:`, `chore:`).
- Large features are merged behind a clear milestone, not accumulated indefinitely in a branch.

## Governance

The project is maintainer-led. Decisions are made in public issues and pull requests, with the reasoning recorded. There is no voting membership and no foundation.

This model is chosen for speed and clarity at the current size. If the contributor base grows, the governance will be documented and revised in the repository.

## Code of conduct

Participants are expected to be direct, specific and respectful. Critique the design, not the person. Harassment, personal attacks and sustained disruption are not tolerated. Maintainers may lock or close threads that stop being productive.

## Security

Do not report a vulnerability in a public issue. Use the **Security** tab of the repository and choose **Report a vulnerability** to send a private advisory. Include reproduction steps and the affected version or commit.

## Roadmap and status

Milestones are tracked in the repository. The documentation states the current phase honestly: design and documentation, with implementation milestones to follow. Dates are not promised.

## Supporting the project

- Use the blueprint and tell us where it fails.
- Report bugs with reproduction steps.
- Improve the documentation.
- Share the project with a manufacturer or consultant who has the problem it addresses.
- Star the repository so that others can find it.

There is no paid support tier and no sponsorship requirement. Advertising on the PieTeams website covers hosting costs.

## Next steps

- [Ecosystem overview](/ecosystem/overview) — how PiePLM fits with other systems
- [What is PiePLM](/getting-started/what-is-pieplm) — scope and status
- [GitHub repository](https://github.com/pieteams/pieplm) — issues and milestones
