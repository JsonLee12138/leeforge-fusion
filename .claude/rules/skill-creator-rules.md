# Skill Creator Usage Rules

> ⚠️ **IMPORTANT**: This file documents how to use the `skill-creator` skill. These rules help Claude understand when and how to invoke the skill-creator capability.

## Overview

The `skill-creator` skill provides comprehensive guidance for creating effective skills that extend Claude's capabilities with specialized knowledge, workflows, and tool integrations.

## When to Use This Skill

**Use skill-creator when users want to:**
- Create a new skill from scratch
- Update or improve an existing skill
- Package a skill for distribution
- Validate a skill's structure and metadata
- Understand skill best practices and conventions

**Trigger phrases:**
- "Create a new skill for..."
- "Help me build a skill that..."
- "I need a skill for..."
- "How do I create a skill for..."
- "Package this skill"
- "Validate this skill"

## How to Use This Skill

### Step-by-Step Workflow

#### 1. Understanding the Skill Requirements

**Always start by gathering concrete examples:**
- Ask: "What specific tasks should this skill handle?"
- Ask: "Can you give examples of how this skill would be used?"
- Ask: "What would a user say that should trigger this skill?"

**Key questions to clarify:**
- What functionality should the skill support?
- What file types or domains are involved?
- What are the common workflows?

#### 2. Planning Reusable Resources

Analyze the requirements to identify what resources to include:

**Scripts (`scripts/`)**
- Include when: Same code is rewritten repeatedly
- Include when: Deterministic reliability is needed
- Examples: PDF rotation, data processing, API calls
- Format: Executable Python/Bash scripts

**References (`references/`)**
- Include when: Documentation needs to be loaded as needed
- Include when: Schemas, policies, or detailed guides are required
- Examples: API docs, database schemas, company policies
- Format: Markdown files with detailed information

**Assets (`assets/`)**
- Include when: Files will be used in the final output
- Include when: Templates, boilerplate, or brand assets are needed
- Examples: PowerPoint templates, logo files, project templates
- Format: Any file type (images, templates, fonts, etc.)

#### 3. Initializing the Skill

**Always use the initialization script:**

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

**Example:**
```bash
scripts/init_skill.py pdf-editor --path skills/public
scripts/init_skill.py data-analyzer --path skills/private
```

**The script creates:**
- `SKILL.md` with proper frontmatter and TODO placeholders
- `scripts/` directory with example script
- `references/` directory with example reference doc
- `assets/` directory with example asset placeholder

#### 4. Editing the Skill

**Writing Style Requirements:**
- Use **imperative/infinitive form** (verb-first instructions)
- Use objective, instructional language
- **Correct**: "To accomplish X, do Y"
- **Incorrect**: "You should do X" or "If you need to do X"

**SKILL.md Structure:**
```markdown
---
name: skill-name
description: [What the skill does and WHEN to use it]
---

# Skill Title

## Overview
[1-2 sentences explaining purpose]

## [Main Sections]
[Content organized by workflow or task]

## Resources
[Reference to scripts/references/assets as needed]
```

**Metadata Requirements:**
- `name`: 3-50 characters, lowercase with hyphens only
- `description`: 20-120 characters, starts with verb, third-person
- Must include WHEN to use the skill

#### 5. Packaging the Skill

**Before packaging, validate:**
```bash
scripts/quick_validate.py <skill-directory>
```

**Package for distribution:**
```bash
scripts/package_skill.py <path/to/skill-folder>
scripts/package_skill.py <path/to/skill-folder> ./dist  # with output dir
```

**The packaging script:**
1. Validates the skill automatically
2. Creates `<skill-name>.zip` if validation passes
3. Reports errors if validation fails

#### 6. Iteration

**After testing:**
1. Use the skill on real tasks
2. Notice struggles or inefficiencies
3. Identify how SKILL.md or resources should be updated
4. Implement changes and test again

## File Structure Requirements

### Standard Directory Structure
```
skill-name/
├── SKILL.md              # Required - main skill file
├── scripts/              # Optional - executable code
│   └── *.py or *.sh
├── references/           # Optional - documentation
│   └── *.md
└── assets/               # Optional - templates/files
    └── * (any file type)
```

### Naming Conventions

**Skill Name:**
- Lowercase English
- Hyphens between words
- 3-50 characters
- Examples: `pdf-editor`, `data-analyzer`, `brand-guidelines`

**Files:**
- Use lowercase with hyphens
- No spaces or special characters
- Examples: `rotate_pdf.py`, `api-reference.md`

**Directories:**
- Lowercase with hyphens
- Examples: `scripts/`, `references/`, `assets/`

## Quality Standards

### Required Elements

**Every skill must have:**
1. ✅ YAML frontmatter with `name` and `description`
2. ✅ Proper naming conventions (hyphen-case)
3. ✅ Clear description of when to use the skill
4. ✅ Imperative writing style
5. ✅ Reference to bundled resources (if any)

### Validation Checklist

Before packaging, verify:
- [ ] SKILL.md exists with proper frontmatter
- [ ] Name is lowercase with hyphens only
- [ ] Description is 20-120 characters, starts with verb
- [ ] No angle brackets in description
- [ ] Directory structure follows conventions
- [ ] Scripts are executable (if present)
- [ ] References are properly formatted (if present)
- [ ] Assets are organized (if present)

### Progressive Disclosure

**Three-level loading system:**
1. **Metadata** (~100 words) - Always in context
2. **SKILL.md body** (<5k words) - When skill triggers
3. **Bundled resources** - As needed by Claude

**Best practice:** Keep SKILL.md lean. Move detailed information to references files.

## Common Patterns

### Workflow-Based Skills
```
## Overview
## Workflow Decision Tree
## Step 1: [Action]
## Step 2: [Action]
## Resources
```

### Task-Based Skills
```
## Overview
## Quick Start
## Task Category 1
## Task Category 2
## Resources
```

### Reference/Guidelines Skills
```
## Overview
## Guidelines
## Specifications
## Usage
## Resources
```

## Example Commands

### Creating a New Skill
```bash
# 1. Initialize
scripts/init_skill.py my-skill --path skills/public

# 2. Edit SKILL.md and resource files
# 3. Validate
scripts/quick_validate.py skills/public/my-skill

# 4. Package
scripts/package_skill.py skills/public/my-skill
```

### Updating an Existing Skill
```bash
# 1. Make changes to SKILL.md or resources
# 2. Validate
scripts/quick_validate.py path/to/skill

# 3. Re-package
scripts/package_skill.py path/to/skill
```

## Common Mistakes to Avoid

### ❌ Don't Do This
- Missing YAML frontmatter
- Using uppercase in names or files
- Using spaces in file/directory names
- Writing in second person ("you should")
- Including angle brackets in description
- Putting too much in SKILL.md (use references instead)
- Forgetting to reference bundled resources

### ✅ Do This Instead
- Always include frontmatter
- Use hyphen-case: `my-skill-name`
- Use imperative: "To do X, do Y"
- Keep SKILL.md lean, use references for details
- Reference resources: "Use `scripts/rotate_pdf.py`"
- Validate before packaging

## Advanced Usage

### Loading References
When a skill has references, Claude should:
1. Check if detailed information is needed
2. Load specific reference files as needed
3. Use grep patterns for large files

### Executing Scripts
When a skill has scripts, Claude can:
1. Read the script for understanding
2. Execute it directly for deterministic tasks
3. Patch or modify for environment-specific needs

### Using Assets
When a skill has assets:
1. Copy to output location
2. Modify as needed
3. Use in final deliverables

---

*This rules file helps Claude understand when and how to use the skill-creator skill effectively.*
