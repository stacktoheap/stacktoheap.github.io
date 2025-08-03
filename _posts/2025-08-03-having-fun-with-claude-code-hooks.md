---
layout: post
title: "Having Fun with Claude Code Hooks - Make Your AI Coding Assistant Talk!"
excerpt: "Tired of staring at your terminal waiting for Claude to finish? Let's add some personality with audio notifications and custom automation using Claude Code hooks."
reading_time: "5 mins"
date: 2025-08-03 12:00
comments: true
categories: [ai, claude, productivity, automation]
tags: [claude-code, hooks, automation, productivity, ai-tools, fun]
image: "claude-hooks.jpg"
---

Ever found yourself staring at your terminal, waiting for Claude Code to finish some complex task, wondering if it crashed or if it's just thinking really hard? Yeah, me too. That's when I discovered Claude Code hooks and decided to make my AI coding buddy a bit more... chatty.

# What Are These "Hooks" Anyway?

Think of hooks as little event listeners that let you run custom scripts when specific things happen in Claude Code. It's like having a butler who announces "Sir Claude has finished reading your files" or "Master Claude is about to write some code." 

The beauty is that you can make Claude Code integrate with whatever weird workflow you've cobbled together over the years. Want to post to Slack when Claude finishes? Sure. Want to play a sound effect when it starts writing code? Why not. Want it to literally talk to you? That's exactly what I did.

# My Setup: Making Claude Code Speak

I've configured two simple hooks that give me audio feedback during my Claude sessions using Python's `pyttsx3` library. Now my computer tells me when Claude is doing stuff, even when I'm grabbing coffee or pretending to pay attention in meetings.

## Why pyttsx3?

For this basic setup, I chose `pyttsx3` because it's:
- **Completely offline**: No API calls or internet dependency
- **Cross-platform**: Works on macOS, Windows, and Linux
- **Zero configuration**: Just install and go
- **Fast**: Immediate response, no network latency

The downside? The voice sounds... well, like a robot from 1995. But hey, it gets the job done!

Here's what my `~/.claude/settings.json` looks like:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "uv run ~/.claude/hooks/notification.py"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "uv run ~/.claude/hooks/stop.py"
          }
        ]
      }
    ]
  }
}
```

Simple, right? Two hooks: one for notifications and one for when Claude stops working.

## The Notification Script - Claude's Voice

Here's the script that handles general notifications (`~/.claude/hooks/notification.py`):

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pyttsx3",
# ]
# ///

import sys
import json
import pyttsx3
from typing import Dict, Any


def main() -> None:
    """Main function to handle Claude hook notifications."""
    try:
        input_data = sys.stdin.read().strip()
        if not input_data:
            print("No data received from stdin", file=sys.stderr)
            sys.exit(1)
        
        hook_data = json.loads(input_data)
        handle_notification(hook_data)
    except json.JSONDecodeError as e:
        print(f"Error parsing hook data: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error handling notification: {e}", file=sys.stderr)
        sys.exit(1)


def handle_notification(data: Dict[str, Any]) -> None:
    """Handle the notification with text-to-speech."""
    message = data.get("message", "Claude Code notification")
    
    # Initialize TTS engine
    engine = pyttsx3.init()
    
    # Make it speak a bit slower so I can understand
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate - 50)
    
    # Actually speak the message
    engine.say(message)
    engine.runAndWait()
    
    print(f"Notification: {message}")


if __name__ == "__main__":
    main()
```

## The Stop Script - "I'm Done!"

And here's the completion announcement (`~/.claude/hooks/stop.py`):

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "pyttsx3",
# ]
# ///

import pyttsx3


def main() -> None:
    """Tell me when Claude is done working."""
    engine = pyttsx3.init()
    
    # Slow it down so it's not jarring
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate - 50)
    
    # The magic words
    message = "Claude Code is done"
    engine.say(message)
    engine.runAndWait()
    
    print(f"Stop event: {message}")


if __name__ == "__main__":
    main()
