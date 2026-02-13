---
title: "TP3: Claude Code Permissions and YOLO Mode"
ref: tp3a
---

**Duration**: 30 minutes
**Level**: Beginner-Intermediate
**Prerequisites**: Completed TP1, Claude Code installed

## Learning Objectives

By the end of this practical exercise, you will be able to:
- Understand Claude Code's permission system and why it exists
- Configure permission rules for different operations
- Know the difference between allowlist and blocklist approaches
- Understand when and how to use YOLO mode safely
- Make informed decisions about security vs. convenience trade-offs

## Introduction

Claude Code operates with a **permission system** designed to protect you from unintended actions. By default, Claude will ask for your approval before performing potentially risky operations like:

- Writing or modifying files
- Executing shell commands
- Making network requests
- Accessing sensitive directories

This permission system exists because AI assistants can make mistakes or misinterpret instructions. Having a human in the loop for critical operations provides a safety net.

However, constantly approving every action can slow down your workflow, especially for repetitive or low-risk tasks. That's where **permission configuration** and **YOLO mode** come in.

## Part 1: Understanding the Permission System (10 minutes)

### Default Behavior

When you start Claude Code, it operates in a **safe mode** by default. This means:

1. **File Operations**: Claude asks before writing, editing, or deleting files
2. **Bash Commands**: Claude asks before running shell commands
3. **MCP Tools**: Claude asks before using Model Context Protocol tools

When Claude wants to perform an action, you'll see a prompt like:
```
Claude wants to run: npm install express
Allow? [y/n/a]
```

Response options:
- `y` (yes): Allow this specific action
- `n` (no): Deny this action
- `a` (always): Allow this type of action for the session

### Types of Permissions

| Permission Type | Default | Risk Level | Examples |
|----------------|---------|------------|----------|
| Read files | Allowed | Low | Reading source code, configs |
| Write/Edit files | Ask | Medium | Modifying code, creating files |
| Delete files | Ask | High | Removing files or directories |
| Bash commands | Ask | Variable | Running scripts, installing packages |
| Network requests | Ask | Medium | API calls, web fetches |
| System commands | Ask | High | System configuration changes |

## Part 2: Configuring Permissions (10 minutes)

### Viewing Current Settings

To see your current permission settings:

```bash
# View all settings
/config
```

### Allowlist Approach

The **allowlist** approach lets you pre-approve specific commands or patterns. This is the recommended approach for most users.

**Example configurations**:

```bash
# Allow specific git commands
/allowed-tools Bash(git status)
/allowed-tools Bash(git diff*)
/allowed-tools Bash(git add*)
/allowed-tools Bash(git commit*)

# Allow npm/yarn commands
/allowed-tools Bash(npm install*)
/allowed-tools Bash(npm run*)
/allowed-tools Bash(yarn*)

# Allow Python execution
/allowed-tools Bash(python*)
/allowed-tools Bash(pytest*)
```

**Pattern Syntax**:
- `*` matches any characters
- Exact match: `git status` only matches exactly `git status`
- Prefix match: `git*` matches anything starting with `git`

### Session vs. Project vs. User Settings

Permissions can be configured at three levels:

1. **Session**: Only lasts for the current Claude Code session (temporary)
2. **Project**: Saved in `.claude/settings.json` in your project (shared with team)
3. **User**: Saved in `~/.claude/settings.json` (personal, all projects)

```bash
# Add to project settings
/allowed-tools --project Bash(npm run build)

# Add to user settings
/allowed-tools --user Bash(git*)
```

### Exercise A: Configure Your Permissions

Set up a sensible permission configuration for a typical Node.js project.

**Steps**:
1. Open Claude Code in a project directory
2. Allow common git operations
3. Allow npm/yarn commands
4. Allow test execution
5. Verify with `/config`

```bash
# Your configuration
/allowed-tools Bash(git status)
/allowed-tools Bash(git diff*)
/allowed-tools Bash(git add*)
/allowed-tools Bash(git commit*)
/allowed-tools Bash(git push*)
/allowed-tools Bash(git pull*)
/allowed-tools Bash(npm*)
/allowed-tools Bash(yarn*)
/allowed-tools Bash(npx jest*)
/allowed-tools Bash(npx prettier*)
/allowed-tools Bash(npx eslint*)
```

## Part 3: YOLO Mode (10 minutes)

### What is YOLO Mode?

**YOLO Mode** (You Only Live Once) is the ultimate convenience feature that **auto-approves all operations** without asking for permission. When enabled, Claude will execute any action immediately without prompting you.

**WARNING**: YOLO mode is powerful but potentially dangerous. Use it only when you fully trust the task and environment.

### Enabling YOLO Mode

There are several ways to enable YOLO mode:

**Method 1: Command Line Flag**
```bash
# Start Claude Code in YOLO mode
claude --dangerously-skip-permissions
```

