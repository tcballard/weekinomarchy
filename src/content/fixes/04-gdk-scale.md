---
title: "Set the GDK scale to 1 on a 1x display"
order: 4
summary: "The manual says Omarchy assumes a 2x display and tells 1x displays to change omarchy_gdk_scale from 2 to 1 in monitors.lua."
heading: "Why are some apps so large on my display?"
manual: "https://omarchy.org/manual/troubleshooting/#why-are-some-apps-so-large-on-my-display"
source: "https://github.com/omacom/omarchy/blob/quattro/manual/45-troubleshooting.md"
---

The heading “Why are some apps so large on my display?” says Omarchy assumes a 2x high-resolution display, which sets `GDK_SCALE` to 2 in `~/.config/hypr/monitors.lua`. On a 1x display, change `local omarchy_gdk_scale = 2` to 1, then restart any app that is still oversized. The chapter points to the monitors page for the rest.
