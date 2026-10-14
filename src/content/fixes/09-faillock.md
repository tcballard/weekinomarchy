---
title: "Reset a password lockout with faillock"
order: 9
summary: "The manual says repeated bad passwords can lock a login, and faillock --reset clears it from a root TTY."
heading: "Why can't I login or sudo with my password?"
manual: "https://omarchy.org/manual/troubleshooting/#why-cant-i-login-or-sudo-with-my-password"
source: "https://github.com/omacom/omarchy/blob/quattro/manual/45-troubleshooting.md"
---

The heading says too many wrong passwords locks the account. From the lock screen, `CTRL + ALT + F2` opens a TTY. Log in as root, then run `faillock --reset --user [your-username]`.
