# TP2: Ralph Wiggum - Autonomous Loops with Claude Code

**Duration**: 45 minutes
**Level**: Intermediate
**Prerequisites**: Completed TP1, Claude Code installed, basic understanding of iterative processes

## Learning Objectives

By the end of this practical exercise, you will be able to:
- Understand what Ralph Wiggum is and how it enables autonomous iteration
- Install and configure the Ralph Wiggum plugin for Claude Code
- Use autonomous loops to complete complex multi-step tasks
- Understand the cost implications and safety considerations
- Know when to use autonomous loops vs. manual interaction

## Introduction

**Ralph Wiggum** is an official Claude Code plugin that enables autonomous iteration loops. Named after the Simpson's character who never gives up, Ralph Wiggum allows Claude to work persistently on complex tasks without requiring manual intervention between steps.

Traditionally, Claude Code stops after completing each response, requiring you to manually continue the conversation. Ralph Wiggum changes this by intercepting Claude's "stop" signal and automatically re-injecting the original prompt, allowing Claude to iterate continuously within the same session until the task is complete or a maximum iteration limit is reached.

**Key Concept**: Think of Ralph Wiggum as giving Claude "persistence" - the ability to keep working on a problem through multiple thinking cycles, just like a developer might iterate on a solution multiple times before getting it right.

## Part 1: Understanding Ralph Wiggum (10 minutes)

### Background Reading

Before installing Ralph Wiggum, it's important to understand the concept and its origins.

