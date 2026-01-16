# Leeforge Fusion Rules

## When to Use This Skill

### Trigger Phrases

Use this skill when the user mentions:

- "Leeforge Fusion" or "leeforge-fusion"
- "leeforge" (case-insensitive)
- "SSR framework" or "full-stack framework" (in context of Leeforge)
- "file-based routing" (in context of Leeforge)
- "route guards" or "middleware" (in context of Leeforge)
- "server actions" (in context of Leeforge)
- "CLI tool for Leeforge"
- "leeforge-fusion init/dev/build/generate"
- "create a new Leeforge project"
- "add authentication to routes" (when working with Leeforge)
- "generate page/api/component" (in context of Leeforge)

### File Context Triggers

Use this skill when working with:

- `leeforge.config.ts` files
- Files in `src/app/` directory (Leeforge app structure)
- Files in `src/middleware/` directory
- Package.json with `@leeforge/fusion-cli` dependency
- CLI commands starting with `leeforge-fusion` or `lf-fusion`

### Task Triggers

Use this skill for:

- Initializing new Leeforge Fusion projects
- Setting up development environments
- Creating routes and pages
- Implementing authentication/authorization
- Generating code scaffolding
- Configuring build and deployment
- Troubleshooting Leeforge-specific issues
- Optimizing performance
- Writing tests for Leeforge apps

## When NOT to Use This Skill

### Do NOT use when:

- Working with other SSR frameworks (Next.js, Remix, Nuxt, SvelteKit)
- Working with other CLI tools (Vite CLI, React CLI, etc.)
- The user mentions "leeforge" but refers to something else
- The context is clearly about a different framework
- The user is asking about general Solid.js concepts (use general Solid.js knowledge instead)
- The user is asking about general TypeScript/JavaScript concepts

## Usage Guidelines

### Priority Order

1. **Check for skill triggers first** - Look for keywords and context
2. **Verify it's Leeforge-specific** - Ensure the context matches
3. **Use the skill** - Provide Leeforge-specific guidance
4. **Fall back to general knowledge** - If not Leeforge-specific

### Context Verification

Before using the skill, verify:

- Is this actually about Leeforge Fusion?
- Are there Leeforge-specific files or dependencies?
- Does the user mention Leeforge-specific features?
- Is the context clearly about this framework?

### When to Ask Clarifying Questions

Ask if:

- The user mentions "leeforge" but context is unclear
- Multiple frameworks could apply
- The user asks about general concepts that might apply to Leeforge
- You need to confirm which template to use for initialization

## Integration with Other Skills

### Frontend UI/UX Engineer

- Use for visual/styling changes in Leeforge components
- Leeforge uses Solid.js, so delegate visual work to frontend skill
- Keep logic changes in Leeforge skill

### Architecture Assistant

- Use for complex architectural decisions in Leeforge apps
- Leeforge skill provides framework-specific patterns
- Architecture skill provides broader design principles

### Librarian

- Use when researching Leeforge-specific libraries
- Leeforge skill provides built-in patterns
- Librarian finds external examples and best practices

## Common Workflows

### Workflow 1: New Project

```
1. User asks to create a Leeforge app
2. Use skill to provide init command
3. Recommend template based on use case
4. Provide setup instructions
```

### Workflow 2: Adding Features

```
1. User wants to add authentication
2. Use skill to explain middleware and route guards
3. Provide code examples
4. Show configuration
```

### Workflow 3: Code Generation

```
1. User wants to generate code
2. Use skill to show generate command
3. Explain what gets generated
4. Provide customization options
```

### Workflow 4: Troubleshooting

```
1. User reports an issue
2. Use skill to identify common problems
3. Provide solutions
4. Suggest testing approaches
```

## Quality Standards

### Code Quality

- Always use TypeScript
- Follow existing patterns in the codebase
- Never suppress type errors
- Use proper error handling

### Testing

- Recommend tests for new features
- Use Vitest for unit/integration tests
- Use Playwright for E2E tests
- Run tests before deployment

### Performance

- Consider bundle size
- Use code splitting when appropriate
- Optimize SSR performance
- Monitor build times

### Security

- Always use route guards for protected routes
- Never expose sensitive data in client code
- Validate user input on server
- Use proper authentication patterns

## Common Patterns to Reference

### Route Guards

- `requireAuth()` - For authenticated routes
- `requireAdmin()` - For admin-only routes
- `requireGuest()` - For public-only routes
- `defineGuard()` - For custom guards

### Data Loading

- `createServerData()` - For server-side data
- `apiFetch()` - For client-side API calls
- `withAuth()` - For authenticated requests

### Code Generation

- `leeforge-fusion generate page` - Create pages
- `leeforge-fusion generate api` - Create API routes
- `leeforge-fusion generate component` - Create components

### Configuration

- `leeforge.config.ts` - Main config file
- Route guards in config
- Vite configuration

## Error Handling

### Common Errors and Solutions

1. **Port in use** - Use `--port` flag
2. **Missing app directory** - Create `src/app/` with page files
3. **Type errors** - Run `npm run typecheck`
4. **Build fails** - Check file naming conventions
5. **Generation fails** - Use `--dry-run` to debug

### When to Escalate

- After 3 failed fix attempts, consult Oracle
- If the issue is not Leeforge-specific
- If you need broader architectural advice

## Performance Considerations

### Build Performance

- Small apps: ~2 seconds
- Medium apps: ~5-10 seconds
- Large apps: ~10-20 seconds

### Bundle Size

- Client bundle: ~15KB (gzipped)
- Server bundle: ~50KB (gzipped)
- Automatic code splitting

### SSR Performance

- Response time: ~50ms per request
- Progressive HTML streaming
- Intelligent caching