```

# Why This Actually Rocks

## UV Makes Everything Easy

Notice I'm using UV's inline script feature? That `#!/usr/bin/env -S uv run --script` shebang with the dependency block is pure magic. No virtual environments to manage, no requirements.txt files to forget about. UV just handles it all.

## Multitasking Like a Pro

Now I can ask Claude to refactor my entire codebase and go make a sandwich. When I hear "Claude Code is done," I know it's time to come back and see what chaos... I mean, beautiful code it created.

## The Unexpected Benefits

- **No more zombie terminals**: I know immediately if Claude is stuck or actually working
- **Context switching**: Perfect for when you're juggling multiple tasks
- **Meeting survival**: Claude can work while you're in "that meeting that could have been an email"
- **Coffee break optimization**: Time your caffeine runs perfectly

# Other Fun Ideas for Hooks

Once you get the basic audio working, the possibilities are endless:

## Git Paranoia Mode
Auto-commit before any major file changes:

```json
{
  "PreToolUse": [
    {
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [
        {
          "type": "command", 
          "command": "git add -A && git commit -m 'Pre-Claude backup'"
        }
      ]
    }
  ]
}
```

## Slack Integration
Tell your team when you're being productive:

```bash
#!/bin/bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Claude just finished helping me code 🤖"}' \
  YOUR_SLACK_WEBHOOK_URL
```

## Usage Analytics
Track how much you're using Claude:

```python
# Log to a CSV file
import csv
from datetime import datetime

with open('claude_usage.csv', 'a') as f:
    writer = csv.writer(f)
    writer.writerow([datetime.now(), tool_name, "completed"])
```

# Hook Events You Can Play With

Claude Code gives you these events to hook into:

- **`PreToolUse`**: Before Claude uses any tool (great for validation)
- **`PostToolUse`**: After a tool completes successfully  
- **`UserPromptSubmit`**: When you hit enter on a prompt
- **`Notification`**: System notifications (what I'm using)
- **`Stop`**: When Claude finishes responding (my completion hook)
- **`SessionStart`**: When you start a new Claude session

# Level Up: Better Voice Options

While `pyttsx3` is perfect for getting started, you might eventually want something that sounds less like a 1990s computer. Once you're hooked on audio notifications (pun intended), consider upgrading to:

## ElevenLabs TTS
The Rolls Royce of text-to-speech. Want Claude's notifications to sound like Morgan Freeman? ElevenLabs can make that happen. The voice quality is absolutely stunning, but it'll cost you per character.

## OpenAI TTS
The sweet spot between quality and cost. OpenAI's voices sound natural and human-like without breaking the bank. Six different voices to choose from, and way more affordable than ElevenLabs for regular use.

Both options require API keys and internet connectivity, unlike our trusty `pyttsx3` setup. But the voice quality upgrade is genuinely impressive - it's like going from dial-up to fiber internet for your ears.

# Getting Started

1. Create the hooks directory: `mkdir -p ~/.claude/hooks`
2. Copy my scripts or write your own
3. Update your `~/.claude/settings.json` 
4. Make your scripts executable: `chmod +x ~/.claude/hooks/*.py`
5. Test it out, then maybe upgrade to fancy voices later!

# A Word of Caution

Hooks run shell commands, so don't go copy-pasting random scripts from the internet (except mine, obviously 😉). Always review what you're running, especially if it has network access or file system permissions.

# Conclusion

Claude Code hooks turned my AI coding sessions from silent, mysterious processes into interactive, fun experiences. Now my computer talks to me, I never miss when Claude finishes a task, and I feel like I'm living in the future.

The best part? This is just scratching the surface. You could integrate with Discord, trigger CI/CD pipelines, update project management tools, or even make your smart lights change color when Claude is working.

So go ahead, make your Claude Code setup more fun. Your productivity will thank you, and you'll finally have a good reason to explain to your coworkers why your computer is talking to you.

Now if you'll excuse me, I need to go ask Claude to refactor something so I can hear my computer tell me it's done. It never gets old.