#### Required Reading
Read the original article about Ralph Wiggum:
- Article: [Ralph Wiggum - Autonomous Loops](https://ghuntley.com/ralph/)

#### Understanding the Third-Party Implementation

The community repo at [github.com/frankbria/ralph-claude-code](https://github.com/frankbria/ralph-claude-code) was an early third-party implementation that provided additional features like rate limiting and circuit breakers.

**IMPORTANT NOTE**: You do NOT need to follow the setup instructions from this repository. Ralph Wiggum is now officially integrated into Claude Code, and we'll use the official plugin instead.

The third-party repo is useful for:
- Understanding the conceptual evolution
- Seeing example use cases
- Learning about additional features (rate limiting, circuit breakers)

### How Ralph Wiggum Works

Ralph Wiggum uses a **Stop hook** mechanism to intercept Claude's exit attempts:

1. You start a task with `/ralph-wiggum:ralph-loop "your task" --completion-promise "DONE" --max-iterations 20`
2. Claude begins working on the task
3. When Claude would normally stop, the Stop hook intercepts it
4. The original prompt is re-injected into the session
5. Claude continues iterating with full context from previous iterations
6. This continues until:
   - The completion condition is met (e.g., "DONE" is output)
   - Maximum iterations are reached
   - You manually cancel with `/cancel-ralph`

## Part 2: Installation (5 minutes)

### Step 1: Add the Official Plugin Marketplace

First, ensure you have access to the Anthropic official plugin marketplace.

```bash
# Add Anthropic official plugin marketplace
/plugin marketplace add anthropics/claude-code
```

### Step 2: Install Ralph Wiggum Plugin

Install the official Ralph Wiggum plugin.

```bash
# Install Ralph Wiggum plugin
/plugin install ralph-wiggum@claude-plugins-official
```

### Verification

Verify the installation by listing your installed plugins:

```bash
# List installed plugins
/plugin list
```

You should see `ralph-wiggum` in the output.

## Part 3: Basic Usage (15 minutes)

### Starting an Autonomous Loop

The basic syntax for starting a Ralph loop is:

```bash
/ralph-wiggum:ralph-loop "your task description" --completion-promise "DONE" --max-iterations <number>
```

**Parameters**:
- `"your task description"`: The task you want Claude to complete
- `--max-iterations <number>`: Safety limit (ALWAYS SET THIS)
- `--completion-promise "DONE"`: The keyword Claude should output when finished

### Exercise A: Simple Multi-Step Task

Let's try a simple autonomous loop task.

**Task**:
```bash
/ralph-wiggum:ralph-loop "Create a Python function to calculate fibonacci numbers, write tests for it, run the tests, and fix any issues until all tests pass. Output DONE when complete." --completion-promise "DONE" --max-iterations 10
```

**What to Observe**:

1. Claude will create the function
2. Claude will write tests
3. Claude will run the tests
4. If tests fail, Claude will fix the code automatically
5. Claude will iterate until tests pass or max iterations reached
6. Claude will output "DONE" when successful

### Canceling a Running Loop

If you need to stop a running loop:

```bash
/cancel-ralph
```

## Part 4: Cost Awareness & Safety (10 minutes)

### Cost Implications

⚠️ **CRITICAL WARNING**: Autonomous loops consume tokens rapidly!

**Cost Examples**:
- A 50-iteration loop on a medium codebase: **$50-100+ in API costs**
- Each iteration includes full context from previous iterations
- Costs scale with: codebase size, iteration count, task complexity

**ALWAYS**:
- Set `--max-iterations` to a reasonable limit
- Start with small values (5-10) for testing
- Monitor your API usage
- Use on smaller, focused tasks first

### Best Practices for Cost Management

1. **Start Small**: Test with `--max-iterations 5` first
2. **Be Specific**: Clear task descriptions reduce wasted iterations
3. **Use Completion Promises**: Help Claude know when to stop
4. **Monitor Progress**: Watch the first few iterations to ensure Claude is on track
5. **Cancel Early**: Use `/cancel-ralph` if things go off track

### When to Use Ralph Wiggum vs. Manual Interaction

**Good Use Cases for Ralph Wiggum**:
- Multi-step tasks with clear completion criteria
- Test-driven development cycles (write tests -> implement -> fix -> verify)
- Iterative refinement tasks
- Tasks requiring multiple file changes
- Debugging complex issues that need multiple attempts

**Poor Use Cases**:
- Exploratory work (unclear end goal)
- Tasks requiring human judgment at each step
- Simple one-step tasks
- Tasks where you want to review each change

## Part 5: Practical Exercises (15 minutes)

### Exercise B: Test-Driven Development Loop

Create a task that requires multiple iterations to get right.

**Task**:
```bash
/ralph-wiggum:ralph-loop "Create a Python class for a simple calculator with add, subtract, multiply, and divide methods. Write comprehensive unit tests including edge cases (division by zero, large numbers, negative numbers). Run the tests and fix any failures. Output DONE when all tests pass." --completion-promise "DONE" --max-iterations 15
```

### Exercise C: Documentation Generation

Use Ralph to create comprehensive documentation.

**Task**:
```bash
/ralph-wiggum:ralph-loop "Analyze all Python files in the src/ directory and create a comprehensive README.md with: project description, installation instructions, usage examples for each module, and API documentation. Verify the markdown formatting is correct. Output DONE when complete." --completion-promise "DONE" --max-iterations 8
```

### Exercise D: Debugging Challenge

Let Ralph debug and fix a problematic piece of code.

**Task**:
```bash
/ralph-wiggum:ralph-loop "Find and fix all bugs in the file utils.py. For each bug found: identify it, explain why it's a bug, fix it, and add a test case to prevent regression. Continue until no more bugs are found or all tests pass. Output DONE when complete." --completion-promise "DONE" --max-iterations 12
```

## Expected Outcomes

After completing this TP, you should have:

- Successfully understood what Ralph Wiggum is and how it works
- Successfully installed the Ralph Wiggum plugin
- Completed at least one autonomous loop task
- Understanding of cost implications
- Ability to judge when to use autonomous loops

## Troubleshooting

### Problem: Ralph loop doesn't stop at completion promise

**Solutions**:
- Ensure your completion promise is clear and distinctive (e.g., "TASK_COMPLETE", "DONE", "FINISHED")
- Check that Claude is actually outputting the promise string
- Verify the promise string matches exactly (case-sensitive)

### Problem: Loop exceeds max iterations without completing

**Solutions**:
- Task may be too complex - break it into smaller sub-tasks
- Task description may be unclear - be more specific
- Increase `--max-iterations` if task is legitimately complex
- Review the first few iterations to see if Claude is making progress

### Problem: High API costs

**Solutions**:
- Reduce `--max-iterations` for testing
- Use more specific task descriptions
- Start with smaller codebases
- Monitor first iteration to catch issues early
- Cancel loops that go off track immediately

## Key Takeaways

1. **Ralph Wiggum enables persistence**: Claude can work through multi-step tasks autonomously
2. **Always set max-iterations**: This is your safety net against runaway costs
3. **Start small and test**: Use low iteration counts for testing before production use
4. **Clear completion criteria help**: Well-defined tasks converge faster
5. **Cost awareness is critical**: Monitor token usage and start with small tasks
6. **It's a power tool**: Great for complex tasks, overkill for simple ones

## Additional Resources

- [Original Ralph Wiggum Article by Geoffrey Huntley](https://ghuntley.com/ralph/)
- [Community Implementation (for reference)](https://github.com/frankbria/ralph-claude-code)
- [Claude Code Official Documentation](https://github.com/anthropics/claude-code)
- [Claude Code Plugin Marketplace](https://github.com/anthropics/claude-code-plugins)

## Submission

To complete this TP, submit:

1. **Screenshots**:
   - Ralph plugin installation confirmation
   - At least one successful Ralph loop completion

2. **Code Repository Link**:
   - Repository showing work completed by autonomous loops

3. **Reflection** (5-7 sentences):
   - Describe your experience using Ralph Wiggum. What task did you give it? How many iterations did it take? Were you surprised by anything? What are the advantages and disadvantages compared to manual interaction with Claude? Would you use this for real projects?

4. **Cost Analysis**:
   - Estimate the token usage for your Ralph loops. How much would this cost at current API rates?

---

**Congratulations!** You now understand how to use Ralph Wiggum to enable Claude Code to work autonomously on complex multi-step tasks. Use this power wisely, always with cost awareness and appropriate safety limits.