### Development Performance

- Startup time: <1 second
- HMR updates: <100ms
- Incremental type checking

## Testing Strategy

### Unit Tests

- Use Vitest
- Test middleware in isolation
- Test route guards
- Test utility functions

### Integration Tests

- Test SSR flows
- Test API routes
- Test middleware chains
- Test guard chains

### E2E Tests

- Use Playwright
- Test complete user flows
- Test authentication flows
- Test form submissions

## Deployment Considerations

### Build Output

- `dist/client/` - Client-side bundles
- `dist/server/` - Server-side bundle
- Static assets

### Environment Variables

- API keys
- Database connections
- Feature flags

### Hosting

- Node.js hosting required
- SSR support needed
- Static file serving

## Documentation Standards

### When to Document

- Complex routing structures
- Custom middleware
- Authentication flows
- Performance optimizations

### Documentation Format

- Clear code examples
- Type definitions
- Configuration examples
- Troubleshooting tips

## Version Compatibility

### Supported Versions

- Node.js: >=18.0.0
- npm: >=9.0.0
- Leeforge Fusion: 0.1.0+

### Breaking Changes

- Check release notes
- Test thoroughly before upgrading
- Update configuration as needed

## Community and Support

### Resources

- GitHub: https://github.com/JsonLee12138/leeforge-fusion
- NPM: https://www.npmjs.com/package/@leeforge/fusion-cli
- Issues: GitHub Issues
- Discussions: GitHub Discussions

### Contributing

- Fork the repository
- Create feature branch
- Add tests
- Update documentation
- Submit PR

## Quick Reference Commands

### Initialization

```bash
leeforge-fusion init my-app
leeforge-fusion init my-blog --template blog
```

### Development

```bash
leeforge-fusion dev
leeforge-fusion dev --port 3001
```

### Build

```bash
leeforge-fusion build
leeforge-fusion build --sourcemap
```

### Generation

```bash
leeforge-fusion generate page blog/[id]
leeforge-fusion generate api users/[id]
leeforge-fusion generate component Button --test --css
```

### Testing

```bash
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run typecheck
```

## Decision Trees

### When to use which template?

```
User wants to learn Leeforge → basic template
User wants a blog/content site → blog template
User wants admin dashboard → dashboard template
User has specific requirements → basic template + customize
```

### When to use which guard?

```
Public route → no guard or requireGuest()
Protected route → requireAuth()
Admin route → requireAdmin() or createGuardChain(requireAuth(), requireAdmin())
Custom requirements → defineGuard()
```

### When to use which generation type?

```
New page → generate page
API endpoint → generate api
Reusable UI → generate component
Cross-cutting logic → generate middleware
Shared layout → generate layout
```

## Anti-Patterns to Avoid

### ❌ Don't Do This

- Use `as any` or `@ts-ignore`
- Delete failing tests
- Skip type checking
- Hardcode secrets
- Ignore route guards
- Mix client and server code incorrectly

### ✅ Do This Instead

- Fix type errors properly
- Fix failing tests
- Run type checks regularly
- Use environment variables
- Implement proper guards
- Separate client/server code

## Success Metrics

### Code Quality

- 100% TypeScript coverage
- All tests passing
- No lint errors
- Clean build

### Performance

- Build time < 5 seconds
- Bundle size < 20KB (client)
- SSR response < 100ms
- HMR updates < 100ms

### User Experience

- Clear error messages
- Fast development feedback
- Intuitive file structure
- Good documentation

## Maintenance Checklist

### Before Deployment

- [ ] Run all tests
- [ ] Type check passes
- [ ] Build succeeds
- [ ] No console errors
- [ ] Route guards implemented
- [ ] Environment variables configured

### After Deployment

- [ ] Monitor performance
- [ ] Check error logs
- [ ] Verify routes work
- [ ] Test authentication
- [ ] Validate API endpoints

## Emergency Procedures

### When Build Fails

1. Check `src/app/` directory structure
2. Verify `leeforge.config.ts` exists
3. Run `npm run typecheck`
4. Check file naming conventions

### When Dev Server Won't Start

1. Check port availability
2. Verify dependencies installed
3. Check `leeforge.config.ts`
4. Look for syntax errors

### When Tests Fail

1. Run `npm test` to see failures
2. Check test file locations
3. Verify imports are correct
4. Update snapshots if needed

## Communication Guidelines

### When to Be Concise

- Simple commands
- Quick fixes
- Direct answers

### When to Be Detailed

- Complex configurations
- Security considerations
- Performance optimizations
- Architecture decisions

### When to Ask Questions

- Unclear requirements
- Multiple valid approaches
- Need user preference
- Missing context

## Integration Points

### With Other Tools

- **Vite**: Build tool (built-in)
- **TanStack Router**: Routing (built-in)
- **TanStack Query**: Data fetching (built-in)
- **Hono**: Middleware (built-in)
- **Playwright**: E2E testing (optional)
- **Vitest**: Unit testing (built-in)

### With Other Skills

- **Frontend UI/UX Engineer**: Visual changes
- **Architecture Assistant**: Complex design decisions
- **Librarian**: External library research
- **Document Writer**: Documentation generation

## Future Considerations

### When Framework Updates

- Check release notes
- Update skill documentation
- Test existing patterns
- Update examples

### When Patterns Change

- Update skill rules
- Add new patterns
- Deprecate old patterns
- Communicate changes

### When New Features Added

- Update API reference
- Add new examples
- Update quick start scripts
- Add troubleshooting tips

---

**Remember**: This skill is specifically for Leeforge Fusion. For general Solid.js, TypeScript, or JavaScript questions, use general knowledge or other appropriate skills.