**Method 2: During Session**
```bash
# Enable YOLO mode for current session
/dangerously-skip-permissions
```

### When to Use YOLO Mode

**Safe scenarios for YOLO mode**:
- Working in a disposable development container (Docker)
- Testing in a sandboxed environment
- Running well-understood, repetitive tasks
- Personal projects where mistakes are easily reversible
- Following along with tutorials in isolated environments
- Using with Ralph Wiggum for autonomous loops (TP2)

**Dangerous scenarios - NEVER use YOLO mode**:
- Production environments
- Repositories with sensitive data
- Shared team repositories (without team consent)
- When working with credentials or secrets
- Unfamiliar codebases
- When you haven't clearly defined the task

### Safety Precautions

If you decide to use YOLO mode, follow these safety guidelines:

1. **Use Git**: Always have uncommitted changes backed up or be on a clean branch
2. **Set boundaries**: Use `--max-turns` to limit the number of actions
3. **Work in isolation**: Use containers or VMs when possible
4. **Review after**: Always review what changes were made
5. **Have an exit strategy**: Know how to stop (Ctrl+C) and revert (git checkout .)

### Exercise B: Safe YOLO Experimentation

Practice using YOLO mode in a safe environment.

**Steps**:

1. Create a new test directory:
```bash
mkdir ~/yolo-test && cd ~/yolo-test
git init
echo "# YOLO Test" > README.md
git add . && git commit -m "Initial commit"
```

2. Start Claude Code in YOLO mode:
```bash
claude --dangerously-skip-permissions
```

3. Give Claude a multi-step task:
```
Create a simple Python calculator module with add, subtract, multiply, and divide functions.
Then create a test file and run the tests.
```

4. Observe how Claude executes without prompts

5. Review the changes:
```bash
git diff
git status
```

6. Clean up:
```bash
cd ~ && rm -rf ~/yolo-test
```

### Combining YOLO with Ralph Wiggum

YOLO mode is often used together with Ralph Wiggum (TP2) for fully autonomous coding sessions:

```bash
# Start Claude Code in YOLO mode
claude --dangerously-skip-permissions

# Then use Ralph Wiggum for autonomous loops
/ralph-wiggum:ralph-loop "implement feature X with tests" --completion-promise "DONE" --max-iterations 10
```

This combination allows Claude to work completely autonomously, iterating until the task is complete.

## Best Practices Summary

### Permission Configuration

| Situation | Recommendation |
|-----------|----------------|
| Daily development | Allowlist common safe commands |
| Team project | Use project-level settings in `.claude/settings.json` |
| Personal tools | Use user-level settings for consistency |
| Sensitive work | Keep default (ask for everything) |
| Learning/tutorials | YOLO mode in isolated environment |

### Decision Flowchart

```
Is this a production environment?
  -> YES: Never use YOLO mode, use conservative allowlist

Is this a sandboxed/disposable environment?
  -> YES: YOLO mode is acceptable

Do I fully understand what Claude will do?
  -> NO: Don't use YOLO mode
  -> YES: Consider YOLO for efficiency

Am I using version control?
  -> NO: Don't use YOLO mode
  -> YES: YOLO is safer (can revert)
```

## Expected Outcomes

After completing this TP, you should have:

- Understanding of Claude Code's permission system
- Configured allowlist for common operations
- Experimented with YOLO mode safely
- Ability to make informed security decisions

## Troubleshooting

### Problem: Permission keeps getting asked for allowed command

**Solutions**:
- Check exact command syntax matches your allowlist pattern
- Verify the setting was saved (use `/config` to check)
- Remember that patterns are case-sensitive

### Problem: YOLO mode seems to have stopped

**Solutions**:
- YOLO mode is session-only by default
- Restart with `--dangerously-skip-permissions` flag
- Check if you hit a hard limit (like network errors)

### Problem: Want to disable YOLO mode mid-session

**Solution**: Simply restart Claude Code without the flag, or press Ctrl+C to exit.

## Additional Resources

- [Claude Code Documentation - Permissions](https://docs.anthropic.com/claude-code/permissions)
- [Claude Code Security Best Practices](https://docs.anthropic.com/claude-code/security)
- [TP2: Ralph Wiggum - For autonomous loops](./TP2-Ralph-Wiggum-Autonomous-Loops.md)

## Submission

To complete this TP, submit:

1. **Screenshot**:
   - Your `/config` output showing your allowlist configuration

2. **Configuration file**:
   - Your `.claude/settings.json` if you created project-level settings

3. **Reflection** (3-5 sentences):
   - What is your philosophy on permission configuration? Do you prefer asking for everything, allowlisting common commands, or using YOLO mode? Why? What scenarios would change your approach?

---

**Congratulations!** You now understand how to balance security and convenience when using Claude Code. Remember: with great power comes great responsibility. Use YOLO mode wisely!
